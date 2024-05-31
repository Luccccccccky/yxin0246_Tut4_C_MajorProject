let initialDotNumber = 60; // Initial dot number
let dotNumberDecrement = 5; // Decrement of dots
let wheels = []; // Array to store the wheels
let circleRadius = 75;

//Arrays to store bouncing balls
let circles = []; 
let xSpeeds = [];
let ySpeeds = [];

let wheelsGraphics; // Store the picture of wheels

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  randomSeed(1); // Set random seed for consistency
  wheelsGraphics = createGraphics(windowWidth, windowHeight);
  initializeWheels();
  drawWheels();
  noLoop(); // Only draw once
}

function draw() {
  clear(); 
  image(wheelsGraphics, 0, 0); // Draw still wheels

  if (circles.length > 0) {
    drawBouncingBalls(); 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  wheelsGraphics = createGraphics(windowWidth, windowHeight);
  randomSeed(1); 
  initializeWheels(); 
  drawWheels(); 
}

class Wheel {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.drawLines = random(1) > 0.5; // Whether draw lines
    this.drawArcs = random(1) > 0.8; // Whether draw arcs
    this.numDotRings = 5; // The number of dot rings
    this.dotNumber = [];

    // Dot number of each ring
    for (let i = 0; i < this.numDotRings; i++) {
      let currentDotNumber = initialDotNumber - i * dotNumberDecrement;
      this.dotNumber.push(currentDotNumber);
    }

    this.ringRadius = this.radius;
    this.col = color(50, random(0, 30), 95); 
    this.dotColor = color(random(360), 50, 60); 
  }

  display(g) {
    // Draw outer circle
    g.fill(this.col);
    g.noStroke();
    g.ellipse(this.x, this.y, this.ringRadius * 2);

    // Using if-else to draw two types of wheels
    if (this.drawLines) {
      let numLines = 70; 
      g.stroke(random(360), 50, 60);
      g.strokeWeight(1.5);
      g.noFill();

      g.beginShape();
      for (let k = 0; k < numLines; k++) {
        let angle = TWO_PI / numLines * k;
        let startX = this.x + cos(angle) * this.radius * 0.7;
        let startY = this.y + sin(angle) * this.radius * 0.7;
        let endX = this.x + cos(angle) * this.radius * 0.94;
        let endY = this.y + sin(angle) * this.radius * 0.94;
        g.vertex(startX, startY);
        g.vertex(endX, endY);
      }
      g.endShape(CLOSE);

      for (let i = 0; i < 3; i++) {
        let dotRingRadius = this.radius * (1 - i * 0.12);
        let numDots = this.dotNumber[i];
        for (let j = 0; j < numDots; j++) {
          let angle = j * TWO_PI / numDots;
          let dotX = this.x + cos(angle) * dotRingRadius * 0.63;
          let dotY = this.y + sin(angle) * dotRingRadius * 0.63;
          g.fill(this.dotColor);
          g.noStroke();
          g.ellipse(dotX, dotY, 5);
        }
      }
    } else {
      for (let i = 0; i < this.numDotRings; i++) {
        let dotRingRadius = this.radius * (1 - i * 0.1);
        let numDots = this.dotNumber[i];
        for (let j = 0; j < numDots; j++) {
          let angle = j * TWO_PI / numDots;
          let dotX = this.x + cos(angle) * dotRingRadius * 0.95;
          let dotY = this.y + sin(angle) * dotRingRadius * 0.95;
          g.fill(this.dotColor);
          g.noStroke();
          g.ellipse(dotX, dotY, 6);
        }
      }
    }

    // Draw inner cirles
    let numInnerCircles = 5;
    for (let i = 0; i < numInnerCircles; i++) {
      let innerRadius = this.radius * 0.5 * (1 - i * 0.2);
      g.fill(color(random(330), 50, random(30, 90)));
      g.stroke(color(random(330), 50, random(30, 90)));
      g.strokeWeight(1);
      g.ellipse(this.x, this.y, innerRadius * 1.8);
    }

    // Draw pink arcs
    if (this.drawArcs) {
      g.stroke(348, 63, 90);
      g.strokeWeight(4);
      g.noFill();
      let arcRadius = this.radius * 2;
      let startAngle = PI / 2;
      let endAngle = PI;
      g.arc(this.x, this.y - this.radius, arcRadius, arcRadius, startAngle, endAngle);
    }
  }
}

function initializeWheels() {
  wheels = []; //Clear wheels
  let spacing = 160;
  let rows = height / spacing;
  let cols = width / spacing;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      let x = j * spacing + spacing / 2;
      let y = i * spacing + spacing / 2;
      wheels.push(new Wheel(x, y, circleRadius)); 
    }
  }
}

function drawWheels() {
  wheelsGraphics.background(195, 99, 40); 
  wheelsGraphics.scale(1.8); 
  wheelsGraphics.translate(width / 2, height / 2);
  wheelsGraphics.rotate(PI / 12);
  wheelsGraphics.translate(-width / 2 - 80, -height / 2 - 80);

  for (let wheel of wheels) {
    wheel.display(wheelsGraphics); 
  }
}

function initializeCircles(num, x, y) {
  for (let i = 0; i < num; i++) {
    let circle = {
      x: x,
      y: y,
      radius: random(10, 20),
      r: random(360),
      g: 80,
      b: 100
    };
    circles.push(circle);
    xSpeeds.push(random(-3, 3));
    ySpeeds.push(random(1, 5)); // Effects to imitate the Gravity
  }
}

function drawBouncingBalls() {
  for (let i = 0; i < circles.length; i++) {
    let xSpeed = xSpeeds[i];
    let ySpeed = ySpeeds[i];

    circles[i].x += xSpeed;
    circles[i].y += ySpeed;

    if (circles[i].x + circles[i].radius >= width || circles[i].x - circles[i].radius <= 0) {
      xSpeeds[i] = -xSpeed;
    }
    if (circles[i].y + circles[i].radius >= height) {
      ySpeeds[i] = -ySpeed * 0.9; // Simulate the energy loss
      circles[i].y = height - circles[i].radius; 
    } else {
      ySpeeds[i] += 0.2; // Simulate gravity
    }

    fill(circles[i].r, circles[i].g, circles[i].b);
    circle(circles[i].x, circles[i].y, circles[i].radius * 2);
  }
}

function mouseClicked() {
  let numNewCircles = random(5, 20); 
  initializeCircles(numNewCircles, mouseX, mouseY); 
  loop(); 
}