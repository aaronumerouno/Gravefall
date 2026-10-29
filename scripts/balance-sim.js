#!/usr/bin/env node
/*
 * Gravefall balance simulator (Project Plan recommendation #1: "Balance by simulation").
 *
 * Mirrors the rules engine in Gravefall.html (CONFIG, ITEMS, DROPS, the fight stat
 * blocks, and the story-check DCs/effects) and runs many thousands of simulated
 * play-throughs of each chapter, using the game's own formulas (see rollCheck,
 * act, foeHit, hurt in Gravefall.html) rather than approximations.
 *
 * Usage: node scripts/balance-sim.js [runsPerChapter]
 */
'use strict';

const RUNS = parseInt(process.argv[2], 10) || 20000;

/* ===== Rules, copied from Gravefall.html ===== */
const CONFIG = { die: 20, maxHp: 28, critHeal: 3, fumbleDmg: 2, bag: 5, stats: { might: 3, guile: 1, resolve: 2 } };

const ITEMS = {
  chainblade: { n: 'Ironwolf Cutter', slot: 'weapon', atk: 6, acc: 1 },
  cleaver: { n: 'Salvaged Pipe Wrench', slot: 'weapon', atk: 4, acc: 0, tier: 'weak' },
  shiv: { n: 'Trench Shiv', slot: 'weapon', atk: 5, acc: 1, tier: 'weak' },
  maul: { n: 'Thunderclap Sledge', slot: 'weapon', atk: 10, acc: 0, tier: 'strong' },
  plasma: { n: 'Sunspear Lancer', slot: 'weapon', atk: 13, acc: -1, tier: 'strong' },
  spike: { n: 'Void Spike', slot: 'weapon', atk: 9, acc: 2, tier: 'strong' },
  carapace: { n: 'Ironwolf Flak Vest', slot: 'armor', dr: 2 },
  scrap: { n: 'Bolted Hull Plating', slot: 'armor', dr: 1, tier: 'weak' },
  legplate: { n: 'Salvaged Legplate', slot: 'armor', dr: 2, tier: 'weak' },
  bulwark: { n: 'Anvil-Class Siege Plate', slot: 'armor', dr: 4, tier: 'strong' },
  ablative: { n: 'Ablative Plating', slot: 'armor', dr: 3, tier: 'strong' },
  stim: { n: 'Rattlesnake Stim', slot: 'use', heal: 6, tier: 'weak' },
  bandage: { n: 'Field Bandage', slot: 'use', heal: 4, tier: 'weak' },
  medikit: { n: 'Lazarus Trauma Kit', slot: 'use', heal: 12, tier: 'strong' },
  nanite: { n: 'Nanite Canister', slot: 'use', heal: 9, tier: 'strong' }
};
const DROPS = { small: ['cleaver', 'scrap', 'stim', 'shiv', 'legplate', 'bandage'], big: ['maul', 'plasma', 'bulwark', 'medikit', 'spike', 'ablative', 'nanite'] };

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
  { id: 'boss', kind: 'fight', fight: { name: 'Major Kraag', hp: 26, dc: 13, def: 2, acc: 9, dmg: 9, drop: null } }
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
  { id: 'ch2_boss', kind: 'fight', fight: { name: 'Colonel Vex', hp: 34, dc: 14, def: 2, acc: 11, dmg: 8, drop: null } }
];

/* ===== Engine, copied from Gravefall.html's act()/rollCheck()/foeHit()/hurt() ===== */
const rand = () => Math.random();
const d20 = () => 1 + Math.floor(rand() * CONFIG.die);
const pick = a => a[Math.floor(rand() * a.length)];

function gear(p) {
  return { w: ITEMS[p.eq.weapon] || { atk: 2, acc: 0 }, a: ITEMS[p.eq.armor] || { dr: 0 } };
}
function mod(p, stat) {
  const base = CONFIG.stats[stat];
  const acc = stat === 'might' ? gear(p).w.acc : 0;
  const boost = (p.boost && p.boost[stat]) || 0;
  return base + acc + boost;
}
function evasion(p) { return mod(p, 'guile'); }
function rollCheck(p, stat, dc) {
  const roll = d20(), m = mod(p, stat), total = roll + m;
  const o = roll === CONFIG.die ? 'crit' : roll === 1 ? 'fumble' : total >= dc ? 'success' : 'fail';
  return { roll, total, o, pass: o === 'crit' || o === 'success' };
}
function hurt(p, n) {
  const d = Math.max(1, n - gear(p).a.dr - evasion(p));
  p.hp = Math.max(0, p.hp - d);
  return d;
}
function foeHit(p, f, add) { return hurt(p, f.dmg + add); }
function heal(p, n) { p.hp = Math.min(CONFIG.maxHp, p.hp + n); }

/* Loot: take if room, else swap out the worst item of the same slot if the new one is better. */
function giveLoot(p, poolOrId) {
  let id = poolOrId;
  if (DROPS[poolOrId]) {
    const pool = DROPS[poolOrId].filter(i => !p.inv.includes(i));
    if (!pool.length) return;
    id = pick(pool);
  }
  if (p.inv.includes(id)) return;
  const item = ITEMS[id];
  if (p.inv.length < CONFIG.bag) {
    p.inv.push(id);
  } else {
    // swap out the weakest item in the same slot, if this one is better; else leave it (as a cautious player would)
    const sameSlot = p.inv.filter(x => ITEMS[x].slot === item.slot);
    if (!sameSlot.length) return;
    const worst = sameSlot.reduce((a, b) => {
      const va = item.slot === 'weapon' ? ITEMS[a].atk : item.slot === 'armor' ? ITEMS[a].dr : ITEMS[a].heal;
      const vb = item.slot === 'weapon' ? ITEMS[b].atk : item.slot === 'armor' ? ITEMS[b].dr : ITEMS[b].heal;
      return va <= vb ? a : b;
    });
    const value = x => item.slot === 'weapon' ? ITEMS[x].atk : item.slot === 'armor' ? ITEMS[x].dr : ITEMS[x].heal;
    if (value(id) > value(worst)) {
      p.inv = p.inv.filter(x => x !== worst);
      if (p.eq[item.slot] === worst) p.eq[item.slot] = null;
      p.inv.push(id);
    }
  }
  // equip automatically if it's an upgrade (weapon/armor) and the slot's better or empty
  if (item.slot === 'weapon' || item.slot === 'armor') {
    const cur = p.eq[item.slot] ? ITEMS[p.eq[item.slot]] : null;
    const val = i => item.slot === 'weapon' ? i.atk : i.dr;
    if (!cur || val(item) > val(cur)) p.eq[item.slot] = id;
  }
}

function freshPlayer() {
  return { hp: CONFIG.maxHp, boost: {}, inv: ['chainblade', 'carapace', 'stim'], eq: { weapon: 'chainblade', armor: 'carapace' } };
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

/* Combat policy: Strike normally; use a healing item below 40% HP if one is carried;
   otherwise Guard below 25% HP; Reckless blow when it looks likely to end the fight in one hit. */
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
    const w = gear(p).w;
    let kind = 'strike';
    if (p.hp / CONFIG.maxHp < 0.25) kind = 'guard';
    else if (f.hp <= w.atk * 2) kind = 'wild'; // likely lethal reckless blow
    if (kind === 'guard') {
      const r = rollCheck(p, 'resolve', f.acc);
      if (r.o === 'crit') heal(p, CONFIG.critHeal);
      if (r.o === 'fumble') hurt(p, CONFIG.fumbleDmg);
      if (r.pass) heal(p, 2); else foeHit(p, f, 0);
    } else {
      const dc = kind === 'wild' ? f.dc + 3 : f.dc;
      const r = rollCheck(p, 'might', dc);
      if (r.o === 'crit') heal(p, CONFIG.critHeal);
      if (r.o === 'fumble') hurt(p, CONFIG.fumbleDmg);
      if (r.pass) {
        const cr = r.o === 'crit' ? w.atk : 0;
        const ml = kind === 'wild' ? 2 : 1;
        const df = cr ? 0 : f.def;
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

function runChapter(chapter, carriedPlayer) {
  // Chapter start: full Vitality, but gear/boosts carry over if the previous chapter was finished
  // (see "Between chapters" in the Game Design Document).
  const p = carriedPlayer ? { hp: CONFIG.maxHp, boost: { ...carriedPlayer.boost }, inv: carriedPlayer.inv.slice(), eq: { ...carriedPlayer.eq } } : freshPlayer();
  const log = { checks: [], fights: [] };
  for (const scene of chapter) {
    if (p.hp <= 0) break;
    if (scene.kind === 'choice') runChoice(p, scene, log);
    else if (scene.kind === 'fight') { if (!runFight(p, scene.fight, log)) break; }
    if (p.hp <= 0) break;
  }
  return { win: p.hp > 0, hpLeft: p.hp, log, player: p };
}

/* ===== Run simulations and report per-encounter stats ===== */
function simulate(name, chapter, runs) {
  const encounterStats = {}; // name -> {attempts, wins, hpLeftSum}
  let wins = 0, hpSum = 0;
  for (let i = 0; i < runs; i++) {
    const result = runChapter(chapter);
    if (result.win) { wins++; hpSum += result.hpLeft; }
    for (const f of result.log.fights) {
      const s = encounterStats[f.name] || (encounterStats[f.name] = { attempts: 0, wins: 0, roundsSum: 0, hpLeftSum: 0 });
      s.attempts++;
      if (f.won) { s.wins++; s.roundsSum += f.rounds; s.hpLeftSum += f.hpLeft; }
    }
  }
  console.log(`\n=== ${name} — chapter win rate: ${(wins / runs * 100).toFixed(1)}% over ${runs} runs (avg HP left on win: ${(hpSum / Math.max(1, wins)).toFixed(1)}/${CONFIG.maxHp}) ===`);
  console.log('Encounter          attempts   win%   avgRounds(won)  avgHPleft(won)   flag');
  for (const [enc, s] of Object.entries(encounterStats)) {
    const winPct = s.wins / s.attempts * 100;
    const avgRounds = s.roundsSum / Math.max(1, s.wins);
    const avgHp = s.hpLeftSum / Math.max(1, s.wins);
    let flag = '';
    if (winPct < 50) flag = 'IMPOSSIBLE?'; // reached the fight but usually dies
    else if (winPct > 97 && avgHp / CONFIG.maxHp > 0.75) flag = 'TRIVIAL?';
    console.log(
      enc.padEnd(18) + String(s.attempts).padStart(8) + winPct.toFixed(1).padStart(8) + '%' +
      avgRounds.toFixed(1).padStart(16) + avgHp.toFixed(1).padStart(17) + '   ' + flag
    );
  }
}

simulate('Chapter 1: Iron in the Dark (fresh kit)', CH1, RUNS);
simulate('Chapter 2: The Hollow Moon (fresh kit — only reachable today by skipping Ch.1)', CH2, RUNS);

// End-to-end: Chapter 2 as actually reached by a player who finished Chapter 1 and carried gear forward.
function simulateSaga(runs) {
  const encounterStats = {};
  let sagaWins = 0, ch1Wins = 0;
  for (let i = 0; i < runs; i++) {
    const r1 = runChapter(CH1);
    if (!r1.win) continue;
    ch1Wins++;
    const r2 = runChapter(CH2, r1.player);
    if (r2.win) sagaWins++;
    for (const f of r2.log.fights) {
      const s = encounterStats[f.name] || (encounterStats[f.name] = { attempts: 0, wins: 0, roundsSum: 0, hpLeftSum: 0 });
      s.attempts++;
      if (f.won) { s.wins++; s.roundsSum += f.rounds; s.hpLeftSum += f.hpLeft; }
    }
  }
  console.log(`\n=== Full saga: Chapter 2 with gear carried from a won Chapter 1 — ${runs} attempts, ${ch1Wins} reached Ch.2, saga win rate ${(sagaWins / ch1Wins * 100).toFixed(1)}% of those ===`);
  console.log('Encounter          attempts   win%   avgRounds(won)  avgHPleft(won)   flag');
  for (const [enc, s] of Object.entries(encounterStats)) {
    const winPct = s.wins / s.attempts * 100;
    const avgRounds = s.roundsSum / Math.max(1, s.wins);
    const avgHp = s.hpLeftSum / Math.max(1, s.wins);
    let flag = '';
    if (winPct < 50) flag = 'IMPOSSIBLE?';
    else if (winPct > 97 && avgHp / CONFIG.maxHp > 0.75) flag = 'TRIVIAL?';
    console.log(
      enc.padEnd(18) + String(s.attempts).padStart(8) + winPct.toFixed(1).padStart(8) + '%' +
      avgRounds.toFixed(1).padStart(16) + avgHp.toFixed(1).padStart(17) + '   ' + flag
    );
  }
}
simulateSaga(RUNS);
