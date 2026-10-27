'use strict';
(function(root){
 const G=root.RoadRacer,S=G.state,CFG=S.config,track=G.track,trees=G.trees;
 function center(t){return{x:1580*Math.cos(t)+250*Math.sin(3*t)+110*Math.sin(5*t),y:1000*Math.sin(t)+130*Math.sin(2*t)};}
 function tangent(t){return Math.atan2(1000*Math.cos(t)+260*Math.cos(2*t),-1580*Math.sin(t)+750*Math.cos(3*t)+550*Math.cos(5*t));}
 function build(){
  track.length=0;trees.length=0;let dist=0,prev=null;const n=CFG.trackSamples;
  for(let i=0;i<n;i++){const t=i/n*G.TAU,p=center(t),a=tangent(t);if(prev)dist+=Math.hypot(p.x-prev.x,p.y-prev.y);track.push({...p,a,t,d:dist,index:i});prev=p;}
  dist+=Math.hypot(track[0].x-track[n-1].x,track[0].y-track[n-1].y);S.trackLength=Math.max(1,dist);
  for(let i=0;i<220;i++){const t=i/220*G.TAU,p=center(t),a=tangent(t),side=i%2?1:-1,o=CFG.roadHalf+100+(i*47)%240;
   trees.push({x:p.x-Math.sin(a)*o*side,y:p.y+Math.cos(a)*o*side,r:15+(i*17)%19,kind:i%4});}
 }
 function nearest(x,y,hint){
  if(!track.length)return{index:0,point:{x:0,y:0,a:0,d:0},distance:Infinity,progress:0};
  const n=track.length,origin=Number.isInteger(hint)?hint:S.viewIndex;let idx=0,best=Infinity;
  for(let off=-76;off<=76;off++){const i=(origin+off+n)%n,p=track[i],dx=x-p.x,dy=y-p.y,d=dx*dx+dy*dy;if(d<best){best=d;idx=i;}}
  if(best>Math.pow(CFG.roadHalf*2,2))for(let i=0;i<n;i++){const p=track[i],dx=x-p.x,dy=y-p.y,d=dx*dx+dy*dy;if(d<best){best=d;idx=i;}}
  const point=track[idx];return{index:idx,point,distance:Math.sqrt(best),progress:point.d/S.trackLength};
 }
 function interpolate(a,b,t){let da=b.a-a.a;while(da>Math.PI)da-=G.TAU;while(da< -Math.PI)da+=G.TAU;return{x:G.lerp(a.x,b.x,t),y:G.lerp(a.y,b.y,t),a:a.a+da*t,d:G.lerp(a.d,b.d,t),index:a.index,t:G.lerp(a.t,b.t,t)};}
 function atProgress(progress){
  if(!track.length)return{x:0,y:0,a:0,index:0,d:0};const p=((progress%1)+1)%1,target=p*S.trackLength,last=track[track.length-1];
  if(target>=last.d)return interpolate(last,track[0],G.clamp((target-last.d)/Math.max(1,S.trackLength-last.d),0,1));
  let lo=0,hi=track.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(track[mid].d<target)lo=mid;else hi=mid;}
  return interpolate(track[lo],track[hi],G.clamp((target-track[lo].d)/Math.max(1e-6,track[hi].d-track[lo].d),0,1));
 }
 G.trackApi={center,tangent,build,nearest,atProgress};
})(window);
