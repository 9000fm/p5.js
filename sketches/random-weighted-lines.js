var x, y, sz, a;


function setup() {

  createCanvas(windowWidth, windowHeight);
  background(255);
  frameRate(20);
  a = 20;
  x = 0;
  y = 0;
  sz = 0;
  strokeCap(SQUARE);


}



function draw() {
  console.log(frameCount);

// clear the background with some transparency 

  push();
  noStroke();
  fill(255, a);
  rect(0, 0, width, height);
  pop();

// draw a line at a random position

  push();
  translate(x, y);
  sz = random(4, 200);
  stroke(0);
  strokeWeight(random(1, 50));
  line(0,-sz,0,sz);
  pop();

  
  x = random(0, width);
  y = random(0, height);


  a += 1;

  if (a > 255) {
    a = 40;
  }
}
