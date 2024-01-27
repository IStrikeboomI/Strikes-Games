const gameMessageHandlers = [
    {"name": "getGameData","handler":getGameData},
    {"name": "makeMove","handler":makeMove}
]
function getGameData(message) {
    sethHead.extraCardsSize = message.extraCardsSize;
    sethHead.topPileCard = message.topPileCard;
	sethHead.currentSuit = Object.entries(Suit).find((s) => s[0]===message.currentSuit)[0];
	let player = sethHead.usersWithData[0];
    player.onTurn = true;
    for (let u of sethHead.usersWithData) {
        u.handSize = message.handsSize[Object.keys(message.handsSize).find(id => id===u.user.separationId)] || message.hand.length;
        u.visibleCards = message.visibleCards[Object.keys(message.visibleCards).find(id => id===u.user.separationId)];
    }
    player.hand = message.hand;
    player.visibleCards = message.visibleCards[user.separationId];
    window.requestAnimationFrame(sethHead.drawCanvas.bind(sethHead));
}
function makeMove(message) {

}