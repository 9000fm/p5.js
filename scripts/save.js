#!/usr/bin/env node
import { copyFileSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run save "sketch-name"');
  process.exit(1);
}

const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const wipPath = join(root, 'sketches', '_wip.js');
const destPath = join(root, 'sketches', `${slug}.js`);

if (existsSync(destPath)) {
  console.error(`sketches/${slug}.js already exists. Pick a different name.`);
  process.exit(1);
}

// Copy WIP to named sketch
copyFileSync(wipPath, destPath);
console.log(`Saved → sketches/${slug}.js`);

// Reset WIP to blank template
const template = `function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 255);
}

function draw() {
  background(0, 0, 255);

  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
`;

writeFileSync(wipPath, template);
console.log('Reset → sketches/_wip.js');
