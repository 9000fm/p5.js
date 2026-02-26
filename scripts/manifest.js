#!/usr/bin/env node
// Scans sketches/ and captures/ to produce a JSON manifest for the gallery.
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { resolve, join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const sketchesDir = join(root, 'sketches');
const capturesDir = join(root, 'captures');
const outPath = join(root, 'public', 'manifest.json');

const sketches = readdirSync(sketchesDir)
  .filter((f) => f.endsWith('.js') && f !== '_wip.js')
  .map((f) => {
    const name = basename(f, '.js');
    const stat = statSync(join(sketchesDir, f));
    const thumbDir = join(capturesDir, name);
    const thumbPath = join(thumbDir, 'thumb.png');
    const hasThumb = existsSync(thumbPath);

    return {
      name,
      file: f,
      date: stat.mtime.toISOString().split('T')[0],
      thumb: hasThumb ? `captures/${name}/thumb.png` : null,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date)); // newest first

writeFileSync(outPath, JSON.stringify(sketches, null, 2));
console.log(`Manifest → public/manifest.json (${sketches.length} sketches)`);
