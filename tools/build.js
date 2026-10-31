#!/usr/bin/env node
/*
 * Builds Gravefall.html from src/shell.html + src/js/*.js.
 *
 * The game must stay a single deployable file (GitHub Pages serves it directly, and it has
 * to keep opening via file:// with no server), so the source is split for editing but always
 * reassembled into one file for publishing. This is plain concatenation into one global-scope
 * script, not ES modules -- order matters and matches src/js/'s numeric filename prefixes.
 *
 * Usage: node tools/build.js [--check]
 *   --check   Build in memory and compare against the committed Gravefall.html instead of
 *             writing it; exits non-zero if they differ. Use this in CI or before a commit
 *             to catch a stale build (edited src/ but forgot to rebuild).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const JS_DIR = path.join(SRC_DIR, 'js');
const SHELL = path.join(SRC_DIR, 'shell.html');
const OUT = path.join(ROOT, 'Gravefall.html');

const shell = fs.readFileSync(SHELL, 'utf8');
if (!shell.includes('{{SCRIPT}}')) {
  throw new Error(`${SHELL} has no {{SCRIPT}} placeholder -- can't build.`);
}

// Every file in src/js/, in filename order (the numeric prefixes are the load order).
const files = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js')).sort();
if (!files.length) throw new Error(`No .js files found in ${JS_DIR}`);

const script = files
  .map(f => fs.readFileSync(path.join(JS_DIR, f), 'utf8').replace(/\n$/, '')) // strip exactly the one trailing newline each file was saved with -- a file that legitimately ends in a blank line keeps it
  .join('\n');

const built = shell.replace('{{SCRIPT}}', script);

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;
  if (current === built) {
    console.log('OK: Gravefall.html matches src/ (up to date).');
    process.exit(0);
  }
  console.error('STALE: Gravefall.html does not match what src/ would build.');
  console.error('Run `node tools/build.js` to regenerate it, then commit the result.');
  process.exit(1);
}

fs.writeFileSync(OUT, built);
console.log(`Built ${OUT} from ${files.length} files in ${path.relative(ROOT, JS_DIR)}/ (${built.length} bytes).`);
