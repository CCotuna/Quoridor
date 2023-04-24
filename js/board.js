let board = [];

function setup(){
    createCanvas(500, 400);

    let color1 = 'green';

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let x = j * 60 + 50;
            let y = i * 60 + 50;
            let box = new Box(x, y, 50, green); 
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






















// function draw(){
//     var rows = 0;

//     var firstColor = 'black'
//     var secondColor = 'white'


//     while(rows < 8){
//        if(rows % 2 == 0){
//         firstColor = 'white'
//         secondColor = 'black'
//        }
//        else {
//         firstColor = 'black'
//         secondColor = 'white'
//        }
//         var cols = 0;
//         while(cols <  8){
//             if(cols % 2 == 0){
//                 fill(firstColor);
//             }
//             else{
//                 fill(secondColor);
//             }
//             rect(cols * 50, rows*50, 50, 50);
//             cols += 1;
//         }
//         rows += 1;
//     }
// }
