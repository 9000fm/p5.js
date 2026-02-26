// Capture engine — screenshot, GIF, video recording
// Works in two modes:
//   standalone: downloads files directly (runner.html opened alone)
//   iframe:     sends data back to parent via postMessage

import { MSG } from '/src/bridge.js';

let sketchName = '_wip';
let recording = null; // 'gif' | 'video' | null
let gifFrames = [];
let gifInterval = null;
let mediaRecorder = null;
let videoChunks = [];
let captureCount = 0;
let isIframed = false;

function getCanvas() {
  return document.querySelector('canvas');
}

function flash() {
  const el = document.getElementById('flash');
  if (!el) return;
  el.classList.add('active');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.remove('active'));
  });
}

function showRecording(show) {
  const el = document.getElementById('hud-recording');
  if (el) el.style.display = show ? 'inline' : 'none';
  const hud = document.getElementById('capture-hud');
  if (hud && show) hud.classList.add('visible');
}

function nextName(ext) {
  captureCount++;
  const num = String(captureCount).padStart(3, '0');
  return `${sketchName}-${num}.${ext}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sendToParent(type, blob) {
  const reader = new FileReader();
  reader.onload = () => {
    window.parent.postMessage({ type, dataUrl: reader.result }, '*');
  };
  reader.onerror = () => {
    window.parent.postMessage({ type: MSG.CAPTURE_ERROR, error: 'Failed to read blob' }, '*');
  };
  reader.readAsDataURL(blob);
}

// --- Screenshot ---
export function takeScreenshot() {
  const canvas = getCanvas();
  if (!canvas) return;
  flash();
  canvas.toBlob((blob) => {
    if (!blob) return;
    if (isIframed) {
      sendToParent(MSG.SCREENSHOT_READY, blob);
    } else {
      downloadBlob(blob, nextName('png'));
    }
  }, 'image/png');
}

// --- GIF Recording ---
export function toggleGif() {
  if (recording === 'gif') {
    stopGif();
  } else if (!recording) {
    startGif();
  }
}

function startGif() {
  const canvas = getCanvas();
  if (!canvas) return;
  recording = 'gif';
  gifFrames = [];
  showRecording(true);

  gifInterval = setInterval(() => {
    const frame = document.createElement('canvas');
    frame.width = canvas.width;
    frame.height = canvas.height;
    frame.getContext('2d').drawImage(canvas, 0, 0);
    gifFrames.push(frame);
  }, 66);
}

function stopGif() {
  clearInterval(gifInterval);
  recording = null;
  showRecording(false);

  if (gifFrames.length === 0) return;

  const w = gifFrames[0].width;
  const h = gifFrames[0].height;

  import('gif.js').then(({ default: GIF }) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: w,
      height: h,
      workerScript: '/node_modules/gif.js/dist/gif.worker.js',
    });

    gifFrames.forEach((frame) => {
      gif.addFrame(frame, { delay: 66 });
    });

    gif.on('finished', (blob) => {
      if (isIframed) {
        sendToParent(MSG.GIF_READY, blob);
      } else {
        downloadBlob(blob, nextName('gif'));
      }
      gifFrames = [];
    });

    gif.render();
  }).catch((err) => {
    console.warn('GIF encoding failed:', err);
    gifFrames = [];
    if (isIframed) {
      window.parent.postMessage({ type: MSG.CAPTURE_ERROR, error: 'GIF encoding failed' }, '*');
    }
  });
}

// --- Video Recording ---
export function toggleVideo() {
  if (recording === 'video') {
    stopVideo();
  } else if (!recording) {
    startVideo();
  }
}

function startVideo() {
  const canvas = getCanvas();
  if (!canvas) return;

  const stream = canvas.captureStream(30);
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm',
  });
  videoChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) videoChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(videoChunks, { type: 'video/webm' });
    if (isIframed) {
      sendToParent(MSG.VIDEO_READY, blob);
    } else {
      downloadBlob(blob, nextName('webm'));
    }
    videoChunks = [];
  };

  mediaRecorder.start();
  recording = 'video';
  showRecording(true);
}

function stopVideo() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  recording = null;
  showRecording(false);
}

// --- Keyboard handler (works when iframe/runner has focus) ---
function onKeyDown(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key.toLowerCase()) {
    case 's':
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      takeScreenshot();
      break;
    case 'g':
      e.preventDefault();
      toggleGif();
      break;
    case 'v':
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      toggleVideo();
      break;
  }
}

// --- PostMessage listener (commands from parent workspace) ---
function onParentMessage(e) {
  switch (e.data?.type) {
    case MSG.CAPTURE_SCREENSHOT:
      takeScreenshot();
      break;
    case MSG.CAPTURE_GIF:
      toggleGif();
      break;
    case MSG.CAPTURE_VIDEO:
      toggleVideo();
      break;
  }
}

export function initCapture(name) {
  sketchName = name || '_wip';
  isIframed = window !== window.top;

  document.addEventListener('keydown', onKeyDown);

  if (isIframed) {
    window.addEventListener('message', onParentMessage);
  }
}
