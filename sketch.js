let initialDotNumber = 60; // Initial number of dots
let dotNumberDecrement = 5; // Dot number decrement
let wheels = []; // Array to store all wheels
let circleRadius = 75;

let circles = []; 
let xSpeeds = [];
let ySpeeds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  randomSeed(1); // Set random seed for consistency
  initializeWheels(); // Initialize wheels
  noLoop(); // Only draw once
}

function draw() {
  background(195, 99, 40);
  scale(1.8);
  translate(width / 2, height / 2);
  rotate(PI / 12);
  translate(-width / 2 - 80, -height / 2 - 80);

  for (let wheel of wheels) {
    wheel.display(); // Call display() method for each wheel
  }
  
  drawBouncingBalls(); // Draw bouncing balls
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  randomSeed(1); // Set random seed again for consistency
  initializeWheels(); // Reinitialize wheels
  redraw(); // Redraw on window resize
}

class Wheel {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.drawLines = random(1) > 0.5; // Draw lines?
    this.drawArcs = random(1) > 0.8; // Draw arcs?
    this.numDotRings = 5; // Number of dot rings
    this.dotNumber = [];

    // Number of dots for each ring
    for (let i = 0; i < this.numDotRings; i++) {
      let currentDotNumber = initialDotNumber - i * dotNumberDecrement;
      this.dotNumber.push(currentDotNumber);
    }

    this.ringRadius = this.radius;
    this.col = color(50, random(0, 30), 95); // Color
    this.dotColor = color(random(360), 50, 60); // Dot color
  }

  display() {
    // Draw outer circle
    fill(this.col);
    noStroke();
    ellipse(this.x, this.y, this.ringRadius * 2);

    // Draw two types of wheels
    if (this.drawLines) {
      let numLines = 70; // Number of lines
      stroke(random(360), 50, 60);
      strokeWeight(1.5);
      noFill();

      beginShape();
      for (let k = 0; k < numLines; k++) {
        let angle = TWO_PI / numLines * k;
        let startX = this.x + cos(angle) * this.radius * 0.7;
        let startY = this.y + sin(angle) * this.radius * 0.7;
        let endX = this.x + cos(angle) * this.radius * 0.94;
        let endY = this.y + sin(angle) * this.radius * 0.94;
        vertex(startX, startY);
        vertex(endX, endY);
      }
      endShape(CLOSE);

      for (let i = 0; i < 3; i++) {
        let dotRingRadius = this.radius * (1 - i * 0.12);
        let numDots = this.dotNumber[i];
        for (let j = 0; j < numDots; j++) {
          let angle = j * TWO_PI / numDots;
          let dotX = this.x + cos(angle) * dotRingRadius * 0.63;
          let dotY = this.y + sin(angle) * dotRingRadius * 0.63;
          fill(this.dotColor);
          noStroke();
          ellipse(dotX, dotY, 5);
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
          fill(this.dotColor);
          noStroke();
          ellipse(dotX, dotY, 6);
        }
      }
    }

    // Draw center circles
    let numInnerCircles = 5;
    for (let i = 0; i < numInnerCircles; i++) {
      let innerRadius = this.radius * 0.5 * (1 - i * 0.2);
      fill(color(random(330), 50, random(30, 90)));
      stroke(color(random(330), 50, random(30, 90)));
      strokeWeight(1);
      ellipse(this.x, this.y, innerRadius * 1.8);
    }

    // Draw pink arcs
    if (this.drawArcs) {
      stroke(348, 63, 90);
      strokeWeight(4);
      noFill();
      let arcRadius = this.radius * 2;
      let startAngle = PI / 2;
      let endAngle = PI;
      arc(this.x, this.y - this.radius, arcRadius, arcRadius, startAngle, endAngle);
    }
  }
}

function initializeWheels() {
  wheels = []; // Clear wheel array
  let spacing = 160;
  let rows = height / spacing;
  let cols = width / spacing;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      let x = j * spacing + spacing / 2;
      let y = i * spacing + spacing / 2;
      wheels.push(new Wheel(x, y, circleRadius)); // Create new Wheel object and push to array
    }
  }
}

function initializeCircles(num) {
  for (let i = 0; i < num; i++) {
    let circle = {
      x: random(width),
      y: random(height),
      radius: random(10, 20),
      r: random(360),
      g: 80,
      b: 100
    };
    circles.push(circle);
    xSpeeds.push(random(-3, 3));
    ySpeeds.push(random(1, 5)); // Gravity-like effect
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
      ySpeeds[i] = -ySpeed * 0.9; // Simulate energy loss on bounce
      circles[i].y = height - circles[i].radius; // Prevent getting stuck at the bottom
    } else {
      ySpeeds[i] += 0.2; // Simulate gravity
    }

    fill(circles[i].r, circles[i].g, circles[i].b);
    circle(circles[i].x, circles[i].y, circles[i].radius * 2);
  }
}

function mouseClicked() {
  let numNewCircles = random(5, 20); // Random number of new circles
  initializeCircles(numNewCircles); // Initialize new circles
  loop(); // Redraw to animate balls
}