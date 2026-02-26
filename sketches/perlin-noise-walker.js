var x, y, t

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(220) 
    x = 0
    t = 0
}

function draw() {

    var y = random(height)

    // ellipse(random(width), random(0, height), 10, 10)

    var y0 = noise(t)*500
    ellipse(x, y0, 20, 20)

    t = t + 0.01;
    x = x + 1;

    if (x >= width) {
        x = 0
    }
}
