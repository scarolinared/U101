import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {newRoom,apply,view} from './core.js';
const c=JSON.parse(fs.readFileSync('content.json'));assert.equal(c.categories.length,5);assert(c.categories.every(c=>c.clues.length===6));
let r=newRoom('123456','host');const go=(action,args={},token='host')=>apply(r,{action,...args},token,c);
for(let i=1;i<=5;i++)go('join',{name:'Team '+i,id:'t'+i,token:'p'+i},null);
assert.throws(()=>go('join',{name:'Sixth',id:'6',token:'6'},null),/five/);
assert.throws(()=>go('start',{},'p1'),/host/);go('start');go('select',{id:'0-0'});
assert(!('a' in view(r,'p1',c).clue));assert.throws(()=>go('buzz',{},'p1'),/closed/);go('open');go('buzz',{},'p1');assert.throws(()=>go('buzz',{},'p2'),/closed/);go('judge',{correct:false});assert.equal(r.teams[0].score,-100);go('open');assert.throws(()=>go('buzz',{},'p1'),/closed/);go('buzz',{},'p2');go('judge',{correct:true});assert.equal(r.teams[1].score,100);go('undo');assert.equal(r.teams[1].score,0);assert.equal(r.buzz,'t2');go('judge',{correct:true});assert.equal(view(r,'p1',c).clue.a,'Cocky');go('board');assert.throws(()=>go('select',{id:'0-0'}),/unavailable/);
for(const cat of c.categories)for(const q of cat.clues)if(!r.used.includes(q.id)){go('select',{id:q.id});go('manual',{id:'t3'});go('judge',{correct:true});go('board')}
assert.equal(r.used.length,30);go('final');assert(!view(r,'p1',c).final.q);assert.throws(()=>go('wager',{amount:1},'p1'),/wager/);go('wager',{amount:0},'p1');go('wager',{amount:75},'p2');assert.throws(()=>go('wager',{amount:10},'p2'),/locked/);assert.deepEqual(view(r,'p1',c).wagers,{});go('beginFinal');assert.equal(r.wagers.t3,0);assert(view(r,'p1',c).final.q);go('answer',{answer:'Metallica'},'p1');assert.throws(()=>go('answer',{answer:'Wrong'},'p1'),/already/);assert.deepEqual(view(r,'p2',c).finalAnswers,{});go('closeFinal');assert.throws(()=>go('answer',{answer:'Metallica'},'p2'),/closed/);for(let i=1;i<=5;i++)go('gradeFinal',{id:'t'+i,correct:i===1});assert.equal(r.teams[1].score,25);assert.throws(()=>go('gradeFinal',{id:'t2',correct:true}),/Already/);go('finish');assert.equal(r.phase,'ended');
const html=fs.readFileSync('Carolina_Trivia.html','utf8');const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);const qr=fs.readFileSync('qr-inline.js','utf8');const context={window:{}};vm.runInNewContext(qr,context);const q=new context.window.QRCode(-1,1);q.addData('http://192.168.1.20:3000/?room=123456');q.make();assert(q.getModuleCount()>20);
console.log('PASS: 31 questions, five-team cap, host authorization, buzzer race/lockout, steals, score undo, complete board, private wagers/answers, final grading, HTML syntax, QR generation.');
