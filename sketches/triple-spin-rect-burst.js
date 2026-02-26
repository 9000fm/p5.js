var x, y, sz, rot, velRot

const TRAIL_ALPHA = 50;


function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);
  frameRate(60);
  x = width/2;
  y = 0;
  rot = 30;
  sz = 80;
  velRot = 5;
  strokeCap(SQUARE);

}


function draw() {

  push();
  noStroke();
  fill(255, TRAIL_ALPHA);
  rect(0, 0, width, height);
  pop();

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
  rect(x,y,random(sz),random(sz/4));
  pop();

  push();
  translate(width/2, height/2);
  rotate (rot*3);
  fill(0);
  translate(x, y)
  rotate(rot)
  rect(x,y,random(sz)*5,random(sz/9));
  pop();

  rot = rot + velRot;

  if(rot >= 360) {
    rot = 0;
    x = random(0, width/2);
    sz = random(5, 300);
  }

}
