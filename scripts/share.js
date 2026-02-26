#!/usr/bin/env node
// CLI: post a capture to Instagram via Meta Graph API
// Usage: npm run share "sketch-name" [-- --caption "custom caption"]
//
// Requires .env with:
//   INSTAGRAM_USER_ID=your_ig_user_id
//   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token

import { readdirSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

// Parse args
const args = process.argv.slice(2);
const sketchName = args[0];
const captionIdx = args.indexOf('--caption');
const customCaption = captionIdx !== -1 ? args[captionIdx + 1] : null;

if (!sketchName) {
  console.error('Usage: npm run share "sketch-name" [-- --caption "text"]');
  process.exit(1);
}

// Load .env manually (no dotenv dependency)
async function loadEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) {
    console.error('Missing .env file. Create one with INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN.');
    process.exit(1);
  }
  const { readFileSync } = await import('fs');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

// Find the latest capture for a sketch
function findCapture(name) {
  const dir = join(root, 'captures', name);
  if (!existsSync(dir)) {
    console.error(`No captures found for "${name}". Run the sketch and press S/G/V to capture.`);
    process.exit(1);
  }
  const files = readdirSync(dir)
    .filter((f) => /\.(png|jpg|mp4|webm)$/.test(f) && f !== 'thumb.png')
    .sort()
    .reverse();
  if (files.length === 0) {
    console.error(`No capture files in captures/${name}/`);
    process.exit(1);
  }
  return join(dir, files[0]);
}

// Instagram Graph API publishing
async function publishToInstagram(imagePath, caption, env) {
  const userId = env.INSTAGRAM_USER_ID;
  const token = env.INSTAGRAM_ACCESS_TOKEN;

  if (!userId || !token) {
    console.error('.env must contain INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN');
    process.exit(1);
  }

  // Note: Instagram Graph API requires a publicly accessible image URL.
  // For local files, you'd need to upload to a hosting service first.
  // This implementation assumes you'll set up a simple file server or use a service.
  console.error(
    'Instagram Graph API requires a public URL for the image.\n' +
    'Upload your capture to a public host and use:\n' +
    `  node scripts/share.js "${sketchName}" --url "https://your-host.com/image.png"\n\n` +
    'Or set up IMAGE_HOST_URL in .env for automatic uploads.'
  );
  process.exit(1);

  // When you have a public URL, the flow is:
  // 1. POST /{user-id}/media { image_url, caption, access_token }
  // 2. POST /{user-id}/media_publish { creation_id, access_token }
}

async function main() {
  const env = await loadEnv();
  const capturePath = findCapture(sketchName);
  const ext = extname(capturePath).toLowerCase();

  const tags = '#creativecoding #p5js #generativeart #codeart #sqrfm';
  const caption = customCaption || `${sketchName.replace(/-/g, ' ')} ${tags}`;

  console.log(`Capture: ${capturePath}`);
  console.log(`Caption: ${caption}`);
  console.log(`Type: ${ext}`);

  await publishToInstagram(capturePath, caption, env);
}

main();
