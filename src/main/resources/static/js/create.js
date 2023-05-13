"use strict"
document.getElementById("game").addEventListener("change", (e) => changeGame(e));
document.getElementById("max-players").addEventListener("keydown", (e) => checkIfNumber(e));
document.getElementById("max-players").addEventListener("blur", (e) => checkValues(e));
document.getElementById("create-lobby").addEventListener("click", (e) => onButtonClick());

var games;
let xhttp = new XMLHttpRequest();
xhttp.onload = (event) => {
    games = JSON.parse(event.target.responseText);
    for (let game of games) {
        let e = document.createElement("option");
        e.innerHTML = game.name + " (" + game.maxPlayers + " Max Players)";
        e.setAttribute("name",game.name);
        document.getElementById("game").appendChild(e);
    }
}
xhttp.open("GET","/games.json");
xhttp.send();
//called every time key is down, checks if what got inputted was a number
function checkIfNumber(event) {
    if (!(event.key >= '0' && event.key <= '9') && event.key!=="Backspace") {
        event.preventDefault();
    }
}
//called when focus on the max players is lost, checks if number is a valid max player amount
function checkValues() {
    let maxPlayersElement = document.getElementById("max-players");
    let maxPlayersAmount = parseInt(maxPlayersElement.value) || 0;
    if (maxPlayersAmount > parseInt(maxPlayersElement.max)) {
        maxPlayersElement.value = maxPlayersElement.max;
    }
    if (maxPlayersAmount < parseInt(maxPlayersElement.min)) {
        maxPlayersElement.value = maxPlayersElement.min;
    }
}
function changeGame(event) {
    let game = event.target.options[event.target.selectedIndex].getAttribute("name");
    let maxPlayersElement = document.getElementById("max-players");
    maxPlayersElement.max = games.find(g => g.name === game).maxPlayers;
    checkValues();
}
function onButtonClick() {
    if (document.getElementById("name").value.length === 0) {
        alert("Name must not be empty!");
        return;
    }
    if (document.getElementById("name").value.length > 40) {
        alert("Name Too Long!");
        return;
    }
    const obj = {
        name: document.getElementById("name").value,
        game: document.getElementById("game").options[document.getElementById("game").selectedIndex].getAttribute("name"),
        private: document.getElementById("private").checked,
        maxPlayers: parseInt(document.getElementById("max-players").value)
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onload = (event) => {
        let response = JSON.parse(xhttp.response);
        window.location.replace(window.location.origin+"/join/"+response.lobby.joinCode);
    }
    xhttp.open("POST","/api/lobby/create");
    //Send the proper header information along with the request
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(obj));

}