'use strict';
(function(root){
 const G=root.RoadRacer,keys=Object.create(null),touch=Object.create(null);let initialized=false;
 function input(n){if(n==='gas')return!!(keys.ArrowUp||keys.KeyW||touch.gas);if(n==='brake')return!!(keys.ArrowDown||keys.KeyS||touch.brake);if(n==='left')return!!(keys.ArrowLeft||keys.KeyA||touch.left);if(n==='right')return!!(keys.ArrowRight||keys.KeyD||touch.right);if(n==='hand')return!!(keys.Space||touch.hand);return false;}
 function steeringAxis(){return(input('right')?1:0)-(input('left')?1:0);}
 function clear(){Object.keys(keys).forEach(k=>keys[k]=false);Object.keys(touch).forEach(k=>touch[k]=false);if(root.document)root.document.querySelectorAll('.touch-btn').forEach(b=>b.classList.remove('active'));}
 function init(){
  if(initialized)return;initialized=true;
  root.document.querySelectorAll('.touch-btn').forEach(b=>{const k=b.dataset.key;
   const down=e=>{e.preventDefault();touch[k]=true;b.classList.add('active');try{b.setPointerCapture(e.pointerId);}catch(_){}};
   const up=e=>{if(e)e.preventDefault();touch[k]=false;b.classList.remove('active');};
   b.addEventListener('pointerdown',down,{passive:false});b.addEventListener('pointerup',up,{passive:false});b.addEventListener('pointercancel',up,{passive:false});b.addEventListener('lostpointercapture',up);b.addEventListener('contextmenu',e=>e.preventDefault());
  });
  root.addEventListener('keydown',e=>{keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&G.ui)G.ui.handleEscape();if(e.code==='KeyR'&&G.ui)G.ui.resetCarFromKeyboard();},{passive:false});
  root.addEventListener('keyup',e=>keys[e.code]=false);root.addEventListener('blur',clear);
  root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden){clear();if(G.state.session==='playing'&&G.ui)G.ui.pauseGame();}});
 }
 G.controls={init,input,steeringAxis,clear};
})(window);
