var a;
var x;
var y;
var velx;
var vely;
var sz;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  a = 20;
  x = width / 2;
  y = height / 2;
  velx = 10;
  vely = 10;
  sz = 20;
}

function draw() {


  push();
  fill(0,0,255, a*2)
  noStroke();
  rect(0, 0, width, height);
  pop();


  push();
  translate(x,y)
  strokeWeight(1);
  stroke(255)
  noFill();
  ellipse(0,0,sz)
  pop();


  x += velx;
  y += vely;

  if (x > width - sz/2) {
    velx *= -1;
  }
  if (x < sz/2) {
    velx *= -1;
  }

  if (y > height - sz/2) {
    vely *= -1;
  }

  if (y < sz/2) {
    vely *= -1;
  }


}
