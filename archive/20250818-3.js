var x, y, sz, rot, velRot

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);
  frameRate(30);

  x = 10;
  y = height/2;
  rot = 0;
  sz = 60;
  velRot = 2;

}


function draw() {

  push();
  translate(width/2, height/2);
  rotate (rot);
  fill(0);
  translate(x, y)
  rotate(-rot*4)
  line(0,-sz,0,sz)
  pop();

  rot = rot + velRot;

  if(rot >= 360) {
    rot = 0;
    x = random(0, height/2);
    sz = random(4, 88);
    velRot = random(1, 7);
    y = random(-height/2, height/2);
  }

}
