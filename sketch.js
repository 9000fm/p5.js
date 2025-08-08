// Smooth-moving sphere in WEBGL
// Naming: 
// - pos = current position; target = target position we ease toward
// - t = time driver for noise; ease = easing factor for smooth motion

let pos;           // current position of the sphere
let target;        // target position the sphere will drift toward
let t = 0;         // time for noise sampling
const ease = 0.05; // how quickly we approach the target (smaller = smoother)
const range = 220; // motion range in each axis

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pos = createVector(0, 0, 0);
  target = createVector(0, 0, 0);
  noStroke();
}

function draw() {
  background(10);

  // Time step: scale by frame rate so motion is stable
  t += 0.002 * (deltaTime / 16.6667);

  // Noise-driven target position mapped to [-range, range]
  target.x = map(noise(t * 1.00), 0, 1, -range, range);
  target.y = map(noise(t * 1.10 + 100), 0, 1, -range, range);
  target.z = map(noise(t * 0.90 + 200), 0, 1, -range, range);

  // Smoothly move current position toward target
  pos.lerp(target, ease);

  // Simple camera drift for depth feel
  const camZ = (height / 2) / tan(PI / 6);
  camera(
    0, 0, camZ + 150 * sin(t * 0.8), // eye
    0, 0, 0,                          // center
    0, 1, 0                           // up
  );

  // Lights: ambient + directional that slowly orbits
  ambientLight(60);
  const lx = 1 * cos(t * 0.7);
  const ly = 0.4;
  const lz = 1 * sin(t * 0.7);
  directionalLight(200, 200, 200, lx, ly, lz);

  // Material with subtle hue drift
  const hue = map(noise(t + 300), 0, 1, 0, 255);
  ambientMaterial(hue, 160, 255 - hue);

  push();
  translate(pos.x, pos.y, pos.z);

  // Mild rotation for highlights
  rotateY(t * 1.2);
  rotateX(t * 0.9);

  // Sphere size breathes slowly
  const r = 70 + 15 * sin(t * 1.3);
  sphere(r, 64, 48); // higher segments => smoother sphere
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('smooth-sphere', 'png');
  }
}

