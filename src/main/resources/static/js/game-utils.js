const cardNames = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK","C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK","D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK","RJ","BJ"];
const cards = [];

let spadeImage = new Image();
spadeImage.src = "image/card/suit/spade.png";
let clubImage = new Image();
clubImage.src = "image/card/suit/club.png";
let heartImage = new Image();
heartImage.src = "image/card/suit/heart.png";
let diamondImage = new Image();
diamondImage.src = "image/card/suit/diamond.png";
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
	image.src = `image/card/${name}.png`
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
backImage.src = "image/card/back.png"
let back = {
    name: "back",
    card: null,
    value: null,
    image: backImage
}
cards.push(back);
function getCard(name) {
    //back is always last card
    if (name === "back" || !name) {
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
function randomCard(includeBack = false) {
	return cards[randomInt(0,53 + (includeBack ? 1 : 0))];
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
/**
Generates a rotation matrix using pitch, yaw, and roll
x and y can be passed on as optional arguments to offset the origin of rotation

Matrix is generated from the product of the pitch, yaw, and roll matrices
*/
DOMMatrix.rotationMatrix = (pitch,yaw,roll,x=0,y=0) => {
	let matrix = new DOMMatrix();
	//rotations based on multiplying the pitch, yaw, and roll matrices together
	//search up euler angles
	matrix.m11 = Math.cos(yaw)*Math.cos(pitch);
	matrix.m12 = -Math.cos(roll)*Math.sin(pitch) + Math.sin(roll)*Math.sin(yaw)*Math.cos(pitch);
	matrix.m13 = Math.sin(roll)*Math.sin(pitch) + Math.cos(roll)*Math.sin(yaw)*Math.cos(pitch);
	matrix.m21 = Math.cos(yaw)*Math.sin(pitch);
	matrix.m22 = Math.cos(roll)*Math.cos(pitch) + Math.sin(roll)*Math.sin(yaw)*Math.sin(pitch);
	matrix.m23 = -Math.sin(roll)*Math.cos(pitch) + Math.cos(roll)*Math.sin(yaw)*Math.sin(pitch);
	matrix.m31 = -Math.sin(yaw);
	matrix.m32 = Math.sin(roll)*Math.cos(yaw);
	matrix.m33 = Math.cos(roll)*Math.cos(yaw);

	//translating to rotate along (x,y) instead of default which is the origin of (0,0)
	matrix.e = x;
	matrix.f = y;
	return matrix;
}
//used for user input
const KeyData = class {
	mouseX = 0;
	mouseY = 0;
}
class AnimationManager {
	constructor() {
		this.animations = [];
		this.currentId = 0;
	}
	addAnimation(animation, toStart = false) {
		animation.setId(this.currentId++);
		if (toStart) {
			this.animations.unshift(animation);
		} else {
			this.animations.push(animation);
		}
	}
	cancelAnimation(animation) {
		this.animations = this.animations.filter(a => a !== animation);
		animation.onEnd();
	}
	getAnimationFromId(id) {
		for (let animation of this.animations) {
			if (animation.id === id) {
				return animation;
			}
		}
	}
	drawAll(canvas, timestamp, lastTimestamp) {
		for (let animation of this.animations) {
			animation.draw(canvas, timestamp);
			animation.age += lastTimestamp;
			if (animation.length > 0 && animation.age >= animation.length) {
				this.cancelAnimation(animation);
			}
		}
	}
}
class Animation {
	//If length < 0 then animation lingers until removed
	//length is in miliseconds
	constructor(length = -1) {
		this.length = length;
		this.age = 0;
	}
	draw(canvas, timestamp) {

	}
	setId(id) {
		this.id = id;
	}
	onEnd() {}
}
class GuiManager {
	constructor(animationManager) {
		this.guis = [];
		this.currentId = 0;
		this.animationManager = animationManager;
	}
	addGui(gui, toStart = false) {
		gui.setId(this.currentId++);
		gui.manager = this;
		if (toStart) {
			this.guis.unshift(gui);
		} else {
			this.guis.push(gui);
		}
		this.animationManager.addAnimation(gui,true);
	}
	cancelGui(gui) {
		this.guis = this.guis.filter(g => g !== gui);
		this.animationManager.cancelAnimation(gui);
	}
	onClick(e) {
		let x = e.layerX;
		let y = e.layerY;
		for (let gui of this.guis) {
			if (x >= gui.x && x <= gui.x + gui.width && y >= gui.y && y <= gui.y + gui.height) {
				gui.onClick(e);
			}
		}
	}
	get isGuiPresent() {
		return this.guis.length > 0;
	}
}
class Gui extends Animation {
	constructor(x,y,width,height) {
		super(-1);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.elements = [];
		this.backgroundColor = "#eac888";

		//X button in the top right corner, clicking on this will call onExit() AND onEnd()
		let xButton = new GuiElement(width - width * .1,0,width * .1, height * .1);
		xButton.draw = (ctx) => {
			ctx.save();
			ctx.lineWidth = 2;
			if (KeyData.mouseX >= (x + xButton.x) && KeyData.mouseX <= (x + xButton.x + xButton.width)
			 && KeyData.mouseY >= (y + xButton.y) && KeyData.mouseY <= (y + xButton.y + xButton.height)) {
				ctx.fillStyle = "#FF0000";
				ctx.strokeStyle = "#FF0000";
			} else {
				ctx.fillStyle = "#424242";
				ctx.strokeStyle = "#424242";
			}
			ctx.beginPath();
			ctx.arc(xButton.width/2,xButton.height/2,xButton.width/2,0,Math.PI*2);
			ctx.stroke();

			ctx.beginPath();
			ctx.translate(xButton.width/2,xButton.height/2);
			ctx.rotate(Math.PI / 4);
			ctx.translate(-xButton.width/2,-xButton.height/2);
			ctx.roundRect(xButton.width/2 - xButton.width/20,xButton.height/2 - xButton.height * .25,xButton.width/10,xButton.height * .5,25);
			ctx.translate(xButton.width/2,xButton.height/2);
			ctx.rotate(Math.PI / 2);
			ctx.translate(-xButton.width/2,-xButton.height/2);
			ctx.roundRect(xButton.width/2 - xButton.width/20,xButton.height/2 - xButton.height * .25,xButton.width/10,xButton.height * .5,25);
			ctx.fill();
			ctx.restore();
		}
		xButton.onClick = (e) => {
			this.manager.cancelGui(this);
			this.onExit();
		}
		this.elements.push(xButton);
	}
	addElement(element) {
		this.elements.push(element);
	}
	onClick(e) {
		let x = e.layerX - this.x;
		let y = e.layerY - this.y;
		for (let element of this.elements) {
			if (x >= element.x && x <= element.x + element.width && y >= element.y && y <= element.y + element.height) {
				element.onClick(e);
			}
		}
	}
	//unlike onEnd(), this method gets called if the x in the top right corner gets clicked
	onExit() {}
	draw(canvas, timestamp) {
		let ctx = canvas.getContext("2d");
		ctx.save();
		for (let element of this.elements) {
			ctx.save();
			ctx.translate(this.x + element.x,this.y + element.y);
			element.draw(ctx);
			ctx.restore();
		}
		ctx.fillStyle = this.backgroundColor;
		ctx.beginPath();
		ctx.roundRect(this.x,this.y,this.width,this.height,25);
		ctx.fill();
		ctx.restore();
	}
}
class GuiElement {
	constructor(x,y,width=0,height=0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	onClick(e) {}
	//draw methods on gui elemnts are translated by (x,y) at start so no need to translate
	draw(ctx) {}
}