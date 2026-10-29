# Gravefall

A dark sci-fi dice RPG that runs in your browser. You play Captain Dax Ironside of Ironwolf Company, fighting through a derelict carrier one dice roll at a time.

**Play it:** [link to the published game]
**Version:** 0.1.0 (see [CHANGELOG.md](CHANGELOG.md))

## What it is

- Text-driven tactical RPG: story choices and fights are decided by a d20 plus a stat.
- Two chapters so far: *Iron in the Dark* and *The Hollow Moon*.
- Pixel art for every scene and enemy, synthesized sound effects, and optional narration using your device's voices.
- Works on phones and monitors. No account, no install, nothing is stored or sent anywhere.

## Run it locally

Open `Gravefall.html` in a modern browser. There is nothing to install or build.

## Project layout

| Path | What it holds |
| --- | --- |
| `Gravefall.html` | The whole game: story, rules, art and engine |
| `docs/` | Game design document and project plan (Markdown exports) |
| `CHANGELOG.md` | What changed in each release |

## Documentation

- [Game design document](docs/Gravefall Game Design Document.md): story, mechanics, enemies, items and chapter flow
- [Project plan](docs/project-plan.md): roadmap, decisions and source control

## Working on it

- `main` is always playable. Make changes on a branch such as `feature/leveling` and open a pull request.
- Versions use `MAJOR.MINOR.PATCH` tags: MAJOR for a new chapter or a save format that breaks old saves, MINOR for features and content, PATCH for fixes and balance tweaks.
- Add a changelog entry for every release.
- Story rule: every line of dialogue names its speaker.
- To add a scene, enemy, item or chapter, see "How to extend" in the design document.

## Status

First-pass balance, not yet tested on real phones. Saving, levels and chapter locking are planned.

## Credits and license

Written with help from Claude. All names, characters and art are original. [Choose a license, or write "All rights reserved" for now.]
