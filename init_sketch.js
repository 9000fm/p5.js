function setup() {
  createCanvas(windowWidth, windowHeight); // full window
  background(0,0,255)); 
}

function draw() {
  background(0,0,255); 

  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
