/* ===== CHARACTER CREATION: spend CONFIG.allocPoints across the 3 stats once, before Chapter 1 starts.
   The chosen build is remembered as SAVES.build (and saved) so later deaths/restarts of Chapter 1 reuse it
   without asking again; 'New game' clears SAVES.build and this runs again. ===== */
function renderAlloc(box){
 const d=state.allocDraft,spent=d.might+d.guile+d.resolve,left=CONFIG.allocPoints-spent;
 const head=document.createElement('p');head.innerHTML=`You have <b>${left}</b> point${left===1?'':'s'} left to spend.`;box.append(head);
 ['might','guile','resolve'].forEach(stat=>{
  const total=CONFIG.stats[stat]+d[stat],r=document.createElement('div');r.className='slot';
  r.innerHTML=`<span class="tip" tabindex="0" data-tip="${STAT_INFO[stat]}">${LABELS[stat]} <b>${total}</b></span>`;
  btn('−',()=>{if(d[stat]>0){d[stat]--;show();}},r).disabled=d[stat]<=0;
  btn('+',()=>{if(left>0){d[stat]++;show();}},r).disabled=left<=0;
  box.append(r);
 });
 btn(left===0?'Next: choose your kit':`Spend all ${CONFIG.allocPoints} points to continue`,()=>{
  if(left!==0)return;
  for(const k of['might','guile','resolve'])state.boost[k]=(state.boost[k]||0)+d[k];
  SAVES.build={...d};state.allocDraft=undefined;
  state.scene='loadout';state.loadoutDraft={weapon:null,armor:null};enter(state.scene);
 },box).disabled=left!==0;
}
const ARMOR_LABEL={might:'Might-forged',guile:'Guile-woven',resolve:'Steadfast',mix:'Balanced'};
function renderLoadout(box){
 const d=state.loadoutDraft;
 const head=document.createElement('p');head.innerHTML=d.weapon&&d.armor?'Ready to deploy, Captain.':'Pick an opening weapon and an opening armor.';box.append(head);
 const wRow=document.createElement('div');wRow.className='slot';wRow.innerHTML='<span>Opening weapon</span>';
 [['melee','Melee first',ITEMS.chainblade.n+' equipped; find a gun later'],['gun','Gun first',ITEMS.pistol.n+' equipped; find a melee weapon later']].forEach(([k,label,sub])=>{
  btn(`${label}${d.weapon===k?' <b class="eq">chosen</b>':''}<small>${sub}</small>`,()=>{d.weapon=k;show();},wRow);
 });
 box.append(wRow);
 const aRow=document.createElement('div');aRow.className='slot';aRow.innerHTML='<span>Opening armor</span>';
 for(const k in ARMOR_LABEL){
  const item=ITEMS[LOADOUT_ARMORS[k]];
  btn(`${ARMOR_LABEL[k]}${d.armor===k?' <b class="eq">chosen</b>':''}<small>${item.n}: Defense ${item.dr}${item.stat?', '+statLine(item):''}</small>`,()=>{d.armor=k;show();},aRow);
 }
 box.append(aRow);
 btn(d.weapon&&d.armor?'Deploy':'Choose a weapon and an armor to deploy',()=>{
  if(!d.weapon||!d.armor)return;
  const armorId=LOADOUT_ARMORS[d.armor];
  const inv=d.weapon==='gun'?['pistol',armorId,'stim']:['chainblade',armorId,'stim'];
  const eq=d.weapon==='gun'?{melee:null,gun:'pistol',body:armorId,legs:null}:{melee:'chainblade',gun:null,body:armorId,legs:null};
  state.inv=inv;state.eq=eq;
  SAVES.loadout={inv:inv.slice(),eq:{...eq}};
  state.loadoutDraft=undefined;state.scene=START[state.chapter];enter(state.scene);
 },box).disabled=!(d.weapon&&d.armor);
}

async function toStory(){if(document.documentElement.dataset.device!=='mobile')return;
 $('text').scrollIntoView({block:'start'});await sleep(80);}
const logAct=t=>{state.acts.push(t);renderHist();const k=/picked up/i.test(t)?'pickup':/^Equipped/.test(t)?'equip':/^Dropped/.test(t)?'drop':/^Used/.test(t)?'heal':null;if(k)sfx(k);};
const actLine=(t,before)=>{const d=diff(before,snap());return d?`${t}, ${d}`:t;};
const snap=()=>({hp:state.hp,...Object.fromEntries(Object.keys(CONFIG.stats).map(k=>[k,mod({stat:k})]))});
const diff=(a,b)=>Object.keys(a).filter(k=>a[k]!==b[k]).map(k=>`${k==='hp'?'Vitality':LABELS[k]} ${b[k]>a[k]?'+':''}${b[k]-a[k]}`).join(', ');
function showResult(r,msg,before,calc){const d=diff(before,snap());renderHud();speakLine(msg,1);
 if(document.documentElement.dataset.device==='mobile')$('roll').scrollIntoView({block:'nearest'});
 $('result').innerHTML=`${r.tag}<span class="ln">${msg}</span>`+(calc?`<span class="ln calc">${calc}</span>`:'')+(d?`<span class="ln chg">${d}</span>`:'');}
function renderText(){const sc=SCENES[state.scene],text=typeof sc.text==='function'?sc.text(state):sc.text;$('text').innerHTML=`<h2>${sc.title}</h2>`+(state.note?`<p class="note">${state.note}</p>`:'')+text.map(p=>`<p>${p}</p>`).join('');}
function renderHist(){$('acts').innerHTML=state.acts.slice().reverse().map(t=>`<li>${t}</li>`).join('')||'<li>No actions yet.</li>';$('hist').innerHTML=state.rolls.slice().reverse().map(t=>`<li>${t}</li>`).join('')||'<li>No rolls yet.</li>';}
function show(){
 persist();renderHud();renderArt();const sc=SCENES[state.scene],box=$('choices');box.innerHTML='';
 renderText();
 if(state.scene==='alloc'){renderAlloc(box);return;}
 if(state.scene==='loadout'){renderLoadout(box);return;}
 if(state.pending){const id=state.pending,i=ITEMS[id];
  box.innerHTML=`<h3 class="tip" tabindex="0" data-tip="${tipText(id)}">Loot: ${nm(id)}</h3><p>${info(i)}. Your pack holds ${state.inv.length} of ${CONFIG.bag}.</p><p class="note">${lootHint(i)}</p>`;
  const done=()=>{state.pending=null;show();};
  if(state.inv.length<CONFIG.bag)btn('Take it',()=>{state.inv.push(id);logAct('Picked up '+nm(id));done();});
  else state.inv.forEach(x=>btn(`Swap for ${nm(x)}`,()=>{logAct('Dropped '+nm(x)+' and picked up '+nm(id));dropItem(x);state.inv.push(id);done();}));
  btn('Leave it',()=>{logAct('Left '+nm(id));done();});return;}
 if(sc.end){
  const next=state.chapter+1;
  if(state.scene!=='dead'&&CHAPTERS[next])btn(`Continue to Chapter ${next}: ${CHAPTERS[next]}`,()=>{$('roll').classList.remove('show');goToChapter(next);});
  btn('Fight again',()=>{$('roll').classList.remove('show');newGame();});
  return;}
 if(state.fight){const f=state.fight,g=gear(state);
  const actions=[['strike','Strike',{stat:'might',dc:f.dc,vs:`Evasion ${f.dc}`},`Hit for ${g.melee.atk}, minus ${f.def} Defense`],
   ['wild','Reckless blow',{stat:'might',dc:f.dc+3,vs:`Evasion ${f.dc} +3 reckless = ${f.dc+3}`},`Hit for ${g.melee.atk*2}, minus ${f.def} Defense, but costs more if you miss`]];
  if(g.gun)actions.push(['aim','Aimed shot',{stat:'guile',dc:f.dc+2,bonus:g.gun.acc,vs:`Evasion ${f.dc} +2 aimed = ${f.dc+2}`},`Hit for ${g.gun.atk} with the ${g.gun.n}, ignoring Defense`]);
  actions.push(['guard','Guard and endure',{stat:'resolve',dc:f.acc,vs:`Enemy accuracy ${f.acc}`},'Block the blow and recover 2']);
  if(f.envAction&&!f.envUsed){const ea=f.envAction,descByType={damage:`Deal ${ea.amount} damage, ignoring Defense`,heal:`Heal ${ea.amount} Vitality`,armor:`+${ea.amount} Defense for this fight`,might:`+${ea.amount} Might for this fight`,guile:`+${ea.amount} Guile for this fight`,resolve:`+${ea.amount} Resolve for this fight`}[ea.type];
   actions.push(['env',ea.label,{stat:ea.stat,dc:ea.dc,vs:`DC ${ea.dc}`},descByType+'. One use per fight — a failed roll still lets the enemy hit you, and a fumble can backfire.']);}
  actions.forEach(([k,t,c,d])=>btn(`${t}<small>${LABELS[c.stat]}${CONFIG.showOdds?', '+odds(c)+'% to succeed':''}. ${d}</small>`,()=>act(k,c)));
  if(!g.gun){const p=document.createElement('p');p.className='note';p.textContent='No ranged weapon equipped — find and equip a gun to use Aimed shot.';box.append(p);}
  return;}
 sc.choices.forEach(ch=>btn(ch.text+(ch.check?`<small>${LABELS[ch.check.stat]} check${CONFIG.showOdds?', '+odds(ch.check)+'% to succeed':''}</small>`:''),()=>choose(ch)));
}
const lock=v=>{busy=v;document.querySelectorAll('#choices button').forEach(b=>b.disabled=v);};

async function choose(ch){
 if(busy)return;lock(true);stopVoice();await toStory();let br=ch,rr=null;const before=snap();
 if(ch.check){rr=await rollUI(ch.check);br=rr.pass?ch.win:ch.lose;}
 apply(br.fx);if(rr){showResult(rr,br.msg,before);sfx(rr.pass?(ch.sfx||{might:'smash',guile:'click',resolve:'chime'}[ch.check.stat]):'hit');}
 logAct(actLine((ch.past||`Chose to ${ch.text.charAt(0).toLowerCase()+ch.text.slice(1)}`)+(rr?(rr.pass?' and succeeded':' and failed'):''),before));
 if(state.hp<=0){const p=pickGlobal('playerFall',TEXT.playerFall);state.note=p.again?againify(p.text):p.text;state.scene='dead';}else state.scene=br.goto||state.scene;
 // a check's result is worth reading before the scene changes underneath it (e.g. a door opening) --
 // a plain goto with no roll result has nothing new on screen yet, so it can move on right away
 await sleep(ch.check?CONFIG.sceneReadDelay:0);lock(false);enter(state.scene);
}

async function act(kind,c){
 if(busy)return;lock(true);stopVoice();await toStory();const before=snap(),f=state.fight,fh=f.hp,rg=kind==='aim',w=rg?gear(state).gun:gear(state).melee,r=await rollUI(c);let m,calc;
 const F=(key,pool)=>{const p=pickFresh(key,pool),filled=fill(p.text,f,w);return p.again?againify(filled):filled;};
 if(kind==='env'){
  const ea=f.envAction,envEffect=n=>{if(ea.type==='damage'){if(n>=0)f.hp=Math.max(0,f.hp-n);else hurt(-n);}else if(ea.type==='heal')apply({hp:n});else if(ea.type==='armor')f.envDr=(f.envDr||0)+n;else f.envBoost[ea.type]=(f.envBoost[ea.type]||0)+n;},
   envCalc=(n,doubled)=>{const tag=doubled?' (critical doubles it)':'';
    if(ea.type==='damage')return n>=0?`${n} damage to ${f.ref}, ignoring Defense${tag}`:`It backfires \u2014 ${-n} damage to you${tag}`;
    if(ea.type==='heal')return n>=0?`+${n} Vitality${tag}`:`It backfires \u2014 ${-n} Vitality lost${tag}`;
    const label=ea.type==='armor'?'Defense':LABELS[ea.type];
    return `${n>=0?'+':'\u2212'}${Math.abs(n)} ${label} for the rest of this fight${tag}`;};
  f.envUsed=true;
  if(r.o==='crit'){const n=ea.amount*2;envEffect(n);calc=envCalc(n,true);m=fill(ea.text.crit,f,w);}
  else if(r.pass){const n=ea.amount;envEffect(n);calc=envCalc(n,false);m=fill(ea.text.success,f,w);}
  else if(r.o==='fumble'){const n=-ea.amount;envEffect(n);calc=envCalc(n,false)+' '+foeHit(f,0);m=fill(ea.text.fumble,f,w);}
  else{calc=foeHit(f,0);m=fill(ea.text.fail,f,w);}
 }
 else if(kind==='guard'){if(r.pass){apply({hp:2});m=F('guardOk',TEXT.guardOk);calc='No damage taken. You recover 2 Vitality.';}else{calc=foeHit(f,0);m=F('guardBad',TEXT.guardBad);}}
 else if(r.pass){const cr=r.o==='crit'?w.atk:0,ml=kind==='wild'?2:1,df=(cr||kind==='aim')?0:f.def,d=Math.max(1,w.atk*ml+cr-df);f.hp=Math.max(0,f.hp-d);calc=`Damage: ${w.atk}${ml>1?' \u00d7 2 reckless':''}${cr?` + ${cr} critical`:''} \u2212 ${df} Defense${cr?' (critical ignores Defense)':kind==='aim'?' (aimed shot ignores Defense)':''} = ${d}`;
  const hitKey=kind==='wild'?'wild.melee':rg?'hit.ranged':'hit.melee',hitPool=kind==='wild'?TEXT.wild.melee:rg?TEXT.hit.ranged:TEXT.hit.melee;
  m=`${state.lp?pick(AGAIN):'You hit for'} ${d}. `+F(hitKey,hitPool);state.lp=1;}
 else{calc=foeHit(f,kind==='wild'?2:0);
  const missKey=kind==='wild'?'wildMiss':rg?'miss.ranged':'miss.melee',missPool=kind==='wild'?TEXT.wildMiss:rg?TEXT.miss.ranged:TEXT.miss.melee;
  m=F(missKey,missPool);state.lp=0;}
 if(state.hp<=0){const p=pickGlobal('playerFall',TEXT.playerFall);state.note=p.again?againify(p.text):p.text;state.scene='dead';state.fight=null;}
 else if(f.hp<=0){const p=pickGlobal('fall',TEXT.fall),fallText=fill(p.text,f,w);m+=' '+(p.again?againify(fallText):fallText);state.fight=null;if(f.drop)apply({give:f.drop});state.scene=SCENES[state.scene].then;}
 else if(Math.random()<.6)m+=' '+fill(pickFresh('say',f.say).text,f,w);
 showResult(r,m,before,calc);actSfx(kind,r);flashFoe(kind,r);
 {const L={strike:['Struck','Missed'],wild:['Landed a reckless blow on','Missed a reckless blow on'],aim:['Landed an aimed shot on','Missed an aimed shot on'],guard:['Held a guard against','Lost a guard against'],env:['Used the environment against','Failed to use the environment against']}[kind],dealt=fh-f.hp;
 logAct(actLine(`${L[r.pass?0:1]} ${f.name}${dealt?` for ${dealt}`:''}${f.hp<=0?', and it fell':''}`,before));}
 // a kill or a player death is the last action before the scene changes -- give the result text (and any
 // loot) time to be read before it cuts away. Mid-fight, keep the normal, snappier round-to-round pace.
 await sleep(state.fight?900:CONFIG.sceneReadDelay);lock(false);
 if(state.fight){show();}else enter(state.scene);
}
