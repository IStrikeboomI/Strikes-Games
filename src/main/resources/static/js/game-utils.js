const cardNames = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK","C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK","D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK","RJ","BJ"];
const cards = [];

const Suit = Object.freeze({
    SPADES: "S",
    CLUBS: "C",
    HEARTS : "H",
    DIAMONDS: "D",
    //used for jokers
    RED: "R",
    BLACK: "B"
});
const Value = Object.freeze({
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    TEN: "10",
    JACK: "J",
    QUEEN: "Q",
    KING: "K",
    JOKER: "J"
});
for (let name of cardNames) {
    let suit = name.substring(0,1);
    let value = name.substring(1);
	let image = new Image();
	image.src = `/image/card/${name}.png`
    let card = {
        name: name,
        card: Object.entries(Suit).find((s) => s[1]===suit)[0],
		value: Object.entries(Value).find((s) => s[1]===value)[0],
		image: image
    }
	cards.push(card);
}
cards[52].value = "JOKER";
cards[53].value = "JOKER";
let backImage = new Image();
backImage.src = "/image/card/back.png"
let back = {
    name: "back",
    card: null,
    value: null,
    image: backImage
}
cards.push(back);
function getCard(name) {
    //back is always last card
    if (name === "back") {
        return cards[cards.length-1];
    }
    if (name === "RJ") {
        return cards[52];
    }
    if (name === "BJ") {
        return cards[53];
    }
    let suit = Object.values(Suit).indexOf(name.substring(0,1));
    let value = Object.values(Value).indexOf(name.substring(1));
	return cards[suit * 13+ value];
}
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function randomBoolean() {
    return randomInt(0,1) === 0;
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