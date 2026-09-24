/* BDL TEST PLATFORM — standalone. Production data is read-only here. */
const PROD_URL="https://bdl-amy.github.io/Quiz-Me-This-BDL-Quiz-Me-That/";
const API="https://ggmcjycwrnpahauhwyrs.supabase.co/functions/v1/test-results-service";
const TEST_MENU=[["TEST PLAY","test-play"],["TEST MODE","test-mode"],["LIVE ANSWERS","live-answers"],["SYSTEM CHECK","system-check"],["QUESTIONS","questions"],["RESULTS","results"],["STATISTICS","statistics"],["HISTORY","history"],["WINNER CONTROL","winner-control"],["NOTIFICATIONS","notifications"]];
const app=document.getElementById("app");
const state={session:true,simulation:{},activeAccount:null,playerId:null};
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function qs(k){return new URLSearchParams(location.search).get(k)||""}
function renderHome(){app.innerHTML='<h1>BDL TEST PLATFORM</h1><p><span class="badge">ACTIVE TEST SESSION</span></p><p class="muted">Standalone simulation environment. Production data remains unchanged.</p><div class="menu">'+TEST_MENU.map(([l,id])=>'<button data-open="'+id+'">'+l+'</button>').join("")+'</div><button class="end" id="endSession">END TEST SESSION</button>';app.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>renderSection(b.dataset.open));document.getElementById("endSession").onclick=endSession}
function shell(title,body){app.innerHTML='<h2>'+esc(title)+'</h2>'+body+'<button class="secondary" id="back">BACK TO TEST PLATFORM</button><button class="end" id="endSession">END TEST SESSION</button>';document.getElementById("back").onclick=renderHome;document.getElementById("endSession").onclick=endSession}
async function liveAnswers(){
 const playerName=qs("player_name"),playerId=qs("player_id");
 if(!playerName||!playerId){shell("LIVE ANSWERS",'<div class="card"><p>Open TEST PLATFORM from the Amy.TEST or DrBDL.TEST account to authenticate this read-only monitor.</p></div>');return}
 shell("LIVE ANSWERS",'<div class="card"><p>Loading live quiz answers…</p></div>');
 try{
  const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"results",player_name:playerName,player_id:playerId})});
  const x=await r.json(); if(!r.ok||!x.success) throw new Error(x.error||"Request failed");
  const rows=x.results||[];
  const body='<div class="card"><p><strong>'+rows.length+'</strong> answers received</p></div>'+rows.map(v=>'<div class="card"><p><strong>Q'+esc(v.question_num)+'</strong> · '+esc(v.quiz_date)+'</p><p>'+esc(v.player_name)+' — '+esc(v.answer)+'</p><p class="muted">'+(v.is_correct===true?"Correct":v.is_correct===false?"Incorrect":"Pending")+' · '+esc(new Date(v.created_at).toLocaleString())+'</p></div>').join("");
  shell("LIVE ANSWERS",body||'<div class="card"><p>No answers found.</p></div>');
 }catch(e){shell("LIVE ANSWERS",'<div class="card"><p>LIVE ANSWERS unavailable: '+esc(e.message)+'</p></div>')}
}
function systemCheck(){const ok=location.protocol==="https:";shell("SYSTEM CHECK",'<div class="card"><p>TEST PLATFORM: '+(ok?"PASS":"FAIL")+'</p><p>Production mutation: DISABLED</p><p>Simulation storage: SESSION ONLY</p></div>')}
function renderSection(id){if(id==="live-answers"){liveAnswers();return}if(id==="system-check"){systemCheck();return}const item=TEST_MENU.find(x=>x[1]===id);shell(item?item[0]:id,'<div class="card"><p>This module is isolated from production and ready for implementation.</p></div>')}
function endSession(){state.session=false;location.href=PROD_URL}
renderHome();
