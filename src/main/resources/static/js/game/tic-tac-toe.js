let grid = [[" "," "," "]
           ,[" "," "," "],
            [" "," "," "]];

let hasGameEnded = false;
let winner;

let playerWithX;
let playerWithO;
let playerOnTurn;

let playerWithXElement;
let playerWithOElement;
let playerOnTurnElement;

let playerWithXImage;
let playerWithOImage;

let gameRestartButton;

let canvas;

const BAR_LONG = document.documentElement.clientHeight * .95;
const BAR_THICKNESS = 25;
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
    user1Element.innerHTML = user1.name + (user1 == user ? " (You!)" : "");
    user1Div.setAttribute("separationId",user1.separationId);
    user1Div.appendChild(user1Element);
    users.appendChild(user1Div);

    let user2Div = document.createElement("div");
    user2Div.appendChild(rolePicture.cloneNode(true));
    let user2Element = document.createElement("p");
    user2Div.className = "user";
    user2Element.innerHTML = user2.name + (user2 == user ? " (You!)" : "");
    user2Div.setAttribute("separationId",user2.separationId);
    user2Div.appendChild(user2Element);
    users.appendChild(user2Div);

    document.body.appendChild(users);
    //button to make game restart should only be visible for creator
    if (user.creator) {
        gameRestartButton = document.createElement("button");
        //only show restart button when game is ended
        gameRestartButton.style.display = "none";
        gameRestartButton.onclick = () => {
            stompClient.send("/lobby/restart",{},true);
        }
        gameRestartButton.innerHTML = "Restart Game";
        document.body.appendChild(gameRestartButton);
    }

    canvas = document.createElement("canvas");

    canvas.addEventListener('mousedown', (e) => onCanvasClick(e));
    canvas.addEventListener('mousemove', (e) => onCanvasHover(e));

    canvas.height = document.documentElement.clientHeight;
    canvas.width = document.documentElement.clientWidth * .65;

    canvas.onload = () => {
        drawGrid();
    }

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

function onCanvasClick(e) {
    let canvasThirdWidth = canvas.width / 3;
    let gridX;
    if (e.layerX < canvasThirdWidth) {
        gridX = 0;
    } else if (e.layerX < canvasThirdWidth * 2) {
        gridX = 1;
    } else if (e.layerX > canvasThirdWidth * 2) {
        gridX = 2;
    }

    let canvasThirdHeight = canvas.height / 3;
    let gridY;
    if (e.layerY < canvasThirdHeight) {
        gridY = 0;
    } else if (e.layerY < canvasThirdHeight * 2) {
        gridY = 1;
    } else if (e.layerY > canvasThirdHeight * 2) {
        gridY = 2;
    }
    let message = {
        gridX: gridX,
        gridY: gridY
    };
    if (playerOnTurn == user && !hasGameEnded) {
        if (grid[gridY][gridX] === " ") {
            stompClient.send("/lobby/game/tic-tac-toe/makeMove",{},JSON.stringify(message));
        }
    }
}

function onCanvasHover(e) {
    let canvasThirdWidth = canvas.width / 3;
    let gridX;
    if (e.layerX < canvasThirdWidth) {
        gridX = 0;
    } else if (e.layerX < canvasThirdWidth * 2) {
        gridX = 1;
    } else if (e.layerX > canvasThirdWidth * 2) {
        gridX = 2;
    }

    let canvasThirdHeight = canvas.height / 3;
    let gridY;
    if (e.layerY < canvasThirdHeight) {
        gridY = 0;
    } else if (e.layerY < canvasThirdHeight * 2) {
        gridY = 1;
    } else if (e.layerY > canvasThirdHeight * 2) {
        gridY = 2;
    }

    const ctx = canvas.getContext("2d");
    drawGrid();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = "rgba(201,188,6,1)";
    ctx.fillStyle = "rgba(244, 229, 17, .5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(gridX * canvasThirdWidth + BAR_THICKNESS/2,gridY * canvasThirdHeight + BAR_THICKNESS/2,canvasThirdWidth - BAR_THICKNESS,canvasThirdHeight - BAR_THICKNESS);
    ctx.stroke();
    ctx.fill();
}
function clearCanvas() {
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
}
function drawGrid() {
    clearCanvas();
    const thirdWidth = canvas.width / 3;
    const thirdHeight = canvas.height / 3;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(53, 53, 53, .5)";
    ctx.globalCompositeOperation = "xor";
    ctx.lineWidth = 2;
    ctx.beginPath();
    //two vertical bars
    ctx.roundRect(thirdWidth - BAR_THICKNESS/2, 25, BAR_THICKNESS, document.documentElement.clientHeight * .95, 20);
    ctx.roundRect(thirdWidth * 2 - BAR_THICKNESS/2, 25, BAR_THICKNESS, document.documentElement.clientHeight * .95, 20);
    //two horizontal bars
    ctx.roundRect(25, thirdHeight - BAR_THICKNESS/2, canvas.width * .95, BAR_THICKNESS, 20);
    ctx.roundRect(25, thirdHeight * 2 - BAR_THICKNESS/2, canvas.width * .95, BAR_THICKNESS, 20);
    ctx.fill();
    ctx.stroke();

    for (let row in grid) {
        for (let column in grid[row]) {
            let move = grid[column][row];
            let imageToDraw;
            if (move === "X") {
                imageToDraw = playerWithXImage;
            } else if (move === "O") {
                imageToDraw = playerWithOImage;
            }
            if (imageToDraw) {
                let desiredImageWidth = thirdWidth * .75;
                let desiredImageHeight = thirdHeight * .75;
                ctx.drawImage(imageToDraw,thirdWidth * row + thirdWidth/2 - desiredImageWidth/2,thirdHeight * column + thirdHeight/2 - desiredImageHeight/2,desiredImageWidth,desiredImageHeight);
            }
        }
    }
    if (hasGameEnded) {
        if (winner && winner != "tie") {
            let gridX1;
            let gridY1;
            let gridX2;
            let gridY2;
            for (let x = 0;x < grid.length;x++) {
                if (checkForWin(x,0,x,1,x,2,winner)) {
                    gridX1 = 0;
                    gridY1 = x;
                    gridX2 = 2;
                    gridY2 = x;
                }
                if (checkForWin(0,x,1,x,2,x,winner)) {
                    gridX1 = x;
                    gridY1 = 0;
                    gridX2 = x;
                    gridY2 = 2;
                }
            }
            if (checkForWin(0,0,1,1,2,2,winner)) {
                gridX1 = 0;
                gridY1 = 0;
                gridX2 = 2;
                gridY2 = 2;
            }
            if (checkForWin(0,2,1,1,2,0,winner)) {
                gridX1 = 0;
                gridY1 = 2;
                gridX2 = 2;
                gridY2 = 0;
            }
            let x1 = gridX1 * thirdWidth + (thirdWidth/2);
            let y1 = gridY1 * thirdHeight + (thirdHeight/2);
            let x2 = (gridX2 + 1) * thirdWidth - (thirdWidth/2);
            let y2 = (gridY2 + 1) * thirdHeight - (thirdHeight/2);

            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();
        }
    }
}
function checkForWin(x1, y1, x2, y2, x3, y3, character) {
    return grid[x1][y1] === character && grid[x2][y2] === character && grid[x3][y3] === character;
}