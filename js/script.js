// Responsive menu
var menuList = document.getElementById("menuList");

menuList.style.maxHeight = "0px";
function togglemenu(){
    if( menuList.style.maxHeight == "0px"){
        menuList.style.maxHeight = "130px"
    }
    else{
        menuList.style.maxHeight = "0px"
    }
}

function displayDiscord(){
    alert("ID: nomnom#2027");
}

function displaySlackAddres(){
    alert("Email address: calin.cotuna@emanuel.ro")
}