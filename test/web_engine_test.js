'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const rootDir=path.resolve(__dirname,'..'),store=new Map();
const context=vm.createContext({
 console,Math,JSON,Number,Object,Array,Infinity,Date,isFinite,innerWidth:390,innerHeight:844,devicePixelRatio:1,
 localStorage:{getItem(k){return store.has(k)?store.get(k):null;},setItem(k,v){store.set(k,v);}}
});
context.window=context;
function load(p){vm.runInContext(fs.readFileSync(path.join(rootDir,p),'utf8'),context,{filename:p,timeout:2000});}
['assets/js/core.js','assets/js/track.js','assets/js/controls.js','assets/js/physics.js'].forEach(load);
const game=context.RoadRacer;
game.ui={showToast(){},finishRace(){},updateHud(){},formatTime(v){return String(v);}};
game.trackApi.build();
assert.equal(game.track.length,game.state.config.trackSamples,'track samples should match configuration');
assert.ok(game.state.trackLength>8000,'track should have a usable length');
const start=game.trackApi.center(0);
assert.ok(game.trackApi.nearest(start.x,start.y,0).distance<5,'nearest lookup should find the circuit');
const point=game.trackApi.atProgress(.5);
assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y),'track interpolation should return coordinates');
game.controls={input(n){return n==='gas';},steeringAxis(){return 0;},clear(){}};
game.physics.resetSession();game.state.session='playing';
for(let i=0;i<120;i++)game.physics.update(1/120);
assert.ok(game.car.speed>0,'accelerator input should move the car');
assert.ok(game.car.speed<=game.state.config.baseMax+126,'speed should respect the configured cap');
game.physics.resetCar();
assert.equal(game.car.speed,0,'reset should clear speed');
assert.equal(game.car.vx,0,'reset should clear x velocity');
assert.equal(game.car.vy,0,'reset should clear y velocity');
console.log('Road Racer engine smoke tests passed.');
