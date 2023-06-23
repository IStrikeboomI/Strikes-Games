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
    canvas.width = document.documentElement.clientWidth;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(53, 53, 53, .5)";
    ctx.globalCompositeOperation = "xor";
    ctx.beginPath();
    ctx.roundRect(200, 25, 25, 800, 20);
    ctx.roundRect(600, 25, 25, 800, 20);
    ctx.roundRect(25, 200, 800, 25, 20);
    ctx.roundRect(25, 600, 800, 25, 20);
    ctx.fill();
    ctx.stroke();

    document.body.appendChild(canvas);
}
//Some browsers might not support roundRect so a manual implement
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  return this;
}