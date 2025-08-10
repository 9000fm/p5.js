let possibleChars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",.<>?/`~";

let charGrid = [];
let cols, rows;
let fontSize = 24;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  textFont('monospace');
  cols = floor(width / fontSize);
  rows = floor(height / fontSize);

  // Initialize grid with random characters
  for (let y = 0; y < rows; y++) {
    charGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      charGrid[y][x] = randomChar();
    }
  }
}

function draw() {
  background(0);
  fill(0, 255, 70); // Matrix green
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Randomly change some characters
      if (random() < 0.05) {
        charGrid[y][x] = randomChar();
      }
      text(charGrid[y][x], x * fontSize, y * fontSize);
    }
  }
}

function randomChar() {
  return possibleChars.charAt(floor(random(possibleChars.length)));
}
