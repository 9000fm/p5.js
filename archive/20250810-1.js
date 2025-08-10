let x, y, rot, sz, a;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  x = width / 2;
  y = 0;
  rot = 0;
  sz = 20;
  a = 0; 

  background(0); 
}

function draw() {
  
  // 1. fade old frames. small alpha means slow fade, big alpha means fast fade
  noStroke();
  fill(0, 0, 0, 30); // try 10 to 40
  rect(0, 0, width, height);

  // 2. draw the line with current alpha
  push();
  translate(x, y);
  rotate(rot);
  stroke(255, 255, 255, a); // a controls visibility
  strokeWeight(2);
  line(0, -sz, 0, sz);
  pop();

  // 3. update motion and alpha
  y += 10;
  rot += 2;
  if (a < 255) a += 8;          

  // 4. reset when offscreen
  if (y > windowHeight ) {
    y = 0;
    x = random(width);
    sz = random(10, 40);
    a = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
