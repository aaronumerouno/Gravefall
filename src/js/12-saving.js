/* ===== SAVING: localStorage only, game state only (see security review S1/S2). Every value coming back
   out of storage is untrusted: scenes, item ids and numbers are checked against the game's own data before
   use, and anything unrecognized is dropped rather than trusted. Nothing here is ever run as code. ===== */
const EQ_SLOTS=['melee','gun','body','legs'];
function sanitizeEq(raw,inv){const eq={};for(const slot of EQ_SLOTS){const id=raw&&raw[slot];eq[slot]=(id&&ITEMS[id]&&ITEMS[id].slot===slot&&inv.includes(id))?id:null;}return eq;}
function sanitizeBoost(raw){const boost={};if(raw&&typeof raw==='object')for(const k in raw)if(k in CONFIG.stats&&typeof raw[k]==='number'&&isFinite(raw[k]))boost[k]=Math.max(-20,Math.min(20,raw[k]));return boost;}
function sanitizeCarry(raw){
 if(!raw||typeof raw!=='object')return null;
 const inv=Array.isArray(raw.inv)?raw.inv.filter(id=>ITEMS[id]).slice(0,CONFIG.bag):[];
 return{inv,eq:sanitizeEq(raw.eq,inv),boost:sanitizeBoost(raw.boost)};
}
function sanitizeBuild(raw){
 if(!raw||typeof raw!=='object')return null;
 const out={};let sum=0;
 for(const k of['might','guile','resolve']){const v=raw[k];if(typeof v==='number'&&isFinite(v)&&v>=0&&v<=CONFIG.allocPoints){out[k]=Math.floor(v);sum+=out[k];}else out[k]=0;}
 if(sum>CONFIG.allocPoints)return null;
 return out;
}
const LOADOUT_WEAPONS=['melee','gun'],LOADOUT_ARMORS={might:'bodyMight',guile:'bodyGuile',resolve:'bodyResolve',mix:'bodyMix'};
function sanitizeLoadoutDraft(raw){
 const weapon=raw&&LOADOUT_WEAPONS.includes(raw.weapon)?raw.weapon:null;
 const armor=raw&&raw.armor in LOADOUT_ARMORS?raw.armor:null;
 return{weapon,armor};
}
function sanitizeLoadout(raw){
 if(!raw||typeof raw!=='object')return null;
 const inv=Array.isArray(raw.inv)?raw.inv.filter(id=>ITEMS[id]).slice(0,CONFIG.bag):[];
 if(!inv.length)return null;
 return{inv,eq:sanitizeEq(raw.eq,inv)};
}
function sanitizeUnlocked(raw){
 const out={1:1};
 if(raw&&typeof raw==='object')for(const k in raw){const n=+k;if(Number.isInteger(n)&&CHAPTERS[n])out[n]=1;}
 return out;
}
function sanitizeState(raw,n){
 if(!raw||typeof raw!=='object')return null;
 const scene=raw.scene;
 if(typeof scene!=='string'||!SCENES[scene])return null;
 let hp=raw.hp;if(typeof hp!=='number'||!isFinite(hp))return null;
 hp=Math.max(0,Math.min(CONFIG.maxHp,hp));
 const inv=Array.isArray(raw.inv)?raw.inv.filter(id=>ITEMS[id]).slice(0,CONFIG.bag):[];
 const eq=sanitizeEq(raw.eq,inv);
 const flags={};if(raw.flags&&typeof raw.flags==='object')for(const k in raw.flags)if(typeof k==='string')flags[k]=1;
 const boost=sanitizeBoost(raw.boost);
 const pending=(raw.pending&&ITEMS[raw.pending])?raw.pending:null;
 const rolls=Array.isArray(raw.rolls)?raw.rolls.filter(x=>typeof x==='string').slice(-200):[];
 const acts=Array.isArray(raw.acts)?raw.acts.filter(x=>typeof x==='string').slice(-200):[];
 const note=typeof raw.note==='string'?raw.note:'';
 const def=SCENES[scene].fight,savedFightHp=raw.fight&&typeof raw.fight.hp==='number'?raw.fight.hp:def&&def.hp;
 const envBoost={};if(raw.fight&&raw.fight.envBoost&&typeof raw.fight.envBoost==='object')for(const k of['might','guile','resolve'])if(typeof raw.fight.envBoost[k]==='number'&&isFinite(raw.fight.envBoost[k]))envBoost[k]=Math.max(-20,Math.min(20,raw.fight.envBoost[k]));
 const envDr=raw.fight&&typeof raw.fight.envDr==='number'&&isFinite(raw.fight.envDr)?Math.max(-20,Math.min(20,raw.fight.envDr)):0;
 const envUsed=!!(raw.fight&&raw.fight.envUsed);
 const fight=def?{...def,max:def.hp,hp:Math.max(0,Math.min(def.hp,savedFightHp)),used:{},envBoost,envDr,envUsed}:null;
 const allocDraft=scene==='alloc'?(sanitizeBuild(raw.allocDraft)||{might:0,guile:0,resolve:0}):undefined;
 const loadoutDraft=scene==='loadout'?sanitizeLoadoutDraft(raw.loadoutDraft):undefined;
 return{scene,hp,flags,inv,eq,fight,pending,rolls,acts,note,boost,chapter:n,lp:0,allocDraft,loadoutDraft};
}
function persist(){try{SAVES[state.chapter]=state;localStorage.setItem(SAVE_KEY,JSON.stringify({v:SAVE_VER,chapter:state.chapter,saves:SAVES}));}catch(e){}}
function loadSave(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
  const data=JSON.parse(raw);
  if(!data||data.v!==SAVE_VER||!data.saves||typeof data.saves!=='object')return false;
  let found=false;
  for(const k in data.saves){
   if(k==='carry'){const c=sanitizeCarry(data.saves.carry);if(c)SAVES.carry=c;continue;}
   if(k==='build'){const b=sanitizeBuild(data.saves.build);if(b)SAVES.build=b;continue;}
   if(k==='loadout'){const l=sanitizeLoadout(data.saves.loadout);if(l)SAVES.loadout=l;continue;}
   if(k==='unlocked'){SAVES.unlocked=sanitizeUnlocked(data.saves.unlocked);continue;}
   const n=+k;if(!Number.isInteger(n)||!CHAPTERS[n])continue;
   const s=sanitizeState(data.saves[k],n);if(s){SAVES[n]=s;found=true;}
  }
  if(!found)return false;
  // Migration: a save from before chapter locking existed has no 'unlocked' key, but reaching a
  // chapter's state at all already meant the player had gotten there under the old (unlocked) rules
  // — treat that as already-unlocked rather than silently re-locking chapters they could already play.
  if(!('unlocked' in data.saves)){SAVES.unlocked={1:1};for(const k in SAVES){const n=+k;if(Number.isInteger(n))SAVES.unlocked[n]=1;}}
  const want=+data.chapter,startChapter=SAVES[want]?want:Object.keys(SAVES).map(Number).find(x=>!isNaN(x)&&CHAPTERS[x]&&SAVES[x]);
  if(!SAVES[startChapter])return false;
  state=SAVES[startChapter];return true;
 }catch(e){return false;}
}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

function enter(id){state.scene=id;const f=SCENES[id].fight;state.fight=f?{...f,max:f.hp,used:{},envBoost:{},envDr:0,envUsed:false}:null;state.lp=0;
 $('roll').classList.remove('show');$('result').textContent=''; // a new scene starts fresh -- the previous scene's last roll shouldn't linger
 if(SCENES[id].end&&id!=='dead'){SAVES.carry={inv:state.inv.slice(),eq:{...state.eq},boost:{...state.boost}};
  if(!SAVES.unlocked)SAVES.unlocked={1:1};SAVES.unlocked[state.chapter+1]=1;buildChapters();}
 show();
 if(/victory/.test(id))sfx('victory');else if(id==='dead')sfx('death');narrate(id);}

function odds(c){const m=mod(c);let k=0;for(let r=1;r<=CONFIG.die;r++)if(r===CONFIG.die||(r>1&&r+m>=c.dc))k++;return Math.round(k*100/CONFIG.die);}
function rollCheck(c){const roll=1+Math.floor(Math.random()*CONFIG.die),m=mod(c),total=roll+m;
 const o=roll===CONFIG.die?'crit':roll===1?'fumble':total>=c.dc?'success':'fail';
 return{roll,m,total,o,pass:o==='crit'||o==='success'};}
const apply=fx=>{for(const k in(fx||{}))EFFECTS[k]&&EFFECTS[k](state,fx[k]);};
const evasion=()=>mod({stat:'guile'});
const hurt=n=>{const d=Math.max(1,n-armorDr(state)-evasion());EFFECTS.hp(state,-d);return d;};
function foeHit(f,add){const dr=armorDr(state),ev=evasion(),d=hurt(f.dmg+add);
 return `Enemy attack ${f.dmg}${add?` + ${add} reckless`:''} − ${dr} Defense − ${ev} Evasion = ${d} damage${f.dmg+add-dr-ev<1?' (minimum 1)':''}`;}

function breakdown(r,c){const a=c.stat==='might'?gear(state).melee.acc:(c.bonus||0),g=gearStatBonus(state,c.stat),e=envStatBonus(state,c.stat),b=(state.boost&&state.boost[c.stat])||0,base=CONFIG.stats[c.stat],o=r.m-base-a-g-e-b,sg=n=>n<0?'\u2212':'+',
  parts=[`${base} base`];
 if(b)parts.push(`${sg(b)}${Math.abs(b)} training`);
 if(g)parts.push(`${sg(g)}${Math.abs(g)} armor`);
 if(e)parts.push(`${sg(e)}${Math.abs(e)} terrain`);
 if(a)parts.push(`${sg(a)}${Math.abs(a)} accuracy`);
 if(o)parts.push(`${sg(o)}${Math.abs(o)} bonus`);
 // "Might" here is always the player's whole current Might (the same number the HUD shows) -- the
 // parenthetical explains how it adds up, it is never a further addend on top of that number.
 return `${r.roll} + ${LABELS[c.stat]} ${r.m} = ${r.total} (${parts.join(', ')})`;}
async function rollUI(c){
 const die=$('die');$('roll').classList.add('show');$('result').textContent='Rolling…';die.className='die spin';sfx('roll');
 const t=setInterval(()=>die.textContent=1+Math.floor(Math.random()*CONFIG.die),70);
 await sleep(matchMedia('(prefers-reduced-motion:reduce)').matches?100:800);clearInterval(t);
 const r=rollCheck(c);die.textContent=r.roll;die.className='die'+(r.o==='crit'?' crit':r.o==='fumble'?' fumble':'');
 if(r.o==='crit'){sfx('crit');apply({hp:CONFIG.critHeal});}if(r.o==='fumble'){sfx('fumble');hurt(CONFIG.fumbleDmg);}
 r.tag={crit:'Critical! ',fumble:'Fumble! ',success:'Success. ',fail:'Failure. '}[r.o]+`${breakdown(r,c)}${c.vs?` vs ${c.vs}`:CONFIG.showOdds?' vs '+c.dc:''}. `;
 state.rolls.push(SCENES[state.scene].title+': '+r.tag);renderHist();
 return r;
}

function renderHud(){hideTip();
 $('hpnum').textContent=state.hp+' / '+CONFIG.maxHp;$('hpbar').style.width=state.hp/CONFIG.maxHp*100+'%';
 const g=gear(state);
 $('stats').innerHTML=Object.keys(CONFIG.stats).map(k=>tipSpan(`${LABELS[k]} <b>+${mod({stat:k})}</b>`,STAT_INFO[k])).join('')+tipSpan(`Defense <b>${armorDr(state)}</b>`,STAT_INFO.armor)+tipSpan(`Evasion <b>${evasion()}</b>`,STAT_INFO.evasion)+tipSpan(`Melee <b>${g.melee.atk} dmg, ${g.melee.acc>=0?'+':''}${g.melee.acc} acc</b>`,STAT_INFO.accuracy)+(g.gun?tipSpan(`Gun <b>${g.gun.atk} dmg, ${g.gun.acc>=0?'+':''}${g.gun.acc} acc</b>`,STAT_INFO.accuracy):tipSpan('Gun <b>none equipped</b>',STAT_INFO.accuracy));
 const f=state.fight;$('foe').classList.toggle('show',!!f);
 if(f){$('foename').textContent=f.name;$('foenum').textContent=f.hp+' / '+f.max;$('foebar').style.width=f.hp/f.max*100+'%';
  $('foestats').innerHTML=tipSpan(`Evasion <b>${f.dc}</b>`,STAT_INFO.foeEva)+tipSpan(`Defense <b>${f.def}</b>`,STAT_INFO.foeDef)+tipSpan(`Attack <b>${f.dmg}</b>`,STAT_INFO.foeAtk)+tipSpan(`Accuracy <b>${f.acc}</b>`,STAT_INFO.foeAcc);}
 renderPack();renderHist();
}
const info=i=>`${CAT_LABEL[i.slot]} — `+((i.slot==='melee'||i.slot==='gun')?`Damage ${i.atk}, accuracy ${i.acc>=0?'+':''}${i.acc}`:(i.slot==='body'||i.slot==='legs')?`Armor ${i.dr}`+(i.stat?`, ${statLine(i)}`:''):`Heals ${i.heal}`);
const nm=id=>ITEMS[id].n+(ITEMS[id].tier?` (${ITEMS[id].tier})`:'');
function lootHint(i){const cur=state.eq[i.slot]?ITEMS[state.eq[i.slot]]:null;
 if(i.slot==='melee'||i.slot==='gun'){if(!cur)return `You have no ${CAT_LABEL[i.slot].toLowerCase()} equipped — this fills that gap.`;
  if(i.atk>cur.atk)return `Hits harder than your ${nm(state.eq[i.slot])} (${i.atk} vs ${cur.atk} damage).`;
  if(i.atk<cur.atk)return `Hits softer than your ${nm(state.eq[i.slot])} (${i.atk} vs ${cur.atk} damage) — only worth it for the accuracy.`;
  return `About the same punch as your ${nm(state.eq[i.slot])} — compare the accuracy.`;}
 if(i.slot==='body'||i.slot==='legs'){if(!cur)return `You have no ${CAT_LABEL[i.slot].toLowerCase()} equipped — this fills that gap.`;
  if(i.dr>cur.dr)return `Tougher than your ${nm(state.eq[i.slot])} (Defense ${i.dr} vs ${cur.dr}).`;
  if(i.dr<cur.dr)return `Less Defense than your ${nm(state.eq[i.slot])} (${i.dr} vs ${cur.dr}) — only worth it for the stat bonus.`;
  return `Same Defense as your ${nm(state.eq[i.slot])} — compare the stat bonus.`;}
 return `Heals ${i.heal} Vitality when used — worth keeping spare for a tougher fight ahead.`;}
function btn(t,fn,p){const b=document.createElement('button');b.innerHTML=t;b.onclick=fn;(p||$('choices')).append(b);return b;}

function renderPack(){
 $('packsum').textContent=`Pack ${state.inv.length} / ${CONFIG.bag}`;const p=$('pack');p.innerHTML='';
 if(!state.inv.length)p.innerHTML='<div class="slot">Empty.</div>';
 state.inv.forEach(id=>{const i=ITEMS[id],on=state.eq[i.slot]===id,d=document.createElement('div');d.className='slot';
  d.innerHTML=`<span class="tip" tabindex="0" data-tip="${tipText(id)}">${nm(id)}${on?' <b class="eq">equipped</b>':''}<small>${info(i)}</small></span>`;
  if(i.slot==='use')btn('Use',()=>useItem(id),d);else if(!on)btn('Equip',()=>{state.eq[i.slot]=id;logAct('Equipped '+nm(id));show();},d);
  btn('Drop',()=>{logAct('Dropped '+nm(id));dropItem(id);},d);p.append(d);});
}
function dropItem(id){state.inv=state.inv.filter(x=>x!==id);for(const k in state.eq)if(state.eq[k]===id)state.eq[k]=null;show();}
function useItem(id){const b=snap();apply({hp:ITEMS[id].heal});logAct(actLine('Used '+nm(id),b));dropItem(id);}

