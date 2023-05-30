let board = [];
let canvas;
document.getElementById("resetButton").addEventListener("click", resetBoard);
let playerName = localStorage.getItem("playerName");

function setup(){
    canvas = createCanvas(630, 630);
    let canvasX = (windowWidth - width) / 2;
    let canvasY = (windowHeight - height) / 2;
    canvas.position(canvasX, canvasY);
    
    background('darkred');

    let color1 = 'white';

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let x = j * 60 + 50;
            let y = i * 60 + 50;
            let box = new Box(x, y, 50, color1); 
            board.push(box);
        }
    }
}

class Box {
    constructor( x, y, size, color){
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
    constructor(x, y, w, h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    display(){
        fill(this.color);
        rect(this.x, this.y, this.w, this.h)
    }
}


function draw(){
    for(let box of board){
        box.display();
    }
}

function mouseClicked(){
    for(let box of board) {
        if(mouseX > box.x && mouseX < box.x + box.size && mouseY > box.y && mouseY < box.y + box.size)
            box.newColor();
    }
}

function resetBoard(){
    for(let box of board){
        box.color = 'white';
    }
} 

document.getElementById("playerNameDisplay").textContent = "Player Name: " + playerName; 