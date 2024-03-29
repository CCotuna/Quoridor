document.getElementById("resetButton").addEventListener("click", resetBoard);
document.getElementById("surrenderButton").addEventListener("click", surrender);

let player1Name = localStorage.getItem("player1Name");
let player2Name = localStorage.getItem("player2Name");

let wallPositions = [];
let wallsUsed = [];
let board = [];
let canvas;
let pawn1, pawn2;
let distance;
let canvasWidth;
let canvasHeight;
let player1, player2;
let currentPlayer = 1;
// Math.floor(Math.random() * 2) + 1;

function setup() {
  canvas = createCanvas(630, 630);
  canvasWidth = width;
  canvasHeight = height;
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  canvas.position(canvasX, canvasY);

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
      let wall1 = new Wall(x + 50, y, 10, 50, "midnightblue", 0, 1); //verticale
      board.push(wall1);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let wall2 = new Wall(x, y + 50, 50, 10, "midnightblue", 0, 2); //orizontale
      board.push(wall2);
    }
  }
  player1 = new Player(player1Name, 10, "black");
  player2 = new Player(player2Name, 10, "orangered");

  // step de 60 - sus jos stanga dreapta
  pawn1 = new Pawn(315, 75, 30, player1.color);
  board.push(pawn1);

  pawn2 = new Pawn(315, 555, 30, player2.color);
  board.push(pawn2);

  for (let item of board) {
    if (item instanceof Wall) {
      addWallPosition(
        item.x,
        item.y,
        item.w,
        item.h,
        item.color,
        item.isPlaced,
        item.type,
        wallsUsed
      );
    }
  }
}

function addWallPosition(x, y, w, h, color, isPlaced, type, wallPositions) {
  let position = {
    x: x,
    y: y,
    w: w,
    h: h,
    color: color,
    originalColor: color,
    isPlaced: isPlaced,
    type: type,
  };
  wallPositions.push(position);
}

class Player {
  constructor(name, wallCount, color) {
    this.name = name;
    this.wallCount = wallCount;
    this.color = color;
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

class Pawn {
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

function draw() {
  background("indigo");

  for (let item of board) {
    if (item instanceof Box || item instanceof Pawn || item instanceof Wall) {
      item.display();
    }
  }

  textSize(17);
  fill("cornsilk");
  text(`${player1.name} has ${player1.wallCount} walls.`, 10, 20);
  text(`${player2.name} has ${player2.wallCount} walls.`, 10, 40);
  currentPlayer === 1
    ? text(`Current turn: ${player1.name}`, 270, 30)
    : text(`Current turn: ${player2.name}`, 270, 30);
}

let selectedPawn = null;
let directionChosen = false;
let placeWall = true;

function mouseClicked() {
  if (!directionChosen) {
    for (let item of board) {
      if (item instanceof Pawn) {
        //distance = sqrt((mouseX - item.x)^2 + (mouseY - item.y)^2)
        distance = dist(mouseX, mouseY, item.x, item.y);

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
    for (let item of board) {
      if (item instanceof Pawn) {
        distance = dist(mouseX, mouseY, item.x, item.y);
        if (distance < item.diameter / 2) {
          selectedPawn.color = selectedPawn.originalColor;
          selectedPawn.isClicked = false;
          selectedPawn = false;
          placeWall = true;
          break;
        }
      }
    }

    let newX = mouseX - selectedPawn.x;
    let newY = mouseY - selectedPawn.y;

    let isValidStep = true;
    let isBlocked = false;
    let isWall = false;

    if (abs(newX) > abs(newY)) {
      if (newX > 0 && selectedPawn.x < width - 120) {
        //DREAPTA

        for (let wall of wallsUsed) {
          if (
            wall.x === selectedPawn.x + 25 &&
            wall.y === selectedPawn.y - 25 &&
            wall.isPlaced === 1
          ) {
            isBlocked = true;
            break;
          }
        }

        if (isBlocked) {
          alert("You can't move the pawn there!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (
              (currentPlayer === 1 && selectedPawn === pawn1) ||
              (currentPlayer === 2 && selectedPawn === pawn2)
            ) {
              // daca e pozitiva mutam la dreapta
              if (checkForPawnRight(selectedPawn)) {
                if (selectedPawn.x + 120 < 580) {
                  for (let wall of wallsUsed) {
                    if (
                      wall.x === selectedPawn.x + 25 + 60 &&
                      wall.y === selectedPawn.y - 25 &&
                      wall.isPlaced === 1
                    ) {
                      isWall = true;
                      break;
                    }
                  }
                  if (isWall === true) {
                    alert("You can't move there! There's a wall!");
                    return;
                  } else {
                    selectedPawn.x += 120;
                    isWall = false;
                  }
                } else {
                  alert("You're trying to go outside the board!");
                  return;
                }
              } else {
                selectedPawn.x += 60;
              }
              placeWall = false;
              currentPlayer = currentPlayer === 1 ? 2 : 1;
            } else {
              // It's not the pawn's turn, movement is blocked
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      } else if (newX < 0 && selectedPawn.x > 120) {
        // STANGA

        for (let wall of wallsUsed) {
          if (
            wall.x === selectedPawn.x - 35 &&
            wall.y === selectedPawn.y - 25 &&
            wall.isPlaced === 1
          ) {
            isBlocked = true;
            break;
          }
        }

        if (isBlocked) {
          alert("You can't move the pawn there!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (
              (currentPlayer === 1 && selectedPawn === pawn1) ||
              (currentPlayer === 2 && selectedPawn === pawn2)
            ) {
              //daca e negativa mutam la stanga
              if (checkForPawnLeft(selectedPawn)) {
                if (selectedPawn.x - 120 > 50) {
                  for (let wall of wallsUsed) {
                    if (
                      wall.x === selectedPawn.x - 35 - 60 &&
                      wall.y === selectedPawn.y - 25 &&
                      wall.isPlaced === 1
                    ) {
                      isWall = true;
                      break;
                    }
                  }
                  if (isWall === true) {
                    alert("You can't move there! There's a wall!");
                    return;
                  } else {
                    selectedPawn.x -= 120;
                    isWall = false;
                  }
                } else {
                  alert("You're trying to go outside the board!");
                  return;
                }
              } else {
                selectedPawn.x -= 60;
              }
              placeWall = false;
              currentPlayer = currentPlayer === 1 ? 2 : 1;
            } else {
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      }
    } else {
      if (newY > 0 && selectedPawn.y < height - 120) {
        //JOS

        for (let wall of wallsUsed) {
          if (
            wall.x === selectedPawn.x - 25 &&
            wall.y === selectedPawn.y + 25 &&
            wall.isPlaced === 1
          ) {
            isBlocked = true;
            break;
          }
        }

        if (isBlocked) {
          alert("You can't move the pawn there!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (
              (currentPlayer === 1 && selectedPawn === pawn1) ||
              (currentPlayer === 2 && selectedPawn === pawn2)
            ) {
              // daca e pozitiva mutam in jos
              if (checkForPawnDown(selectedPawn)) {
                if (selectedPawn.y + 120 < 580) {
                  for (let wall of wallsUsed) {
                    if (
                      wall.x === selectedPawn.x - 25 &&
                      wall.y === selectedPawn.y + 25 + 60 &&
                      wall.isPlaced === 1
                    ) {
                      isWall = true;
                      break;
                    }
                  }
                  if (isWall === true) {
                    alert("You can't move there! There's a wall!");
                    return;
                  } else {
                    selectedPawn.y += 120;
                    isWall = false;
                  }
                } else {
                  alert("You're trying to go outside the board!");
                  return;
                }
              } else {
                selectedPawn.y += 60;
              }
              placeWall = false;
              currentPlayer = currentPlayer === 1 ? 2 : 1;
            } else {
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      } else if (newY < 0 && selectedPawn.y > 120) {
        // SUS
        for (let wall of wallsUsed) {
          if (
            wall.x === selectedPawn.x - 25 &&
            wall.y === selectedPawn.y - 35 &&
            wall.isPlaced === 1
          ) {
            isBlocked = true;
            break;
          }
        }
        if (isBlocked) {
          alert("You can't move the pawn there!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (
              (currentPlayer === 1 && selectedPawn === pawn1) ||
              (currentPlayer === 2 && selectedPawn === pawn2)
            ) {
              // daca e negativa mutam in sus
              if (checkForPawnUp(selectedPawn)) {
                if (selectedPawn.y - 120 > 50) {
                  for (let wall of wallsUsed) {
                    if (
                      wall.x === selectedPawn.x - 25 &&
                      wall.y === selectedPawn.y - 35 - 60 &&
                      wall.isPlaced === 1
                    ) {
                      isWall = true;
                      break;
                    }
                  }
                  if (isWall === true) {
                    alert("You can't move there! There's a wall!");
                    return;
                  } else {
                    selectedPawn.y -= 120;
                    isWall = false;
                  }
                } else {
                  alert("You're trying to go outside the board!");
                  return;
                }
              } else {
                selectedPawn.y -= 60;
              }
              placeWall = false;
              currentPlayer = currentPlayer === 1 ? 2 : 1;
            } else {
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      }
    }

    //reinitializam valorile pentru a selecta o alta piesa
    selectedPawn.isClicked = false;
    selectedPawn.color = selectedPawn.originalColor;
    directionChosen = false;
    selectedPawn = null;
    placeWall = true;
  }
  if (placeWall === true) {
    for (let item of board) {
      if (item instanceof Wall) { // spre dreapta
        if (
          mouseX > item.x + item.w / 2 &&
          mouseX < item.x + item.w &&
          mouseY < item.y + item.h &&
          mouseY > item.y &&
          item.type == 2
        ) {
          if (item.type == findWall1(item).type) {
            wallsUsed.push(item);
            wallsUsed.push(findWall1(item));

            let isWallPlaced = wallsUsed.some(
              (pos) =>
                (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
                (pos.x === findWall1(item).x &&
                  pos.y === findWall1(item).y &&
                  pos.isPlaced === 1)
            );
            console.log(isWallPlaced);

            if (!isWallPlaced) {
              if (currentPlayer === 1 && player1.wallCount > 0) {
                if (
                  findWall1(item).w + findWall1(item).x < canvasWidth ||
                  findWall1(item).h + findWall1(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall1(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall1(item).x +
                      "y: " +
                      findWall1(item).y
                  );
                  item.isPlaced = 1;
                  findWall1(item).isPlaced = 1;
                  player1.wallCount--;
                  currentPlayer = 2;
                }
                break;
              } else if (currentPlayer === 2 && player2.wallCount > 0) {
                if (
                  findWall1(item).w + findWall1(item).x < canvasWidth ||
                  findWall1(item).h + findWall1(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall1(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall1(item).x +
                      "y: " +
                      findWall1(item).y
                  );
                  item.isPlaced = 1;
                  findWall1(item).isPlaced = 1;
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
          if (player1.wallCount == 0 || player2.wallCount == 0) {
            alert("You don't have walls!");
          }
        }
        else if ( // spre stanga
        mouseX < item.x + item.w / 2 &&
        mouseX > item.x &&
        mouseY < item.y + item.h &&
        mouseY > item.y &&
        item.type == 2
        ) {
          if (item.type == findWall2(item).type) {
            wallsUsed.push(item);
            wallsUsed.push(findWall2(item));

            let isWallPlaced = wallsUsed.some(
              (pos) =>
                (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
                (pos.x === findWall2(item).x &&
                  pos.y === findWall2(item).y &&
                  pos.isPlaced === 1)
            );
            console.log(isWallPlaced);

            if (!isWallPlaced) {
              if (currentPlayer === 1 && player1.wallCount > 0) {
                if (
                  findWall2(item).w + findWall2(item).x < canvasWidth ||
                  findWall2(item).h + findWall2(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall2(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall2(item).x +
                      "y: " +
                      findWall2(item).y
                  );
                  item.isPlaced = 1;
                  findWall2(item).isPlaced = 1;
                  player1.wallCount--;
                  currentPlayer = 2;
                }
                break;
              } else if (currentPlayer === 2 && player2.wallCount > 0) {
                if (
                  findWall2(item).w + findWall2(item).x < canvasWidth ||
                  findWall2(item).h + findWall2(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall2(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall2(item).x +
                      "y: " +
                      findWall2(item).y
                  );
                  item.isPlaced = 1;
                  findWall2(item).isPlaced = 1;
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
          if (player1.wallCount == 0 || player2.wallCount == 0) {
            alert("You don't have walls!");
          }
        }
        else if ( // in sus
        mouseX < item.x + item.w &&
        mouseX > item.x &&
        mouseY < item.y + item.h/2 &&
        mouseY > item.y &&
        item.type == 1
        ) {
          if (item.type == findWall3(item).type) {
            wallsUsed.push(item);
            wallsUsed.push(findWall3(item));

            let isWallPlaced = wallsUsed.some(
              (pos) =>
                (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
                (pos.x === findWall3(item).x &&
                  pos.y === findWall3(item).y &&
                  pos.isPlaced === 1)
            );
            console.log(isWallPlaced);

            if (!isWallPlaced) {
              if (currentPlayer === 1 && player1.wallCount > 0) {
                if (
                  findWall3(item).w + findWall3(item).x < canvasWidth ||
                  findWall3(item).h + findWall3(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall3(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall3(item).x +
                      "y: " +
                      findWall3(item).y
                  );
                  item.isPlaced = 1;
                  findWall3(item).isPlaced = 1;
                  player1.wallCount--;
                  currentPlayer = 2;
                }
                break;
              } else if (currentPlayer === 2 && player2.wallCount > 0) {
                if (
                  findWall3(item).w + findWall3(item).x < canvasWidth ||
                  findWall3(item).h + findWall3(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall3(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall3(item).x +
                      "y: " +
                      findWall3(item).y
                  );
                  item.isPlaced = 1;
                  findWall3(item).isPlaced = 1;
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
          if (player1.wallCount == 0 || player2.wallCount == 0) {
            alert("You don't have walls!");
          }
        }
        else if (
          mouseX > item.x &&
        mouseX < item.x + item.w &&
        mouseY > item.y + item.h/2 &&
        mouseY < item.y + item.h &&
        item.type == 1
        ) {
          if (item.type == findWall4(item).type) {
            wallsUsed.push(item);
            wallsUsed.push(findWall4(item));

            let isWallPlaced = wallsUsed.some(
              (pos) =>
                (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
                (pos.x === findWall4(item).x &&
                  pos.y === findWall4(item).y &&
                  pos.isPlaced === 1)
            );
            console.log(isWallPlaced);

            if (!isWallPlaced) {
              if (currentPlayer === 1 && player1.wallCount > 0) {
                if (
                  findWall4(item).w + findWall4(item).x < canvasWidth ||
                  findWall4(item).h + findWall4(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall4(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall4(item).x +
                      "y: " +
                      findWall4(item).y
                  );
                  item.isPlaced = 1;
                  findWall4(item).isPlaced = 1;
                  player1.wallCount--;
                  currentPlayer = 2;
                }
                break;
              } else if (currentPlayer === 2 && player2.wallCount > 0) {
                if (
                  findWall4(item).w + findWall4(item).x < canvasWidth ||
                  findWall4(item).h + findWall4(item).y < canvasHeight
                ) {
                  item.color = "chocolate";
                  findWall4(item).color = "chocolate";
                  console.log("wall1: x:" + item.x + "y: " + item.y);
                  console.log(
                    "wall1below: x: " +
                      findWall4(item).x +
                      "y: " +
                      findWall4(item).y
                  );
                  item.isPlaced = 1;
                  findWall4(item).isPlaced = 1;
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
          if (player1.wallCount == 0 || player2.wallCount == 0) {
            alert("You don't have walls!");
          }
        }
      }
    }
  }
  checkWinner(pawn1, pawn2);
}

function checkForPawnUp(pawn) {
  let isWall = false;
  for (let item of board) {
    if (item instanceof Pawn && item !== pawn) {
      if (pawn.x == item.x && pawn.y - 60 == item.y) return true;
    }
  }
  return false;
}

function checkForPawnDown(pawn) {
  for (let item of board) {
    if (item instanceof Pawn && item !== pawn) {
      if (pawn.x == item.x && pawn.y + 60 == item.y) return true;
    }
  }
  return false;
}

function checkForPawnRight(pawn) {
  for (let item of board) {
    if (item instanceof Pawn && item !== pawn) {
      if (pawn.x + 60 == item.x && pawn.y == item.y) return true;
    }
  }
  return false;
}

function checkForPawnLeft(pawn) {
  for (let item of board) {
    if (item instanceof Pawn && item !== pawn) {
      if (pawn.x - 60 == item.x && pawn.y == item.y) return true;
    }
  }
  return false;
}


function findWall1(findWall) {
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
    }
  }
  return null;
}

function findWall2(findWall) {
  for (let item of board) {
    if (item instanceof Wall) {
      if (item.type == 2) {
        if (
          item.x === findWall.x - 60 &&
          item.y === findWall.y &&
          item.w + findWall.w == 100
        )
          return item;
      }
    }
  }
  return null;
}

function findWall3(findWall) {
  for (let item of board) {
    if (item instanceof Wall) {
      if (item.type == 1) {
        if (
          item.x === findWall.x &&
          item.y < findWall.y &&
          item.w === findWall.w &&
          item.y + 60 === findWall.y
        )
          return item;
      }
    }
  }
  return null;
}

function findWall4(findWall) {
  for (let item of board) {
    if (item instanceof Wall) {
      if (item.type == 1) {
        if (
          item.x === findWall.x &&
          item.y > findWall.y &&
          item.w === findWall.w &&
          item.y - 60 === findWall.y
        )
          return item;
      }
    }
  }
  return null;
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

  for (item of board) {
    if (item instanceof Wall) {
      item.reset();
    }
  }

  selectedWall = null;

  player1.wallCount = 10;
  player2.wallCount = 10;
  currentPlayer = 1;
}

document.getElementById("player1NameDisplay").textContent =
  "First player's name: " + player1Name;
document.getElementById("player2NameDisplay").textContent =
  "Second player's name: " + player2Name;

function checkWinner(pawn1, pawn2) {
  if (pawn1.y == 555) {
    gameover(pawn1);
  } else if (pawn2.y == 75) {
    gameover(pawn2);
  }
}

function gameover(winningPawn) {
  if (winningPawn.color == player1.color) {
    pawnName = player1.name;
  } else if (winningPawn.color == player2.color) {
    pawnName = player2.name;
  }

  const message = pawnName + " has won the game!";
  alert(message);

  localStorage.setItem("winner", pawnName);
  window.location.href = "winner.html";
}

function surrender() {
  window.location.href = "loser.html";
}
