import { wallsUsed, board, canvas, pawn1, pawn2, distance, player1, player2, currentPlayer } from "./gameplay.js";
import { Player, Box, Wall, Pawn, mouseClicked, findWall, resetPawns, resetBoard} from "./gameplay.js";

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
      let wall1 = new Wall(x + 50, y, 10, 50, "yellow", 0, 1); //verticale
      board.push(wall1);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * 60 + 50;
      let y = i * 60 + 50;
      let wall2 = new Wall(x, y + 50, 50, 10, "yellow", 0, 2); //orizontale
      board.push(wall2);
    }
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
}
