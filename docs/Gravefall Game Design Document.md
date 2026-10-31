# Gravefall: Game Design Document

Oct 29, 2026 · @Aaron

## Overview

Gravefall is a single-page browser RPG where you play Captain Dax Ironside, fighting through a derelict carrier one dice roll at a time. Chapter length is not a target (the early idea was 10 to 15 minutes), since voice, reading speed and idle time all change it.

- **Genre:** text-driven tactical RPG with pixel art, sound effects and optional narration.
- **Tone:** grim military sci-fi with ranks, comrades and hard fighting. The setting is original and does not use Warhammer 40k names.
- **Platform:** any modern browser on a phone or a monitor, delivered as one HTML file at a published link.
- **Content today:** three chapters — Chapter 1 (Iron in the Dark), Chapter 2 (The Hollow Moon) and Chapter 3 (The Hive's End), which closes Act I — out of a planned ten-chapter saga (see **Saga arc**, below).
- **Outcome:** the hero can win a chapter or die. Every action rests on a d20 roll.

## Story and setting

Ironwolf Company's Third Platoon died on the approach to the carrier *Gravefall*. Captain Ironside alone reaches the airlock and has eleven minutes to stop the reactor before it breaches. Chapter 1 is the fight to the reactor and Major Kraag. Chapter 2 follows the crash of the gunship *Wrenhawk* on the dead moon below, and the push into Hollow Station to stop Colonel Vex.

| Character | Role | Notes |
| --- | --- | --- |
| Captain Dax Ironside | Player hero, Ironwolf Company | Calls his allies by rank and says "comrade" |
| Lieutenant Quill | Medic and pilot of the *Wrenhawk*, on the comm | Cautious, steady, prays during fights |
| Corporal Brannigan | Tech and hacker, on the comm | Dry, gravel-voiced, reports enemy counts |
| Major Kraag | Chapter 1 boss | Three meters of scarred iron and borrowed flesh |
| Colonel Vex | Chapter 2 boss, commands Kraag's fleet | Green-lit and soft-spoken |
| The Hive Sovereign | Chapter 3 boss, Act I finale | An ancient, fused intelligence built from a thousand stolen soldiers; commanded Vex, and Kraag before him |

**Places and machines:** the carrier *Gravefall*, the gunship *Wrenhawk*, the gutted siege tank *Old Bessie*, the dead moon, Hollow Station, and the hive beneath it.

**The enemy.** Chapter 1's first fight (The Scraping Dark) gives the player a quick briefing from Brannigan: the Skitterlings are bred stock, not sentient on their own, answering to armored humanoid commanders like Major Kraag; the hive they come from is charted as Gravemoor, out past the Rim. This establishes the alien threat (creatures and commanders) and its homeworld before the player meets either in person.

## Saga arc (planned)

The full saga is shaped like the *Odyssey*: a war fought and won far from home, then a long, harder road back, where each stop is a trial rather than a battle of conquest. Ten chapters total, in two acts. Chapters 1–3 (all of Act I) are built; 4–10 are a planned outline, not yet written into scenes, fights or items, and nothing in that part of the table below is final until it goes through the same loop as everything else (`scripts/balance-sim.js`, a security pass, and the roadmap's phases).

**Act I: The War (Chapters 1–3, built).** Ironwolf Company fights and wins a war against an alien hive intelligence — Major Kraag and Colonel Vex are its field commanders, not the true enemy. Chapter 3 ends the war by descending beneath Hollow Station (the "something far older beneath the moon" Colonel Vex's last signal points to) to reach the hive's ancient command core, the Hive Sovereign, and kill what has been directing the war all along. Having won, the survivors turn the *Wrenhawk* toward home — and Quill's last line of the chapter ("Something is wrong down there too, Captain") is the hook into Act II.

**Act II: The Return (Chapters 4–10).** Home is an Earth-like world, but the voyage back is not a victory lap — seven stops, each ruled by a demon lord embodying one of the seven deadly sins, each standing between Ironwolf Company and the ground. Tone shifts here: Act I's enemies are alien and mechanical (hives, gunners, iron); Act II's are infernal and personal (temptation, hunger, rage), and every chapter's setting, dialogue and (eventually) mechanics should say which sin it is about before the boss ever appears. The order below climbs in severity, ending on Pride as the final boss of the saga — fitting, since pride is traditionally the root sin, and the chapter's twist is that the Fallen Sovereign orchestrated the alien war in Act I as well.

| # | Chapter | Act | Enemy / theme | Boss | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Iron in the Dark | I: The War | Alien hive, shipboard | Major Kraag | Built |
| 2 | The Hollow Moon | I: The War | Alien hive, mining colony | Colonel Vex | Built |
| 3 | The Hive's End | I: The War | Alien hive command core, beneath Hollow Station | The Hive Sovereign | Built |
| 4 | *(working title)* The Drowning Fields | II: The Return | Sloth — a bog world where nothing moves fast enough to matter | The Slack Lord | Planned |
| 5 | *(working title)* The Feeding Grounds | II: The Return | Gluttony — a ruined farmland consumed by endless hunger | The Maw | Planned |
| 6 | *(working title)* The Siren Reaches | II: The Return | Lust — beautiful ruins that lure and lie | The Temptress | Planned |
| 7 | *(working title)* The Mirrored City | II: The Return | Envy — a city of doubles and reflections | The Envious One | Planned |
| 8 | *(working title)* The Hoarder's Vault | II: The Return | Greed — a treasury of cursed gold | The Hoarder | Planned |
| 9 | *(working title)* The Burning Line | II: The Return | Wrath — an endless battlefield | The Wrathbound | Planned |
| 10 | *(working title)* The Throne of Ash | II: The Return | Pride — the demon capital, final chapter | The Fallen Sovereign | Planned |

**Design notes for Act II, once it's built:**
- Each boss's *mechanics*, not just its name, should carry the sin: a rough starting idea for each is in the table above's "enemy / theme" column, e.g. Wrath growing stronger as it loses Health, Envy mirroring the player's own stats, Greed stealing or hoarding loot mid-fight. These are concepts to prototype and balance-test, not committed numbers.
- Quill and Brannigan stay with the Captain for the whole saga — the *Wrenhawk* is the throughline between chapters, same as today.
- Chapter 3 is built: three new alien enemies (Hive Stalker, Hive Warden, the Hive Sovereign) reusing the Skitterling/Hullcrusher/Kraag sprite rows with a new violet palette, per the sprite-reuse approach the game already uses for Chapter 2 — unique art per chapter is still owed (see **Planned changes**). Chapters 4–10 need a new palette and sprite set per chapter, since Act II is a tonal break from Act I by design.
- This outline does not yet set per-chapter XP, enemy stats or item tiers; those get designed (and simulated) chapter by chapter as each one is actually built, the same way Chapters 1–2 were.

## Features

- **Chapters as dropdowns:** each chapter opens like an accordion and keeps its own progress. A chapter is locked (dimmed, cannot be opened) until the one before it is finished — only Chapter 1 starts unlocked. Finishing a chapter carries your gear and stat boosts into the next and unlocks it; its Victory screen offers a "Continue to Chapter N" button straight there.
- **Dice-driven choices:** story choices and combat actions roll a d20 plus a stat. A natural 20 is a critical hit and heals a little; a natural 1 is a fumble and costs health.
- **Choices that echo forward:** a handful of key choices in each chapter set a flag (which door you forced, how you approached the boss, which item you took) regardless of whether the roll succeeded — the *approach*, not the outcome, is what's remembered. Later scenes, boss introductions and the victory ending reference it, so two runs of the same chapter read differently. Flags reset each chapter; they don't carry into the next.
- **Combat:** enemy health bars, visible enemy stats, four standard actions (Strike, Reckless blow, Aimed shot, Guard) plus a 5th, scene-specific environmental action in every fight, and a result box that shows the full damage calculation.
- **Environmental actions:** every one of the 10 fights across Chapters 1–3 has its own one-time action tied to something in that scene's description (Old Bessie's gunnery deck, a steam pipe, an ore cart, a failing station's bulkheads...). It rolls against a stat like any other action, dealing damage, healing, or granting a fight-only bonus to Defense or one stat on success — doubled on a critical, and on the rare fumble it backfires (the bonus applies in reverse) on top of the normal fumble penalty and the enemy's own hit. Once used in a fight, the button disappears; the bonus itself resets at the start of the next fight.
- **Story text in the result:** over 100 result lines with spoken dialogue across separate melee-success, melee-failure, ranged-success and ranged-failure pools (12–13 lines each), plus Reckless blow and Guard pools and a 6-line taunt pool per enemy (60 more lines) — every fight in every chapter works this way, not just the boss fights. No line repeats within a fight until every line in its pool has been used; the pool then reshuffles and the next pick is prefixed "Again, …". Consecutive hits also continue the scene on their own ("Again you hit for 12").
- **Inventory:** a 10-slot pack, weak or strong loot from small or big monsters, take / leave / swap decisions (always resolved before the next scene's choices appear), equipping at any time across four gear slots (melee, gun, body armor, leg armor), and item tooltips with category, stats and lore.
- **HUD:** pixel portrait of Captain Ironside, vitality bar, stat tooltips, and two history boxes (rolls and actions) written in the past tense.
- **Hidden odds:** success chances are off by default and switchable in the code (`showOdds`).
- **Audio:** one browser narrator voice for story and results, synthesized sound effects (slash, shot, explosion, pickup, equip and more), and separate Voice and Effects toggles.
- **Pixel art:** a painted backdrop per scene, sprites for the hero and each enemy, comm portraits for Quill and Brannigan, and a pixel starfield page background.
- **Devices:** the game detects phone or monitor and switches layout, shrinks the HUD and boxes on mobile, and scrolls back to the story after a tap.

## Mechanics

Every risky action is one d20 roll plus a stat against a target number. A natural 20 always succeeds and heals 3 Vitality; a natural 1 always fails and costs extra damage.

**Character creation.** Before Chapter 1 begins, two screens set up a build, once per save file; dying and starting the chapter over keeps it, and "New game" clears it and asks again.

1. **Stats.** The player spends 3 points freely across Might, Guile and Resolve (each starts at 1). The game does not steer the choice — a Might-heavy build hits harder in melee, a Guile-heavy build is harder to hit and can take Aimed shot further, a Resolve-heavy build survives longer on Guard, and spreading points gives a steadier all-rounder.
2. **Opening kit.** The player picks one of two opening weapons — a melee weapon (find a gun later) or a gun (find a melee weapon later; Strike and Reckless blow fall back to bare fists, 2 damage, until one is found) — and one of four opening armors, each matching a stat: Might-forged, Guile-woven, Steadfast (Resolve) or Balanced (a small amount of two stats). These reuse the same weak-tier items a monster could drop; nothing new is created for this choice. Loot that fills a missing weapon slot is weighted somewhat more likely to appear (see Mechanics) so a gun-first or melee-first start isn't left waiting indefinitely for its other half.

**Starting values:** Vitality 28; a 10-slot pack; starting gear is the Ironwolf Cutter (melee) and Ironwolf Flak Vest (body armor), plus one Rattlesnake Stim. No gun or leg armor is carried at the start — both are found as loot.

**Equipment.** Four gear slots are worn at once: one melee weapon, one gun, one body armor and one leg armor. Melee and gun weapons set damage and accuracy; body and leg armor set Defense (the two add together) and may also grant a flat bonus to Might, Guile or Resolve, so armor choice is part of a build, not just a damage-reduction number. Strike and Reckless blow always use the equipped melee weapon; Aimed shot always uses the equipped gun and is unavailable without one.

**Story checks.** The roll is d20 + stat + modifiers against a hidden target. A success or failure each leads to its own result text, scene and effects. Effects can change Vitality, set a flag, give loot, or raise or lower a stat for the rest of the run (for example, Guile +1 for slipping in unseen). The roll breakdown shown in the result box always states the stat as the player's whole current value — the same number the HUD panel shows — followed by a parenthetical explaining how it adds up, e.g. "11 + Might 6 = 17 (1 base, +3 training, +1 armor, +1 accuracy)". Earlier drafts split the base and the gear bonuses into separate addends in the main sum (e.g. "Might 4 + Armor 1 + Accuracy 1"); that was mathematically correct but repeatedly read as a bug, since the number next to "Might" never matched the HUD by itself. The number next to the stat name is now always the true total.

**Modifiers.** The weapon's accuracy is added to every Might roll. Stat boosts and penalties from scenes ("training") are added to their stat.

| Combat action | Roll | Target | On success | On failure |
| --- | --- | --- | --- | --- |
| Strike | Might | Enemy Evasion | Weapon damage minus enemy Defense | Enemy hits you |
| Reckless blow | Might | Enemy Evasion +3 | Double weapon damage minus Defense | Enemy hits you for 2 extra |
| Aimed shot | Guile | Enemy Evasion +2 | Weapon damage, ignoring Defense entirely | Enemy hits you |
| Guard and endure | Resolve | Enemy Accuracy | No damage, you recover 2 Vitality | Enemy hits you |

**Damage you deal:** weapon damage (times 2 for a reckless blow) minus the enemy's Defense, never below 1. A critical hit adds the weapon damage again and ignores Defense.

**Damage you take:** enemy Attack (plus 2 after a missed reckless blow) minus your Defense (your armor) minus your Evasion (your Guile), never below 1.

**One roll per round.** There is no separate enemy roll: when your roll fails, the enemy's attack lands. The result box shows the roll breakdown, the story line, the damage calculation and any change to Vitality or stats, and stays visible as rounds continue within the same fight, so a hit-after-hit exchange reads as a running account rather than resetting each time. It clears the moment a new scene is entered (the next fight, the next story choice, a new chapter), so no scene opens showing a stale result from whatever happened before it.

**Loot.** Small monsters drop weak items and big monsters drop strong ones. You may take it, leave it, or swap it for something in a full pack. Healing items are used from the pack: Rattlesnake Stim heals 6, Lazarus Trauma Kit heals 12. If the player doesn't yet own a melee weapon or a gun, a drop has a 60% chance of being weighted toward one that fills the gap, so an opening-kit choice isn't left waiting too long for its other weapon.

**Death and restart.** Vitality 0 ends the run at the Fallen scene, opening with one of 10 varied death lines (combat or a failed story check both use the same pool, since neither needs to name an enemy). An enemy's own death also now has 11 varied lines, up from 7. Both pools follow the same no-repeat-until-exhausted rule as combat results, but track across the whole session (`SAVES.textUsed`) rather than resetting per fight, since each only fires once per fight or once per death. "Fight again" restarts the current chapter.

## Enemies and items

Stats below are the first-pass values in the game. They have not been balanced by testing yet.

| Enemy | Chapter | Health | Evasion | Defense | Attack | Accuracy | Drop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Skitterling | 1 | 9 | 10 | 0 | 4 | 6 | Weak |
| Hullcrusher | 1 | 16 | 12 | 1 | 7 | 8 | Strong |
| Rustjack gunner | 1 | 11 | 11 | 1 | 5 | 7 | Weak |
| Major Kraag (boss) | 1 | 26 | 13 | 5 | 11 | 13 | None |
| Skitterling brood | 2 | 13 | 11 | 0 | 5 | 7 | Weak |
| Ironback Hullcrusher | 2 | 22 | 12 | 2 | 8 | 8 | Strong |
| Colonel Vex (boss) | 2 | 34 | 14 | 4 | 10 | 14 | None |
| Hive Stalker | 3 | 17 | 12 | 0 | 6 | 8 | Weak |
| Hive Warden | 3 | 28 | 12 | 3 | 9 | 8 | Strong |
| The Hive Sovereign (boss) | 3 | 42 | 15 | 4 | 11 | 14 | None |

Kraag and Vex were bumped up from their first-pass numbers (Defense 2/Accuracy 9–11) once equipment, the stat-allocation build and Aimed shot were added — those systems meaningfully raise what a well-equipped player can do before ever reaching the boss, so the bosses needed to raise with them. Chapter 3's numbers continue that same curve (small/big enemies step up roughly the same amount Chapter 1 to 2 did; the Sovereign lands at a similar win rate to Kraag and Vex for a balanced build with gear carried from both earlier chapters). See `scripts/balance-sim.js`.

| Item | Category | Stats | Tier |
| --- | --- | --- | --- |
| Ironwolf Cutter | Melee weapon | Damage 6, accuracy +1 | Starting |
| Salvaged Pipe Wrench | Melee weapon | Damage 4, accuracy 0 | Weak |
| Trench Shiv | Melee weapon | Damage 5, accuracy +1 | Weak |
| Thunderclap Sledge | Melee weapon | Damage 10, accuracy 0 | Strong |
| Void Spike | Melee weapon | Damage 9, accuracy +2 | Strong |
| Salvaged Repeater | Gun | Damage 5, accuracy +1 | Weak |
| Sunspear Lancer | Gun | Damage 13, accuracy -1 | Strong |
| Ironwolf Flak Vest | Body armor | Defense 2 | Starting |
| Bolted Hull Plating | Body armor | Defense 1 | Weak |
| Brute-Forged Breastplate | Body armor | Defense 1, Might +1 | Weak |
| Shadowweave Vest | Body armor | Defense 1, Guile +1 | Weak |
| Stalwart Harness | Body armor | Defense 1, Resolve +1 | Weak |
| Hybrid Combat Rig | Body armor | Defense 1, Guile +1, Resolve +1 | Weak |
| Anvil-Class Siege Plate | Body armor | Defense 4 | Strong |
| Juggernaut Plate | Body armor | Defense 3, Might +2 | Strong |
| Phantom Weave Plate | Body armor | Defense 3, Guile +2 | Strong |
| Bastion Plate | Body armor | Defense 3, Resolve +2 | Strong |
| Warbound Plate | Body armor | Defense 3, Might +1, Guile +1, Resolve +1 | Strong |
| Salvaged Legplate | Leg armor | Defense 1 | Weak |
| Stormtrooper Greaves | Leg armor | Defense 1, Might +1 | Weak |
| Silent Treads | Leg armor | Defense 1, Guile +1 | Weak |
| Anchor Greaves | Leg armor | Defense 1, Resolve +1 | Weak |
| Scavenger Leg Guards | Leg armor | Defense 1, Might +1, Resolve +1 | Weak |
| Ablative Plating | Leg armor | Defense 3 | Strong |
| Siegebreaker Greaves | Leg armor | Defense 2, Might +2 | Strong |
| Nightfall Treads | Leg armor | Defense 2, Guile +2 | Strong |
| Unbreakable Greaves | Leg armor | Defense 2, Resolve +2 | Strong |
| Warden's Leg Plate | Leg armor | Defense 2, Might +1, Guile +1, Resolve +1 | Strong |
| Rattlesnake Stim | Consumable | Heals 6 | Weak |
| Field Bandage | Consumable | Heals 4 | Weak |
| Lazarus Trauma Kit | Consumable | Heals 12 | Strong |
| Nanite Canister | Consumable | Heals 9 | Strong |
| Hivebreaker Gauntlet | Melee weapon | Damage 11, accuracy +1 | Strong |
| Sovereign's Elixir | Consumable | Heals 15 | Strong |

Small monsters drop from the weak pool (one melee weapon, one gun, four body-armor variants, four leg-armor variants, two consumables). Big monsters drop from the matching strong pool, which now also includes the Hivebreaker Gauntlet and Sovereign's Elixir from Chapter 3's relic chamber — items are shared across the whole saga's loot pools, not locked to the chapter that introduces them. Duplicates are never offered, and a full pack only swaps in a drop that beats what it would replace. Scenes can also give loot directly, such as the armory choice between the Lancer and the Trauma Kit, or Chapter 3's relic-chamber choice between the Hivebreaker Gauntlet and the Elixir.

## Chapter flow

Each chapter is a straight run of scenes where story choices alternate with fights. Vitality 0 at any point sends the player to the Fallen scene, and "Fight again" restarts that chapter. Each check below shows the stat and the hidden target number (for example Might 14).

**Chapter 1: Iron in the Dark** (12 scenes including the two endings)

| # | Scene | Type | What the player does | Consequence |
| --- | --- | --- | --- | --- |
| 1 | The Breach | Choice | Smash the bulkhead (Might 14) or wait for Brannigan to crack the lock (Resolve 11) | Failure costs 3 to 4 Vitality |
| 2 | The Scraping Dark | Fight | Skitterling | Weak loot |
| 3 | The Dead Relay | Choice | Cover the hack (Resolve 11), hack it (Guile 12) or rip the seal off (Might 14) | Failure costs 4 to 6 Vitality |
| 4 | The Hullcrusher | Fight | Hullcrusher | Strong loot |
| 5 | The Silent Infirmary | Choice | Patch up (Resolve 9), search the lockers (Guile 12) or press on with no roll | Patch-up heals 10 or 3; a failed search costs 3 |
| 6 | The Gunnery Deck | Choice | Take cover and fire back (Resolve 11) or charge the gantry (Might 14) | Failure costs 5 to 7 Vitality |
| 7 | Rustjack Gunner | Fight | Rustjack gunner | Weak loot |
| 8 | The Dead Armory | Choice | Take the Sunspear Lancer or the Lazarus Trauma Kit (no roll) | Choose one item |
| 9 | The Reactor Gate | Choice | Slip in through the vent (Guile 13) or announce yourself (Resolve 10) | Stat +1 on success, -1 on failure; no Vitality change |
| 10 | Major Kraag | Boss fight | Major Kraag | No loot |
| 11 | Victory | Ending | The reactor is stabilized by hand and Gravefall is saved; the Wrenhawk docks and the crew has a brief reunion before departing for the moon; gear and stat boosts carry to Chapter 2 | Chapter 1 complete, Chapter 2 unlocked |
| 12 | Fallen | Ending | Vitality reached 0 | Restart the chapter |

**Chapter 2: The Hollow Moon** (8 scenes including the two endings)

| # | Scene | Type | What the player does | Consequence |
| --- | --- | --- | --- | --- |
| 1 | Crash Landing | Choice | Ride out the crash (Resolve 11) or jump clear (Might 13) | Failure costs 4 to 5 Vitality |
| 2 | The Green Mist | Fight | Skitterling brood | Weak loot |
| 3 | The Dead Lift | Choice | Rig the lift (Guile 12), brace the doors (Might 13) or steady your breathing (Resolve 10) | Stat +1 on success, -1 on failure |
| 4 | The Ironback | Fight | Ironback Hullcrusher | Strong loot |
| 5 | The Control Hall | Choice | Sneak through the vents (Guile 13) or kick the door in (Might 12) | Stat +1 on success, -1 on failure |
| 6 | Colonel Vex | Boss fight | Colonel Vex | No loot |
| 7 | Victory | Ending | Hollow Station is destroyed; Chapter 2 complete | Hint at a deeper threat for Chapter 3 |
| 8 | Fallen | Ending | Vitality reached 0 | Restart the chapter |

**Chapter 3: The Hive's End** (9 scenes, sharing the Fallen ending with the other chapters)

| # | Scene | Type | What the player does | Consequence |
| --- | --- | --- | --- | --- |
| 1 | Into the Dark Below | Choice | Rappel down the chasm (Resolve 11) or force the sealed airlock (Might 14) | Failure costs 4 to 5 Vitality |
| 2 | The Writhing Dark | Fight | Hive Stalker | Weak loot |
| 3 | The Humming Walls | Choice | Read the pulses (Guile 12), push through (Might 14) or hold steady (Resolve 11) | Failure costs 4 to 6 Vitality |
| 4 | The Core Warden | Fight | Hive Warden | Strong loot |
| 5 | The Dead Nest | Choice | Patch up (Resolve 9), search the husks (Guile 12) or press on with no roll | Patch-up heals 10 or 3; a failed search costs 3 |
| 6 | The Last Descent | Choice | Take the narrow shaft (Resolve 12) or blast through the floor (Might 15) | Failure costs 5 to 7 Vitality |
| 7 | The Relic Chamber | Choice | Take the Hivebreaker Gauntlet or the Sovereign's Elixir (no roll) | Choose one item |
| 8 | The Sovereign's Threshold | Choice | Slip along the wall (Guile 14) or walk in and call it out (Resolve 11) | Stat +1 on success, -1 on failure; no Vitality change |
| 9 | The Hive Sovereign | Boss fight | The Hive Sovereign | No loot |

Victory ends Act I: Ironside and crew set course for home, and Quill's closing line ("Something is wrong down there too, Captain") is the hook into Act II.

**Between chapters.** Finishing a chapter (reaching its Victory ending, not Fallen) saves your pack, equipped gear and stat boosts, and unlocks the next chapter — its accordion entry is locked and cannot be opened until then. The Victory screen offers "Continue to Chapter N" alongside "Fight again," taking you straight there at full Vitality with that gear. Unlock state is saved and survives a reload; "New game" relocks everything back to Chapter 1 only.

## Technical specs

The game still ships as one self-contained HTML file (`Gravefall.html`, about 112 KB, 1128 lines), with 31 scenes (including character creation) and 10 fights. It loads no images or audio files; only two Google Fonts (Teko and Crimson Pro) come from outside, with system fallbacks.

**Source layout.** `Gravefall.html` is now a *build output*, not the file to edit. The editable source lives under `src/`: `src/shell.html` (the HTML/CSS shell, with a `{{SCRIPT}}` placeholder) plus 15 numbered files in `src/js/` that are concatenated in filename order into the shell's script tag. `node tools/build.js` regenerates `Gravefall.html` from those sources; `node tools/build.js --check` verifies it's up to date without writing anything (useful before a commit). The split follows the same section boundaries the single file already had:

- `01-rules.js` (`CONFIG`), `02-items.js` (`ITEMS`/`DROPS`), `03-lore.js` (`LORE`), `04-modifiers.js` (`MODIFIERS`), `05-effects.js` (`EFFECTS`: hp, flag, give, stat).
- `06-scenes-ch1.js`, `07-scenes-ch2.js`, `08-scenes-ch3.js` (`SCENES`, each chapter added by `Object.assign`), `09-text.js` (combat result `TEXT` pools).
- `10-art.js` (`BG` backdrops, `SP`/`SPF` sprites), `11-engine.js` (`state`, `enter`, `show`, `choose`, `act`), `12-saving.js` (save/load, sanitizers, chapter locking), `13-character-creation.js`, `14-audio.js`, `15-ui-bootstrap.js` (tooltips, device detection, chapter accordion, boot).

This is plain concatenation into one global-scope script, not ES modules — order matters (hence the numeric prefixes), and it stays this way on purpose: the game has to keep working via `file://` with no server, and GitHub Pages serves a single file. Edit the files in `src/js/`, then run `node tools/build.js` and commit both the source change and the regenerated `Gravefall.html` together.

**State.** A single `state` object holds scene, vitality, flags, inventory, equipment, the current fight, pending loot, roll and action history, stat boosts and the chapter. Each chapter keeps its own saved state while you switch between chapters.

**Art.** Backdrops are drawn in code on a 160 by 75 canvas; sprites are letter grids colored from a palette. Both are scaled up with hard pixel edges.

**Audio.** Narration uses the browser's built-in speech voices, so it sounds different on each device. Sound effects are synthesized with the Web Audio API. Browsers only start audio after the first tap, so the opening scene is not read automatically.

**Devices.** A touchscreen or a window up to 820 px wide counts as mobile; everything else is desktop. Layout, sizes, tooltips (hover or tap) and scrolling change with it.

**Accessibility.** Reduced-motion settings stop the animations, buttons have visible keyboard focus, and the story and result areas are live regions.

**Hosting limits.** The page is published as a claude.ai artifact (16 MB cap).

**Saving.** Progress (scene, Vitality, a fight in progress, inventory, equipped gear, stat boosts and history) is saved to `localStorage` per chapter after every action and restored on load. Anything read back from storage is checked against the game's own scenes, items and numeric ranges before use, and a bad or tampered save falls back to a fresh start instead of crashing. A "New game" button clears saved progress. `localStorage` is per browser profile, so progress does not follow the player to another device or browser.

**Testing so far.** Automated checks in a desktop browser found no script errors and screenshots confirmed the art and chapter switching at desktop and phone widths. Real phones, real voices and a full play-through of each chapter are untested.

## How to extend

Most additions are one entry in a data table, made in the relevant file under `src/js/` (see **Source layout** above), followed by `node tools/build.js` to regenerate `Gravefall.html`. Keep one rule for story text: every line of dialogue names its speaker, such as "Contact!" Quill says.

1. **Scene with choices:** add an entry to `SCENES` with `title`, `text` (paragraphs) and `choices`. A choice is either `{text, goto}` or `{text, check:{stat, dc}, win:{msg, goto, fx}, lose:{msg, goto, fx}}`. Add `bg` to reuse another scene's backdrop. `text` can also be a function of `state` (`text: s => [...]`) for a scene whose wording should change based on a flag set earlier in the run; `fx:{flag:'name'}` on a choice's `win`/`lose` sets it.
2. **Fight:** add a scene with `fight:{name, ref, pr, pos, hp, dc, def, acc, dmg, drop, say}` and `then:'nextSceneId'`. Add `art` to reuse an existing sprite, or a new entry in `SPF` for a new look. Give `say` at least 5–6 lines — it's the enemy-specific taunt pool layered on top of the shared melee/ranged/guard result pools, and it follows the same no-repeat-until-exhausted rule, so a short `say` list cycles (and says "Again") sooner than a longer fight will want.
3. **Item:** add it to `ITEMS` and `LORE`, then add its id to a pool in `DROPS` if monsters should drop it.
4. **Chapter:** add a name to `CHAPTERS`, a start scene to `START`, and the scenes themselves. The new dropdown appears automatically.
5. **Effect or modifier:** add a key to `EFFECTS` (then use it as `fx:{key: value}`), or a function to `MODIFIERS` for situational roll bonuses.

```js
SCENES.example = {
  title: 'The Vent',
  text: ['"Quiet now," Brannigan says.'],
  choices: [{
    text: 'Crawl through',
    check: { stat: 'guile', dc: 12 },
    win:  { msg: 'You slip through.', goto: 'next', fx: { stat: { guile: 1 } } },
    lose: { msg: 'The grate clangs.', goto: 'next', fx: { hp: -2 } }
  }]
};
```

## Source control and versioning

The game's code will live in a private Git repository on GitHub, which is the master copy; the Claude Project, the published link and the Claude Docs are copies. The repository does not exist yet, and the setup steps are in the [Gravefall: Project Plan](https://claude.ai/artifact/4SA2ZmqyRVmsT6ifEtvZSJ).

- **Releases:** tagged `MAJOR.MINOR.PATCH`, starting at `v0.1.0`. A new chapter or a save format that breaks old saves bumps MAJOR; features and content bump MINOR; fixes and balance tweaks bump PATCH. The game stays on 0.x until Chapters 1 to 3, saving and levels exist.
- **In the game:** the version is shown in the page and in saved data, with a separate save-format number so old saves can be upgraded.
- **Changes:** every release gets a `CHANGELOG.md` entry, and `main` always stays playable.
- **File structure:** source is split into `src/shell.html` + `src/js/*.js` (see **Source layout** under Technical specs), reassembled into the single deployable `Gravefall.html` by `node tools/build.js`. Done, ahead of Chapter 4.

## Planned changes

These decisions come from the [Gravefall: Project Plan](https://claude.ai/artifact/4SA2ZmqyRVmsT6ifEtvZSJ). None of them is built yet; the sections above describe the game as it plays today.

- **Levels and stat points:** the player earns experience from fights, levels up, and spends one stat point per level.
- **Random dice:** there is no target win rate. Outcomes stay random, and a balance simulation only checks for fights that are impossible or trivial.
- **Narration:** no recorded narration; the browser voices already on a device are fine.
- **Chapter length:** no time target for a chapter.
- **Also on the roadmap:** saving progress, a settings panel, choices that change later scenes, ally abilities, and unique Chapter 2 art.

| Source or level | XP | Reward |
| --- | --- | --- |
| Small enemy (Skitterling, Rustjack gunner, brood) | 10 | None |
| Big enemy (Hullcrusher, Ironback) | 25 | None |
| Boss (Kraag, Vex) | 50 | None |
| Level 2 | 30 total | +1 stat point, +3 max Vitality |
| Level 3 | 70 total | +1 stat point, +3 max Vitality |
| Level 4 | 120 total | +1 stat point, +3 max Vitality |
| Level 5 | 180 total | +1 stat point, +3 max Vitality |

A stat point adds +1 to Might, Guile or Resolve, and level-ups can raise any one stat by at most 3. Scene bonuses and weapon accuracy stack on top. Leveling does not heal. Chapter 1 gives 95 XP (level 3) and Chapter 2 gives 85 more (level 5 at 180), so by level 5 Vitality is 40. These numbers are proposals and have not been tested.

## Security review

No exploitable vulnerability was found, and the overall risk is low. The game takes no player input, makes no network requests of its own, and stores nothing, so there is little for an attacker to use. The findings below are mostly hardening for the planned features.

**Scope and method.** Claude reviewed the published game file (about 61 KB) on 2026-10-29 by searching the code for risky patterns and reading each use. This was a static review only: there was no penetration test, and the hosting platform and browsers were not reviewed.

| ID | Area | Finding | Risk today | Action |
| --- | --- | --- | --- | --- |
| S1 | Personal data | No accounts, forms, cookies, browser storage or analytics; nothing about the player is collected | None | Keep it that way; when saving is added, store game state only |
| S2 | Page injection | The page inserts HTML in 15 places. All of it comes from fixed story text or game numbers, and no player input exists | Low | Before adding saves, player names or imports, escape text or use `textContent` |
| S3 | Dangerous functions | None found: no `eval`, `new Function`, `document.write`, network calls, `postMessage`, `window.open` or inline event attributes | None | Re-check after each large change |
| S4 | Third-party requests | One outside request: the Google Fonts stylesheet. It has no integrity check and shares the visitor's IP address and browser details with Google | Low | Use system fonts or embed the fonts if privacy matters |
| S5 | Tooltips | Tooltip text is stored in an attribute built from a string, so story text containing a quote mark would break it | Low | Build tooltips with DOM calls and `textContent`, or escape quotes |
| S6 | Client-side rules | All rules, dice and chapter locking run in the browser, so players can change their stats | None for single player | Chapter locking and levels are not security controls; a leaderboard would need server checks |
| S7 | Browser voices | Some browser voices send the text to a cloud service; the text is fictional story text | Low | Mention it in any privacy notice if the game is shared widely |
| S8 | Sharing | The published page is private until shared; anyone with a shared link can open it. Platform protections were not reviewed | Info | Share deliberately and keep a backup copy |
| S9 | History lists | Roll and action history grow without limit during a long session | Very low | Cap each list, for example at 200 entries |
| S10 | Licensing | Sound effects and art are generated in code and names are original; any added sound or image files need their license checked | Low | Record the source and license of every added asset |

**Requirements for planned features.**

- **Saving:** store only game state, with a version number. On load, check that the scene exists, every item id is a known item, and numbers are in range; ignore anything else and never run saved data as code.
- **Levels and stat points:** enforce the stat cap and the XP table in code, and check them again on load.
- **Chapter locking:** treat it as game flow only; a player can still edit a save.
- **New libraries or files:** pin exact versions, avoid remote scripts, and keep secrets and keys out of the file.

## Known limitations

- **Untested balance:** enemy stats and item values are first guesses and no full run of either chapter has been played or simulated.
- **Linear structure:** every choice still leads to the same next scene (no branching paths or alternate scene order) — only the text within a scene, and a few flags, change with replaying. The scenes themselves are not yet reordered or skipped by choices.
- **Voice quality varies:** the narrator uses whatever voices the device has, so the sound cannot be guaranteed.
- **Audio starts on tap:** browsers block sound until the player taps, so the opening scene is not read automatically.
- **Reused art:** Chapter 2 reuses Chapter 1 backdrops, and Colonel Vex and the Ironback reuse the Kraag and Hullcrusher sprites with recoloring.
- **Allies are voices only:** Quill and Brannigan appear in the story and as portraits but do not act in fights.
- **Not tested on real devices:** checks so far used a desktop browser at desktop and phone widths.
