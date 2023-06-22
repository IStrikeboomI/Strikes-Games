let playerWithX;
let playerWithO;

let playerWithXElement;
let playerWithOElement;
let playerOnTurnElement;
function init() {
    let user1 = lobby.users[0]
    let user2 = lobby.users[1]

    playerOnTurnElement = document.createElement("span");
    playerOnTurnElement.id = "player-on-turn";
    document.body.appendChild(playerOnTurnElement);

    let users = document.createElement("div");
    users.id = "users";

    let rolePicture = document.createElement("img");
    rolePicture.className = "role";

    let user1Div = document.createElement("div");
    user1Div.appendChild(rolePicture.cloneNode(true));
    let user1Element = document.createElement("p");
    user1Div.className = "user";
    user1Element.innerHTML = user1.name;
    user1Div.setAttribute("separationId",user1.separationId);
    user1Div.appendChild(user1Element);
    users.appendChild(user1Div);

    let user2Div = document.createElement("div");
    user2Div.appendChild(rolePicture.cloneNode(true));
    let user2Element = document.createElement("p");
    user2Div.className = "user";
    user2Element.innerHTML = user2.name;
    user2Div.setAttribute("separationId",user2.separationId);
    user2Div.appendChild(user2Element);
    users.appendChild(user2Div);

    document.body.appendChild(users);

    let canvas = document.createElement("canvas");

    canvas.height = document.documentElement.clientHeight;
    canvas.width = document.documentElement.clientWidth * (2/3);

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgba(53, 53, 53, .5)";
    ctx.beginPath();
    ctx.roundRect(200, 25, 25, 800, 20);
    ctx.roundRect(600, 25, 25, 800, 20);
    ctx.roundRect(25, 200, 800, 25, 20);
    ctx.roundRect(25, 600, 800, 25, 20);
    ctx.stroke();
    ctx.fill();

    document.body.appendChild(canvas);
}