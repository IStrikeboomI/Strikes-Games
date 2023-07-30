const gameMessageHandlers = [
    {"name": "getGameData","handler":getGameData},
    {"name": "makeMove","handler":makeMove}
]
function getGameData(message) {
    console.log(message);
    window.requestAnimationFrame(animate);
}
function makeMove(message) {

}