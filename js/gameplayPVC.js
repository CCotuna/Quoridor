document.getElementById("resetButton").addEventListener("click", resetBoard);
let playerName = localStorage.getItem("playerName");

let wallPositions = [];
let wallsUsed = [];
let board = [];
let canvas;
let pawn1, pawn2;
let distance;
let canvasWidth;
let canvasHeight;
let player1, player2;
let currentPlayer = 2;
let isOverWall = false;

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
      let wall1 = new Wall(x + 50, y, 10, 50, "black", 0, 1); //verticale
      board.push(wall1);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let wall2 = new Wall(x, y + 50, 50, 10, "black", 0, 2); //orizontale
      board.push(wall2);
    }
  }
  player1 = new Player("Computer", 10, "rgb(220, 20, 60)");
  player2 = new Player(playerName, 10, "rgb(0, 0, 0)");
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

  mouseOver(){
    fill("gray");
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
  background("darkred");
  for (let item of board) {
    if (item instanceof Box || item instanceof Pawn || item instanceof Wall) {
      item.display();
    }
  }

  textSize(14);
  fill("yellow");
  text(`Number of walls: ${player1.name} [${player1.wallCount}]`, 10, 15);
  text(`Number of walls: ${player2.name} [${player2.wallCount}]`, 10, 40);
  currentPlayer === 1
    ? text(`Current turn: ${player1.name}`, 300, 30)
    : text(`Current turn: ${player2.name}`, 300, 30);

  HoveringEffect();
}


let selectedPawn = null;
let directionChosen = false;

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
          break;
        }
      }
    }

    let newX = mouseX - selectedPawn.x;
    let newY = mouseY - selectedPawn.y;

    let isValidStep = true;
    let isBlocked = false;

    if (abs(newX) > abs(newY)) {
      if (newX > 0 && selectedPawn.x < width - 120) {
        //DREAPTA

        for (let wall of wallPositions) {
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
          alert("You can't move the pawn there! There is a wall!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (currentPlayer === 2 && selectedPawn === pawn2) {
              selectedPawn.x += 60; // daca e pozitiva mutam la dreapta
              currentPlayer = currentPlayer === 2 ? 1 : 2;
            } else {
              // It's not the pawn's turn, movement is blocked
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      } else if (newX < 0 && selectedPawn.x > 120) {
        // STANGA
        for (let wall of wallPositions) {
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
          alert("You can't move the pawn there! There is a wall!");
        } else {
          if (isValidStep) {
            if (currentPlayer === 2 && selectedPawn === pawn2) {
              selectedPawn.x -= 60; //daca e negativa mutam la stanga
              currentPlayer = currentPlayer === 2 ? 1 : 2;
            } else {
              // It's not the pawn's turn, movement is blocked
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      }
    } else {
      if (newY > 0 && selectedPawn.y < height - 120) {
        //JOS
        for (let wall of wallPositions) {
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
          alert("You can't move the pawn there! There is a wall!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (currentPlayer === 2 && selectedPawn === pawn2) {
              selectedPawn.y += 60; // daca e pozitiva mutam in jos
              currentPlayer = currentPlayer === 2 ? 1 : 2;
            } else {
              // It's not the pawn's turn, movement is blocked
              isBlocked = true;
              alert("It's not your turn!");
            }
          }
        }
      } else if (newY < 0 && selectedPawn.y > 120) {
        // SUS
        for (let wall of wallPositions) {
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
          alert("You can't move the pawn there! There is a wall!");
        } else if (!isBlocked) {
          if (isValidStep) {
            if (currentPlayer === 2 && selectedPawn === pawn2) {
              selectedPawn.y -= 60; // daca e negativa mutam in sus
              currentPlayer = currentPlayer === 2 ? 1 : 2;
            } else {
              // It's not the pawn's turn, movement is blocked
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

    if (
      !isBlocked &&
      !directionChosen &&
      currentPlayer === 1 &&
      player1.wallCount > 0
    ) {
      if (player1.wallCount > 0) {
        let random = generateRandomNumber();
        console.log(random);
        if (random === 1) {
          moveAI();
        } else if (random === 2) {
          placeWallAI();
        }
      } else if (
        !isBlocked &&
        !directionChosen &&
        currentPlayer === 1 &&
        player1.wallCount == 0
      ) {
        moveAI();
      }
    }
  }

  // place walls
  for (let item of board) {
    if (item instanceof Wall) {
      if (
        mouseX < item.x + item.w &&
        mouseX > item.x &&
        mouseY < item.y + item.h &&
        mouseY > item.y
      ) {
        if (item.type == findWall(item).type) {
          wallPositions.push(item);
          wallPositions.push(findWall(item));
          let isWallPlaced = wallPositions.some(
            (pos) =>
              (pos.x === item.x && pos.y === item.y && pos.isPlaced === 1) ||
              (pos.x === findWall(item).x &&
                pos.y === findWall(item).y &&
                pos.isPlaced === 1)
          );
          console.log(isWallPlaced);

          if (!isWallPlaced) {
            if (currentPlayer === 2 && player2.wallCount > 0) {
              if (
                findWall(item).w + findWall(item).x < canvasWidth ||
                findWall(item).h + findWall(item).y < canvasHeight
              ) {
                item.color = "purple";
                findWall(item).color = "purple";

                console.log("wall1: x:" + item.x + "y: " + item.y);
                console.log(
                  "wall1below: x: " +
                    findWall(item).x +
                    "y: " +
                    findWall(item).y
                );

                item.isPlaced = 1;
                findWall(item).isPlaced = 1;
                player2.wallCount--;
                currentPlayer = 1;
                let random = generateRandomNumber();
                if (random === 1) {
                  moveAI();
                } else if (random === 2) {
                  if (player1.wallCount === 0) {
                    moveAI();
                  } else {
                    placeWallAI();
                  }
                }
              }
              break;
            }
          } else {
            alert(
              "You can't place a wall there. It must not overlap an existing wall!"
            );
          }
        }
        if (player2.wallCount == 0) {
          alert("You don't have walls!");
        }
      }
    }
  }
  checkWinner(pawn1, pawn2);
}

function HoveringEffect(){
  for (let item of board) {
    if (item instanceof Wall) {
      if (
        mouseX < item.x + item.w &&
        mouseX > item.x &&
        mouseY < item.y + item.h &&
        mouseY > item.y
      ) {
        if (item.type == findWall(item).type) { 
          item.mouseOver();
          item.display();

          findWall(item).mouseOver();
          findWall(item).display();
        }
      }
    }
  }
  console.log('macar am intrat aici')
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 2) + 1;
}

function moveAI() {
  if (currentPlayer === 1) {
    const directions = [1, 2, 3, 4]; //1 sus | 2 jos | 3 dreapta | 4 stanga
    const randomIndex = Math.floor(Math.random() * directions.length);
    const randomDirection = directions[randomIndex];
    let initialx = pawn1.x;
    let initialy = pawn1.y;

    let ableToMove = true;
    switch (randomDirection) {
      case 1: // up
        if (
          pawn1.y > 120 &&
          !(pawn1.x === pawn2.x && pawn1.y - 60 === pawn2.y) &&
          !checkForWall(pawn1.x - 25, pawn1.y - 35)
        ) {
          pawn1.y -= 60;
        } else if (
          pawn1.y > 180 &&
          pawn1.y - 120 === pawn2.y &&
          pawn1.x === pawn2.x &&
          !checkForWall(pawn1.x - 25, pawn1.y - 95)
        ) {
          pawn1.y -= 120;
        } else {
          ableToMove = false;
        }
        break;
      case 2: // down
        if (
          pawn1.y < height - 180 &&
          !(pawn1.x === pawn2.x && pawn1.y + 60 === pawn2.y) &&
          !checkForWall(pawn1.x - 25, pawn1.y + 25)
        ) {
          pawn1.y += 60;
        } else if (
          pawn1.y < height - 240 &&
          pawn1.y + 120 === pawn2.y &&
          pawn1.x === pawn2.x &&
          !checkForWall(pawn1.x - 25, pawn1.y + 55)
        ) {
          pawn1.y += 120;
        } else {
          ableToMove = false;
        }
        break;
      case 3: // right
        if (
          pawn1.x < width - 180 &&
          !(pawn1.x + 60 === pawn2.x && pawn1.y === pawn2.y) &&
          !checkForWall(pawn1.x + 25, pawn1.y - 25)
        ) {
          pawn1.x += 60;
        } else if (
          pawn1.x < width - 240 &&
          pawn1.x + 120 === pawn2.x &&
          pawn1.y === pawn2.y &&
          !checkForWall(pawn1.x + 95, pawn1.y - 25)
        ) {
          pawn1.x += 120;
        } else {
          ableToMove = false;
        }
        break;
      case 4: // left
        if (
          pawn1.x > 120 &&
          !(pawn1.x - 60 === pawn2.x && pawn1.y === pawn2.y) &&
          !checkForWall(pawn1.x - 35, pawn1.y - 25)
        ) {
          pawn1.x -= 60;
        } else if (
          pawn1.x > 180 &&
          pawn1.x - 120 === pawn2.x &&
          pawn1.y === pawn2.y &&
          !checkForWall(pawn1.x - 155, pawn1.y - 25)
        ) {
          pawn1.x -= 120;
        } else {
          ableToMove = false;
        }
        break;
    }
    if (pawn1.x == initialx && pawn1.y == initialy) {
      moveAI();
    }
    currentPlayer = 2;
  }
}

function placeWallAI() {
  let randomIndex = Math.floor(Math.random() * wallsUsed.length);
  let randomWall = wallsUsed[randomIndex];

  let isWallPlaced = false;
  let canPlaceWall = true;

  console.log(wallPositions);

  for (let pos of board)
    if (pos instanceof Wall) {
      if (
        (pos.x === randomWall.x &&
          pos.y === randomWall.y &&
          pos.isPlaced === 1) ||
        (findWall(randomWall) !== null &&
          pos.x === findWall(randomWall).x &&
          pos.y === findWall(randomWall).y &&
          pos.isPlaced === 1)
      ) {
        isWallPlaced = true;
        break;
      }
    }
  console.log("wallul random este: ");
  console.log(randomWall);
  if (randomWall.type == 1) {
    console.log("wallul random de sub el este: ");
    console.log(findWall(randomWall));
  } else if (randomWall.type == 2) {
    console.log("wallul random de langa el este: ");
    console.log(findWall(randomWall));
  }

  if (!isWallPlaced) {
    if (
      currentPlayer === 1 &&
      player1.wallCount > 0 &&
      findWall(randomWall) != null &&
      findWall(randomWall).w + findWall(randomWall).x < canvasWidth - 180 &&
      findWall(randomWall).h + findWall(randomWall).y < canvasHeight - 180
    ) {
      // Place the wall
      for (let itemBoard of board) {
        if (itemBoard instanceof Wall)
          if (
            (itemBoard.x === randomWall.x &&
              itemBoard.y === randomWall.y &&
              itemBoard.isPlaced === 1 &&
              itemBoard.type === randomWall.type) ||
            (findWall(randomWall) !== null &&
              itemBoard.x === findWall(randomWall).x &&
              itemBoard.y === findWall(randomWall).y &&
              itemBoard.isPlaced === 1 &&
              itemBoard.type === randomWall.type)
          ) {
            itemBoard.color = "purple";
            itemBoard.isPlaced = 1;
            player1.wallCount--;
            itemBoard.display();
            findWall(itemBoard).display();
            currentPlayer = 2;
          }
      }
    }
  }
  moveAI();
}

function findWall(findWall) {
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

function checkForWall(x, y) {
  for (let wall of wallPositions) {
    if (wall.x == x && wall.y == y && wall.isPlaced === 1) {
      return true;
    }
  }
  return false;
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
  currentPlayer = 2;
  // Math.floor(Math.random() * 2) + 1;
}

function checkWinner(pawn) {
  if (pawn.y == 555 || pawn.y == 100) {
    gameover();
  }
}

function gameover() {
  window.location.href = "";
}
document.getElementById("playerNameDisplay").textContent =
  "Player Name: " + playerName;

//   localStorage.removeItem("playerName");

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
  // Redirect to the winner.html page
  window.location.href = "winner.html";
}
