document.getElementById("resetButton").addEventListener("click", resetBoard);
let playerName = localStorage.getItem("playerName");
let board = [];
let canvas;
let pawn1, pawn2;
let distance;

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
  pawn1 = new Pawn(315, 75, 30, "yellow");
  board.push(pawn1);
  // pawn1.x -= 60;

  pawn2 = new Pawn(315, 555, 30, "yellow");
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
    this.isPlaced = 0;
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
    if (item instanceof Box || item instanceof Pawn) {
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
        distance = dist(mouseX, mouseY, item.x, item.y);

        if (distance < item.diameter / 2) {
          selectedPawn = item;
          selectedPawn.originalColor = selectedPawn.color;
          selectedPawn.color = "blue";
          directionChosen = true;
          selectedPawn.isClicked = true;
          console.log(selectedPawn.x)
          console.log(selectedPawn.y)
          break; // pentru a nu mai cauta elementul in intreg for-ul atunci cand am gasit deja pionul
        }
      }
    }
  } else {
    for (let item of board) {
      if (item instanceof Pawn) {
        distance = dist(mouseX, mouseY, item.x, item.y);
        if(distance < item.diameter / 2){
          selectedPawn.color = selectedPawn.originalColor;
          selectedPawn.isClicked = false;
          selectedPawn = false;
          break;
        }
      }
    }

  
    let newX = mouseX - selectedPawn.x;
    let newY = mouseY - selectedPawn.y;
    console.log("new X = " + newX);
    console.log("new Y = " + newY);

    let isValidStep = true;
    if (abs(newX) > abs(newY)) {
      if (newX > 0 && selectedPawn.x < width - 120) { //DREAPTA
        for (let item of board) {
          if (
            item instanceof Wall &&
            item.x >= selectedPawn.x -60  &&
            item.y == selectedPawn.y -25 &&
            item.isPlaced == true
          ) {
            console.log("\n\nselctedPawn.diameter = " + selectedPawn.diameter/2)
            console.log("item.x= " +item.x + " >= " + int(selectedPawn.x + selectedPawn.diameter / 2 - 5 ));
            console.log("item.y= " + item.y + " == " + int(selectedPawn.y - 25));
            console.log("itemIsPlaced == " + item.isPlaced);
            console.log("ISINVALIDSTEP ==== " + isValidStep);
            isValidStep = false;
            break;
          }
          else{
            if(item.isPlaced == 1){
            console.log("\n\nselctedPawn.diameter = " + selectedPawn.diameter/2)
            console.log("item.x= " +item.x + " >= " + int(selectedPawn.x + selectedPawn.diameter / 2 - 5 ));
            console.log("item.y= " + item.y + " == " + int(selectedPawn.y -25));
            console.log("ITEMIsPlaced == " + item.isPlaced);
            }
          }
        }

        if (isValidStep) {
          selectedPawn.x += 60; // daca e pozitiva mutam la dreapta
        }
      } else if (newX < 0 && selectedPawn.x > 120) { // STANGA
        for (let item of board) {
          if (
            item instanceof Wall &&
            item.x === selectedPawn.x - 60 &&
            item.y === selectedPawn.y &&
            item.isPlaced == true
          ) {
            isValidStep = false;
            break;
          }
        }

        if (isValidStep) selectedPawn.x -= 60; //daca e negativa mutam la stanga
      }
    } else {
      if (newY > 0 && selectedPawn.y < height - 120) { //JOS
        for (let item of board) {
          if (
            item instanceof Wall &&
            item.x === selectedPawn.x &&
            item.y === selectedPawn.y + 60 &&
            item.isPlaced == true
          ) {
            isValidStep = false;
            break;
          }
        }
        if (isValidStep) selectedPawn.y += 60; // daca e pozitiva mutam in jos
      } else if (newY < 0 && selectedPawn.y > 120) {  //SUS
        for (let item of board) {
          if (
            item instanceof Wall &&
            item.x === selectedPawn.x &&
            item.y === selectedPawn.y - 60 &&
            item.isPlaced == true
          ) {
            isValidStep = false;
            break;
          }
        }
        if (isValidStep) selectedPawn.y -= 60; // daca e negativa mutam in sus
      }
    }
    //reinitializam valorile pentru a selecta o alta piesa
    selectedPawn.isClicked = false;
    selectedPawn.color = selectedPawn.originalColor;
    directionChosen = false;
    selectedPawn = null;
  }

  
  for (let item of board) {
    if (item instanceof Wall) {
      if (
        mouseX < item.x + item.w &&
        mouseX > item.x &&
        mouseY < item.y + item.h &&
        mouseY > item.y
      ) {
        item.display();
        item.isPlaced = true;
        console.log("x wall: " + item.x);
        console.log("y wall: " + item.y);
        console.log("isplaced = " + item.isPlaced);
      }else{
        item.isPlaced = false;
      }
    }
  }
}

function resetPawns() {
  for (let item of board) {
    if (item instanceof Pawn) {
      if (item === pawn1) {
        item.x = 315;
        item.y = 75;
      } else if (item === pawn2) {
        item.x = 315;
        item.y = 555;
      }
    }
  }
}

function resetBoard() {
  resetPawns();

  for (let item of board) {
    if (item instanceof Wall) {
      item.isPlaced = 0;
    }
  }
}

document.getElementById("playerNameDisplay").textContent =
  "Player Name: " + playerName;
