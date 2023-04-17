function setup(){
    createCanvas(440, 440)
    background(200)
}

function draw(){
    var rows = 0;

    var firstColor = 'black'
    var secondColor = 'white'


    while(rows < 8){
       if(rows % 2 == 0){
        firstColor = 'white'
        secondColor = 'black'
       }
       else {
        firstColor = 'black'
        secondColor = 'white'
       }
        var cols = 0;
        while(cols <  8){
            if(cols % 2 == 0){
                fill(firstColor);
            }
            else{
                fill(secondColor);
            }
            rect(cols * 50, rows*50, 50, 50);
            cols += 1;
        }
        rows += 1;
    }
}

draw();