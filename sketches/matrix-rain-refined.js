// Matrix grid. Clean structure for learning and tweaking.

let CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]= {}|;':\",.<>?/`~";
// You can swap the charset at runtime. Try only "01" or only Katakana if you load a font.

let grid = [];          // 2D array of single character strings
let cols = 0, rows = 0; // grid dimensions in cells
let fontSize = 11;      // pixels per cell. also controls text size
let flipProb = 0.01;    // chance per cell per frame to change character (lower = less frequent)
let ink, paper;         // colors

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);                // keep crisp text across displays
  textFont('monospace');          // swap with a loaded font to change feel
  textAlign(LEFT, TOP);           // draw using top left as origin per cell
  ink = color(0, 255, 70);        // matrix green
  paper = color(0);               // black
  rebuildGrid();                  // allocate and fill grid
}

function draw() {
  background(paper);

  // 1. update
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (random() < flipProb) {
        grid[y][x] = randomChar();
      }
    }
  }

  // 2. render
  fill(ink);
  noStroke();
  textSize(fontSize);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * fontSize;
      const py = y * fontSize;
      text(grid[y][x], px, py);
    }
  }
}

function rebuildGrid() {
  cols = max(1, floor(width / fontSize));
  rows = max(1, floor(height / fontSize));
  grid = new Array(rows);
  for (let y = 0; y < rows; y++) {
    grid[y] = new Array(cols);
    for (let x = 0; x < cols; x++) {
      grid[y][x] = randomChar();
    }
  }
}

function randomChar() {
  const i = floor(random(CHARSET.length));
  return CHARSET.charAt(i);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rebuildGrid();
}

function keyPressed() {
  if (key === ' ') {
    noLoop();
  } else if (key === 'P') {
    loop();
  } else if (key === 'R') {
    rebuildGrid();
  } else if (key === '1') {
    fontSize = max(8, fontSize - 2);
    rebuildGrid();
  } else if (key === '2') {
    fontSize += 2;
    rebuildGrid();
  } else if (key === '3') {
    flipProb = max(0, flipProb - 0.01);
  } else if (key === '4') {
    flipProb = min(1, flipProb + 0.01);
  }
}
