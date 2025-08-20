var x, y, sz, rot, velRot

const TRAIL_ALPHA = 100;


function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);

  x = 0;
  y = 0;
  rot = 20;
  sz = 50;
  velRot = 1;

}


function draw() {

  push();
  noStroke();
  fill(255, TRAIL_ALPHA);
  rect(0, 0, width, height);
  pop();

  if (x < width) {
    x -= 5;
  }

  push();
  translate(width/2, height/2);
  rotate (rot);
  fill(0);
  translate(x, y)
  rotate(-rot*5)
  line(0,-sz,0,sz)
  pop();

  push();
  translate(width/2, height/2);
  rotate (rot*2);
  fill(0);
  translate(x, y)
  rotate(rot)
  rect(x,y,sz/random(11,120), sz*11);
  pop();

  rot = rot + velRot;

  if(rot >= 360) {
    rot = 0;
    x = random(0, width/2);
    sz = random(5, 300);
  }

}
