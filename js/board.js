let board = [];
let canvas;
document.getElementById("resetButton").addEventListener("click", resetBoard);
let playerName = localStorage.getItem("playerName");

function setup() {
  canvas = createCanvas(630, 630);
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  canvas.position(canvasX, canvasY);

  background("darkred");

  let color1 = "white";

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let box = new Box(x, y, 50, color1);
      board.push(box);
    }
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 8; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let wall1 = new Wall(x + 50, y, 10, 50, "blue");
      board.push(wall1);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let wall2 = new Wall(x, y + 50, 50, 10, "green");
      board.push(wall2);
    }
  }
  // step de 60 - sus jos stanga dreapta
  let pawn1 = new Pawn(315, 75, 30, "yellow");
  board.push(pawn1);
  pawn1.x -= 60;

  let pawn2 = new Pawn(315, 555, 30, "yellow");
  board.push(pawn2);
  pawn2.y -= 60;
}

class Box {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  display() {
    fill(this.color);
    square(this.x, this.y, this.size);
  }

  newColor() {
    this.color = color(random(255), random(255), random(255));
  }
}

class Wall {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.originalColor = color;
    this.isMouseOver = false;
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
  
}

class Pawn {
  constructor(x, y, diameter, color){
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = color;
    this.isClicked = false;
  }

  display(){
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }

}

function draw() {
  for (let box of board) {
    box.display();
  }
}

function mouseClicked() {
  for (let item of board) {
    if(item instanceof Box){
      if (
      mouseX > item.x &&
      mouseX < item.x + item.size &&
      mouseY > item.y &&
      mouseY < item.y + item.size
    )
      item.newColor();
    }
  }
}

function resetBoard() {
  for (let item of board) {
    if(item instanceof Box){
      item.color = "white";
    }
  }
}

document.getElementById("playerNameDisplay").textContent =
  "Player Name: " + playerName;
