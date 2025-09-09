// p5.js. Grid based random sketch with 16x8 tiles.
// Colors from the screenshot. Shapes sometimes span 2 tiles.

let cols = 16;
let rows = 8;
let tileW, tileH;

const PALETTE = [
  "#AC7173", "#FFFFFF", "#52B0D2", "#D3706C",
  "#4EB3D1", "#DAC876", "#D04D7A", "#32BE7C"
];

let bgColor;
let occupied; // 2D boolean map

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  noLoop();
  regenerate();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  regenerate();
}

function regenerate() {
  // set tile size and occupancy map
  tileW = width / cols;
  tileH = height / rows;
  occupied = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));

  // choose background and draw
  bgColor = random(PALETTE);
  background(bgColor);

  // do not use background color for shapes
  const colors = PALETTE.filter(c => c !== bgColor);

  // walk the grid
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      if (occupied[gy][gx]) continue;

      // decide span. 30 percent chance to span 2 tiles
      let spanX = 1;
      let spanY = 1;
      if (random() < 0.3) {
        if (random() < 0.5 && gx < cols - 1 && !occupied[gy][gx + 1]) {
          spanX = 2;
        } else if (gy < rows - 1 && !occupied[gy + 1][gx]) {
          spanY = 2;
        }
      }

      // mark occupied
      for (let y = 0; y < spanY; y++) {
        for (let x = 0; x < spanX; x++) {
          occupied[gy + y][gx + x] = true;
        }
      }

      // tile rectangle in pixels
      const x0 = gx * tileW;
      const y0 = gy * tileH;
      const w = tileW * spanX;
      const h = tileH * spanY;

      drawShape(x0, y0, w, h, colors);
    }
  }
}

function drawShape(x, y, w, h, colors) {
  push();

  // padding inside tile
  const pad = min(w, h) * random(0.06, 0.14);
  const cx = x + w * 0.5;
  const cy = y + h * 0.5;

  // choose colors
  const fillCol = random(colors);
  const strokeCol = random(colors);
  const secondary = random(colors);

  // subtle rotation for variety
  const a = noise(cx * 0.002, cy * 0.002) * TWO_PI * 0.08;
  translate(cx, cy);
  rotate(a);

  // choose a shape type
  const choice = floor(random(6));

  noStroke();
  fill(fillCol);

  switch (choice) {
    case 0:
      // circle or oval
      ellipse(0, 0, w - 2 * pad, h - 2 * pad);
      // optional inner ring
      if (random() < 0.35) {
        noFill();
        stroke(secondary);
        strokeWeight(min(w, h) * 0.06);
        ellipse(0, 0, w - 3 * pad, h - 3 * pad);
      }
      break;

    case 1:
      // square or rect with rounded corners
      const r = min(w, h) - 2 * pad;
      rectMode(CENTER);
      rect(0, 0, r, r, r * random(0.1, 0.35));
      // cutout
      if (random() < 0.3) {
        noStroke();
        fill(bgColor);
        rect(0, 0, r * 0.5, r * 0.5, r * 0.2);
      }
      break;

    case 2:
      // diamond
      beginShape();
      vertex(0, -h * 0.5 + pad);
      vertex(w * 0.5 - pad, 0);
      vertex(0, h * 0.5 - pad);
      vertex(-w * 0.5 + pad, 0);
      endShape(CLOSE);
      if (random() < 0.35) {
        noFill();
        stroke(strokeCol);
        strokeWeight(min(w, h) * 0.05);
        beginShape();
        vertex(0, -h * 0.35);
        vertex(w * 0.35, 0);
        vertex(0, h * 0.35);
        vertex(-w * 0.35, 0);
        endShape(CLOSE);
      }
      break;

    case 3:
      // cross
      const t = min(w, h) * 0.18;
      const l = min(w, h) - 2 * pad;
      rectMode(CENTER);
      rect(0, 0, l, t);
      rect(0, 0, t, l);
      if (random() < 0.4) {
        fill(secondary);
        circle(0, 0, t * 0.9);
      }
      break;

    case 4:
      // arc pair
      noStroke();
      arc(0, 0, w - 2 * pad, h - 2 * pad, PI * 0.1, PI * 1.1, PIE);
      fill(secondary);
      arc(0, 0, w - 3 * pad, h - 3 * pad, -PI * 0.4, PI * 0.6, PIE);
      break;

    case 5:
      // striped rect
      rectMode(CENTER);
      const rw = w - 2 * pad;
      const rh = h - 2 * pad;
      fill(fillCol);
      rect(0, 0, rw, rh, min(rw, rh) * 0.1);
      const stripes = floor(random(3, 7));
      const sw = rw / (stripes * 2);
      noStroke();
      fill(bgColor);
      for (let i = -stripes; i < stripes; i++) {
        rect(i * sw * 2 + sw * 0.5, 0, sw, rh * 0.9);
      }
      break;
  }

  // optional outline
  if (random() < 0.25) {
    noFill();
    stroke(strokeCol);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, w - pad, h - pad);
  }

  pop();
}

// controls
function keyPressed() {
  if (key === "R" || key === "r") {
    regenerate();
    redraw();
  }
  if (key === "S" || key === "s") {
    saveCanvas("grid-sketch", "png");
  }
}
