var x, y, sz, rot, velRot, velx

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(0);

  x = 0;
  y = height/2;
  rot = 0;
  sz = 20;
  velRot = 10;
  velx = 10;

}


function draw() {

  push();
  translate(width/2, height/2);
  rotate (rot);
  noStroke(); 
  ellipse(x,0,sz,sz)
  pop();

  rot = rot + velRot;

  if(rot >= 360) {
    x = random(width/2);
    y = random(height/2);
    sz = random(5,50);
    velRot = random(1,6);
    rot = 0;
  }

}
