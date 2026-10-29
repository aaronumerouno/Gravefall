# Gravefall: Game Design Document

Oct 29, 2026 · @Aaron

## Overview

Gravefall is a single-page browser RPG where you play Captain Dax Ironside, fighting through a derelict carrier one dice roll at a time. Chapter length is not a target (the early idea was 10 to 15 minutes), since voice, reading speed and idle time all change it.

- **Genre:** text-driven tactical RPG with pixel art, sound effects and optional narration.
- **Tone:** grim military sci-fi with ranks, comrades and hard fighting. The setting is original and does not use Warhammer 40k names.
- **Platform:** any modern browser on a phone or a monitor, delivered as one HTML file at a published link.
- **Content today:** two chapters, Chapter 1 (Iron in the Dark) and Chapter 2 (The Hollow Moon).
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

**Places and machines:** the carrier *Gravefall*, the gunship *Wrenhawk*, the gutted siege tank *Old Bessie*, the dead moon, and Hollow Station.

## Features

- **Chapters as dropdowns:** each chapter opens like an accordion and keeps its own progress. Finishing a chapter carries your gear and stat boosts into the next.
- **Dice-driven choices:** story choices and combat actions roll a d20 plus a stat. A natural 20 is a critical hit and heals a little; a natural 1 is a fumble and costs health.
- **Combat:** enemy health bars, visible enemy stats, three actions (Strike, Reckless blow, Guard), and a result box that shows the full damage calculation.
- **Story text in the result:** about 60 varied result lines with spoken dialogue, so fights do not repeat. Consecutive hits continue the scene ("Again you hit for 12").
- **Inventory:** a 5-slot pack, weak or strong loot from small or big monsters, take / leave / swap decisions, equipping at any time, and item tooltips with type, stats and lore.
- **HUD:** pixel portrait of Captain Ironside, vitality bar, stat tooltips, and two history boxes (rolls and actions) written in the past tense.
- **Hidden odds:** success chances are off by default and switchable in the code (`showOdds`).
- **Audio:** one browser narrator voice for story and results, synthesized sound effects (slash, shot, explosion, pickup, equip and more), and separate Voice and Effects toggles.
- **Pixel art:** a painted backdrop per scene, sprites for the hero and each enemy, comm portraits for Quill and Brannigan, and a pixel starfield page background.
- **Devices:** the game detects phone or monitor and switches layout, shrinks the HUD and boxes on mobile, and scrolls back to the story after a tap.

## Mechanics

Every risky action is one d20 roll plus a stat against a target number. A natural 20 always succeeds and heals 3 Vitality; a natural 1 always fails and costs extra damage.

**Starting values:** Vitality 28; Might +3, Guile +1, Resolve +2; a 5-slot pack; starting gear is the Ironwolf Cutter, Ironwolf Flak Vest and one Rattlesnake Stim.

**Story checks.** The roll is d20 + stat + modifiers against a hidden target. A success or failure each leads to its own result text, scene and effects. Effects can change Vitality, set a flag, give loot, or raise or lower a stat for the rest of the run (for example, Guile +1 for slipping in unseen).

**Modifiers.** The weapon's accuracy is added to every Might roll. Stat boosts and penalties from scenes ("training") are added to their stat.

| Combat action | Roll | Target | On success | On failure |
| --- | --- | --- | --- | --- |
| Strike | Might | Enemy Evasion | Weapon damage minus enemy Defense | Enemy hits you |
| Reckless blow | Might | Enemy Evasion +3 | Double weapon damage minus Defense | Enemy hits you for 2 extra |
| Guard and endure | Resolve | Enemy Accuracy | No damage, you recover 2 Vitality | Enemy hits you |

**Damage you deal:** weapon damage (times 2 for a reckless blow) minus the enemy's Defense, never below 1. A critical hit adds the weapon damage again and ignores Defense.

**Damage you take:** enemy Attack (plus 2 after a missed reckless blow) minus your Defense (your armor) minus your Evasion (your Guile), never below 1.

**One roll per round.** There is no separate enemy roll: when your roll fails, the enemy's attack lands. The result box shows the roll breakdown, the story line, the damage calculation and any change to Vitality or stats.

**Loot.** Small monsters drop weak items and big monsters drop strong ones. You may take it, leave it, or swap it for something in a full pack. Healing items are used from the pack: Rattlesnake Stim heals 6, Lazarus Trauma Kit heals 12.

**Death and restart.** Vitality 0 ends the run at the Fallen scene. "Fight again" restarts the current chapter.

## Enemies and items

Stats below are the first-pass values in the game. They have not been balanced by testing yet.

| Enemy | Chapter | Health | Evasion | Defense | Attack | Accuracy | Drop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Skitterling | 1 | 9 | 10 | 0 | 4 | 6 | Weak |
| Hullcrusher | 1 | 16 | 12 | 1 | 7 | 8 | Strong |
| Rustjack gunner | 1 | 11 | 11 | 1 | 5 | 7 | Weak |
| Major Kraag (boss) | 1 | 26 | 13 | 2 | 9 | 9 | None |
| Skitterling brood | 2 | 13 | 11 | 0 | 5 | 7 | Weak |
| Ironback Hullcrusher | 2 | 22 | 12 | 2 | 8 | 8 | Strong |
| Colonel Vex (boss) | 2 | 34 | 14 | 2 | 8 | 11 | None |

| Item | Type | Stats | Tier |
| --- | --- | --- | --- |
| Ironwolf Cutter | Melee weapon | Damage 6, accuracy +1 | Starting |
| Salvaged Pipe Wrench | Melee weapon | Damage 4, accuracy 0 | Weak |
| Thunderclap Sledge | Melee weapon | Damage 10, accuracy 0 | Strong |
| Sunspear Lancer | Ranged weapon | Damage 13, accuracy -1 | Strong |
| Ironwolf Flak Vest | Armor | Defense 2 | Starting |
| Bolted Hull Plating | Armor | Defense 1 | Weak |
| Anvil-Class Siege Plate | Armor | Defense 4 | Strong |
| Rattlesnake Stim | Consumable | Heals 6 | Weak |
| Lazarus Trauma Kit | Consumable | Heals 12 | Strong |

Small monsters drop from the weak pool (Pipe Wrench, Hull Plating, Stim). Big monsters drop from the strong pool (Sledge, Lancer, Siege Plate, Trauma Kit). Duplicates are never offered. Scenes can also give loot directly, such as the armory choice between the Lancer and the Trauma Kit.

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
| 11 | Victory | Ending | The reactor dies; gear and stat boosts carry to Chapter 2 | Chapter 1 complete |
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

**Between chapters.** Finishing a chapter saves your pack, equipped gear and stat boosts. Opening the next chapter starts it at full Vitality with that gear. If you open it without finishing the previous chapter, you start with the standard kit (this will change; see Planned changes).

## Technical specs

The game is one self-contained HTML file of about 61 KB (roughly 489 lines and 51 KB of JavaScript), with 19 scenes and 7 fights. It loads no images or audio files; only two Google Fonts (Teko and Crimson Pro) come from outside, with system fallbacks.

**Code layout.** The script is split into labelled sections so features can be added without rewrites:

- Rules and numbers (`CONFIG`), items (`ITEMS`, `LORE`, `DROPS`), roll modifiers (`MODIFIERS`) and scene effects (`EFFECTS`: hp, flag, give, stat).
- Story as data (`SCENES`, with chapter scenes added by `Object.assign`) and combat result text (`TEXT` pools).
- Art (`BG` backdrops, `SP` and `SPF` sprites), the engine (`state`, `enter`, `show`, `choose`, `act`), audio, tooltips, chapters and device detection.

**State.** A single `state` object holds scene, vitality, flags, inventory, equipment, the current fight, pending loot, roll and action history, stat boosts and the chapter. Each chapter keeps its own saved state while you switch between chapters.

**Art.** Backdrops are drawn in code on a 160 by 75 canvas; sprites are letter grids colored from a palette. Both are scaled up with hard pixel edges.

**Audio.** Narration uses the browser's built-in speech voices, so it sounds different on each device. Sound effects are synthesized with the Web Audio API. Browsers only start audio after the first tap, so the opening scene is not read automatically.

**Devices.** A touchscreen or a window up to 820 px wide counts as mobile; everything else is desktop. Layout, sizes, tooltips (hover or tap) and scrolling change with it.

**Accessibility.** Reduced-motion settings stop the animations, buttons have visible keyboard focus, and the story and result areas are live regions.

**Hosting limits.** The page is published as a claude.ai artifact (16 MB cap).

**Saving.** Progress (scene, Vitality, a fight in progress, inventory, equipped gear, stat boosts and history) is saved to `localStorage` per chapter after every action and restored on load. Anything read back from storage is checked against the game's own scenes, items and numeric ranges before use, and a bad or tampered save falls back to a fresh start instead of crashing. A "New game" button clears saved progress. `localStorage` is per browser profile, so progress does not follow the player to another device or browser.

**Testing so far.** Automated checks in a desktop browser found no script errors and screenshots confirmed the art and chapter switching at desktop and phone widths. Real phones, real voices and a full play-through of each chapter are untested.

## How to extend

Most additions are one entry in a data table. Keep one rule for story text: every line of dialogue names its speaker, such as "Contact!" Quill says.

1. **Scene with choices:** add an entry to `SCENES` with `title`, `text` (paragraphs) and `choices`. A choice is either `{text, goto}` or `{text, check:{stat, dc}, win:{msg, goto, fx}, lose:{msg, goto, fx}}`. Add `bg` to reuse another scene's backdrop.
2. **Fight:** add a scene with `fight:{name, ref, pr, pos, hp, dc, def, acc, dmg, drop, say}` and `then:'nextSceneId'`. Add `art` to reuse an existing sprite, or a new entry in `SPF` for a new look.
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
- **File structure:** one HTML file now; once it passes about 100 KB or Chapter 3 starts, the source is split into modules and a build script produces the single published file.

## Planned changes

These decisions come from the [Gravefall: Project Plan](https://claude.ai/artifact/4SA2ZmqyRVmsT6ifEtvZSJ). None of them is built yet; the sections above describe the game as it plays today.

- **Chapter locking:** the next chapter stays locked until the current one is finished. Gear, level and stat points carry over, and Vitality resets to full when a chapter starts.
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
- **Linear story:** most choices lead to the same next scene, so replaying changes little beyond dice results and a few stat boosts.
- **Voice quality varies:** the narrator uses whatever voices the device has, so the sound cannot be guaranteed.
- **Audio starts on tap:** browsers block sound until the player taps, so the opening scene is not read automatically.
- **Reused art:** Chapter 2 reuses Chapter 1 backdrops, and Colonel Vex and the Ironback reuse the Kraag and Hullcrusher sprites with recoloring.
- **Allies are voices only:** Quill and Brannigan appear in the story and as portraits but do not act in fights.
- **Not tested on real devices:** checks so far used a desktop browser at desktop and phone widths.
