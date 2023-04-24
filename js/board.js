let board = [];
let canvas;

function setup(){
    canvas = createCanvas(630, 630);
    canvas.position(400, 200);

    background(color(random(255), random(255), random(255)));
    let color1 = color(random(255), random(255), random(255));

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

    display(){
        fill(this.color);
        square(this.x, this.y, this.size);
    }
}


function draw(){
    for(let box of board){
        box.display();
    }
}