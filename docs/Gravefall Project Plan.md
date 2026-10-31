# Gravefall: Project Plan

Oct 29, 2026 · @Aaron

## Where we are

Gravefall has two playable chapters, a full set of mechanics, pixel art, sound and narration, and a published link; the next step is to prove it plays well. The full design is in the Gravefall Game Design Document.

**Built:** three chapters (Chapter 3 closes Act I, the alien war — see the Game Design Document's **Saga arc**), dice-driven choices and combat with a 4th action (Aimed shot), enemy stats with a visible damage breakdown, a 10-slot inventory across four equipment slots (melee, gun, body armor, leg armor) with loot that always resolves before the next scene, a one-time character-creation stat allocation plus an opening-kit choice (starting weapon and armor flavor), saved progress, choices that echo into later scenes and endings, about 60+ varied fight lines, pixel art for every scene and enemy (Chapter 3's enemies reuse Chapter 1/2's sprites with a new palette), synthesized sound effects, a browser narrator, mobile and desktop layouts, and chapters as dropdowns.

**Not yet verified:** a full play-through of any chapter on a real device, real phones, and real voices. Enemy and item numbers are simulated (`scripts/balance-sim.js`) but not human-playtested.

## Recommendations

Start with balance, saving and meaningful choices; they decide whether the game is worth playing twice. Impact and effort below are Claude's estimates, not measured.

| # | Recommendation | Why | Impact | Effort | Priority |
| --- | --- | --- | --- | --- | --- |
| 1 | Balance by simulation | Run thousands of automated fights and runs to catch fights that are impossible or trivial, keeping dice results random | High | Small | **Done** — `scripts/balance-sim.js`, now simulated per build archetype (all-Might/Guile/Resolve/balanced); Kraag and Vex retuned twice, most recently after the equipment and stat-allocation overhaul |
| 2 | Save progress | A refresh currently loses everything; store progress per chapter on the player's device | High | Small | **Done** — saved to `localStorage`, validated on load |
| 3 | Make choices matter | Choices set flags that change later scenes, ally reactions and endings, so replays differ | High | Medium | **Done** — forced-entry/picked-lock, stealth/bold, and the armory item choice now echo into the next scene, the boss introduction and the victory text, per chapter |
| 4 | Add progression | Decided: the player has a level and spends stat points on each level-up; see the progression design below, now revised and simulated against the real 3-chapter game, not just estimated. A one-time stat allocation at character creation already exists (not this) — leveling still adds points *during* a chapter from XP. Not yet implemented, and the simulation found a real stat-balance issue (Guile) to fix first | Medium | Medium | Next |
| 5 | Give allies jobs | For example Quill heals once per fight and Brannigan lowers an enemy's Defense | Medium | Medium | Next |
| 6 | Unique Chapter 2 art | New backdrops and sprites instead of reused Chapter 1 art and recolors | Medium | Medium | Later |
| 7 | Settings panel | Toggles for success odds, voice speed and text size | Low | Small | Next |
| 8 | Environmental actions | A 5th, scene-specific combat action per fight using something from that scene's description (prop-based damage, heal, or a fight-only Defense/stat bonus), with a small fumble-driven chance to backfire instead | Medium | Medium | **Done** — all 10 fights across Chapters 1–3; not yet run through `scripts/balance-sim.js` since it's a bounded, once-per-fight bonus, but worth including in the next full balance pass |

**Process recommendations.** Test on real phones and note anything that looks or sounds wrong before adding features. Settle the story and the mechanics before adding more systems; the voice work was redone several times because each change built on the last.

## Roadmap

Four phases, in order; no dates are set yet because the pace depends on how much testing and feedback each phase needs.

| Phase | Delivers | Done when |
| --- | --- | --- |
| 1. Stabilize | Real-phone test pass, balance simulation, saving, chapter locking (done), settings panel | A typical player can finish Chapter 1, and progress survives a refresh |
| 2. Depth | Meaningful choices and endings, progression, ally abilities | Two runs of one chapter can differ in story and in build |
| 3. Polish | Unique Chapter 2 art | Chapter 2 no longer reuses Chapter 1 art |
| 4. Expand | The full ten-chapter saga, built one chapter at a time from the chapter template. Chapter 3 is done and closes Act I (the alien war). Chapters 4–10 are Act II — seven chapters on an Earth-like homeworld, each themed to one of the seven deadly sins with its own demon-lord boss. See the Game Design Document's **Saga arc** section for the planned chapter list, order and status | Each new chapter opens as a dropdown and carries gear forward; each chapter's enemy stats go through `scripts/balance-sim.js` before it ships, the same as Chapters 1–3 |

## Progression design (recommendation #4, revised and simulated — still not built)

The old version of this section assumed the pre-overhaul baseline (Might 3/Guile 1/Resolve 2, one weapon slot) and said plainly it needed to be re-run against the current game before shipping. It has now been re-run, for real, through `scripts/balance-sim.js --level` (a new flag added for exactly this: it layers the design below on top of the actual engine — same gear, same loot, same 4 build archetypes, same 3 built chapters — without changing anything when the flag is omitted). The numbers below are simulated outcomes, not estimates. **Still not implemented in Gravefall.html** — this is the validated design to build from next, including one real problem it surfaced.

**The proposal.** The player earns XP from fights (not story checks) and levels up, spending one free stat point per level, the same way character-creation points are spent.

| Source or level | XP | Reward |
| --- | --- | --- |
| Small enemy (Skitterling, Rustjack gunner, brood, Hive Stalker) | 10 | None |
| Big enemy (Hullcrusher, Ironback, Hive Warden) | 25 | None |
| Boss (Kraag, Vex, the Hive Sovereign) | 50 | None |
| Level 2 | 30 total | +1 stat point, +3 max Vitality |
| Level 3 | 70 total | +1 stat point, +3 max Vitality |
| Level 4 | 120 total | +1 stat point, +3 max Vitality |
| Level 5 | 180 total | +1 stat point, +3 max Vitality |
| Level 6 | 250 total | +1 stat point, +3 max Vitality |

**Rules.** Leveling does not heal (Vitality resets to full only when a new chapter starts, same as today). XP, level and stat points carry into the next chapter the same way gear already does. A full, careful run clears 95 XP in Chapter 1, 85 more in Chapter 2, 85 more in Chapter 3 — 265 total, enough to reach level 6 with 15 XP to spare, so a level cap isn't being hit mid-fight; room for Chapters 4+ to extend the table later.

**Simulated effect (25,000 runs/build, the Hive Sovereign — the hardest fight in the game today):**

| Build | Without leveling | With leveling |
| --- | --- | --- |
| All-Might | 49.6% (flagged impossible) | 68.5% |
| All-Guile | 88.0% | **99.8% (flagged trivial)** |
| All-Resolve | 48.2% (flagged impossible) | 76.8% |
| Balanced | 63.1% | 81.3% |

**The good news:** leveling does what it's supposed to. It lifts the weakest build (all-Resolve) the most — from the worst performer today to comfortably ahead of where "balanced" starts — because the flat +3 Vitality per level compounds nicely with a tanky, Guard-heavy playstyle. All-Might and balanced both land in healthy, clearly-winnable territory.

**The problem it surfaced:** all-Guile, already the strongest build without any leveling at all, gets pushed into trivial by Chapter 3. Capping *where level-up points go* (tried at `--cap=6/7/8`, i.e. no single stat allowed past that total from level-ups) made no real difference (99.7–99.8% regardless) — because gear alone already pushes Guile past any level-based cap; a single strong Guile-flavored body or leg armor piece grants +2 on its own. The real cause isn't leveling, it's pre-existing: Guile is a hybrid stat (it lowers Evasion damage on *every* hit taken, in every fight, *and* unlocks Aimed shot's Defense-ignoring offense once a gun is found), so it was already the strongest single-stat investment in the game before this feature — leveling just gives more points to pour into it. **This should be fixed before or alongside implementing leveling, not worked around by the level curve.** Two candidate fixes, neither simulated yet: cap each stat's *total* bonus (base + alloc + gear + levels combined, enforced in code the way the security review already calls for), or revisit Evasion's math so it has diminishing returns instead of a flat 1-for-1 reduction per point. Either is a small, targeted change — this is a flag for the next balance pass, not a rewrite.

**What's still open:** whether the player picks which stat each level-up point goes to (same agency as character creation, but doesn't stop deliberate stacking) versus the game auto-assigning it; whether level-ups should unlock anything beyond stat points and Vitality (an extra pack slot? a 5th combat action?); and the UI for it (a level-up notification + a mini version of the character-creation stat screen is the obvious fit, reusing `renderAlloc()`'s pattern).

## Open questions and risks

- [x] Win rate: decided that there is no target; dice outcomes stay random.
- [x] Chapter length: decided that it is not a target, since voice and idle time change it.
- [x] Chapter locking: decided that the next chapter stays locked until the current one is finished; gear carries over and Vitality resets to full.
- [x] Narration: decided that no recorded narration is needed; device voices are fine.

**Risks.**

- **Voice differs by device:** the narrator uses whatever voices a device has, so the sound cannot be guaranteed (accepted).
- **Single file:** `Gravefall.html` (now ~112 KB) is published as one file, but it's a build output — the editable source is split into `src/shell.html` + 15 files in `src/js/`, reassembled by `node tools/build.js` (see the Game Design Document's **Technical specs**). Resolved ahead of Chapter 4. The 16 MB hosting limit is still far away.
- **Untested on real devices:** problems may only show on real phones or browsers other than the one used for checks.
- **Reused art and stats:** Chapters 2 and 3 share Chapter 1's art (Chapter 3's enemies are Chapter 1/2 sprites recolored), so Act I may feel repetitive until it gets its own.
- **Ten-chapter scope:** the saga is planned at ten chapters across two tonally different acts; Act I (the alien war, Chapters 1–3) is now complete, leaving seven demon-lord chapters on an Earth-like world still unwritten. That is still a large amount of story, art and balancing work ahead; building it one chapter at a time, with each one playtested and simulated before the next starts, kept Act I's steps small, and the same approach should hold for Act II.
