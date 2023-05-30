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

  mouseOver() {
    this.color = "yellow";
    this.isMouseOver = true;
  }

  mouseOut() {
    this.color = this.originalColor;
    this.isMouseOver = false;
  }
}

function draw() {
  for (let box of board) {
    box.display();
  }
}

function mouseMoved() {
  let hoveredWall = null;

  for (let i = 0; i < board.length; i++) {
    let item = board[i];
    if (
      item instanceof Wall &&
      mouseX > item.x &&
      mouseX < item.x + item.w &&
      mouseY > item.y &&
      mouseY < item.y + item.h
    ) {
      hoveredWall = item;
    }

    if (item instanceof Wall) {
      if (
        item === hoveredWall ||
        i === board.indexOf(findWallBelow(hoveredWall)) ||
        i === board.indexOf(findWallBeside(hoveredWall))
      ) {
        item.mouseOver();
      } else {
        item.mouseOut();
      }
    }
  }
}

function findWallBelow(wall) {
  const index = board.indexOf(wall);
  const numColumns = 8;

  const column = index % numColumns;
  const row = Math.floor(index / numColumns);

  const wallBelowIndex = index + numColumns;
  if (wallBelowIndex >= board.length) {
    return null;
  }

  return board[wallBelowIndex];
}

function findWallBeside(wall) {
    const index = board.indexOf(wall);
    const rowLength = 8; // Number of walls in each row
  
    const row = Math.floor(index / rowLength);
    const col = index % rowLength;
  
    if (col === 7) return null; // If wall is in the last column, no wall beside
  
    return board[index + 1];
  }


function mouseClicked() {
  for (let box of board) {
    if (
      mouseX > box.x &&
      mouseX < box.x + box.size &&
      mouseY > box.y &&
      mouseY < box.y + box.size
    )
      box.newColor();
  }
}

function resetBoard() {
  for (let box of board) {
    box.color = "white";
  }
}

document.getElementById("playerNameDisplay").textContent =
  "Player Name: " + playerName;
