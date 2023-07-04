const gameMessageHandlers = [
    {"name": "giveRoles","handler":giveRoles},
    {"name": "getGrid","handler":getGrid},
    {"name": "getPlayerOnTurn","handler":getPlayerOnTurn},
    {"name": "makeMove","handler":makeMove}
]
function giveRoles(message) {
    if (message.role === "O") {
        playerWithX = user;
        playerWithO = lobby.users[lobby.users.length - 1 - lobby.users.indexOf(user)]
        for (let u of document.querySelectorAll('[separationId]')) {
            if (u.getAttribute("separationId") === user.separationId) {
                playerWithXElement = u;
            } else {
                playerWithOElement = u;
            }
        }
    } else {
        playerWithX = lobby.users[lobby.users.length - 1 - lobby.users.indexOf(user)];
        playerWithO = user;
        for (let u of document.querySelectorAll('[separationId]')) {
            if (u.getAttribute("separationId") === user.separationId) {
                playerWithOElement = u;
            } else {
                playerWithXElement = u;
            }
        }
    }
    playerWithXImage = playerWithXElement.children[0];
    playerWithOImage = playerWithOElement.children[0];

    playerWithXImage.src = "/image/game/tic-tac-toe/x.png";
    playerWithOImage.src = "/image/game/tic-tac-toe/o.png";

    playerWithXImage.onload = () => {
        drawGrid();
    }
    playerWithOImage.onload = () => {
        drawGrid();
    }
}
function getGrid(message) {
    for (let row in message.grid) {
        grid[row] = message.grid[row].split('');
    }
}
function getPlayerOnTurn(message) {
    playerOnTurn = getUserFromSeparationId(message.separationId);
    playerOnTurnElement.innerHTML = playerOnTurn.name + "'s Turn" + (playerOnTurn == user ? " (You!)" : "");
}
function makeMove(message) {
    let characterToFill;
    //cycle turn
    if (playerOnTurn == playerWithX) {
        playerOnTurn = playerWithO;
        characterToFill = "X";
    } else {
        playerOnTurn = playerWithX;
        characterToFill = "O";
    }
    playerOnTurnElement.innerHTML = playerOnTurn.name + "'s Turn" + (playerOnTurn == user ? " (You!)" : "");
    let gridX = message.gridX;
    let gridY = message.gridY;
    grid[gridY][gridX] = characterToFill;
    drawGrid();
}