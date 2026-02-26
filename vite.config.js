import { defineConfig } from 'vite';
import { resolve, join, basename } from 'path';
import { fileURLToPath } from 'url';
import {
  copyFileSync, readFileSync, writeFileSync, existsSync,
  readdirSync, statSync,
} from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = __dirname;
const sketchesDir = join(root, 'sketches');
const capturesDir = join(root, 'captures');
const manifestPath = join(root, 'public', 'manifest.json');
const metaPath = join(sketchesDir, 'meta.json');

function loadMeta() {
  try {
    return JSON.parse(readFileSync(metaPath, 'utf-8'));
  } catch {
    return {};
  }
}

function saveMeta(meta) {
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
}

function generateManifest() {
  const meta = loadMeta();
  const sketches = readdirSync(sketchesDir)
    .filter((f) => f.endsWith('.js') && f !== '_wip.js')
    .map((f) => {
      const name = basename(f, '.js');
      const stat = statSync(join(sketchesDir, f));
      const thumbPath = join(capturesDir, name, 'thumb.png');
      return {
        name,
        file: f,
        date: meta[name] || stat.mtime.toISOString().split('T')[0],
        thumb: existsSync(thumbPath) ? `captures/${name}/thumb.png` : null,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  writeFileSync(manifestPath, JSON.stringify(sketches, null, 2));
  return sketches;
}

const WIP_TEMPLATE = `function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
`;

function apiPlugin() {
  return {
    name: 'sqr-fm-api',
    configureServer(server) {
      server.middlewares.use('/api/manifest', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const sketches = generateManifest();
          res.end(JSON.stringify(sketches));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // GET /api/sketch?name=X — return JS source of a sketch
      server.middlewares.use('/api/sketch', (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const name = url.searchParams.get('name');
        if (!name) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'name required' }));
          return;
        }
        const safe = name.replace(/[^a-z0-9_-]/gi, '');
        const filePath = join(sketchesDir, `${safe}.js`);
        if (!existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'not found' }));
          return;
        }
        res.setHeader('Content-Type', 'text/javascript');
        res.end(readFileSync(filePath, 'utf-8'));
      });

      // POST /api/write-wip — write { code } to sketches/_wip.js
      server.middlewares.use('/api/write-wip', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'POST only' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const { code } = JSON.parse(body);
            if (typeof code !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'code string required' }));
              return;
            }
            writeFileSync(join(sketchesDir, '_wip.js'), code);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      server.middlewares.use('/api/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'POST only' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const { name } = JSON.parse(body);
            if (!name) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'name required' }));
              return;
            }
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            if (!slug) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'invalid name' }));
              return;
            }
            const wipPath = join(sketchesDir, '_wip.js');
            const destPath = join(sketchesDir, `${slug}.js`);
            if (existsSync(destPath)) {
              res.statusCode = 409;
              res.end(JSON.stringify({ error: `${slug}.js already exists` }));
              return;
            }
            copyFileSync(wipPath, destPath);
            const meta = loadMeta();
            meta[slug] = new Date().toISOString().split('T')[0];
            saveMeta(meta);
            const sketches = generateManifest();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ slug, sketches }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [apiPlugin()],
  server: {
    open: '/',
    fs: {
      allow: ['.'],
    },
    watch: {
      ignored: ['!**/sketches/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        runner: resolve(__dirname, 'runner.html'),
      },
    },
  },
});
