var x, y, sz, rot, velRot;

var TRAIL_ALPHA = 33; // 0-255, lower is longer trail

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);

  x = 0;
  y = 0;
  rot = 20;
  sz = 100;
  velRot = 21; // degrees per frame
}

function draw() {
  // Faint trail
  push();
  noStroke();
  fill(255, TRAIL_ALPHA);
  rect(0, 0, width, height);
  pop();

  // This moves x left each frame, as written.
  if (x < width) {
    x -= 5;
  }

  // First object. Line that orbits center, then counter-rotates.
  push();
  translate(width / 2, height / 2); // go to center
  rotate(rot);                      // outer spin
  translate(x, y);                  // offset inside rotated space
  rotate(-rot * 5);                 // inner counter-spin
  stroke(0);
  strokeWeight(2);
  line(0, -sz, 0, sz);
  pop();

  // Second object. Rect with a different spin.
  push();
  translate(width / 2, height / 2);
  rotate(rot * 2);
  translate(x, y);
  rotate(rot);
  stroke(0);
  strokeWeight(1.5);
  // Use rect at 0,0 because we already translated by x,y above.
  rect(0, 0, sz/2, sz * 12);
  pop();

  // Advance global rotation
  rot = rot + velRot;

  
  
  
  
  // Wrap and randomize some params each full turn
  if (rot >= 360) {
    rot = 0;
    x = random(0, width);
    sz = random(5, 400);
  }
}
  
// Keybinds. X speeds uC. Z sloZs down. Clampedc
function keyPressed() {
  if (key === 'c' || key === 'C') {
    velRot = 180;
    velRot*-1;
    sz += 20;
  }
  if (key === 'z' || key === 'Z') {
    velRot = 0.3;
    rot = 0;
  }
  if (key === 'x' || key === 'X') {
    velRot = 90;
  }
  if (key === 'a' || key === 'A') {
    TRAIL_ALPHA += 70;
  }
  if (key === 's' || key === 'S') {
    TRAIL_ALPHA -= 70;
  }
  console.log(velRot);
}
