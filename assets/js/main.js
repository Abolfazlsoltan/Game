'use strict';
(function(root){
 const G=root.RoadRacer,S=G.state,STEP=1/120;let lastTime=0,accumulator=0;
 function frame(now){
  if(!lastTime)lastTime=now;const dt=G.clamp((now-lastTime)/1000,0,.05);lastTime=now;
  if(S.session==='playing'&&!S.settingsOpen){accumulator=Math.min(accumulator+dt,STEP*6);let steps=0;while(accumulator>=STEP&&steps<6){G.physics.update(STEP);accumulator-=STEP;steps++;}}
  else accumulator=0;
  G.ui.tick(dt);G.renderer.render();root.requestAnimationFrame(frame);
 }
 function init(){G.canvas=root.document.getElementById('game');G.trackApi.build();G.renderer.resize();G.physics.resetSession();G.controls.init();G.ui.init();G.ui.updateHud();root.requestAnimationFrame(frame);}
 if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(window);
