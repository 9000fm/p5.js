function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0,0,255);


  push();
  translate(width/2,height/2)
  strokeWeight(1);
  stroke(255)
  noFill();
  ellipse(0,0,300,300)
  
  rotate(frameCount * 0.1);
  fill(255);
  ellipse(150,0,10,10)  
  
  translate(150,0);
  noFill();
  ellipse(0,0,120,120)  
  rotate(frameCount * 0.05);
  fill(255);
  ellipse(60,0,10,10)  
  
  translate(60,0);
  noFill();
  ellipse(0,0,40,40)
  rotate(frameCount * 0.025);
  fill(255);
  ellipse(20,0,10,10)
  translate(20,0);
  noFill();
  ellipse(0,0,10,10)
  rotate(frameCount * 0.0125);


  pop();
}
