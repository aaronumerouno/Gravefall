#!/usr/bin/env node
/*
 * Gravefall balance simulator (Project Plan recommendation #1: "Balance by simulation").
 *
 * Mirrors the rules engine in Gravefall.html (CONFIG, ITEMS, DROPS, gear(), mod(), the fight
 * stat blocks, and the story-check DCs/effects) and runs many thousands of simulated
 * play-throughs of each chapter, using the game's own formulas rather than approximations.
 *
 * Also exercises the character-creation stat allocation (CONFIG.allocPoints spent across
 * might/guile/resolve on top of a 1/1/1 base) across a few build archetypes, since the
 * player chooses that build once per save and it should not make the game trivial or
 * impossible regardless of how the points are spent.
 *
 * Usage: node scripts/balance-sim.js [runsPerBuild]
 */
'use strict';

const RUNS = parseInt(process.argv[2], 10) || 10000;

/* ===== Rules, copied from Gravefall.html ===== */
const CONFIG = { die: 20, maxHp: 28, critHeal: 3, fumbleDmg: 2, bag: 10, allocPoints: 3, stats: { might: 1, guile: 1, resolve: 1 } };

const ITEMS = {
  chainblade: { n: 'Ironwolf Cutter', slot: 'melee', atk: 6, acc: 1 },
  cleaver: { n: 'Salvaged Pipe Wrench', slot: 'melee', atk: 4, acc: 0, tier: 'weak' },
  shiv: { n: 'Trench Shiv', slot: 'melee', atk: 5, acc: 1, tier: 'weak' },
  maul: { n: 'Thunderclap Sledge', slot: 'melee', atk: 10, acc: 0, tier: 'strong' },
  spike: { n: 'Void Spike', slot: 'melee', atk: 9, acc: 2, tier: 'strong' },
  pistol: { n: 'Salvaged Repeater', slot: 'gun', atk: 5, acc: 1, tier: 'weak' },
  plasma: { n: 'Sunspear Lancer', slot: 'gun', atk: 13, acc: -1, tier: 'strong' },
  carapace: { n: 'Ironwolf Flak Vest', slot: 'body', dr: 2 },
  scrap: { n: 'Bolted Hull Plating', slot: 'body', dr: 1, tier: 'weak' },
  bodyMight: { n: 'Brute-Forged Breastplate', slot: 'body', dr: 1, stat: { might: 1 }, tier: 'weak' },
  bodyGuile: { n: 'Shadowweave Vest', slot: 'body', dr: 1, stat: { guile: 1 }, tier: 'weak' },
  bodyResolve: { n: 'Stalwart Harness', slot: 'body', dr: 1, stat: { resolve: 1 }, tier: 'weak' },
  bodyMix: { n: 'Hybrid Combat Rig', slot: 'body', dr: 1, stat: { guile: 1, resolve: 1 }, tier: 'weak' },
  bulwark: { n: 'Anvil-Class Siege Plate', slot: 'body', dr: 4, tier: 'strong' },
  bodyMightS: { n: 'Juggernaut Plate', slot: 'body', dr: 3, stat: { might: 2 }, tier: 'strong' },
  bodyGuileS: { n: 'Phantom Weave Plate', slot: 'body', dr: 3, stat: { guile: 2 }, tier: 'strong' },
  bodyResolveS: { n: 'Bastion Plate', slot: 'body', dr: 3, stat: { resolve: 2 }, tier: 'strong' },
  bodyMixS: { n: 'Warbound Plate', slot: 'body', dr: 3, stat: { might: 1, guile: 1, resolve: 1 }, tier: 'strong' },
  legplate: { n: 'Salvaged Legplate', slot: 'legs', dr: 1, tier: 'weak' },
  legsMight: { n: 'Stormtrooper Greaves', slot: 'legs', dr: 1, stat: { might: 1 }, tier: 'weak' },
  legsGuile: { n: 'Silent Treads', slot: 'legs', dr: 1, stat: { guile: 1 }, tier: 'weak' },
  legsResolve: { n: 'Anchor Greaves', slot: 'legs', dr: 1, stat: { resolve: 1 }, tier: 'weak' },
  legsMix: { n: 'Scavenger Leg Guards', slot: 'legs', dr: 1, stat: { might: 1, resolve: 1 }, tier: 'weak' },
  ablative: { n: 'Ablative Plating', slot: 'legs', dr: 3, tier: 'strong' },
  legsMightS: { n: 'Siegebreaker Greaves', slot: 'legs', dr: 2, stat: { might: 2 }, tier: 'strong' },
  legsGuileS: { n: 'Nightfall Treads', slot: 'legs', dr: 2, stat: { guile: 2 }, tier: 'strong' },
  legsResolveS: { n: 'Unbreakable Greaves', slot: 'legs', dr: 2, stat: { resolve: 2 }, tier: 'strong' },
  legsMixS: { n: 'Warden’s Leg Plate', slot: 'legs', dr: 2, stat: { might: 1, guile: 1, resolve: 1 }, tier: 'strong' },
  stim: { n: 'Rattlesnake Stim', slot: 'use', heal: 6, tier: 'weak' },
  bandage: { n: 'Field Bandage', slot: 'use', heal: 4, tier: 'weak' },
  medikit: { n: 'Lazarus Trauma Kit', slot: 'use', heal: 12, tier: 'strong' },
  nanite: { n: 'Nanite Canister', slot: 'use', heal: 9, tier: 'strong' },
  hiveblade: { n: 'Hivebreaker Gauntlet', slot: 'melee', atk: 11, acc: 1, tier: 'strong' },
  elixir: { n: 'Sovereign’s Elixir', slot: 'use', heal: 15, tier: 'strong' }
};
const DROPS = {
  small: ['cleaver', 'shiv', 'pistol', 'scrap', 'bodyMight', 'bodyGuile', 'bodyResolve', 'bodyMix', 'legplate', 'legsMight', 'legsGuile', 'legsResolve', 'legsMix', 'stim', 'bandage'],
  big: ['maul', 'spike', 'plasma', 'bulwark', 'bodyMightS', 'bodyGuileS', 'bodyResolveS', 'bodyMixS', 'ablative', 'legsMightS', 'legsGuileS', 'legsResolveS', 'legsMixS', 'medikit', 'nanite', 'hiveblade', 'elixir']
};

/* Story graph: only the numbers the simulator needs (stat checks, DCs, hp/stat fx, loot). */
const CH1 = [
  { id: 'intro', kind: 'choice', options: [
      { check: { stat: 'might', dc: 14 }, lose: { hp: -4 } },
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -3 } }
  ] },
  { id: 'c1', kind: 'fight', fight: { name: 'Skitterling', hp: 9, dc: 10, def: 0, acc: 6, dmg: 4, drop: 'small' } },
  { id: 'relay', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -4 } },
      { check: { stat: 'guile', dc: 12 }, lose: { hp: -5 } },
      { check: { stat: 'might', dc: 14 }, lose: { hp: -6 } }
  ] },
  { id: 'brute', kind: 'fight', fight: { name: 'Hullcrusher', hp: 16, dc: 12, def: 1, acc: 8, dmg: 7, drop: 'big' } },
  { id: 'medbay', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 9 }, win: { hp: 10 }, lose: { hp: 3 } },
      { check: { stat: 'guile', dc: 12 }, win: { give: 'small' }, lose: { hp: -3 } },
      { noCheck: true }
  ] },
  { id: 'ambush', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -5 } },
      { check: { stat: 'might', dc: 14 }, lose: { hp: -7 } }
  ] },
  { id: 'gunner', kind: 'fight', fight: { name: 'Rustjack gunner', hp: 11, dc: 11, def: 1, acc: 7, dmg: 5, drop: 'small' } },
  { id: 'armory', kind: 'choice', options: [
      { noCheck: true, win: { give: 'plasma' } },
      { noCheck: true, win: { give: 'medikit' } }
  ] },
  { id: 'gate', kind: 'choice', options: [
      { check: { stat: 'guile', dc: 13 }, win: { stat: { guile: 1 } }, lose: { stat: { guile: -1 } } },
      { check: { stat: 'resolve', dc: 10 }, win: { stat: { resolve: 1 } }, lose: { stat: { resolve: -1 } } }
  ] },
  { id: 'boss', kind: 'fight', fight: { name: 'Major Kraag', hp: 26, dc: 13, def: 5, acc: 13, dmg: 11, drop: null } }
];

const CH2 = [
  { id: 'ch2_start', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -4 } },
      { check: { stat: 'might', dc: 13 }, lose: { hp: -5 } }
  ] },
  { id: 'ch2_tunnel', kind: 'fight', fight: { name: 'Skitterling brood', hp: 13, dc: 11, def: 0, acc: 7, dmg: 5, drop: 'small' } },
  { id: 'ch2_lift', kind: 'choice', options: [
      { check: { stat: 'guile', dc: 12 }, win: { stat: { guile: 1 } }, lose: { stat: { guile: -1 } } },
      { check: { stat: 'might', dc: 13 }, win: { stat: { might: 1 } }, lose: { stat: { might: -1 } } },
      { check: { stat: 'resolve', dc: 10 }, win: { stat: { resolve: 1 } }, lose: { stat: { resolve: -1 } } }
  ] },
  { id: 'ch2_pit', kind: 'fight', fight: { name: 'Ironback Hullcrusher', hp: 22, dc: 12, def: 2, acc: 8, dmg: 8, drop: 'big' } },
  { id: 'ch2_gate', kind: 'choice', options: [
      { check: { stat: 'guile', dc: 13 }, win: { stat: { guile: 1 } }, lose: { stat: { guile: -1 } } },
      { check: { stat: 'might', dc: 12 }, win: { stat: { might: 1 } }, lose: { stat: { might: -1 } } }
  ] },
  { id: 'ch2_boss', kind: 'fight', fight: { name: 'Colonel Vex', hp: 34, dc: 14, def: 4, acc: 14, dmg: 10, drop: null } }
];

const CH3 = [
  { id: 'ch3_start', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -4 } },
      { check: { stat: 'might', dc: 14 }, lose: { hp: -5 } }
  ] },
  { id: 'ch3_den', kind: 'fight', fight: { name: 'Hive Stalker', hp: 17, dc: 12, def: 0, acc: 8, dmg: 6, drop: 'small' } },
  { id: 'ch3_relay', kind: 'choice', options: [
      { check: { stat: 'guile', dc: 12 }, lose: { hp: -4 } },
      { check: { stat: 'might', dc: 14 }, lose: { hp: -6 } },
      { check: { stat: 'resolve', dc: 11 }, lose: { hp: -5 } }
  ] },
  { id: 'ch3_warden', kind: 'fight', fight: { name: 'Hive Warden', hp: 28, dc: 12, def: 3, acc: 8, dmg: 9, drop: 'big' } },
  { id: 'ch3_respite', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 9 }, win: { hp: 10 }, lose: { hp: 3 } },
      { check: { stat: 'guile', dc: 12 }, win: { give: 'small' }, lose: { hp: -3 } },
      { noCheck: true }
  ] },
  { id: 'ch3_descent', kind: 'choice', options: [
      { check: { stat: 'resolve', dc: 12 }, lose: { hp: -5 } },
      { check: { stat: 'might', dc: 15 }, lose: { hp: -7 } }
  ] },
  { id: 'ch3_relic', kind: 'choice', options: [
      { noCheck: true, win: { give: 'hiveblade' } },
      { noCheck: true, win: { give: 'elixir' } }
  ] },
  { id: 'ch3_threshold', kind: 'choice', options: [
      { check: { stat: 'guile', dc: 14 }, win: { stat: { guile: 1 } }, lose: { stat: { guile: -1 } } },
      { check: { stat: 'resolve', dc: 11 }, win: { stat: { resolve: 1 } }, lose: { stat: { resolve: -1 } } }
  ] },
  { id: 'ch3_boss', kind: 'fight', fight: { name: 'The Hive Sovereign', hp: 42, dc: 15, def: 4, acc: 14, dmg: 11, drop: null } }
];

/* ===== Engine, copied from Gravefall.html's gear()/mod()/act()/rollCheck()/foeHit()/hurt() ===== */
const rand = () => Math.random();
const d20 = () => 1 + Math.floor(rand() * CONFIG.die);
const pick = a => a[Math.floor(rand() * a.length)];

function gear(p) {
  return {
    melee: ITEMS[p.eq.melee] || { atk: 2, acc: 0 },
    gun: ITEMS[p.eq.gun] || null,
    body: ITEMS[p.eq.body] || { dr: 0 },
    legs: ITEMS[p.eq.legs] || { dr: 0 }
  };
}
function armorDr(p) { const g = gear(p); return g.body.dr + g.legs.dr; }
function gearStatBonus(p, stat) {
  const g = gear(p);
  return ((g.body.stat && g.body.stat[stat]) || 0) + ((g.legs.stat && g.legs.stat[stat]) || 0);
}
function mod(p, stat, bonus) {
  const base = CONFIG.stats[stat];
  const acc = stat === 'might' ? gear(p).melee.acc : 0;
  const boost = (p.boost && p.boost[stat]) || 0;
  return base + acc + boost + gearStatBonus(p, stat) + (bonus || 0);
}
function evasion(p) { return mod(p, 'guile'); }
function rollCheck(p, stat, dc, bonus) {
  const roll = d20(), m = mod(p, stat, bonus), total = roll + m;
  const o = roll === CONFIG.die ? 'crit' : roll === 1 ? 'fumble' : total >= dc ? 'success' : 'fail';
  return { roll, total, o, pass: o === 'crit' || o === 'success' };
}
function hurt(p, n) {
  const d = Math.max(1, n - armorDr(p) - evasion(p));
  p.hp = Math.max(0, p.hp - d);
  return d;
}
function foeHit(p, f, add) { return hurt(p, f.dmg + add); }
function heal(p, n) { p.hp = Math.min(CONFIG.maxHp, p.hp + n); }

/* Loot: take if room, else swap out the worst item of the same slot if the new one is better (by raw dr/atk/heal). */
function slotValue(id) {
  const i = ITEMS[id];
  return i.slot === 'melee' || i.slot === 'gun' ? i.atk : i.slot === 'body' || i.slot === 'legs' ? i.dr : i.heal;
}
function giveLoot(p, poolOrId) {
  let id = poolOrId;
  if (DROPS[poolOrId]) {
    const pool = DROPS[poolOrId].filter(i => !p.inv.includes(i));
    if (!pool.length) return;
    // bias toward filling a missing weapon slot, matching EFFECTS.give in Gravefall.html
    const noMelee = !p.inv.some(i => ITEMS[i].slot === 'melee'), noGun = !p.inv.some(i => ITEMS[i].slot === 'gun');
    const priority = pool.filter(i => (noMelee && ITEMS[i].slot === 'melee') || (noGun && ITEMS[i].slot === 'gun'));
    id = pick((priority.length && rand() < 0.6) ? priority : pool);
  }
  if (p.inv.includes(id)) return;
  const item = ITEMS[id];
  if (p.inv.length < CONFIG.bag) {
    p.inv.push(id);
  } else {
    const sameSlot = p.inv.filter(x => ITEMS[x].slot === item.slot);
    if (!sameSlot.length) return;
    const worst = sameSlot.reduce((a, b) => slotValue(a) <= slotValue(b) ? a : b);
    if (slotValue(id) > slotValue(worst)) {
      p.inv = p.inv.filter(x => x !== worst);
      if (p.eq[item.slot] === worst) p.eq[item.slot] = null;
      p.inv.push(id);
    } else return;
  }
  // equip automatically if it's an upgrade (or the slot is empty)
  if (item.slot !== 'use') {
    const curId = p.eq[item.slot], cur = curId ? ITEMS[curId] : null;
    if (!cur || slotValue(id) > slotValue(curId)) p.eq[item.slot] = id;
  }
}

/* Character creation: CONFIG.allocPoints spent across might/guile/resolve on top of the 1/1/1 base.
   Simulated across a few archetypes a real player might pick. */
const BUILDS = {
  allMight: { might: CONFIG.allocPoints, guile: 0, resolve: 0 },
  allGuile: { might: 0, guile: CONFIG.allocPoints, resolve: 0 },
  allResolve: { might: 0, guile: 0, resolve: CONFIG.allocPoints },
  balanced: (() => {
    const b = { might: 0, guile: 0, resolve: 0 }, keys = ['might', 'guile', 'resolve'];
    for (let i = 0; i < CONFIG.allocPoints; i++) b[keys[i % 3]]++;
    return b;
  })()
};
/* Opening-kit choice (new): one weapon up front (melee or gun), the other found in play; one of 4 armor flavors. */
const LOADOUT_ARMORS = { might: 'bodyMight', guile: 'bodyGuile', resolve: 'bodyResolve', mix: 'bodyMix' };
const LOADOUTS = {
  meleeMight: { weapon: 'melee', armor: 'might' },
  meleeGuile: { weapon: 'melee', armor: 'guile' },
  gunGuile: { weapon: 'gun', armor: 'guile' },
  gunResolve: { weapon: 'gun', armor: 'resolve' }
};
function freshPlayer(build, loadout) {
  if (!loadout) return { hp: CONFIG.maxHp, boost: { ...build }, inv: ['chainblade', 'carapace', 'stim'], eq: { melee: 'chainblade', gun: null, body: 'carapace', legs: null } };
  const armorId = LOADOUT_ARMORS[loadout.armor];
  const inv = loadout.weapon === 'gun' ? ['pistol', armorId, 'stim'] : ['chainblade', armorId, 'stim'];
  const eq = loadout.weapon === 'gun' ? { melee: null, gun: 'pistol', body: armorId, legs: null } : { melee: 'chainblade', gun: null, body: armorId, legs: null };
  return { hp: CONFIG.maxHp, boost: { ...build }, inv, eq };
}

/* Player policy for story checks: pick the option with the best odds of passing (a reasonably played run). */
function oddsOf(p, check) {
  const m = mod(p, check.stat);
  let k = 0;
  for (let r = 1; r <= CONFIG.die; r++) if (r === CONFIG.die || (r > 1 && r + m >= check.dc)) k++;
  return k / CONFIG.die;
}
function runChoice(p, scene, log) {
  const opts = scene.options;
  let opt;
  if (opts.length === 1 && opts[0].noCheck) opt = opts[0];
  else {
    const withCheck = opts.filter(o => o.check);
    opt = withCheck.length
      ? withCheck.reduce((a, b) => oddsOf(p, a.check) >= oddsOf(p, b.check) ? a : b)
      : pick(opts);
  }
  if (opt.noCheck) {
    if (opt.win) applyFx(p, opt.win);
    return;
  }
  const r = rollCheck(p, opt.check.stat, opt.check.dc);
  const fx = r.pass ? opt.win : opt.lose;
  if (r.o === 'crit') heal(p, CONFIG.critHeal);
  if (r.o === 'fumble') hurt(p, CONFIG.fumbleDmg);
  if (fx) applyFx(p, fx);
  log.checks.push({ scene: scene.id, stat: opt.check.stat, dc: opt.check.dc, pass: r.pass });
}
function applyFx(p, fx) {
  if (!fx) return;
  if (fx.hp) p.hp = Math.max(0, Math.min(CONFIG.maxHp, p.hp + fx.hp)); // matches EFFECTS.hp in Gravefall.html
  if (fx.stat) for (const k in fx.stat) p.boost[k] = (p.boost[k] || 0) + fx.stat[k];
  if (fx.give) giveLoot(p, fx.give);
}

/* Combat policy: Strike normally (Aimed shot instead, when a gun is equipped and the enemy's Defense
   makes ignoring it worthwhile); use a healing item below 40% HP if one is carried; Guard below 25% HP;
   Reckless blow when it looks likely to end the fight in one hit. */
function useBestHeal(p) {
  const heals = p.inv.filter(id => ITEMS[id].slot === 'use').sort((a, b) => ITEMS[b].heal - ITEMS[a].heal);
  if (!heals.length) return false;
  const id = heals[0];
  heal(p, ITEMS[id].heal);
  p.inv = p.inv.filter(x => x !== id);
  return true;
}
function runFight(p, fightDef, log) {
  const f = { ...fightDef, max: fightDef.hp };
  let rounds = 0;
  while (f.hp > 0 && p.hp > 0 && rounds < 200) {
    rounds++;
    if (p.hp / CONFIG.maxHp < 0.4 && useBestHeal(p)) continue;
    const g = gear(p);
    let kind = 'strike';
    if (p.hp / CONFIG.maxHp < 0.25) kind = 'guard';
    else if (f.hp <= g.melee.atk * 2) kind = 'wild'; // likely lethal reckless blow
    else if (g.gun && f.def >= 2) kind = 'aim'; // worth ignoring Defense
    if (kind === 'guard') {
      const r = rollCheck(p, 'resolve', f.acc);
      if (r.o === 'crit') heal(p, CONFIG.critHeal);
      if (r.o === 'fumble') hurt(p, CONFIG.fumbleDmg);
      if (r.pass) heal(p, 2); else foeHit(p, f, 0);
    } else {
      const w = kind === 'aim' ? g.gun : g.melee;
      const stat = kind === 'aim' ? 'guile' : 'might';
      const dc = kind === 'wild' ? f.dc + 3 : kind === 'aim' ? f.dc + 2 : f.dc;
      const bonus = kind === 'aim' ? g.gun.acc : 0;
      const r = rollCheck(p, stat, dc, bonus);
      if (r.o === 'crit') heal(p, CONFIG.critHeal);
      if (r.o === 'fumble') hurt(p, CONFIG.fumbleDmg);
      if (r.pass) {
        const cr = r.o === 'crit' ? w.atk : 0;
        const ml = kind === 'wild' ? 2 : 1;
        const df = (cr || kind === 'aim') ? 0 : f.def;
        const dmg = Math.max(1, w.atk * ml + cr - df);
        f.hp = Math.max(0, f.hp - dmg);
      } else {
        foeHit(p, f, kind === 'wild' ? 2 : 0);
      }
    }
  }
  const won = f.hp <= 0 && p.hp > 0;
  log.fights.push({ name: f.name, won, rounds, hpLeft: p.hp });
  if (won && fightDef.drop) giveLoot(p, fightDef.drop);
  return won;
}

function runChapter(chapter, carriedPlayer, build, loadout) {
  // Chapter start: full Vitality, but gear/boosts carry over if the previous chapter was finished
  // (see "Between chapters" in the Game Design Document).
  const p = carriedPlayer ? { hp: CONFIG.maxHp, boost: { ...carriedPlayer.boost }, inv: carriedPlayer.inv.slice(), eq: { ...carriedPlayer.eq } } : freshPlayer(build, loadout);
  const log = { checks: [], fights: [] };
  for (const scene of chapter) {
    if (p.hp <= 0) break;
    if (scene.kind === 'choice') runChoice(p, scene, log);
    else if (scene.kind === 'fight') { if (!runFight(p, scene.fight, log)) break; }
    if (p.hp <= 0) break;
  }
  return { win: p.hp > 0, hpLeft: p.hp, log, player: p };
}

/* ===== Run simulations and report per-encounter stats, once per build archetype ===== */
function simulate(label, chapter, runs, build) {
  const encounterStats = {};
  let wins = 0, hpSum = 0;
  for (let i = 0; i < runs; i++) {
    const result = runChapter(chapter, null, build);
    if (result.win) { wins++; hpSum += result.hpLeft; }
    for (const f of result.log.fights) {
      const s = encounterStats[f.name] || (encounterStats[f.name] = { attempts: 0, wins: 0, roundsSum: 0, hpLeftSum: 0 });
      s.attempts++;
      if (f.won) { s.wins++; s.roundsSum += f.rounds; s.hpLeftSum += f.hpLeft; }
    }
  }
  console.log(`\n--- ${label} — chapter win rate: ${(wins / runs * 100).toFixed(1)}% over ${runs} runs (avg HP left on win: ${(hpSum / Math.max(1, wins)).toFixed(1)}/${CONFIG.maxHp}) ---`);
  for (const [enc, s] of Object.entries(encounterStats)) {
    const winPct = s.wins / s.attempts * 100;
    const avgRounds = s.roundsSum / Math.max(1, s.wins);
    const avgHp = s.hpLeftSum / Math.max(1, s.wins);
    let flag = '';
    if (winPct < 50) flag = 'IMPOSSIBLE?';
    else if (winPct > 97 && avgHp / CONFIG.maxHp > 0.75) flag = 'TRIVIAL?';
    console.log(
      '  ' + enc.padEnd(18) + String(s.attempts).padStart(8) + winPct.toFixed(1).padStart(8) + '%' +
      avgRounds.toFixed(1).padStart(16) + avgHp.toFixed(1).padStart(17) + '   ' + flag
    );
  }
}

console.log(`allocPoints=${CONFIG.allocPoints} (base 1/1/1 + these, freely spent at character creation)`);
console.log('=== Chapter 1: Iron in the Dark (fresh kit, by build) ===');
for (const [name, build] of Object.entries(BUILDS)) simulate(name, CH1, RUNS, build);
console.log('\n=== Chapter 3: The Hive’s End (fresh kit — only reachable today by skipping Ch.1/2) ===');
for (const [name, build] of Object.entries(BUILDS)) simulate(name, CH3, RUNS, build);

// End-to-end: Chapters 2 and 3 as actually reached by a player who won each chapter before it and carried gear forward.
function simulateSaga(runs, build, label) {
  const encounterStats = {};
  let ch1Wins = 0, ch2Wins = 0, ch3Wins = 0;
  for (let i = 0; i < runs; i++) {
    const r1 = runChapter(CH1, null, build);
    if (!r1.win) continue;
    ch1Wins++;
    const r2 = runChapter(CH2, r1.player);
    for (const f of r2.log.fights) {
      const s = encounterStats[f.name] || (encounterStats[f.name] = { attempts: 0, wins: 0, roundsSum: 0, hpLeftSum: 0 });
      s.attempts++;
      if (f.won) { s.wins++; s.roundsSum += f.rounds; s.hpLeftSum += f.hpLeft; }
    }
    if (!r2.win) continue;
    ch2Wins++;
    const r3 = runChapter(CH3, r2.player);
    if (r3.win) ch3Wins++;
    for (const f of r3.log.fights) {
      const s = encounterStats[f.name] || (encounterStats[f.name] = { attempts: 0, wins: 0, roundsSum: 0, hpLeftSum: 0 });
      s.attempts++;
      if (f.won) { s.wins++; s.roundsSum += f.rounds; s.hpLeftSum += f.hpLeft; }
    }
  }
  console.log(`\n--- ${label}: ${runs} attempts, ${ch1Wins} reached Ch.2 (${(ch1Wins / runs * 100).toFixed(1)}%), ${ch2Wins} reached Ch.3 (${(ch2Wins / Math.max(1, ch1Wins) * 100).toFixed(1)}% of those), ${ch3Wins} finished the saga (${(ch3Wins / Math.max(1, ch2Wins) * 100).toFixed(1)}% of those) ---`);
  for (const [enc, s] of Object.entries(encounterStats)) {
    const winPct = s.wins / s.attempts * 100;
    const avgRounds = s.roundsSum / Math.max(1, s.wins);
    const avgHp = s.hpLeftSum / Math.max(1, s.wins);
    let flag = '';
    if (winPct < 50) flag = 'IMPOSSIBLE?';
    else if (winPct > 97 && avgHp / CONFIG.maxHp > 0.75) flag = 'TRIVIAL?';
    console.log(
      '  ' + enc.padEnd(18) + String(s.attempts).padStart(8) + winPct.toFixed(1).padStart(8) + '%' +
      avgRounds.toFixed(1).padStart(16) + avgHp.toFixed(1).padStart(17) + '   ' + flag
    );
  }
}
console.log('\n=== Full saga, by build ===');
for (const [name, build] of Object.entries(BUILDS)) simulateSaga(RUNS, build, name);

// Opening-kit choice: spot-check that an early fight (before any loot) isn't impossible
// for a build/loadout combo a real player might actually pick, especially the unarmed-melee
// gun-first start, which has no melee weapon at all until the player finds and equips one.
console.log('\n=== Chapter 1, by opening kit (fresh kit, Ch.1 only) ===');
function simulateLoadout(label, build, loadout, runs) {
  let wins = 0;
  const first = { attempts: 0, wins: 0 }; // the very first fight (Skitterling), before any loot
  for (let i = 0; i < runs; i++) {
    const result = runChapter(CH1, null, build, loadout);
    if (result.win) wins++;
    const f = result.log.fights[0];
    if (f) { first.attempts++; if (f.won) first.wins++; }
  }
  console.log(`--- ${label} — chapter win rate: ${(wins / runs * 100).toFixed(1)}% | first fight (unarmed/under-geared start) win rate: ${(first.wins / Math.max(1, first.attempts) * 100).toFixed(1)}% ---`);
}
simulateLoadout('melee-first + all-Might (classic)', BUILDS.allMight, LOADOUTS.meleeMight, RUNS);
simulateLoadout('gun-first + all-Guile (sniper)', BUILDS.allGuile, LOADOUTS.gunGuile, RUNS);
simulateLoadout('gun-first + all-Resolve (mismatched, worst case)', BUILDS.allResolve, LOADOUTS.gunResolve, RUNS);
simulateLoadout('melee-first + balanced', BUILDS.balanced, LOADOUTS.meleeGuile, RUNS);
