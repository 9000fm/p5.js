// Rotating colors 1.0

let flashes = [0, 0, 0]; // timers for flashes
let states = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 3; i++) {
    states.push({state:"visible", timer:0, duration:0, alpha:255});
  }

  colors = [
    color(0, 0, 255),   // blue
    color(255, 255, 0), // yellow
    color(255, 0, 0)    // red
  ];
  
  for (let i = 0; i < 3; i++) pickNewState(i);
}

function draw() {
  background(0);

  // VHS overlay
  fill(0, 180);
  rect(0, 0, width, height);

  blendMode(ADD);
  let t = frameCount * 0.02;

  for (let i = 0; i < 3; i++) {
    let phase = i * PI/3;
    let x = width/2 + cos(t + phase) * 200; // larger orbit
    let y = height/2;
    let d = map(sin(t + phase), -1, 1, 150, 400); // larger spheres

    updateState(i);

    // draw sphere
    fill(red(colors[i]), green(colors[i]), blue(colors[i]), states[i].alpha);
    ellipse(x, y, d, d);

    // random flash trigger
    if (flashes[i] <= 0 && random() < 0.005) {
      flashes[i] = int(random(5, 12)); // short burst
    }

    // full-screen flash
    if (flashes[i] > 0) {
      let alpha = map(flashes[i], 0, 12, 0, 255);
      fill(red(colors[i]), green(colors[i]), blue(colors[i]), alpha);
      rect(0, 0, width, height);
      flashes[i]--;
    }
  }

  blendMode(BLEND);

  // VHS noise lines
  stroke(255, 20);
  for (let y = 0; y < height; y += int(random(15, 40))) {
    line(0, y, width, y);
  }
  noStroke();
}

// sphere state management
function updateState(i) {
  let s = states[i];
  s.timer++;
  if (s.timer > s.duration) {
    toggleState(i);
    pickNewState(i);
  }

  if (s.state === "visible") s.alpha = 255;
  else if (s.state === "hidden") s.alpha = 0;
  else if (s.state === "fadeOut") s.alpha = map(s.duration - s.timer, 0, s.duration, 0, 255);
  else if (s.state === "fadeIn") s.alpha = map(s.timer, 0, s.duration, 0, 255);
}

function toggleState(i) {
  let s = states[i];
  if (s.state === "visible") s.state = "fadeOut";
  else if (s.state === "hidden") s.state = "fadeIn";
  else if (s.state === "fadeOut") s.state = "hidden";
  else if (s.state === "fadeIn") s.state = "visible";
}

function pickNewState(i) {
  let s = states[i];
  s.timer = 0;
  if (s.state === "visible") s.duration = int(random(60, 140));
  else if (s.state === "hidden") s.duration = int(random(60, 160));
  else s.duration = int(random(15, 25));
}
