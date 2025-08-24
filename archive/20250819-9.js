var a = 100;


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {



  push();
  fill(0,0,255, a*8)
  noStroke();
  rect(0, 0, width, height);
  pop();


  push();
  translate(width/2,height/2)
  strokeWeight(1);
  stroke(255)
  noFill();
  ellipse(0,0,600,600)
  rotate(frameCount * 0.05);
  fill(255);
  ellipse(300,0,20,20)  
  
  translate(150,0);
  noFill();
  ellipse(0,0,300,300)  
  rotate(frameCount * 0.02);
  fill(255);
  ellipse(150,0,10,10)  
  
  translate(75,0);
  noFill();
  ellipse(0,0,150,150)
  rotate(frameCount * 0.05 );
  fill(255);
  ellipse(75,0,10,10)

  translate(37.5,0);
  noFill();
  ellipse(0,0,75,75)
  rotate(frameCount * 0.08 );
  fill(255);
  ellipse(37.5,0,10,10)

 
  pop();
}
