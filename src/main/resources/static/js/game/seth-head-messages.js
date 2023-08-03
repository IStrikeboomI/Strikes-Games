const gameMessageHandlers = [
    {"name": "getGameData","handler":getGameData},
    {"name": "makeMove","handler":makeMove}
]
function getGameData(message) {
    extraCardsSize = message.extraCardSize;
    topPileCard = message.topPileCard;
    playerOnTurn = lobby.users.find(u => u.separationId===message.playerOnTurn);
    for (let u of usersWithData) {
        u.handSize = message.handsSize[Object.keys(message.handsSize).find(id => id===u.user.separationId)] || message.hand.length;
        u.visibleCards = message.visibleCards[Object.keys(message.visibleCards).find(id => id===u.user.separationId)];
    }
    hand = message.hand;
    visibleCards = message.visibleCards[user.separationId]
    window.requestAnimationFrame(animate);
}
function makeMove(message) {

}