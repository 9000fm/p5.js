// Parent ↔ iframe message protocol
export const MSG = {
  // Parent → iframe commands
  CAPTURE_SCREENSHOT: 'capture-screenshot',
  CAPTURE_GIF:        'capture-gif',
  CAPTURE_VIDEO:      'capture-video',

  // Iframe → parent responses
  SCREENSHOT_READY:   'screenshot-ready',
  GIF_READY:          'gif-ready',
  VIDEO_READY:        'video-ready',
  CAPTURE_ERROR:      'capture-error',

  // Console forwarding (iframe → parent)
  CONSOLE_MSG:        'console-msg',
  CONSOLE_CLEAR:      'console-clear',
};
