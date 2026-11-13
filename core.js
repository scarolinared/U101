export function newRoom(code,host){return {code,host,phase:'lobby',teams:[],used:[],active:null,buzzer:false,deadline:null,attempted:[],buzz:null,revealed:false,finalAnswers:{},wagers:{},grades:{},undo:null,created:Date.now()}}
export function apply(r,b,token,content){
 const host=token===r.host;const t=r.teams.find(t=>t.token===token);const fail=m=>{throw Error(m)};const clue=()=>content.categories.flatMap(c=>c.clues).find(c=>c.id===r.active);
 if(b.action==='join'){if(r.phase!=='lobby')fail('This game has already started.');if(r.teams.length>=5)fail('All five team spots are filled.');let name=String(b.name||'').trim().slice(0,24);if(!name)fail('Enter a team name.');if(r.teams.some(t=>t.name.toLowerCase()===name.toLowerCase()))fail('That team name is already taken.');r.teams.push({id:b.id,token:b.token,name,score:0});return}
 if(!host&&!t)fail('Join this room first.');
 if(b.action==='buzz'){if(host)fail('Use a team phone to buzz.');if(r.phase!=='clue'||!r.buzzer||r.buzz||r.revealed||r.attempted.includes(t.id)||Date.now()>r.deadline)fail('Buzzers are closed.');r.buzz=t.id;r.buzzer=false;r.deadline=null;return}
 if(b.action==='wager'){if(!t||r.phase!=='wager')fail('Wagers are closed.');if(Object.hasOwn(r.wagers,t.id))fail('Wager already locked.');if(!Number.isInteger(b.amount)||b.amount<0||b.amount>Math.max(0,t.score))fail('Enter a whole-number wager within your available score.');r.wagers[t.id]=b.amount;return}
 if(b.action==='answer'){if(!t||r.phase!=='final'||Date.now()>r.deadline)fail('Final answers are closed.');if(Object.hasOwn(r.finalAnswers,t.id))fail('Answer already submitted.');const answer=String(b.answer||'').trim().slice(0,200);if(!answer)fail('Enter your answer.');r.finalAnswers[t.id]=answer;return}
 if(!host)fail('Only the host can do that.');
 switch(b.action){
 case 'add':if(r.phase!=='lobby')fail('Add teams in the lobby.');return apply(r,{action:'join',name:b.name,id:b.id,token:b.token},token,content);
 case 'remove':if(r.phase!=='lobby')fail('Remove teams in the lobby.');r.teams=r.teams.filter(t=>t.id!==b.id);break;
 case 'start':if(r.phase!=='lobby'||!r.teams.length)fail('Add at least one team first.');r.phase='board';break;
 case 'select':if(r.phase!=='board')fail('Return to the board first.');if(r.used.includes(b.id)||!content.categories.flatMap(c=>c.clues).some(c=>c.id===b.id))fail('That clue is unavailable.');r.active=b.id;r.phase='clue';r.revealed=false;r.buzzer=false;r.buzz=null;r.attempted=[];r.deadline=null;r.undo=null;break;
 case 'open':if(r.phase!=='clue'||r.revealed||r.buzz)fail('Buzzers cannot open now.');r.buzzer=true;r.deadline=Date.now()+30000;break;
 case 'manual':if(r.phase!=='clue'||r.revealed||!r.teams.some(t=>t.id===b.id)||r.attempted.includes(b.id))fail('That team cannot answer this clue.');r.buzz=b.id;r.buzzer=false;r.deadline=null;break;
 case 'judge':{if(r.phase!=='clue'||!r.buzz||r.revealed)fail('Choose a team first.');const team=r.teams.find(t=>t.id===r.buzz);r.undo={teams:JSON.parse(JSON.stringify(r.teams)),attempted:[...r.attempted],buzz:r.buzz,revealed:r.revealed};team.score+=b.correct?clue().value:-clue().value;r.attempted.push(team.id);r.buzz=null;r.buzzer=false;r.deadline=null;if(b.correct)r.revealed=true;break}
 case 'undo':if(!r.undo||r.phase!=='clue')fail('No score to undo.');Object.assign(r,r.undo);r.undo=null;break;
 case 'reveal':if(r.phase!=='clue')fail('Open a clue first.');r.revealed=true;r.buzzer=false;r.buzz=null;r.deadline=null;break;
 case 'board':if(r.phase!=='clue')fail('No active clue.');if(!r.used.includes(r.active))r.used.push(r.active);r.phase='board';r.active=null;r.buzz=null;r.buzzer=false;r.deadline=null;r.undo=null;break;
 case 'final':if(r.phase!=='board')fail('Return to the board first.');r.phase='wager';r.deadline=null;break;
 case 'beginFinal':if(r.phase!=='wager')fail('Not in the wager round.');for(const t of r.teams)if(!Object.hasOwn(r.wagers,t.id))r.wagers[t.id]=0;r.phase='final';r.deadline=Date.now()+60000;break;
 case 'closeFinal':if(r.phase!=='final')fail('Final round has not begun.');r.phase='reveal';r.deadline=null;break;
 case 'gradeFinal':if(r.phase!=='reveal')fail('Close final answers first.');if(Object.hasOwn(r.grades,b.id))fail('Already scored.');const ft=r.teams.find(t=>t.id===b.id);if(!ft)fail('Unknown team.');ft.score+=(b.correct?1:-1)*r.wagers[ft.id];r.grades[ft.id]=!!b.correct;break;
 case 'finish':if(r.phase!=='reveal'||r.teams.some(t=>!Object.hasOwn(r.grades,t.id)))fail('Score each final answer first.');r.phase='ended';break;
 case 'adjust':{const at=r.teams.find(t=>t.id===b.id);if(!at||!Number.isInteger(b.amount)||Math.abs(b.amount)>100000)fail('Enter a whole-number adjustment.');at.score+=b.amount;break}
 default:fail('Unknown action.');
 }
}
export function view(r,token,content){
 const host=token===r.host;const me=r.teams.find(t=>t.token===token);if(!host&&!me)throw Error('Join this room first.');
 const clue=content.categories.flatMap(c=>c.clues).find(c=>c.id===r.active);const finalVisible=['final','reveal','ended'].includes(r.phase);
 return {code:r.code,phase:r.phase,teams:r.teams.map(({token,...t})=>t),used:r.used,active:r.active,buzzer:r.buzzer,deadline:r.deadline,attempted:r.attempted,buzz:r.buzz,revealed:r.revealed,canUndo:host&&!!r.undo,me:me?.id,isHost:host,clue:clue?{q:clue.q,value:clue.value,...((host||r.revealed)?{a:clue.a,note:clue.note,source:clue.source}:{})}:null,final:{category:content.final.category,...(finalVisible?{q:content.final.q}:{}),...(['reveal','ended'].includes(r.phase)?{a:content.final.a,note:content.final.note,source:content.final.source}:{})},wagered:Object.keys(r.wagers),submitted:Object.keys(r.finalAnswers),myWager:me?r.wagers[me.id]:undefined,myAnswer:me?r.finalAnswers[me.id]:undefined,finalAnswers:host||r.phase==='ended'?r.finalAnswers:{},wagers:host||r.phase==='ended'?r.wagers:{},grades:r.grades};
}
