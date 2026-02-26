// sqr.fm workspace controller
import { MSG } from '/src/bridge.js';

// ── WIP template (must match vite.config.js WIP_TEMPLATE) ──
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

// ── DOM refs ──
const frame        = document.getElementById('sketch-frame');
const canvasWrap   = document.getElementById('canvas-wrap');
const flashEl      = document.getElementById('canvas-flash');
const listEl       = document.getElementById('sketch-list');
const btnNew       = document.getElementById('btn-new');
const btnShot      = document.getElementById('btn-screenshot');
const btnGif       = document.getElementById('btn-gif');
const btnVideo     = document.getElementById('btn-video');
const toastBox     = document.getElementById('toast-container');
const editor       = document.getElementById('editor');
const editorName   = document.getElementById('editor-name');
const btnSave      = document.getElementById('btn-save');
const btnDiscard   = document.getElementById('btn-discard');
const btnRun       = document.getElementById('btn-run');
const btnAutorun   = document.getElementById('btn-autorun');
const canvasW      = document.getElementById('canvas-w');
const canvasH      = document.getElementById('canvas-h');
const canvasAuto   = document.getElementById('canvas-auto');
const consolePanel = document.getElementById('console-panel');
const consoleToggle= document.getElementById('console-toggle');
const consoleOutput= document.getElementById('console-output');
const consoleBadge = document.getElementById('console-badge');

let currentSketch = '_wip';
let sketches = [];
let captureCount = 0;
let autorunEnabled = true;
let autorunTimer = null;
let lastSavedCode = WIP_TEMPLATE;
let errorCount = 0;

// ── Editor mode management ──
function setEditMode(isWip) {
  editorName.disabled = !isWip;
  btnSave.style.display = isWip ? '' : 'none';
  btnDiscard.style.display = isWip ? '' : 'none';
  btnAutorun.style.display = isWip ? '' : 'none';
  editor.readOnly = !isWip;
  updateSaveButton();
}

function updateSaveButton() {
  const name = editorName.value.trim();
  btnSave.disabled = !name || name === 'New Sketch';
}

// ── Load sketch code into editor ──
async function loadCodeIntoEditor(name) {
  try {
    const res = await fetch(`/api/sketch?name=${encodeURIComponent(name)}`);
    if (!res.ok) {
      console.error(`Failed to load sketch "${name}": ${res.status} ${res.statusText}`);
      editor.value = '// failed to load ' + name;
      return;
    }
    editor.value = await res.text();
  } catch (err) {
    console.error(`Failed to load sketch "${name}":`, err);
    editor.value = '// failed to load ' + name;
  }
}

// ── Run: write editor code to _wip.js then reload iframe ──
async function runSketch() {
  const code = editor.value;
  try {
    const res = await fetch('/api/write-wip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const data = await res.json();
      toast('Run failed: ' + (data.error || 'unknown'));
      return;
    }
  } catch (err) {
    toast('Run failed: ' + err.message);
    return;
  }
  clearConsole();
  // Reload iframe — always runs _wip
  frame.src = '/runner.html?sketch=_wip&t=' + Date.now();
}

btnRun.addEventListener('click', runSketch);

// ── Auto-run toggle ──
btnAutorun.addEventListener('click', () => {
  autorunEnabled = !autorunEnabled;
  btnAutorun.classList.toggle('active', autorunEnabled);
  if (!autorunEnabled && autorunTimer) {
    clearTimeout(autorunTimer);
    autorunTimer = null;
  }
});

editor.addEventListener('input', () => {
  if (!autorunEnabled || currentSketch !== '_wip') return;
  if (autorunTimer) clearTimeout(autorunTimer);
  autorunTimer = setTimeout(() => {
    autorunTimer = null;
    runSketch();
  }, 800);
});

// ── Sketch list ──
async function loadSketches() {
  try {
    const res = await fetch('/api/manifest');
    sketches = await res.json();
  } catch {
    sketches = [];
  }
  renderList();
}

function renderList() {
  listEl.innerHTML = '';

  // Show current draft at the top when editing a new sketch
  if (currentSketch === '_wip') {
    const wipEl = document.createElement('div');
    wipEl.className = 'sketch-item wip active';
    wipEl.textContent = editorName.value || 'Untitled';
    wipEl.addEventListener('click', () => loadSketch('_wip'));
    listEl.appendChild(wipEl);
  }

  // Saved sketches (newest first — already sorted by manifest)
  sketches.forEach((s) => {
    const el = document.createElement('div');
    el.className = 'sketch-item' + (currentSketch === s.name ? ' active' : '');
    el.textContent = s.name;
    el.addEventListener('click', () => loadSketch(s.name));
    listEl.appendChild(el);
  });

  // Highlight "+ new sketch" button when _wip is active
  btnNew.classList.toggle('active', currentSketch === '_wip');
}

function loadSketch(name) {
  currentSketch = name;
  const isWip = name === '_wip';

  if (isWip) {
    editorName.value = 'New Sketch';
  } else {
    // Show saved sketch name (prettified)
    editorName.value = name;
  }

  setEditMode(isWip);

  if (isWip) {
    loadCodeIntoEditor('_wip');
    frame.src = '/runner.html?sketch=_wip&t=' + Date.now();
  } else {
    loadCodeIntoEditor(name);
    frame.src = `/runner.html?sketch=${name}&t=` + Date.now();
  }

  clearConsole();
  renderList();
  parseCanvasSize();

  // Reset recording UI
  btnGif.classList.remove('recording');
  btnVideo.classList.remove('recording');
}

// ── Capture controls ──
function sendCapture(type) {
  frame.contentWindow.postMessage({ type }, '*');
}

btnShot.addEventListener('click', () => {
  flashCanvas();
  sendCapture(MSG.CAPTURE_SCREENSHOT);
});

btnGif.addEventListener('click', () => {
  btnGif.classList.toggle('recording');
  sendCapture(MSG.CAPTURE_GIF);
});

btnVideo.addEventListener('click', () => {
  btnVideo.classList.toggle('recording');
  sendCapture(MSG.CAPTURE_VIDEO);
});

function flashCanvas() {
  flashEl.classList.add('active');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => flashEl.classList.remove('active'));
  });
}

function nextName(ext) {
  captureCount++;
  return `${currentSketch}-${String(captureCount).padStart(3, '0')}.${ext}`;
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// ── Receive messages from iframe ──
window.addEventListener('message', (e) => {
  switch (e.data?.type) {
    case MSG.SCREENSHOT_READY:
      downloadDataUrl(e.data.dataUrl, nextName('png'));
      toast('Screenshot saved');
      break;
    case MSG.GIF_READY:
      downloadDataUrl(e.data.dataUrl, nextName('gif'));
      btnGif.classList.remove('recording');
      toast('GIF saved');
      break;
    case MSG.VIDEO_READY:
      downloadDataUrl(e.data.dataUrl, nextName('webm'));
      btnVideo.classList.remove('recording');
      toast('Video saved');
      break;
    case MSG.CAPTURE_ERROR:
      toast('Capture failed: ' + (e.data.error || 'unknown'));
      btnGif.classList.remove('recording');
      btnVideo.classList.remove('recording');
      break;
    case MSG.CONSOLE_MSG:
      appendConsole(e.data.level, e.data.text);
      break;
  }
});

// ── Save flow (from header) ──
btnSave.addEventListener('click', async () => {
  const name = editorName.value.trim();
  if (!name || name === 'New Sketch') {
    toast('Enter a sketch name first');
    editorName.focus();
    return;
  }

  btnSave.disabled = true;

  try {
    // Write current code to _wip first
    await fetch('/api/write-wip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: editor.value }),
    });

    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || 'Save failed');
      return;
    }
    toast(`Saved as ${data.slug}.js`);
    lastSavedCode = editor.value;
    sketches = data.sketches;
    // Stay on _wip
    currentSketch = '_wip';
    renderList();
  } catch (err) {
    toast('Save failed: ' + err.message);
  } finally {
    btnSave.disabled = false;
    updateSaveButton();
  }
});

editorName.addEventListener('input', updateSaveButton);

// ── Discard button ──
btnDiscard.addEventListener('click', () => {
  if (!confirm('Reset to blank template?')) return;
  editor.value = WIP_TEMPLATE;
  editorName.value = 'New Sketch';
  lastSavedCode = WIP_TEMPLATE;
  updateSaveButton();
  runSketch();
});

// ── New sketch button ──
btnNew.addEventListener('click', async () => {
  if (currentSketch === '_wip' && editor.value.trim() && editor.value !== WIP_TEMPLATE) {
    if (!confirm('Discard current code and start a new sketch?')) return;
  }
  // Write template to _wip
  try {
    await fetch('/api/write-wip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: WIP_TEMPLATE }),
    });
  } catch {
    // best-effort
  }
  lastSavedCode = WIP_TEMPLATE;
  loadSketch('_wip');
});

// ── Canvas size controls ──
function parseCanvasSize() {
  const code = editor.value;
  const match = code.match(/createCanvas\(\s*(\w+)\s*,\s*(\w+)\s*\)/);
  if (!match) return;

  const [, w, h] = match;
  const isAuto = w === 'windowWidth' && h === 'windowHeight';
  canvasAuto.checked = isAuto;
  canvasW.disabled = isAuto;
  canvasH.disabled = isAuto;

  if (!isAuto) {
    const wNum = parseInt(w, 10);
    const hNum = parseInt(h, 10);
    if (!isNaN(wNum)) canvasW.value = wNum;
    if (!isNaN(hNum)) canvasH.value = hNum;
  } else {
    updateAutoSize();
  }
}

function updateAutoSize() {
  canvasW.value = canvasWrap.clientWidth;
  canvasH.value = canvasWrap.clientHeight;
}

canvasAuto.addEventListener('change', () => {
  const isAuto = canvasAuto.checked;
  canvasW.disabled = isAuto;
  canvasH.disabled = isAuto;

  if (isAuto) {
    updateAutoSize();
  }

  if (currentSketch !== '_wip') return;

  if (isAuto) {
    replaceCanvasSize('windowWidth', 'windowHeight');
  } else {
    const w = canvasW.value || '800';
    const h = canvasH.value || '600';
    canvasW.value = w;
    canvasH.value = h;
    replaceCanvasSize(w, h);
  }
});

window.addEventListener('resize', () => {
  if (canvasAuto.checked) updateAutoSize();
});

function applySizeFromInputs() {
  if (canvasAuto.checked || currentSketch !== '_wip') return;
  const w = canvasW.value || '800';
  const h = canvasH.value || '600';
  replaceCanvasSize(w, h);
}

canvasW.addEventListener('change', applySizeFromInputs);
canvasH.addEventListener('change', applySizeFromInputs);

function replaceCanvasSize(w, h) {
  let code = editor.value;
  code = code.replace(
    /createCanvas\([^)]*\)/,
    `createCanvas(${w}, ${h})`
  );
  code = code.replace(
    /resizeCanvas\([^)]*\)/,
    `resizeCanvas(${w}, ${h})`
  );
  editor.value = code;
}

// ── Console panel ──
function clearConsole() {
  consoleOutput.innerHTML = '';
  errorCount = 0;
  consoleBadge.textContent = '';
  consoleBadge.classList.remove('visible');
}

function appendConsole(level, text) {
  const line = document.createElement('div');
  line.className = 'console-line ' + level;

  const prefix = level === 'warn' ? '\u26A0 ' : level === 'error' ? '\u2716 ' : '> ';
  line.textContent = prefix + text;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;

  if (level === 'error') {
    errorCount++;
    consoleBadge.textContent = errorCount + (errorCount === 1 ? ' error' : ' errors');
    consoleBadge.classList.add('visible');
    // Auto-expand on error
    consolePanel.classList.add('open');
  }
}

consoleToggle.addEventListener('click', () => {
  consolePanel.classList.toggle('open');
});

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
  // Ctrl+Enter / Cmd+Enter — run sketch (works even in textarea)
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runSketch();
    return;
  }

  // Don't fire single-key shortcuts when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key.toLowerCase()) {
    case 's':
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      flashCanvas();
      sendCapture(MSG.CAPTURE_SCREENSHOT);
      break;
    case 'g':
      e.preventDefault();
      btnGif.classList.toggle('recording');
      sendCapture(MSG.CAPTURE_GIF);
      break;
    case 'v':
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      btnVideo.classList.toggle('recording');
      sendCapture(MSG.CAPTURE_VIDEO);
      break;
  }
});

// ── Tab key in textarea ──
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
  }
});

// ── Toasts ──
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  toastBox.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Init ──
loadSketches();
loadCodeIntoEditor('_wip').then(() => {
  lastSavedCode = editor.value;
  parseCanvasSize();
});
setEditMode(true);
