var x, y, t, angle, circleSize, phase

function setup() {
    createCanvas(windowWidth, windowHeight)
    x = 0
    t = 0
    sz = width
    angle = 0
    circleSize = 0
    phase = 0
}

function draw() {
    background(0,0,255) 

    push()
    noStroke()
    translate(width/2, height/2)
    
    // Calculate the maximum size needed to cover the window
    let maxSize = sqrt(width * width + height * height)
    
    // Create growing circle effect with perfect loop
    let cycleFrame = frameCount % 240  // 240 frames for complete cycle (120 white + 120 blue)
    
    if (cycleFrame < 120) {
        background(0,0,255) 

        // White circle growing (frames 0-119)
        fill(255)
        circleSize = map(cycleFrame, 0, 120, 0, maxSize)
        ellipse(0, 0, circleSize, circleSize)
    } else {
        background(255) 

        // Electric blue circle growing (frames 120-239)
        fill(0, 0, 255)
        circleSize = map(cycleFrame - 120, 0, 120, 0, maxSize)
        ellipse(0, 0, circleSize, circleSize)
    }
    
    pop()
}
