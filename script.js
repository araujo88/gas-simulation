const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const f1 = 0.95; // wall friction factor
const f2 = 0.5; // particle friction factor
const g = 0; // gravity
const numCircles = 500;
const maxSpeed = 10;
let t = 0; // initial time

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

class Circle {
  constructor(centerX, centerY, radius, vx, vy, ax, ay) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
  }

  draw() {
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'cyan';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'blue';
    context.stroke();
  }

  move(t) {
      this.centerX = this.centerX + this.vx + this.ax*t;
      this.centerY = this.centerY + this.vy + this.ay*t;
  }

  checkWallCollision(t) {
    if (this.centerY > canvas.height) {
        this.centerY = canvas.height
        if (this.vy == 0) {
            this.vy = this.ay*t
        }
        this.vy = (-this.vy-this.ay*t)*f1;
        this.vx = this.vx*f1;
    }
    if (this.centerY < 0) {
        this.centerY = 0
        if (this.vy == 0) {
            this.vy = this.ay*t
        }
        this.vy = (-this.vy-this.ay*t)*f1;
        this.vx = this.vx*f1;
    }

    if (this.centerX > canvas.width) {
        this.centerX = canvas.width
        if (this.vx == 0) {
            this.vx = this.ax*t
        }
        this.vx = (-this.vx-this.ax*t)*f1;
        this.vy = this.vy*f1;
    }
    if (this.centerX < 0) {
        this.centerX = 0
        if (this.vx == 0) {
            this.vx = this.ax*t
        }
        this.vx = (-this.vx-this.ax*t)*f1;
        this.vy = this.vy*f1;
    }
  }
}

function createRandomCircle() {
  const x = getRandomNumber(0, canvas.width);
  const y = getRandomNumber(0, canvas.height);
  const r = 5;
  const v0x = getRandomNumber(-maxSpeed, maxSpeed);
  const v0y = getRandomNumber(-maxSpeed, maxSpeed);

  return new Circle(x, y, r, v0x, v0y, 0, g);
}

// We manage all circles here
const circles = [];

for (let i = 0; i < numCircles; i++) {
    circles.push(createRandomCircle());
}
circles.forEach(c => c.draw());

function gameLoop() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    circles.forEach(c => c.draw());
    circles.forEach(c => c.move(t));
    circles.forEach(c => c.checkWallCollision(t));
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles.length; j++) {
            if ((Math.round(circles[i].centerX) == Math.round(circles[j].centerX)) && (Math.round(circles[i].centerY) == Math.round(circles[j].centerY)) && (i != j)) {
                circles[i].vx = -circles[i].vx*f2
                circles[i].vy = -circles[i].vy*f2
            }
        }
    }
    t++;
  }
  
  // Start the loop
  window.setInterval(gameLoop, 20);
