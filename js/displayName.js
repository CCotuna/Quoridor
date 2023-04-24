document.getElementById("submitButton").addEventListener("click", function(){
    let playerName = document.getElementById("playerNameInput").value;
    displayPlayerName(playerName);
})

function setup(){
    createCanvas(500,500);
    background('yellow');
}

function displayPlayerName(playerName){
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Player Name: " + playerName, width/2, height/2);
}