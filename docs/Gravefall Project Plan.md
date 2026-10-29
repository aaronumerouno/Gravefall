# Gravefall: Project Plan

Oct 29, 2026 · @Aaron

## Where we are

Gravefall has two playable chapters, a full set of mechanics, pixel art, sound and narration, and a published link; the next step is to prove it plays well. The full design is in the Gravefall Game Design Document.

**Built:** dice-driven choices and combat with a 4th action (Aimed shot), enemy stats with a visible damage breakdown, a 10-slot inventory across four equipment slots (melee, gun, body armor, leg armor) with loot that always resolves before the next scene, a one-time character-creation stat allocation, saved progress, about 60 varied fight lines, pixel art for every scene and enemy, synthesized sound effects, a browser narrator, mobile and desktop layouts, and chapters as dropdowns.

**Not yet verified:** a full play-through of either chapter, real phones, and real voices. Enemy and item numbers are first guesses.

## Recommendations

Start with balance, saving and meaningful choices; they decide whether the game is worth playing twice. Impact and effort below are Claude's estimates, not measured.

| # | Recommendation | Why | Impact | Effort | Priority |
| --- | --- | --- | --- | --- | --- |
| 1 | Balance by simulation | Run thousands of automated fights and runs to catch fights that are impossible or trivial, keeping dice results random | High | Small | **Done** — `scripts/balance-sim.js`, now simulated per build archetype (all-Might/Guile/Resolve/balanced); Kraag and Vex retuned twice, most recently after the equipment and stat-allocation overhaul |
| 2 | Save progress | A refresh currently loses everything; store progress per chapter on the player's device | High | Small | **Done** — saved to `localStorage`, validated on load |
| 3 | Make choices matter | Choices set flags that change later scenes, ally reactions and endings, so replays differ | High | Medium | Next |
| 4 | Add progression | Decided: the player has a level and spends stat points on each level-up; see the progression design below. A one-time stat allocation at character creation now exists (not this) — leveling still adds points *during* a chapter from XP | Medium | Medium | Next |
| 5 | Give allies jobs | For example Quill heals once per fight and Brannigan lowers an enemy's Defense | Medium | Medium | Next |
| 6 | Unique Chapter 2 art | New backdrops and sprites instead of reused Chapter 1 art and recolors | Medium | Medium | Later |
| 7 | Settings panel | Toggles for success odds, voice speed and text size | Low | Small | Next |

**Process recommendations.** Test on real phones and note anything that looks or sounds wrong before adding features. Settle the story and the mechanics before adding more systems; the voice work was redone several times because each change built on the last.

## Roadmap

Four phases, in order; no dates are set yet because the pace depends on how much testing and feedback each phase needs.

| Phase | Delivers | Done when |
| --- | --- | --- |
| 1. Stabilize | Real-phone test pass, balance simulation, saving, chapter locking, settings panel | A typical player can finish Chapter 1, and progress survives a refresh |
| 2. Depth | Meaningful choices and endings, progression, ally abilities | Two runs of one chapter can differ in story and in build |
| 3. Polish | Unique Chapter 2 art | Chapter 2 no longer reuses Chapter 1 art |
| 4. Expand | Chapter 3 and later, built from the chapter template | Each new chapter opens as a dropdown and carries gear forward |

## Progression design (proposed)

The player earns experience from fights and levels up, spending one stat point per level. Claude chose these numbers to give about two levels per chapter without letting one stat run away; they are untested. **Note:** this table still assumes the old starting stats (Might 3, Guile 1, Resolve 2) and the old single weapon/armor slots. Character creation now starts the player at Might 1, Guile 1, Resolve 1 plus 3 freely-spent points, and armor can itself grant stat bonuses — so the XP thresholds and "why this is balanced" math below need to be re-run against the current baseline (and through `scripts/balance-sim.js`) before this ships, not just copied as-is.

| Source or level | XP | Reward |
| --- | --- | --- |
| Small enemy (Skitterling, Rustjack gunner, brood) | 10 | None |
| Big enemy (Hullcrusher, Ironback) | 25 | None |
| Boss (Kraag, Vex) | 50 | None |
| Level 2 | 30 total | +1 stat point, +3 max Vitality |
| Level 3 | 70 total | +1 stat point, +3 max Vitality |
| Level 4 | 120 total | +1 stat point, +3 max Vitality |
| Level 5 | 180 total | +1 stat point, +3 max Vitality |

**Rules.** A stat point adds +1 to Might, Guile or Resolve, and level-ups can raise any one stat by at most 3. Scene bonuses and weapon accuracy stack on top. Leveling does not heal; Vitality resets to full only when a new chapter starts. Gear, level and stat points carry into the next chapter, which unlocks when the current one is finished.

**Why this is balanced.** Chapter 1 gives 95 XP (level 3) and Chapter 2 gives 85 more (level 5 at 180). Each stat point is +5 percentage points of success on that stat's rolls, so a player who puts everything in one stat gains at most 15 points, while Chapter 2 enemies are already 1 to 2 Evasion higher than their Chapter 1 counterparts. By level 5 Vitality is 40 (28 plus 12). Later chapters should raise enemy numbers by 1 or 2 each to keep pace, and the balance simulation should check these figures before they ship.

## Open questions and risks

- [x] Win rate: decided that there is no target; dice outcomes stay random.
- [x] Chapter length: decided that it is not a target, since voice and idle time change it.
- [x] Chapter locking: decided that the next chapter stays locked until the current one is finished; gear carries over and Vitality resets to full.
- [x] Narration: decided that no recorded narration is needed; device voices are fine.

**Risks.**

- **Voice differs by device:** the narrator uses whatever voices a device has, so the sound cannot be guaranteed (accepted).
- **Single file:** everything lives in one HTML file of about 61 KB; it will get harder to edit as chapters, art and audio grow, though the 16 MB hosting limit is far away.
- **Untested on real devices:** problems may only show on real phones or browsers other than the one used for checks.
- **Reused art and stats:** Chapter 2 content shares Chapter 1 art, so it may feel repetitive until it gets its own.
