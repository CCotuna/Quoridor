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
  // pawn1.x -= 60;

  let pawn2 = new Pawn(315, 555, 30, "yellow");
  board.push(pawn2);
  // pawn2.y -= 60;
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
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Pawn {
  constructor(x, y, diameter, color) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = color;
    this.originalColor = this.color;
    this.isClicked = false;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }

  newColor() {
    this.color = color(random(255), random(255), random(255));
  }
}

function draw() {
  for (let item of board) {
    if(item instanceof Box || item instanceof Pawn){
      item.display();
    }
  }
}

let selectedPawn = null;
let directionChosen = false;

function mouseClicked() {
  if (!directionChosen) {
    for (let item of board) {
      if (item instanceof Pawn) {
        let distance = dist(mouseX, mouseY, item.x, item.y);

        if (distance < item.diameter / 2) {
          selectedPawn = item;
          selectedPawn.originalColor = selectedPawn.color;
          selectedPawn.color = "blue";
          directionChosen = true;
          selectedPawn.isClicked = true;
          break; // pentru a nu mai cauta elementul in intreg for-ul atunci cand am gasit deja pionul
        }
      }
    }
  } else {
    let newX = mouseX - selectedPawn.x;
    let newY = mouseY - selectedPawn.y;
    console.log("new X = " + newX);
    console.log("new Y = " + newY);

    if (abs(newX) > abs(newY)) {
      if (newX > 0 && selectedPawn.x < width - 120) {
        selectedPawn.x += 60; // daca e pozitiva mutam la dreapta
      } else if (newX < 0 && selectedPawn.x > 120) {
        selectedPawn.x -= 60; //daca e negativa mutam la stanga
      }
    } else {
      if (newY > 0 && selectedPawn.y < height - 120) {
        selectedPawn.y += 60; // daca e pozitiva mutam in jos
      } else if (newY < 0 && selectedPawn.y > 120) {
        selectedPawn.y -= 60; // daca e negativa mutam in sus
      }
    }
    //reinitializam valorile pentru a selecta o alta piesa
    selectedPawn.isClicked = false;
    selectedPawn.color = selectedPawn.originalColor;
    directionChosen = false;
    selectedPawn = null;
  }

  for(let item of board){
    if(item instanceof Wall){
      if(mouseX < item.x+ item.w &&
         mouseX > item.x &&
         mouseY < item.y + item.h &&
         mouseY > item.y)
         item.display();
    }
  }
}

function resetBoard() {
  for (let item of board) {
    if (item instanceof Box) {
      item.color = "white";
    }
  }
}

document.getElementById("playerNameDisplay").textContent =
  "Player Name: " + playerName;
