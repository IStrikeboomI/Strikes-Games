const gameMessageHandlers = [
    {"name": "getGameData","handler":getGameData},
    {"name": "makeMove","handler":makeMove}
]
function getGameData(message) {
    extraCardsSize = message.extraCardsSize;
    topPileCard = message.topPileCard;
	let player = usersWithData[0];
    player.onTurn = true;
    for (let u of usersWithData) {
        u.handSize = message.handsSize[Object.keys(message.handsSize).find(id => id===u.user.separationId)] || message.hand.length;
        u.visibleCards = message.visibleCards[Object.keys(message.visibleCards).find(id => id===u.user.separationId)];
    }
    player.hand = message.hand;
    player.visibleCards = message.visibleCards[user.separationId]
    window.requestAnimationFrame(drawCanvas);
}
function makeMove(message) {

}