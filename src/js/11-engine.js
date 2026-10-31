/* ===== ENGINE ===== */
const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pick=a=>a[Math.floor(Math.random()*a.length)];
/* No story line repeats within the current fight until every line in its pool has been used; once the
   pool wraps around, the line is marked as a repeat so the caller can say "Again". Tracking lives on
   state.fight.used, keyed by pool name, and is reset whenever a new fight starts (see enter()). */
function pickFresh(poolKey,pool){
 const used=state.fight.used[poolKey]||(state.fight.used[poolKey]=[]);
 let avail=pool.map((_,i)=>i).filter(i=>!used.includes(i)),again=false;
 if(!avail.length){state.fight.used[poolKey]=[];avail=pool.map((_,i)=>i);again=true;}
 const idx=avail[Math.floor(Math.random()*avail.length)];
 state.fight.used[poolKey].push(idx);
 return{text:pool[idx],again};
}
/* Same no-repeat-until-exhausted rule as pickFresh(), but for lines that only ever fire once per fight
   (an enemy's death, the Captain's own death) — tracked on SAVES.textUsed instead of the current fight,
   so variety carries across every fight and every death this session, not just within one. */
function pickGlobal(poolKey,pool){
 if(!SAVES.textUsed)SAVES.textUsed={};
 const used=SAVES.textUsed[poolKey]||(SAVES.textUsed[poolKey]=[]);
 let avail=pool.map((_,i)=>i).filter(i=>!used.includes(i)),again=false;
 if(!avail.length){SAVES.textUsed[poolKey]=[];avail=pool.map((_,i)=>i);again=true;}
 const idx=avail[Math.floor(Math.random()*avail.length)];
 SAVES.textUsed[poolKey].push(idx);
 return{text:pool[idx],again};
}
const againify=t=>'Again, '+t.charAt(0).toLowerCase()+t.slice(1);
const mod=c=>CONFIG.stats[c.stat]+MODIFIERS.reduce((n,f)=>n+f(state,c),0)+(c.bonus||0);
let state,busy=false;

const SAVES={},START={1:'intro',2:'ch2_start',3:'ch3_start'};  /* SAVES: each chapter keeps its own progress; SAVES.carry = gear carried into the next chapter */
function freshState(n){const c=n>1?SAVES.carry:null,needsAlloc=n===1&&!SAVES.build,needsLoadout=n===1&&!needsAlloc&&!SAVES.loadout,
  baseBoost=c?{...c.boost}:(SAVES.build?{...SAVES.build}:{}),
  startInv=c?c.inv.slice():(SAVES.loadout?SAVES.loadout.inv.slice():['chainblade','carapace','stim']),
  startEq=c?{...c.eq}:(SAVES.loadout?{...SAVES.loadout.eq}:{melee:'chainblade',gun:null,body:'carapace',legs:null});
 return{scene:needsAlloc?'alloc':needsLoadout?'loadout':START[n],hp:CONFIG.maxHp,flags:{},inv:startInv,eq:startEq,fight:null,pending:null,rolls:[],acts:[],note:'',boost:baseBoost,chapter:n,
  allocDraft:needsAlloc?{might:0,guile:0,resolve:0}:undefined,loadoutDraft:needsLoadout?{weapon:null,armor:null}:undefined};}
function newGame(n){stopVoice();n=n||(state&&state.chapter)||1;state=freshState(n);enter(state.scene);}
const isUnlocked=n=>n===1||!!(SAVES.unlocked&&SAVES.unlocked[n]);
function goToChapter(n){
 if(!isUnlocked(n))return;
 SAVES[state.chapter]=state;stopVoice();
 if(SAVES[n]){state=SAVES[n];$('roll').classList.remove('show');$('result').textContent='';show();}else{state=freshState(n);enter(START[n]);}
 buildChapters();
}
function buildChapters(){const box=$('chapters'),all=()=>box.querySelectorAll('details');let lock=false;
 const layout=$('layout');if(layout&&box.contains(layout))document.body.appendChild(layout); // buildChapters() can run more than once (e.g. 'New game'); #layout may already be nested inside box from an earlier call, and box.innerHTML would destroy it if left there — move it out (still attached, so later $('layout') lookups keep finding it) before wiping box
 box.innerHTML=Object.keys(CHAPTERS).map(n=>{const u=isUnlocked(+n);
  return `<details class="chapter${u?'':' locked'}" id="ch${n}"><summary><span class="chev" aria-hidden="true">▾</span><div class="chaptext"><small>${SAGA}</small><b>Chapter ${n}: ${CHAPTERS[n]}</b>${u?'':'<small class="lockmsg">Locked — finish the previous chapter first</small>'}</div></summary><div class="chapbody"></div></details>`;
 }).join('');
 all().forEach(d=>{
  d.querySelector('summary').addEventListener('click',e=>{if(!isUnlocked(+d.id.slice(2)))e.preventDefault();});
  d.addEventListener('toggle',()=>{if(lock||!d.open)return;lock=true;
   all().forEach(o=>{if(o!==d)o.open=false;});d.querySelector('.chapbody').append($('layout'));
   const n=+d.id.slice(2);if(n!==state.chapter){SAVES[state.chapter]=state;stopVoice();if(SAVES[n]){state=SAVES[n];$('roll').classList.remove('show');$('result').textContent='';show();}else{state=freshState(n);enter(START[n]);}}
   setTimeout(()=>{lock=false;},0);});
 });
 $('ch'+state.chapter).open=true;}

