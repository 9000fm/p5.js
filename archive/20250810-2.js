let N = 1000;           // how many lines

// one array per property. index i identifies a single line
let xs = [], ys = [], rots = [], szs = [], alphas = [];
let speeds = [], rotSpeeds = [];

function setup(){
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(0);

  // create N lines with random state
  for (let i = 0; i < N; i++) spawn(i);
}

function draw(){
  // fade old frames to leave a trace
  noStroke();
  fill(0, 0, 0, 20);
  rect(0, 0, width, height);

  // draw and update each line
  strokeWeight(2);
  for (let i = 0; i < N; i++) {
    // draw
    push();
    translate(xs[i], ys[i]);
    rotate(rots[i]);
    stroke(255, 255, 255, alphas[i]);
    line(0, -szs[i], 0, szs[i]);
    pop();

    // update
    ys[i] += speeds[i];
    rots[i] += rotSpeeds[i];
    alphas[i] = min(255, alphas[i] + 5);

    // respawn when off screen
    if (ys[i] > height) spawn(i);
  }
}

// randomize one line i
function spawn(i){
  xs[i] = random(width);            // random x across the canvas
  ys[i] = random(-height, 0);       // start somewhere above the top
  rots[i] = random(360);
  szs[i] = random(5, 40);
  alphas[i] = 0;                    // fade in
  speeds[i] = random(5, 15);        // fall speed
  rotSpeeds[i] = random(-3, 3);     // spin speed
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
