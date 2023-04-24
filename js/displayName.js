document.getElementById("submitButton").addEventListener("click", function(){
    let playerName = document.getElementById("playerNameInput").value;
    localStorage.setItem("playerName", playerName);
    window.location.href = "gameplay.html";
})

function displayPlayerName(playerName){
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Player Name: " + playerName, width/2, height/2);
}