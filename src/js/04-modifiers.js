/* ===== MODIFIERS: situational roll bonuses ===== */
const MODIFIERS=[(s,c)=>c.stat==='might'?gear(s).melee.acc:0,(s,c)=>(s.boost&&s.boost[c.stat])||0,(s,c)=>gearStatBonus(s,c.stat),(s,c)=>envStatBonus(s,c.stat)];

