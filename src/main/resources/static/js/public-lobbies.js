"use strict"
var lobbies;
let xhttp = new XMLHttpRequest();
xhttp.onload = (event) => {
    lobbies = JSON.parse(xhttp.responseText);
    for (let lobby of lobbies) {
        let div = document.createElement("div");
        div.className = "lobby";

        let name = document.createElement("p");
        name.innerHTML = lobby.name;
        div.appendChild(name);

        let game = document.createElement("b");
        game.innerHTML = lobby.game;
        div.appendChild(game);

        let players = document.createElement("p");
        players.innerHTML = "Players: " + lobby.users.length + " of " + lobby.maxPlayers;
        div.appendChild(players);

        let join = document.createElement("button");
        join.innerHTML = "Join";
        join.onclick = () => window.location.replace(window.location.origin+"/join/"+lobby.joinCode);;
        div.appendChild(join);

        document.getElementById("lobbies").appendChild(div);
    }
};
xhttp.open("GET","/api/lobby/public-lobbies");
xhttp.send();