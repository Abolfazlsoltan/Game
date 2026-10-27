'use strict';
(function(root){
 const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
 function readPref(k,f){try{const v=root.localStorage.getItem('road_racer_'+k);return v===null?f:JSON.parse(v);}catch(_){return f;}}
 function writePref(k,v){try{root.localStorage.setItem('road_racer_'+k,JSON.stringify(v));}catch(_){}}
 const colors=['#36a3ff','#f34f59','#2bd49a','#ffc44d','#e8edf4','#b58cff'];
 const q=readPref('quality','high'),sen=Number(readPref('sensitivity',1)),vol=Number(readPref('volume',.25)),rec=Number(readPref('recordSpeed',0));
 const state={config:{roadHalf:210,baseMax:440,accel:300,brake:700,turn:2.05,trackSamples:1200,maxParticles:90},
 width:Math.max(1,root.innerWidth||390),height:Math.max(1,root.innerHeight||844),dpr:1,
 quality:['high','medium','low'].includes(q)?q:'high',sensitivity:Number.isFinite(sen)?clamp(sen,.6,1.5):1,
 volume:Number.isFinite(vol)?clamp(vol,0,1):.25,session:'menu',mode:'free',settingsOpen:false,
 elapsed:0,lap:0,lapElapsed:0,bestLap:Infinity,bestSpeed:0,recordSpeed:Number.isFinite(rec)?Math.max(0,rec):0,
 progress:0,previousProgress:0,viewIndex:0,trackLength:0,gasHold:0,collisionCooldown:0,particleTimer:0,toastTimer:0,hudTimer:0};
 const car={x:0,y:0,a:0,vx:0,vy:0,steer:0,color:colors[0],speed:0,slip:0,offroad:false};
 const camera={x:0,y:0,zoom:1,shake:0};
 root.RoadRacer={TAU,clamp,lerp,colors,state,car,camera,track:[],trees:[],traffic:[],particles:[],
 readPref,writePref,canvas:null,trackApi:null,controls:null,physics:null,audio:null,renderer:null,ui:null};
})(window);
