'use strict';
(function(root){
 const G=root.RoadRacer,S=G.state,C=S.config,car=G.car,cam=G.camera,traffic=G.traffic,particles=G.particles;
 function pos(v){const p=G.trackApi.atProgress(v.progress);v.x=p.x;v.y=p.y;v.a=p.a;}
 function resetCar(){const p=G.track[0];if(!p)return;Object.assign(car,{x:p.x,y:p.y,a:p.a,vx:0,vy:0,steer:0,speed:0,slip:0,offroad:false});
  S.gasHold=0;S.progress=0;S.previousProgress=0;S.viewIndex=0;cam.x=car.x-Math.cos(car.a)*420;cam.y=car.y-Math.sin(car.a)*420;cam.zoom=1;cam.shake=0;particles.length=0;if(G.controls)G.controls.clear();}
 function resetSession(){S.elapsed=0;S.lap=0;S.lapElapsed=0;S.bestLap=Infinity;S.bestSpeed=0;S.progress=0;S.previousProgress=0;S.gasHold=0;S.collisionCooldown=0;S.particleTimer=0;traffic.length=0;
  const colors=['#ffcc66','#e6edf4','#f05b65','#9d8cff'];for(let i=0;i<7;i++){const v={progress:(i+1)/8,speed:155+(i*31)%90,color:colors[i%4],x:0,y:0,a:0};pos(v);traffic.push(v);}resetCar();if(G.ui)G.ui.updateHud();}
 function particle(hand){const a=car.a+Math.PI+(Math.random()-.5)*.8,d=35+Math.random()*14;particles.push({x:car.x-Math.cos(car.a)*d,y:car.y-Math.sin(car.a)*d,vx:Math.cos(a)*(20+Math.random()*40),vy:Math.sin(a)*(20+Math.random()*40),size:hand?7:4,life:.65+Math.random()*.25,maxLife:.9,color:hand?'#d8e0e4':'#c6d1d4'});}
 function updateParticles(dt){if(S.quality!=='high'||!particles.length){if(S.quality==='low')particles.length=0;return;}for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.size+=dt*10;p.vx*=Math.pow(.96,dt*60);p.vy*=Math.pow(.96,dt*60);}}
 function update(dt){
  if(S.session!=='playing'||S.settingsOpen)return;dt=G.clamp(dt,0,.025);if(dt<=0)return;S.elapsed+=dt;S.lapElapsed+=dt;S.collisionCooldown=Math.max(0,S.collisionCooldown-dt);
  const gas=G.controls.input('gas'),brake=G.controls.input('brake'),hand=G.controls.input('hand'),steer=G.controls.steeringAxis();
  S.gasHold=gas?Math.min(1,S.gasHold+dt*.32):Math.max(0,S.gasHold-dt*.7);
  let f=car.vx*Math.cos(car.a)+car.vy*Math.sin(car.a),l=-car.vx*Math.sin(car.a)+car.vy*Math.cos(car.a);
  const before=G.trackApi.nearest(car.x,car.y,S.viewIndex);car.offroad=before.distance>C.roadHalf-22;
  car.steer=G.lerp(car.steer,steer,1-Math.exp(-dt*(steer?10:14)));
  car.a+=car.steer*C.turn*S.sensitivity*G.clamp(Math.abs(f)/52,0,1)*(f< -1?-1:1)*(car.offroad?.78:1)*dt;
  const top=C.baseMax+S.gasHold*125;if(gas&&!brake&&f<top)f+=C.accel*dt;
  if(brake){if(f>0)f=Math.max(0,f-C.brake*dt);else f=Math.max(-90,f-C.accel*.36*dt);}
  if(!gas&&!brake)f-=Math.sign(f)*Math.min(Math.abs(f),56*dt);f-=Math.sign(f)*f*f*.00013*dt;f=G.clamp(f,-90,top);
  l*=Math.exp(-(hand?1.05:car.offroad?2.15:5.2)*dt);
  const c=Math.cos(car.a),s=Math.sin(car.a);car.vx=c*f-s*l;car.vy=s*f+c*l;car.x+=car.vx*dt;car.y+=car.vy*dt;
  const after=G.trackApi.nearest(car.x,car.y,before.index);S.viewIndex=after.index;S.progress=after.progress;car.offroad=after.distance>C.roadHalf-22;
  if(car.offroad){const pull=G.clamp((after.distance-C.roadHalf+20)*1.7,0,820),dx=after.point.x-car.x,dy=after.point.y-car.y,n=Math.hypot(dx,dy)||1;car.vx+=dx/n*pull*dt;car.vy+=dy/n*pull*dt;const d=Math.pow(.78,dt);car.vx*=d;car.vy*=d;cam.shake=Math.max(cam.shake,1.6);}
  car.speed=Math.hypot(car.vx,car.vy);car.slip=Math.abs(l);S.bestSpeed=Math.max(S.bestSpeed,car.speed);
  if(S.previousProgress>.86&&S.progress<.14&&car.speed>45&&!car.offroad){S.lap++;S.bestLap=Math.min(S.bestLap,S.lapElapsed);const lapTime=S.lapElapsed;S.lapElapsed=0;if(G.ui)G.ui.showToast('دور '+S.lap+' · '+G.ui.formatTime(lapTime,true));if(S.mode==='time'&&S.lap>=3){S.previousProgress=S.progress;if(G.ui)G.ui.finishRace();return;}}
  S.previousProgress=S.progress;
  if(S.mode==='traffic')for(const v of traffic){v.progress=(v.progress+v.speed*dt/S.trackLength)%1;pos(v);if(Math.hypot(v.x-car.x,v.y-car.y)<72&&S.collisionCooldown<=0){car.vx*=.62;car.vy*=.62;car.speed=Math.hypot(car.vx,car.vy);cam.shake=Math.max(cam.shake,3.2);S.collisionCooldown=1.1;if(G.ui)G.ui.showToast('برخورد! فاصله را حفظ کن');}}
  const dist=420+Math.min(90,car.speed*.08),tx=car.x-Math.cos(car.a)*dist,ty=car.y-Math.sin(car.a)*dist,k=1-Math.exp(-dt*5.4);
  cam.x=G.lerp(cam.x,tx,k);cam.y=G.lerp(cam.y,ty,k);cam.shake=Math.max(0,cam.shake-dt*3.8);
  S.particleTimer-=dt;if(S.quality==='high'&&(car.slip>38||hand)&&particles.length<C.maxParticles&&S.particleTimer<=0){particle(hand);S.particleTimer=hand?.035:.075;}updateParticles(dt);
 }
 G.physics={resetCar,resetSession,update};
})(window);
