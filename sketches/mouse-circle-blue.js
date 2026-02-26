function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 255);
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
