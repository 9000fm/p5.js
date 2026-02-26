var x, y, sz, rot, velRot

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);

  x = 10;
  y = height/2;
  rot = 0;
  sz = 60;
  velRot = 5;

}


function draw() {

  push();
  translate(width/2, height/2);
  rotate (rot);
  fill(0);
  translate(x, 0)
  rotate(-rot*5)
  line(0,-30,0,30)
  pop();

  rot = rot + velRot;

  if(rot >= 360) {
    rot = 0;
    x = random(0, width/2);
  }

}
