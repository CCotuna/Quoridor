//      SCRIPT COMUN GAMEPLAY  PVP || PVC
// Aici am adaugat variabilele comune - functiile comune

document.getElementById("resetButton").addEventListener("click", resetBoard);
export let wallsUsed = [];
export let board = [];
export let canvas;
export let pawn1, pawn2;
export let distance;
export let canvasWidth;
export let canvasHeight;
export let player1, player2;
export let currentPlayer = 1;
// Math.floor(Math.random() * 2) + 1;

// function setup() {
//   canvas = createCanvas(630, 630);
//   canvasWidth = width;
//   canvasHeight = height;
//   let canvasX = (windowWidth - width) / 2;
//   let canvasY = (windowHeight - height) / 2;
//   canvas.position(canvasX, canvasY);

//   let color1 = "white";

//   for (let i = 0; i < 9; i++) {
//     for (let j = 0; j < 9; j++) {
//       let x = j * 60 + 50;
//       let y = i * 60 + 50;
//       let box = new Box(x, y, 50, color1);
//       board.push(box);
//     }
//   }

//   for (let i = 0; i < 9; i++) {
//     for (let j = 0; j < 8; j++) {
//       let x = j * 60 + 50;
//       let y = i * 60 + 50;
//       let wall1 = new Wall(x + 50, y, 10, 50, "yellow", 0, 1); //verticale
//       board.push(wall1);
//     }
//   }

//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 9; j++) {
//       let x = j * 60 + 50;
//       let y = i * 60 + 50;
//       let wall2 = new Wall(x, y + 50, 50, 10, "yellow", 0, 2); //orizontale
//       board.push(wall2);
//     }
//   }
// }

export class Player {
  constructor(name, wallCount, color) {
    this.name = name;
    this.wallCount = wallCount;
    this.color = color;
  }
}

export class Box {
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

export class Wall {
  constructor(x, y, w, h, color, isPlaced, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.originalColor = this.color;
    this.isPlaced = isPlaced;
    this.type = type; //tip 2 orizontale - tip 1 verticale
  }

  reset() {
    this.color = this.originalColor;
    this.isPlaced = 0;
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
}

export class Pawn {
  constructor(x, y, diameter, color) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = color;
    this.originalColor = null;
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

export function mouseClicked(){
    for (let item of board) {
    if (item instanceof Wall) {
      if (
        mouseX < item.x + item.w &&
        mouseX > item.x &&
        mouseY < item.y + item.h &&
        mouseY > item.y
      ) {
        if (item.type == findWall(item).type) {
          wallsUsed.push(item);
          wallsUsed.push(findWall(item));
          let isWallPlaced = wallsUsed.some(
            (pos) =>
              (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
              (pos.x === findWall(item).x &&
                pos.y === findWall(item).y &&
                pos.isPlaced === 1)
          );
          console.log(isWallPlaced);

          if (!isWallPlaced) {
            if (currentPlayer === 1 && player1.wallCount > 0) {
              if (
                findWall(item).w + findWall(item).x < canvasWidth ||
                findWall(item).h + findWall(item).y < canvasHeight
              ) {
                item.color = "purple";
                findWall(item).color = "purple";
                console.log("wall1: x:" + item.x + "y: " + item.y);
                console.log("wall1below: x: " + findWall(item).x + "y: " + findWall(item).y);
                item.isPlaced = 1;
                findWall(item).isPlaced = 1;
                player1.wallCount--;
                currentPlayer = 2;
              }
              break;
            } else if (currentPlayer === 2 && player2.wallCount > 0) {
              if (
                findWall(item).w + findWall(item).x < canvasWidth ||
                findWall(item).h + findWall(item).y < canvasHeight
              ) {
                item.color = "purple";
                findWall(item).color = "purple";
                console.log("wall1: x:" + item.x + "y: " + item.y);
                console.log("wall1below: x: " + findWall(item).x + "y: " + findWall(item).y);
                item.isPlaced = 1;
                findWall(item).isPlaced = 1;
                player2.wallCount--;
                currentPlayer = 1;
              }
              break;
            }
          } else {
            alert(
              "You can't place a wall there. It must not overlap an existing wall!"
            );
          }
        }
      }
    }
  }
}

export function findWall(findWall) {
  for (let item of board) {
    if (item instanceof Wall) {
      if (item.type == 2) {
        if (
          item.x === findWall.x + 60 &&
          item.y === findWall.y &&
          item.w + findWall.w == 100
        )
          return item;
      }

      if (item.type == 1) {
        if (
          item.x === findWall.x &&
          item.y > findWall.y &&
          item.w === findWall.w
        )
          return item;
      }
    }
  }
  return null;
}

export function resetPawns() {
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

export function resetBoard() {
  resetPawns();

  for (item of board) {
    if (item instanceof Wall) {
      item.reset();
    }
  }

  selectedWall = null;

  player1.wallCount = 10;
  player2.wallCount = 10;
  currentPlayer = 1;
  // Math.floor(Math.random() * 2) + 1; (alternanta player1 player2)
}