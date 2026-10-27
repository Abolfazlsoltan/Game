'use strict';
(function(root){
 const G=root.RoadRacer;let context=null,oscillator=null,gain=null;
 function start(){
  try{
   if(!context){const AudioClass=root.AudioContext||root.webkitAudioContext;if(!AudioClass)return;
    context=new AudioClass();oscillator=context.createOscillator();gain=context.createGain();oscillator.type='sawtooth';
    gain.gain.value=0;oscillator.connect(gain);gain.connect(context.destination);oscillator.start();}
   if(context.state==='suspended')context.resume();
  }catch(_){/* Audio is optional and must not affect driving. */}
 }
 function update(){
  if(!context||!oscillator||!gain)return;
  const active=G.state.session==='playing'&&!G.state.settingsOpen,throttle=G.controls&&G.controls.input('gas')?20:0;
  gain.gain.setTargetAtTime(active?G.state.volume*(.012+G.car.speed/7000):0,context.currentTime,.08);
  oscillator.frequency.setTargetAtTime(48+G.car.speed*.38+throttle,context.currentTime,.06);
 }
 function stop(){if(context&&gain)gain.gain.setTargetAtTime(0,context.currentTime,.04);}
 G.audio={start,update,stop};
})(window);
