let r = 0;
let g = 0;
let b = 255;
rot = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
  angleMode(DEGREES);
}

function draw() {
  background(220);

  push();
  translate(width / 2, height / 2);
  // rotate(frameCount * 0.02);
  rotate(rot);
  fill(r, g, b);
  rectMode(CENTER);
  rect(0, 0, 100, 100);
  pop();

  rot += 5; // Increment rotation angle
  if (rot >= 360) {
    rot = 0; // Reset rotation angle after a full rotation
  }
  
  // Change color and width every full circle

  if (rot % 360 === 0) {
    r = random(255);
    g = random(255);
    b = random(255);
  }
}