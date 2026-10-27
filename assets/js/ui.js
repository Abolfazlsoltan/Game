'use strict';
(function(root){
 const G=root.RoadRacer,S=G.state,$=id=>root.document.getElementById(id);let initialized=false;
 function formatTime(value,decimal){
  const t=Math.max(0,Number(value)||0),m=Math.floor(t/60),s=Math.floor(t%60),d=Math.floor(t*10)%10;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+(decimal?'.'+d:'');
 }
 function showToast(message){const toast=$('toast');toast.textContent=message;toast.classList.add('show');S.toastTimer=2.2;}
 function updateHud(){
  const kmh=Math.round(G.car.speed*.32);$('speed-number').textContent=String(kmh).padStart(3,'0');
  $('speed-fill').style.width=G.clamp(kmh/210*100,0,100)+'%';
  $('best').textContent=String(Math.round(Math.max(S.recordSpeed,S.bestSpeed)*.32));
  $('lap').textContent=S.mode==='time'?S.lap+'/3':S.mode==='traffic'?'∞':'—';
  $('lap-time').textContent=formatTime(S.lapElapsed,true);$('race-time').textContent=formatTime(S.elapsed,false);
  $('mode-label').textContent=S.mode==='time'?'TIME TRIAL':S.mode==='traffic'?'TRAFFIC':'FREE DRIVE';
  $('status').textContent=G.car.offroad?'OFF ROAD':G.car.slip>65?'DRIFTING':G.car.speed>260?'HIGH SPEED':'READY TO DRIVE';
  $('pause-btn').disabled=S.session==='menu'||S.session==='results';
 }
 function saveRecord(){if(S.bestSpeed>S.recordSpeed){S.recordSpeed=S.bestSpeed;G.writePref('recordSpeed',S.recordSpeed);}}
 function hideOverlays(){$('menu-layer').style.display='none';$('pause-layer').style.display='none';$('result-layer').style.display='none';$('settings-layer').style.display='none';S.settingsOpen=false;}
 function startGame(){
  const selected=root.document.querySelector('.mode.active');S.mode=selected?selected.dataset.mode:'free';
  G.physics.resetSession();S.session='playing';hideOverlays();if(G.controls)G.controls.clear();G.audio.start();
  showToast(S.mode==='time'?'سه دور را کامل کن!':S.mode==='traffic'?'از برخورد با خودروها دوری کن':'رانندگی آزاد شروع شد');updateHud();
 }
 function showMenu(){saveRecord();S.session='menu';hideOverlays();if(G.controls)G.controls.clear();G.physics.resetSession();$('menu-layer').style.display='flex';G.audio.update();updateHud();}
 function pauseGame(){if(S.session!=='playing')return;saveRecord();S.session='paused';if(G.controls)G.controls.clear();$('pause-layer').style.display='flex';G.audio.update();}
 function resumeGame(){if(S.session!=='paused')return;S.session='playing';$('pause-layer').style.display='none';if(G.controls)G.controls.clear();G.audio.update();}
 function finishRace(){
  saveRecord();S.session='results';S.settingsOpen=false;$('pause-layer').style.display='none';$('settings-layer').style.display='none';
  $('result-title').textContent='مسابقه تمام شد!';$('result-message').textContent='هر دور، فرصتی برای بهترشدن است. یک بار دیگر رکوردت را امتحان کن.';
  $('result-time').textContent=formatTime(S.elapsed,true);$('result-best').textContent=String(Math.round(S.bestSpeed*.32));
  $('result-laps').textContent=S.lap+'/3';$('result-layer').style.display='flex';if(G.controls)G.controls.clear();G.audio.update();updateHud();
 }
 function openSettings(){
  $('sensitivity').value=String(Math.round(S.sensitivity*100));$('volume').value=String(Math.round(S.volume*100));$('quality').value=S.quality;
  S.settingsOpen=true;if(G.controls)G.controls.clear();$('settings-layer').style.display='flex';G.audio.update();
 }
 function closeSettings(){
  S.sensitivity=G.clamp(Number($('sensitivity').value)/100,.6,1.5);
  S.volume=G.clamp(Number($('volume').value)/100,0,1);
  S.quality=['high','medium','low'].includes($('quality').value)?$('quality').value:'high';
  G.writePref('sensitivity',S.sensitivity);G.writePref('volume',S.volume);G.writePref('quality',S.quality);
  S.settingsOpen=false;$('settings-layer').style.display='none';G.renderer.resize();G.audio.update();
 }
 function resetCarFromKeyboard(){if(S.session!=='playing'&&S.session!=='paused')return;G.physics.resetCar();showToast('ماشین بازنشانی شد');updateHud();}
 function handleEscape(){if(S.settingsOpen)closeSettings();else if(S.session==='playing')pauseGame();else if(S.session==='paused')resumeGame();}
 function tick(dt){
  if(S.toastTimer>0){S.toastTimer=Math.max(0,S.toastTimer-dt);if(S.toastTimer===0)$('toast').classList.remove('show');}
  S.hudTimer-=dt;if(S.hudTimer<=0){updateHud();S.hudTimer=.08;}G.audio.update();
 }
 function init(){
  if(initialized)return;initialized=true;
  root.document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>root.document.querySelectorAll('.mode').forEach(o=>o.classList.toggle('active',o===b))));
  root.document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{
   G.car.color=b.dataset.color;root.document.querySelectorAll('.swatch').forEach(o=>o.classList.toggle('active',o===b));
  }));
  $('start-btn').addEventListener('click',startGame);$('pause-btn').addEventListener('click',pauseGame);$('resume-btn').addEventListener('click',resumeGame);
  $('reset-btn').addEventListener('click',()=>{G.physics.resetCar();showToast('ماشین به مسیر برگشت');updateHud();});
  $('pause-menu-btn').addEventListener('click',showMenu);$('again-btn').addEventListener('click',startGame);$('result-menu-btn').addEventListener('click',showMenu);
  $('settings-btn').addEventListener('click',openSettings);$('settings-close').addEventListener('click',closeSettings);
  root.addEventListener('resize',()=>G.renderer.resize());root.addEventListener('orientationchange',()=>G.renderer.resize());updateHud();
 }
 G.ui={init,tick,formatTime,showToast,updateHud,startGame,showMenu,pauseGame,resumeGame,finishRace,handleEscape,resetCarFromKeyboard};
})(window);
