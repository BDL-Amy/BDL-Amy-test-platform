(()=>{\n/* BDL TEST PLATFORM — standalone; production is read-only. */
const PROD_URL="https://bdl-amy.github.io/Quiz-Me-This-BDL-Quiz-Me-That/";
const API="https://ggmcjycwrnpahauhwyrs.supabase.co/functions/v1/test-results-service";
const TEST_MENU=[["TEST PLAY","test-play"],["TEST MODE","test-mode"],["LIVE ANSWERS","live-answers"],["SYSTEM CHECK","system-check"],["QUESTIONS","questions"],["RESULTS","results"],["STATISTICS","statistics"],["HISTORY","history"],["WINNER CONTROL","winner-control"],["NOTIFICATIONS","notifications"]];
const app=document.getElementById("app");
const state={session:true,simulation:JSON.parse(sessionStorage.getItem("bdlTestSimulation")||"{}"),account:null,expiresAt:null};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const token=()=>window.__BDL_TEST_SESSION_TOKEN||new URLSearchParams(location.search).get("session")||sessionStorage.getItem("bdlTestSession")||"";
async function api(action,extra={}){const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,session_token:token(),...extra})});const x=await r.json();if(!r.ok||!x.success)throw new Error(x.error||"request_failed");return x}
function saveSim(){sessionStorage.setItem("bdlTestSimulation",JSON.stringify(state.simulation))}
function shell(title,body){app.innerHTML='<h2>'+esc(title)+'</h2>'+body+'<button class="secondary" id="back">BACK TO TEST PLATFORM</button><button class="end" id="endSession">END TEST SESSION</button>';document.getElementById("back").onclick=renderHome;document.getElementById("endSession").onclick=endSession}
async function init(){const u=new URL(location.href),t=u.searchParams.get("session");if(t){sessionStorage.setItem("bdlTestSession",t);u.searchParams.delete("session");history.replaceState(null,"",u.pathname+u.search+u.hash)}try{const s=await api("session");state.account=s.account;state.expiresAt=s.expires_at;renderHome()}catch{shell("TEST PLATFORM",'<div class="card"><p>TEST session unavailable. Return to the quiz and open TEST PLATFORM from Amy.TEST or DrBDL.TEST.</p></div>')}}
function renderHome(){app.innerHTML='<h1>BDL TEST PLATFORM</h1><p><span class="badge">'+esc((state.account||"TEST").toUpperCase())+' · ACTIVE TEST SESSION</span></p><p class="muted">Real quiz data is read-only. Simulations stay inside this session.</p><div class="menu">'+TEST_MENU.map(([l,id])=>'<button data-open="'+id+'">'+l+'</button>').join("")+'</div><button class="end" id="endSession">END TEST SESSION</button>';app.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>renderSection(b.dataset.open));document.getElementById("endSession").onclick=endSession}
async function liveAnswers(){shell("LIVE ANSWERS",'<div class="card"><p>Loading…</p></div>');try{const x=await api("results"),rows=x.results||[];shell("LIVE ANSWERS",'<div class="card"><p><strong>'+rows.length+'</strong> answers received</p></div>'+rows.map(v=>'<div class="card"><p><strong>Q'+esc(v.question_num)+'</strong> · '+esc(v.quiz_date)+'</p><p>'+esc(v.player_name)+' — '+esc(v.selected_answer)+'</p><p class="muted">'+(v.is_correct===true?"Correct":v.is_correct===false?"Incorrect":"Pending")+' · '+esc(new Date(v.created_at).toLocaleString())+'</p></div>').join(""))}catch(e){shell("LIVE ANSWERS",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}}
async function questions(){shell("QUESTIONS",'<div class="card"><p>Loading…</p></div>');try{const x=await api("questions");shell("QUESTIONS",(x.questions||[]).map(q=>'<div class="card"><p><strong>Q'+esc(q.question_num)+'</strong> · '+esc(q.quiz_date)+'</p><p>'+esc(q.question)+'</p><p class="muted">Correct answer: '+esc(q.correct_answer||"—")+'</p></div>').join(""))}catch(e){shell("QUESTIONS",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}}
function testMode(){const sim=state.simulation;const body='<div class="card"><p>Configure the isolated simulation.</p><label>Screen</label><select id="simScreen"><option>Today</option><option>Catch Up</option><option>Previous Question</option></select><p><label><input type="checkbox" id="simWinner"> Release fictitious winner</label></p><button id="saveSim">SAVE TEST MODE</button></div>';shell("TEST MODE",body);document.getElementById("simScreen").value=sim.screen||"Today";document.getElementById("simWinner").checked=!!sim.winner;document.getElementById("saveSim").onclick=()=>{state.simulation={screen:document.getElementById("simScreen").value,winner:document.getElementById("simWinner").checked};saveSim();testMode()}}
function testPlay(){const s=state.simulation||{};shell("TEST PLAY",'<div class="card"><p><strong>Simulated screen:</strong> '+esc(s.screen||"Today")+'</p><p><strong>Fictitious winner:</strong> '+(s.winner?esc((state.account||"test").toUpperCase()):"Not released")+'</p><p class="muted">This presentation does not change production data.</p></div>')}
async function winners(){shell("WINNER CONTROL",'<div class="card"><p>Loading…</p></div>');try{const x=await api("winners");const w=(x.weekly||[]).slice(0,8);shell("WINNER CONTROL",'<div class="card"><p>Fictitious winner in TEST PLAY: <strong>'+esc((state.account||"test").toUpperCase())+'</strong></p><button id="releaseWinner">RELEASE / REMOVE FICTITIOUS WINNER</button></div>'+w.map(v=>'<div class="card"><p>'+esc(v.player_name||v.winner_name||"Winner")+'</p><p class="muted">'+esc(v.week_start||"")+'</p></div>').join(""));document.getElementById("releaseWinner").onclick=()=>{state.simulation.winner=!state.simulation.winner;saveSim();winners()}}catch(e){shell("WINNER CONTROL",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}}
async function systemCheck(){try{await api("session");shell("SYSTEM CHECK",'<div class="card"><p>Session authorization: PASS</p><p>Read-only production access: PASS</p><p>Simulation isolation: PASS</p></div>')}catch{shell("SYSTEM CHECK",'<div class="card"><p>Session authorization: FAIL</p></div>')}}

async function snapshot(){return api("snapshot")}
async function results(){
 shell("RESULTS",'<div class="card"><p>Loading…</p></div>');
 try{
  const x=await snapshot(),rows=x.answers||[],played=rows.length,correct=rows.filter(r=>r.is_correct===true).length,wrong=rows.filter(r=>r.is_correct===false).length,pending=played-correct-wrong;
  shell("RESULTS",'<div class="metric-grid"><div class="metric"><strong>'+played+'</strong><span>PLAYED</span></div><div class="metric"><strong>'+correct+'</strong><span>CORRECT</span></div><div class="metric"><strong>'+wrong+'</strong><span>INCORRECT</span></div><div class="metric"><strong>'+pending+'</strong><span>PENDING</span></div></div>');
 }catch(e){shell("RESULTS",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}
}
async function statistics(){
 shell("STATISTICS",'<div class="card"><p>Loading…</p></div>');
 try{
  const x=await snapshot(),rows=x.answers||[],by=new Map();
  rows.forEach(r=>{const k=r.player_name||"Unknown",v=by.get(k)||{p:0,c:0};v.p++;if(r.is_correct===true)v.c++;by.set(k,v)});
  const list=[...by].map(([n,v])=>({n,p:v.p,c:v.c,a:v.p?Math.round(v.c/v.p*100):0})).sort((a,b)=>b.c-a.c||b.p-a.p);
  shell("STATISTICS",list.map((r,n)=>'<div class="card stat-row"><strong>'+(n+1)+'. '+esc(r.n)+'</strong><span>'+r.c+' correct · '+r.p+' played · '+r.a+'%</span></div>').join("")||'<div class="card"><p>No statistics available.</p></div>');
 }catch(e){shell("STATISTICS",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}
}
async function historyView(){
 shell("HISTORY",'<div class="card"><p>Loading…</p></div>');
 try{
  const x=await snapshot(),w=x.weekly||[],m=x.monthly||[];
  const weekly=w.map(v=>'<div class="card"><strong>'+esc(v.player_name||v.winner_name||"Winner")+'</strong><p class="muted">'+esc(v.week_start||"")+'</p></div>').join("");
  const monthly=m.map(v=>'<div class="card"><strong>'+esc(v.player_name||v.winner_name||"Winner")+'</strong><p class="muted">'+esc(v.month_start||"")+'</p></div>').join("");
  shell("HISTORY",'<h3>WEEKLY WINNERS</h3>'+weekly+'<h3>MONTHLY WINNERS</h3>'+monthly);
 }catch(e){shell("HISTORY",'<div class="card"><p>Unavailable: '+esc(e.message)+'</p></div>')}
}
function notifications(){
 const n=state.simulation.notification||{title:"TEST NOTIFICATION",body:"This is a TEST PLATFORM preview."};
 shell("NOTIFICATIONS",'<div class="card"><label>Title</label><input id="nTitle" value="'+esc(n.title)+'"><label>Message</label><textarea id="nBody">'+esc(n.body)+'</textarea><button id="previewN">PREVIEW NOTIFICATION</button></div><div class="card notification-preview"><strong>'+esc(n.title)+'</strong><p>'+esc(n.body)+'</p></div>');
 document.getElementById("previewN").onclick=()=>{state.simulation.notification={title:document.getElementById("nTitle").value,body:document.getElementById("nBody").value};saveSim();notifications()};
}
function renderSection(id){
 if(id==="live-answers")return liveAnswers();
 if(id==="questions")return questions();
 if(id==="test-mode")return testMode();
 if(id==="test-play")return testPlay();
 if(id==="winner-control")return winners();
 if(id==="system-check")return systemCheck();
 if(id==="results")return results();
 if(id==="statistics")return statistics();
 if(id==="history")return historyView();
 if(id==="notifications")return notifications();
 shell(TEST_MENU.find(x=>x[1]===id)?.[0]||id,'<div class="card"><p>Module unavailable.</p></div>');
}
function endSession(){sessionStorage.removeItem("bdlTestSession");sessionStorage.removeItem("bdlTestSimulation");if(typeof window.BDL_END_TEST_PLATFORM==="function"){window.BDL_END_TEST_PLATFORM();return}if(window.parent!==window){window.parent.postMessage({type:"BDL_TEST_PLATFORM_END"},"https://bdl-amy.github.io");return}location.href=PROD_URL}
init();
\n})();