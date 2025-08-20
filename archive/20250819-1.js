var x, y, sz, rot, velRot

const TRAIL_ALPHA = 70;


function setup() {

  createCanvas(500, 500);
  angleMode(DEGREES);
  background(255);

  x = 0;
  y = 0;
  rot = 1;
  sz = 60;
  velRot = 1;

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

  rot = rot + velRot;

  if(rot >= 360) {
    rot = 0;
    x = random(0, width/2);
    sz = random(5, 60);
  }

}
