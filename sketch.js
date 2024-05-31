let initialDotNumber = 60; // Initial dot number
let dotNumberDecrement = 5; // Decrement of dots
let wheels = []; // Array to store the wheels
let circleRadius = 75;

let circles = []; 
let xSpeeds = [];
let ySpeeds = [];
let wheelsGraphics; // Graphics to store the picture of wheels

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomSeed(1); 
  wheelsGraphics = createGraphics(windowWidth, windowHeight);
  initializeWheels(); 
  drawWheels(); 
  noLoop(); // Draw only once
}

function draw() {
  clear(); // Clear the cnavas
  image(wheelsGraphics, 0, 0); // Draw still wheels

  if (circles.length > 0) {
    drawBouncingBalls(); 
  }

  drawEyes(); 
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
    this.drawLines = random(1) > 0.5; // Whether to draw lines
    this.drawArcs = random(1) > 0.8; // Whethe rto draw arcs
    this.numDotRings = 5; // Number of dot rings
    this.dotNumber = [];

    // Dot number of each ring
    for (let i = 0; i < this.numDotRings; i++) {
      let currentDotNumber = initialDotNumber - i * dotNumberDecrement;
      this.dotNumber.push(currentDotNumber);
    }

    this.ringRadius = this.radius;
    this.col = color(random(200, 255), random(150, 200), random(150, 200)); 
    this.dotColor = color(random(255), random(255), random(255)); 
  }

  display(g) {
    // Draw outer circle
    g.fill(this.col);
    g.noStroke();
    g.ellipse(this.x, this.y, this.ringRadius * 2);

    // Using if-else to draw two types of wheels
    if (this.drawLines) {
      let numLines = 70; 
      g.stroke(random(255), random(255), random(255));
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

    // Draw inner cirlces
    let numInnerCircles = 5;
    for (let i = 0; i < numInnerCircles; i++) {
      let innerRadius = this.radius * 0.5 * (1 - i * 0.2);
      g.fill(color(random(200, 255), random(150, 200), random(150, 200)));
      g.stroke(color(random(200, 255), random(150, 200), random(150, 200)));
      g.strokeWeight(1);
      g.ellipse(this.x, this.y, innerRadius * 1.8);
    }

    // Draw pink arcs
    if (this.drawArcs) {
      g.stroke(255, 105, 180); // 粉色
      g.strokeWeight(4);
      g.noFill();
      let arcRadius = this.radius * 2;
      let startAngle = PI / 2;
      let endAngle = PI;
      g.arc(this.x, this.y - this.radius, arcRadius, arcRadius, startAngle, endAngle);
    }
  }

  drawEye(g) {
    let eyeSize = this.radius * 0.6;
    let pupilSize = eyeSize * 0.4;
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;
    let angle = atan2(dy, dx);
    let pupilX = this.x + cos(angle) * (eyeSize - pupilSize) * 0.3;
    let pupilY = this.y + sin(angle) * (eyeSize - pupilSize) * 0.3;

    // Draw eye white
    g.fill(255);
    g.noStroke();
    g.ellipse(this.x, this.y, eyeSize);

    // Draw pupils
    g.fill(0);
    g.ellipse(pupilX, pupilY, pupilSize);
  }
}

function initializeWheels() {
  wheels = []; 
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
  wheelsGraphics.background(195, 195, 195); 
  wheelsGraphics.scale(1.8); 
  wheelsGraphics.translate(width / 2, height / 2);
  wheelsGraphics.rotate(PI / 12);
  wheelsGraphics.translate(-width / 2 - 80, -height / 2 - 80);

  for (let wheel of wheels) {
    wheel.display(wheelsGraphics); 
  }
}

function drawEyes() {
  for (let wheel of wheels) {
    wheel.drawEye(wheelsGraphics); 
  }
}

function initializeCircles(num, x, y) {
  for (let i = 0; i < num; i++) {
    let circle = {
      x: x,
      y: y,
      radius: random(10, 20),
      r: random(255),
      g: random(255),
      b: random(255)
    };
    circles.push(circle);
    xSpeeds.push(random(-3, 3));
    ySpeeds.push(random(1, 5)); // Effect of gravity simulation
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
      ySpeeds[i] = -ySpeed * 0.9; // Simulation of energy loss
      circles[i].y = height - circles[i].radius; 
    } else {
      ySpeeds[i] += 0.2; // Gravity simulation
    }

    fill(circles[i].r, circles[i].g, circles[i].b);
    noStroke();
    ellipse(circles[i].x, circles[i].y, circles[i].radius * 2);
  }
}

function mouseClicked() {
  let numNewCircles = random(5, 20); 
  initializeCircles(numNewCircles, mouseX, mouseY); 
  loop(); 
}