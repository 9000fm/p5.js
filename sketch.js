function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0,0,255); 
  angleMode(DEGREES);
  radius = 3;
  angle = 200;
  x = 0;
  y = height/2;
}

function draw() {

  var x0 = x + sin(angle) * radius*10
  var y0 = y + cos(angle) * radius*10

  ellipse(x, y, x0, y0);
  angle += 5;

  
  x = x0;
  y = y0;
  x += 6;

  if (x > width*1.7) {
    x = -width*0.7;
    x0 = random(width);
    y0 = random(height);
    y = random(height); 
    background(0,0,255);
  }


  angle = angle + random(-3, 0);

}
 