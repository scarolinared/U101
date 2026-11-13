import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import {randomBytes} from 'node:crypto';
import {newRoom,apply,view} from './core.js';
const data=JSON.parse(fs.readFileSync(new URL('./content.json',import.meta.url)));const html=fs.readFileSync(new URL('./Carolina_Trivia.html',import.meta.url),'utf8');const rooms=new Map();const PORT=Number(process.env.PORT||3000);
const id=()=>randomBytes(24).toString('hex');
// Each event runs synchronously after its body arrives: first request received wins a buzz.
http.createServer(async(req,res)=>{
 const send=(v,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(v))};
 try{const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/api/health')return send({ok:true});
 if(u.pathname==='/api/create'&&req.method==='POST'){
 let code;do{code=String(Math.floor(100000+Math.random()*900000))}while(rooms.has(code));const token=id();rooms.set(code,newRoom(code,token));return send({code,token});}
 if(u.pathname==='/api/state'&&req.method==='GET'){const r=rooms.get(u.searchParams.get('code'));if(!r)throw Error('Room not found. Check the six-digit code.');return send(view(r,req.headers.authorization?.replace('Bearer ',''),data));}
 if(u.pathname==='/api/action'&&req.method==='POST'){
 let body='';for await(const chunk of req){body+=chunk;if(body.length>4000)throw Error('Request too large.');}const b=JSON.parse(body);const r=rooms.get(String(b.code));if(!r)throw Error('Room not found. Check the six-digit code.');const token=req.headers.authorization?.replace('Bearer ','');
 if(b.action==='join'){b.id=id();b.token=id();apply(r,b,null,data);return send({code:r.code,token:b.token});}
 apply(r,b,token,data);return send(view(r,token,data));}
 if(u.pathname.startsWith('/api/'))return send({error:'Unknown endpoint.'},404);
 if(req.method!=='GET'||u.pathname!=='/')return send({error:'Not found.'},404);
 const publicData={categories:data.categories.map(c=>({...c,clues:c.clues.map(({id,value})=>({id,value}))})),final:{category:data.final.category}};
 const page=html.replace(/const CONTENT = .*?;\/\/CONTENT_END/, 'const CONTENT = '+JSON.stringify(publicData)+';//CONTENT_END').replace('const HAS_SERVER = false','const HAS_SERVER = true');
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(page);
 }catch(e){send({error:e.message},400)}
}).listen(PORT,'0.0.0.0',()=>{console.log('\nCarolina Classroom Challenge\nHost: http://localhost:'+PORT);try{for(const ni of Object.values(os.networkInterfaces()).flat())if(ni.family==='IPv4'&&!ni.internal)console.log('Phones on your Wi-Fi: http://'+ni.address+':'+PORT)}catch{console.log('Find your computer’s local IPv4 address in network settings for phone access.')}console.log('Keep this window open. Games reset when this server restarts.\n')});
// Rooms are ephemeral, last at most 24 hours, and contain team nicknames only.
setInterval(()=>{for(const [code,r]of rooms)if(Date.now()-r.created>86400000)rooms.delete(code)},60000).unref();
