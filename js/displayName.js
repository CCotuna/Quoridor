
if(document.getElementById("submitButton1")){
    document.getElementById("submitButton1").addEventListener("click", function(event){
        event.preventDefault();
        let playerName = document.getElementById("playerNameInput").value;

        if (playerName.trim() === "") {
            alert("You must insert a name!"); 
            return;
        }

        localStorage.setItem("playerName", playerName);
        window.location.href = "loading_page.html";
    })
}else{
    document.getElementById("submitButton2").addEventListener("click", function(event){
        event.preventDefault();
        let player1Name = document.getElementById("player1NameInput").value;
        if (player1Name.trim() === "") {
            alert("You must insert a name!"); 
            return;
        }
        localStorage.setItem("player1Name", player1Name);
    
        let player2Name = document.getElementById("player2NameInput").value;
        if (player2Name.trim() === "") {
            alert("You must insert a name!"); 
            return;
        }
        localStorage.setItem("player2Name", player2Name);
    
        window.location.href = "loading_page.html";
    })
}

function displayPlayerName(playerName){
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Player Name: " + playerName, width/2, height/2);
}