/* ===== EFFECTS: used in scene outcomes as fx:{hp:-3, flag:'x', give:'maul'|'small'|'big'} ===== */
const EFFECTS={
 hp:(s,v)=>{s.hp=Math.max(0,Math.min(CONFIG.maxHp,s.hp+v));},
 flag:(s,v)=>{s.flags[v]=1;},
 stat:(s,v)=>{for(const k in v)s.boost[k]=(s.boost[k]||0)+v[k];},
 give:(s,v)=>{if(DROPS[v]){const p=DROPS[v].filter(i=>!s.inv.includes(i));if(!p.length)return;
   const noMelee=!s.inv.some(i=>ITEMS[i].slot==='melee'),noGun=!s.inv.some(i=>ITEMS[i].slot==='gun'),
    pri=p.filter(i=>(noMelee&&ITEMS[i].slot==='melee')||(noGun&&ITEMS[i].slot==='gun')),
    pool=(pri.length&&Math.random()<.6)?pri:p;
   v=pool[Math.floor(Math.random()*pool.length)];}
  if(!s.inv.includes(v))s.pending=v;}
};

