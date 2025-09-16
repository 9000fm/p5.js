function setup() {
  createCanvas(windowWidth, windowHeight); // full window
  background(220); // light gray
}

function draw() {
  background(0,0,255); // clear every frame

  // example: circle follows mouse
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
