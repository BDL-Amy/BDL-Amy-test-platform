/* BDL TEST PLATFORM — standalone application
   Real quiz data may be read here; simulation state must never mutate production quiz data. */
const PROD_URL="https://bdl-amy.github.io/Quiz-Me-This-BDL-Quiz-Me-That/";
const TEST_MENU=[
 ["TEST PLAY","test-play"],["TEST MODE","test-mode"],["LIVE ANSWERS","live-answers"],
 ["SYSTEM CHECK","system-check"],["QUESTIONS","questions"],["RESULTS","results"],
 ["STATISTICS","statistics"],["HISTORY","history"],["WINNER CONTROL","winner-control"],
 ["NOTIFICATIONS","notifications"]
];
const app=document.getElementById("app");
const state={session:true,simulation:{},activeAccount:null};
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderHome(){
 app.innerHTML='<h1>BDL TEST PLATFORM</h1><p><span class="badge">ACTIVE TEST SESSION</span></p><p class="muted">Standalone simulation environment. Production data remains unchanged.</p><div class="menu">'+TEST_MENU.map(([label,id])=>'<button data-open="'+id+'">'+label+'</button>').join("")+'</div><button class="end" id="endSession">END TEST SESSION</button>';
 app.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>renderSection(b.dataset.open));
 document.getElementById("endSession").onclick=endSession;
}
function renderSection(id){
 const item=TEST_MENU.find(x=>x[1]===id),label=item?item[0]:id;
 app.innerHTML='<h2>'+esc(label)+'</h2><div class="card"><p>This module is ready for its dedicated implementation.</p></div><button class="secondary" id="back">BACK TO TEST PLATFORM</button><button class="end" id="endSession">END TEST SESSION</button>';
 document.getElementById("back").onclick=renderHome;document.getElementById("endSession").onclick=endSession;
}
function endSession(){state.session=false;location.href=PROD_URL}
renderHome();
