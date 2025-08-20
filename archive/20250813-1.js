var x, y, sz, rot, velRot, velx

function setup(){
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(225);

  x = 0;
  y = height/2;
  rot = 0;
  sz = 20;
  velRot = 5;
  velx = 5;
}

function draw(){


  push();
  translate(x,y);
  rotate (rot);
  line(0,-sz,0,sz);
  pop();

  x = x + velx;
  rot = rot + velRot;

  if(x >= width){
    x = 0;
    y = random(height);
    sz = random (10,60);
    velRot = random(1,10)
  }
}