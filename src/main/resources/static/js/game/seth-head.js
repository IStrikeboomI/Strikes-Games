var user = { name: "Anonymous", separationId: "e370c9d9-13a4-4442-990d-7fb36f6eec0b", creator: true };
var lobby = {
  "name": "124",
  "game": {
    "name": "Seth-Head",
    "minPlayers": 2,
    "maxPlayers": 4,
    "defaultSettings": [
      {
        "key": "playerTimer",
        "value": 30,
        "name": "Player Timer",
        "type": "INTEGER",
        "min": 15,
        "max": 60
      }
    ]
  },
  "maxPlayers": 4,
  "created": "2023-12-26T18:55:11.199721Z",
  "joinCode": "4fWli6i",
  "users": [
    user,
    {
      "name": "Anonymous1",
      "separationId": "f5e66f67-202d-4384-ac92-992afa72a5fd",
      "creator": false
    },
	{
      "name": "Anonymous2",
      "separationId": "f5e66f67-202d-4384-ac92-992afa72a5fe",
      "creator": false
    },
	{
      "name": "Anonymous3",
      "separationId": "f5e66f67-202d-4384-ac92-992afa72a5ff",
      "creator": false
    }
  ],
  "gameStarted": true,
  "messages": [],
  "settings": [
    {
      "key": "playerTimer",
      "value": 30
    }
  ],
  "private": false
};
class SethHead extends Game {
	constructor() {
		super();
		this.cardWidth = 100 * (this.canvas.width/1920);
		this.cardHeight = 140 * (this.canvas.height/935);
		//stores users along with additional data like where they are on ctx.canvas and what their cards are
		//location of where users are as follows, bottom is always the client then the user order is top, right, then left
		this.usersWithData = [];
		this.extraCardsSize;
		this.topPileCard;
		this.currentSuit;
		this.currentSuit;
		//timestamp of previous animation frame
		this.lastTimestamp = 0;
		super.forceLandscape(true);
		this.stillDealing = true;
		//add client first
		//using polar coordinates to display cards because its much easier and looks nicer
		this.usersWithData.push({user: user, rotation:0, radius: this.canvas.height/2, onTurn: false});
		//add all the other users after
		for (let i = 0;i < getOtherUsers().length;i++) {
			let u = getOtherUsers()[i];
			let userWithData = {user: u};
			//first user goes on top
			if (i == 0) {
				userWithData.rotation = Math.PI;
				userWithData.radius = this.canvas.height/2;
			} else {
				if (i == 1) {
					userWithData.rotation = 3*Math.PI/2;
					userWithData.radius = this.canvas.width/2;
				} else {
					userWithData.rotation = Math.PI/2;
					userWithData.radius = this.canvas.width/2;
				}
			}
			userWithData.onTurn = false;
			this.usersWithData.push(userWithData);
		}
		this.initAnimations();
	}
	onCanvasClick(e) {
		let x = e.layerX;
		let y = e.layerY;
		//cancel dealing on click so you don't have to see each time you refresh
		if (this.stillDealing) {
			this.stillDealing = false;
		} else {
			if (this.usersWithData[0].onTurn && !this.guiManager.isGuiPresent) {
				//if hovering over card in hand
				for (let h = 0;h < this.usersWithData[0].hand.length;h++) {
					let isFirst = h == 0;
					let cardXStart = (h*this.cardWidth/2.5) - ((this.usersWithData[0].hand.length+ 1) * this.cardWidth/2.5)/2 + this.canvas.width/2 + (isFirst ? 0 : this.cardWidth/2);
					let cardYStart = this.usersWithData[0].radius * .95 - (this.cardWidth*1.7) + this.canvas.height/2;
					if (KeyData.mouseIn(cardXStart,cardYStart,(isFirst ? this.cardWidth : this.cardWidth/2),this.cardHeight) && this.isCardValid(this.usersWithData[0].hand[h])) {
						this.userPlayCard(this.usersWithData[0].hand[h])
					}
				}
				//if hovering over visible cards
				for (let c = 0;c < this.usersWithData[0].visibleCards.length;c++) {
					let cardXStart = c*(this.cardWidth * 1.05) - (this.usersWithData[0].visibleCards.length*this.cardWidth)/2 + this.canvas.width/2;
					let cardYStart = this.usersWithData[0].radius * .95 - (this.cardWidth*3.2) + this.canvas.height/2;
					if (KeyData.mouseIn(cardXStart,cardYStart,this.cardWidth,this.cardHeight) && this.isCardValid(this.usersWithData[0].visibleCards[c])) {
						this.userPlayCard(this.usersWithData[0].visibleCards[c]);
					}
				}
				//if hovering over deck of cards (extra cards)
				let extraCardX = this.canvas.width/2 - backImage.width/2;
				let extraCardY = this.canvas.height/2 - backImage.height/2;
				if (KeyData.mouseIn(extraCardX,extraCardY,this.cardWidth,this.cardHeight + this.extraCardsSize)) {
					this.userDrawCard(randomCard().name);
				}
				return;
			}
			this.guiManager.onClick(e);
		}
	}
	userPlayCard(card) {
		let cardData = getCard(card);
		let visibleCardReplaceGui = new Gui(0, 0, this.canvas.width, this.canvas.height,false);
		visibleCardReplaceGui.backgroundColor = "#00000000";
		visibleCardReplaceGui.borderColor = "#00000000";
		visibleCardReplaceGui.easeIn = false;
		let visibleCardReplaceTextElement = new GuiElement(visibleCardReplaceGui.width/2,0);
		visibleCardReplaceTextElement.draw = (ctx) => {
			const TEXT = "Replace Visible Card From Hand";
			ctx.textAlign = "center";
			ctx.font = "40px Arial sans-serif";
			ctx.fillStyle = "black";
			let visibleCardReplaceMeasurements = ctx.measureText(TEXT);
			ctx.fillText(TEXT,0,visibleCardReplaceMeasurements.actualBoundingBoxAscent + 5);
		}
		visibleCardReplaceGui.addElement(visibleCardReplaceTextElement);
		let handCardsBox = new GuiElement(-((this.usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + this.canvas.width/2,this.usersWithData[0].radius * .95 - (this.cardWidth*1.7) + this.canvas.height/2,this.cardWidth + (this.usersWithData[0].hand.length - 1)*(this.cardWidth/2.5),this.cardHeight);
		handCardsBox.draw = (ctx) => {
			ctx.strokeStyle = "green";
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.roundRect(0,0,handCardsBox.width,handCardsBox.height,25);
			ctx.stroke();
			for (let h = 0;h < this.usersWithData[0].hand.length;h++) {
				let isFirst = h == 0;
				let cardXStart = (h*backImage.width/2.5) + (isFirst ? 0 :this.cardWidth/2);
				if (KeyData.mouseIn(cardXStart - ((this.usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + ctx.canvas.width/2,handCardsBox.y,isFirst ? this.cardWidth : this.cardWidth/2,this.cardHeight)) {
					ctx.globalCompositeOperation = 'source-over';
					ctx.strokeStyle = "rgba(201,188,6,1)";
					ctx.lineWidth = 4;
					ctx.beginPath();
					ctx.roundRect(cardXStart,0,isFirst ? this.cardWidth : this.cardWidth/2,this.cardHeight,5);
					ctx.stroke();
				}
			}
		}
		handCardsBox.onClick = (e) => {
			for (let h = 0;h < this.usersWithData[0].hand.length;h++) {
				let isFirst = h == 0;
				let cardXStart = (h*backImage.width/2.5) + (isFirst ? 0 :this.cardWidth/2);
				if (KeyData.mouseIn(cardXStart - ((this.usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + this.canvas.width/2 ,handCardsBox.y,(isFirst ? this.cardWidth : this.cardWidth/2),this.cardHeight)) {
					console.log(this.usersWithData[0].hand[h])
				}
			}
			this.guiManager.cancelGui(visibleCardReplaceGui);
		}
		visibleCardReplaceGui.addElement(handCardsBox);

		if (cardData.value === "JACK" || cardData.value === "JOKER") {
			let chosenSuit;
			let chooseSuitGui = new Gui(this.canvas.width/2 - 250, this.canvas.height/2 - 250, 500, 500);

			let chooseSuitTextElement = new GuiElement(chooseSuitGui.width/2,0);
			chooseSuitTextElement.draw = (ctx) => {
				const TEXT = "Choose Suit";
				ctx.textAlign = "center";
				ctx.font = "40px Arial sans-serif";
				ctx.fillStyle = "black";
				let chooseSuitMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,0,chooseSuitMeasurements.actualBoundingBoxAscent + 5);
			}

			let suitWidth = 175;
			let suitHeight = 175;
			for (let x = 0; x < 2; x++) {
				for (let y = 0; y < 2; y++) {
					let [suit, data] = Object.entries(Suit)[x*2 + y];
					let suitElement = new GuiElement(chooseSuitGui.width*(x*2+1)/4 - suitWidth/2,chooseSuitGui.height*(y*2+1)/4 - suitHeight/2.5,175,175);
					suitElement.onClick = (e) => {
						chosenSuit = suit;
						this.guiManager.cancelGui(chooseSuitGui);
					}
					suitElement.draw = (ctx) => {
						data.image.width = suitElement.width;
						data.image.height = suitElement.height;
						ctx.drawImage(data.image,0,0,data.image.width,data.image.height);
						if (KeyData.mouseIn(chooseSuitGui.x + suitElement.x,chooseSuitGui.y + suitElement.y,suitElement.width,suitElement.height)) {
							ctx.globalCompositeOperation = 'source-over';
							ctx.strokeStyle = "rgba(201,188,6,1)";
							ctx.lineWidth = 4;
							ctx.beginPath();
							ctx.roundRect(0,0,suitElement.width,suitElement.height,5);
							ctx.stroke();
						}
					}
					chooseSuitGui.addElement(suitElement);
				}
			}
			chooseSuitGui.onEnd = () => {
				if (chosenSuit !== undefined) {
					if (this.usersWithData[0].visibleCards.findIndex(c => c==card) != -1 && this.usersWithData[0].handSize > 0) {
						this.guiManager.addGui(visibleCardReplaceGui);
					}
				}
			}
			chooseSuitGui.addElement(chooseSuitTextElement);
			this.guiManager.addGui(chooseSuitGui);
		} else if (this.usersWithData[0].visibleCards.findIndex(c => c==card) != -1 && this.usersWithData[0].handSize > 0 && !this.guiManager.isGuiPresent) {
			this.guiManager.addGui(visibleCardReplaceGui);
		} else {
			this.playCard(this.usersWithData[0],card);
		}
	}
	playCard(userToPlay, card) {
		let visibleCardsSizeBefore = userToPlay.visibleCards.length;
		userToPlay.visibleCards.remove(card);
		if (visibleCardsSizeBefore === userToPlay.visibleCards.length) {
			userToPlay.handSize--;
		}
		if (userToPlay.user === user) {
			this.usersWithData[0].hand.remove(card);
		}

		let playCardAnimation = new Animation(1000);
		playCardAnimation.draw = (ctx, timestamp) => {
			ctx.globalCompositeOperation = "source-over";
			let cardImage = getCard(card).image;
			cardImage.width = this.cardWidth;
			cardImage.height = this.cardHeight;

			//where card ends up
			const CARD_DESTINATION_X = ctx.canvas.width/2 - this.cardWidth*2;
			const CARD_DESTINATION_Y = ctx.canvas.height/2 - this.cardHeight/2;

			let card_source_x = (-Math.sin(userToPlay.rotation) * userToPlay.radius) * .75 + ctx.canvas.width/2 - cardImage.width/2;
			let card_source_y = (Math.cos(userToPlay.rotation) * userToPlay.radius) * .75 + ctx.canvas.height/2 - cardImage.height/2;

			ctx.translate(card_source_x + ((CARD_DESTINATION_X-card_source_x)/playCardAnimation.length)*playCardAnimation.age + this.cardWidth/2,
						  card_source_y + ((CARD_DESTINATION_Y-card_source_y)/playCardAnimation.length)*playCardAnimation.age + this.cardHeight/2);
			ctx.rotate((userToPlay.rotation/playCardAnimation.length) * (playCardAnimation.length - playCardAnimation.age));
			ctx.drawImage(cardImage,-cardImage.width/2,
									-cardImage.height/2,cardImage.width,cardImage.height);
		}
		playCardAnimation.onEnd = () => {
			this.topPileCard = card;
			let cardData = getCard(card);
		}
		this.animationManager.addAnimation(playCardAnimation,true);
	}
	//called when the client draws a card
	userDrawCard(card) {
		let canCardBePlayed = this.isCardValid(card);
		if (canCardBePlayed) {
			let playOrKeepGui = new Gui(this.canvas.width/2 - 200, this.canvas.height/2 - 300, 400, 500,false);

			let titleElement = new GuiElement(playOrKeepGui.width/2,0);
			titleElement.draw = (ctx) => {
				const TEXT = "Play or Keep Card";
				ctx.textAlign = "center";
				ctx.font = "40px Arial sans-serif";
				ctx.fillStyle = "black";
				let titleMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,0,titleMeasurements.actualBoundingBoxAscent + 5);
			}
			playOrKeepGui.addElement(titleElement);

			let cardElement = new GuiElement(playOrKeepGui.width/3,playOrKeepGui.height/2,this.cardWidth*1.5,this.cardHeight*1.5);
			cardElement.draw = (ctx) => {
				let cardImage = getCard(card).image;
				cardImage.width = this.cardWidth;
				cardImage.height = this.cardHeight;
				ctx.drawImage(cardImage,-cardImage.width,-cardImage.height,cardElement.width,cardElement.height);

				const TEXT = "Drawn Card:";
				ctx.textAlign = "center";
				ctx.font = "30px Arial sans-serif";
				ctx.fillStyle = "black";
				let textMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,-cardImage.width/4,-cardImage.height - 15);
			}
			playOrKeepGui.addElement(cardElement);

			let topCardElement = new GuiElement(playOrKeepGui.width * 7/8,playOrKeepGui.height/2 + this.cardHeight/2,this.cardWidth,this.cardHeight);
			topCardElement.draw = (ctx) => {
				let cardImage = getCard(this.topPileCard).image;
				cardImage.width = this.cardWidth;
				cardImage.height = this.cardHeight;
				ctx.drawImage(cardImage,-cardImage.width,-cardImage.height,topCardElement.width,topCardElement.height);

				const TEXT = "Top Card:";
				ctx.textAlign = "center";
				ctx.font = "20px Arial sans-serif";
				ctx.fillStyle = "black";
				let textMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,-cardImage.width/2,-cardImage.height - 10);
			}
			playOrKeepGui.addElement(topCardElement);

			let keepHandButton = new GuiElement(0,playOrKeepGui.height * 2/3,playOrKeepGui.width / 2,playOrKeepGui.height/ 3);
			keepHandButton.draw = (ctx) => {
				ctx.fillStyle = KeyData.mouseIn(playOrKeepGui.x + keepHandButton.x,playOrKeepGui.y + keepHandButton.y,keepHandButton.width,keepHandButton.height) ? "#c1af8d" : "#eac888";
				ctx.globalCompositeOperation = "source-atop";
				ctx.beginPath();
				ctx.rect(0,0,keepHandButton.width,keepHandButton.height);
				ctx.fill();

				const TEXT = "Keep";
				ctx.textAlign = "center";
				ctx.font = "40px Arial sans-serif";
				ctx.fillStyle = "black";
				let textMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,keepHandButton.width/2,keepHandButton.height/2);
			}
			keepHandButton.onClick = (e) => {
				this.drawCard(this.usersWithData[0], card);
				this.guiManager.cancelGui(playOrKeepGui);
			}
			playOrKeepGui.addElement(keepHandButton);

			let playCardButton = new GuiElement(playOrKeepGui.width / 2,playOrKeepGui.height * 2/3,playOrKeepGui.width / 2,playOrKeepGui.height/ 3);
			playCardButton.draw = (ctx) => {
				ctx.fillStyle = KeyData.mouseIn(playOrKeepGui.x + playCardButton.x,playOrKeepGui.y + playCardButton.y,playCardButton.width,playCardButton.height) ? "#c1af8d" : "#eac888";
				ctx.globalCompositeOperation = "source-atop";
				ctx.beginPath();
				ctx.rect(0,0,playCardButton.width,playCardButton.height);
				ctx.fill();

				const TEXT = "Play";
				ctx.textAlign = "center";
				ctx.font = "40px Arial sans-serif";
				ctx.fillStyle = "black";
				let textMeasurements = ctx.measureText(TEXT);
				ctx.fillText(TEXT,playCardButton.width/2,playCardButton.height/2);
			}
			playCardButton.onClick = (e) => {
				this.usersWithData[0].hand.push(card);
				this.usersWithData[0].handSize++;
				this.playCard(this.usersWithData[0], card);
				this.guiManager.cancelGui(playOrKeepGui);
			}
			playOrKeepGui.addElement(playCardButton);

			this.guiManager.addGui(playOrKeepGui);
		} else {
			this.drawCard(this.usersWithData[0], card);
		}
	}
	drawCard(userToDraw, card) {
		let drawCardAnimation = new Animation(500);
		drawCardAnimation.draw = (ctx, timestamp) => {
			ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
			ctx.rotate(userToDraw.rotation);
			let cardImage = getCard(card).image;
			cardImage.width = this.cardWidth;
			cardImage.height = this.cardHeight;
			ctx.drawImage(cardImage,-backImage.width/2, userToDraw.radius * (drawCardAnimation.age / drawCardAnimation.length),cardImage.width,cardImage.height);
			ctx.restore();
		}
		drawCardAnimation.onEnd = () => {
			if (userToDraw.visibleCards.length >= 3) {
				userToDraw.handSize++;
				if (userToDraw.user === user) {
					this.usersWithData[0].hand.push(card);
				}
			} else {
				userToDraw.visibleCards.push(card);
			}
		}
		this.animationManager.addAnimation(drawCardAnimation,true);
	}

	initAnimations() {
		let coordinatesAnimation = new Animation();
		coordinatesAnimation.draw = (ctx, timestamp) => {
			ctx.textAlign = "center";
			ctx.font = "30px Arial sans-serif";
			ctx.fillText("Mouse X: " + KeyData.mouseX + "\nMouse Y: " + KeyData.mouseY, 200,20);
		}
		this.animationManager.addAnimation(coordinatesAnimation);
		backImage.width = this.cardWidth;
		backImage.height = this.cardHeight;
		let usernameAnimation = new Animation();
		usernameAnimation.draw = (ctx, timestamp) => {
			ctx.textAlign = "center";
			ctx.font = "30px Arial sans-serif";
			for (let u of this.usersWithData) {
				ctx.save();
				ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
				ctx.rotate(u.rotation);
				ctx.fillStyle = u.onTurn ? "black" : "darkGray";
				ctx.fillText(u.user.name, 0,u.radius * .95);
				ctx.restore();
			}
		}
		this.animationManager.addAnimation(usernameAnimation);
		let extraCardSpinAnimation = new Animation(1000);
		extraCardSpinAnimation.draw = (ctx, timestamp) => {
			let imageX = ctx.canvas.width - backImage.width/2 - extraCardSpinAnimation.age;
			ctx.translate(imageX,ctx.canvas.height/2-backImage.height/2);
			let rotation = (extraCardSpinAnimation.age / (ctx.canvas.width / 2 - backImage.width/2)) * 4 * Math.PI;
			ctx.rotate(rotation);
			ctx.translate(-imageX,-(ctx.canvas.height/2-backImage.height/2));
			for (let i = 0; i < 54;i++) {
				ctx.drawImage(backImage,imageX,ctx.canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
			}
			if (!this.stillDealing) {
				this.animationManager.cancelAnimation(extraCardSpinAnimation);
			}
		}
		extraCardSpinAnimation.onEnd = () => {
			let dealAnimation = new Animation();
			dealAnimation.draw = (ctx, timestamp) => {
				ctx.globalCompositeOperation = 'destination-over';
				for (let i = 0; i < this.extraCardsSize;i++) {
					ctx.drawImage(backImage,ctx.canvas.width/2 - backImage.width/2,ctx.canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
				}
				const TIME_TO_DEAL = 500;
				let cardsDealt = Math.floor(dealAnimation.age / TIME_TO_DEAL);
				let largestCardAmount = 0;
				for (let u of this.usersWithData) {
					largestCardAmount = Math.max(largestCardAmount, u.handSize + u.visibleCards.length);
					if (u.handSize + u.visibleCards.length > cardsDealt) {
						ctx.save();
						ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
						ctx.rotate(u.rotation);
						ctx.drawImage(backImage, -backImage.width/2, u.radius * ((dealAnimation.age % TIME_TO_DEAL) / TIME_TO_DEAL),backImage.width,backImage.height);
						ctx.restore();
					}
					ctx.save();
					ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
					ctx.rotate(u.rotation);
					for (let h = 0; h < Math.min(cardsDealt,u.handSize); h++) {
						//if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
						if (u.user != user) {
							ctx.drawImage(backImage,-(h*backImage.width/2) + ((u.handSize+ 1) * backImage.width/2)/2 - backImage.width,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
						} else {
							let card = getCard(this.usersWithData[0].hand[h]);
							let cardImage = card.image;
							cardImage.width = this.cardWidth;
							cardImage.height = this.cardHeight;
							ctx.drawImage(cardImage,(h*backImage.width/2.5) - ((Math.min(cardsDealt,u.handSize)+ 1) * backImage.width/2.5)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
						}
					}
					//if the amount of cards already dealt is larger than the size of the hand, that means visible cards are being dealt
					if (cardsDealt > u.handSize) {
						for (let c = 0; c < Math.min(cardsDealt - u.handSize, u.visibleCards.length); c++) {
							let card = getCard(u.visibleCards[c]);
							let cardImage = card.image;
							cardImage.width = this.cardWidth;
							cardImage.height = this.cardHeight;
							ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
						}
					}
					if (cardsDealt > largestCardAmount) {
						this.stillDealing = false;
					}
					if (!this.stillDealing) {
						this.animationManager.cancelAnimation(dealAnimation);
					}
					ctx.restore();
				}
				if (dealAnimation.age >= 1500) {
					const text = "Click To Stop Deal Animation";
					ctx.font = "50px Arial sans-serif";
					let measurements = ctx.measureText(text);
					ctx.globalCompositeOperation = 'source-over';
					ctx.fillStyle = "#eac888";
					ctx.beginPath();
					ctx.roundRect(ctx.canvas.width/2 - measurements.width*1.25/2,(measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent) * 1.25,measurements.width * 1.25, (measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent) * 1.25,25);
					ctx.fill();
					ctx.textAlign = "center";

					ctx.fillStyle = "black";
					ctx.fillText(text,ctx.canvas.width/2,100);
				}
			}
			dealAnimation.onEnd = () => {
				let extraCardAnimation = new Animation();
				extraCardAnimation.draw = (ctx, timestamp) => {
					ctx.globalCompositeOperation = 'destination-over';
					for (let i = 0; i < this.extraCardsSize;i++) {
						ctx.drawImage(backImage,ctx.canvas.width/2 - backImage.width/2,ctx.canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
					}
				}
				this.animationManager.addAnimation(extraCardAnimation);
				let cardFlipAnimation = new Animation(1000);
				cardFlipAnimation.draw = (ctx, timestamp) => {
					//where card starts at
					const CARD_SOURCE = ctx.canvas.width/2 - this.cardWidth/2;
					//where card ends up
					const CARD_DESTINATION = ctx.canvas.width/2 - this.cardWidth*2;
					let image;
					if (cardFlipAnimation.age < cardFlipAnimation.length/2) {
						image = backImage;
					} else {
						image = getCard(this.topPileCard).image;
					}
					image.width = this.cardWidth;
					image.height = this.cardHeight;
					ctx.save();
					//ctx.translate(ctx.canvas.width/2 - image.width/2,ctx.canvas.height/2 - image.width/2);
					//ctx.setTransform(new DOMMatrix().rotate(0,(timestamp/TIME_TO_FLIP) * 100));
					ctx.drawImage(image,CARD_SOURCE + ((CARD_DESTINATION-CARD_SOURCE)/cardFlipAnimation.length)*cardFlipAnimation.age,ctx.canvas.height/2 - image.height/2,image.width,image.height);
					ctx.restore();
				}
				cardFlipAnimation.onEnd = () => {
					let topCardAnimation = new Animation();
					topCardAnimation.draw = (ctx, timestamp) => {
						let topPileCardImage = getCard(this.topPileCard).image;
						topPileCardImage.width = this.cardWidth;
						topPileCardImage.height = this.cardHeight;
						ctx.globalCompositeOperation = 'destination-over';
						ctx.drawImage(topPileCardImage,parseInt(ctx.canvas.width/2 - topPileCardImage.width*2) + .5,parseInt(ctx.canvas.height/2 - topPileCardImage.height/2) + .5,topPileCardImage.width,topPileCardImage.height);
					}
					this.animationManager.addAnimation(topCardAnimation);

					let currentSuitAnimation = new Animation();
					currentSuitAnimation.draw = (ctx, timestamp) => {
						let currentSuitImage = Suit[this.currentSuit].image;
						currentSuitImage.width = this.cardWidth/2;
						currentSuitImage.height = this.cardWidth/2;
						ctx.globalCompositeOperation = 'destination-over';
						ctx.drawImage(currentSuitImage,ctx.canvas.width/2 - this.cardWidth*2 + this.cardWidth/4,ctx.canvas.height/2 - this.cardHeight/2 - currentSuitImage.height - 5,currentSuitImage.width,currentSuitImage.height);
					}
					this.animationManager.addAnimation(currentSuitAnimation);
				}
				this.animationManager.addAnimation(cardFlipAnimation);

				let cardHoverAnimation = new Animation();
				cardHoverAnimation.draw = (ctx, timestamp) => {
					if (!this.guiManager.isGuiPresent) {
						//if hovering over card in hand then draw outline
						for (let h = 0;h < this.usersWithData[0].hand.length;h++) {
							let isFirst = h == 0;
							let cardXStart = (h*backImage.width/2.5) - ((this.usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + ctx.canvas.width/2 + (isFirst ? 0 :this.cardWidth/2);
							let cardYStart = this.usersWithData[0].radius * .95 - (this.cardWidth*1.7) + ctx.canvas.height/2;
							if (KeyData.mouseIn(cardXStart,cardYStart,isFirst ? this.cardWidth : this.cardWidth/2,this.cardHeight) && this.isCardValid(this.usersWithData[0].hand[h])) {
								ctx.globalCompositeOperation = 'destination-over';
								ctx.strokeStyle = "rgba(201,188,6,1)";
								ctx.lineWidth = 4;
								ctx.beginPath();
								ctx.roundRect(cardXStart,cardYStart,isFirst ? this.cardWidth : this.cardWidth/2,this.cardHeight,5);
								ctx.stroke();
							}
						}
						//if hovering over visible cards then draw outline
						for (let c = 0;c < this.usersWithData[0].visibleCards.length;c++) {
							let cardXStart = c*(this.cardWidth * 1.05) - (this.usersWithData[0].visibleCards.length*this.cardWidth)/2 + ctx.canvas.width/2;
							let cardYStart = this.usersWithData[0].radius * .95 - (this.cardWidth*3.2) + ctx.canvas.height/2;
							if (KeyData.mouseIn(cardXStart,cardYStart,this.cardWidth,this.cardHeight) && this.isCardValid(this.usersWithData[0].visibleCards[c])) {
								ctx.globalCompositeOperation = 'destination-over';
								ctx.strokeStyle = "rgba(201,188,6,1)";
								ctx.lineWidth = 4;
								ctx.beginPath();
								ctx.roundRect(cardXStart,cardYStart,this.cardWidth,this.cardHeight,5);
								ctx.stroke();
							}
						}
						//if hovering over deck of cards (extra cards), then show outline
						let extraCardX = ctx.canvas.width/2 - backImage.width/2;
						let extraCardY = ctx.canvas.height/2 - backImage.height/2;
						if (KeyData.mouseIn(extraCardX,extraCardY,this.cardWidth,this.cardHeight + this.extraCardsSize)) {
							ctx.globalCompositeOperation = 'destination-over';
							ctx.strokeStyle = "rgba(201,188,6,1)";
							ctx.lineWidth = 4;
							ctx.beginPath();
							ctx.roundRect(extraCardX,extraCardY,this.cardWidth,this.cardHeight + this.extraCardsSize,5);
							ctx.stroke();
						}
					}
				};
				this.animationManager.addAnimation(cardHoverAnimation);

				let cardsInHandAnimation = new Animation();
				cardsInHandAnimation.draw = (ctx, timestamp) => {
					for (let u of this.usersWithData) {
						ctx.save();
						ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
						ctx.rotate(u.rotation);
						for (let h = 0; h < u.handSize; h++) {
							//if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
							if (u.user != user) {
								ctx.globalCompositeOperation = 'destination-over';
								ctx.drawImage(backImage,-(h*backImage.width/2) + ((u.handSize+ 1) * backImage.width/2)/2 - backImage.width,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
							} else {
								let card = getCard(this.usersWithData[0].hand[h]);
								let cardImage = card.image;
								cardImage.width = this.cardWidth;
								cardImage.height = this.cardHeight;
								ctx.globalCompositeOperation = 'destination-over';
								if (!this.isCardValid(this.usersWithData[0].hand[h])) {
									ctx.fillStyle = "#72717277";
									ctx.beginPath();
									ctx.roundRect((h*backImage.width/1) - ((u.handSize+ 1) * backImage.width/2.5)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height,20);
									ctx.fill();
								}
								ctx.drawImage(cardImage,parseInt((h*backImage.width/2.5) - ((u.handSize+ 1) * backImage.width/2.5)/2),parseInt(u.radius * .95 - (cardImage.width*1.7)),cardImage.width,cardImage.height);
							}
						}
						for (let c = 0; c < u.visibleCards.length; c++) {
							let card = getCard(u.visibleCards[c]);
							let cardImage = card.image;
							cardImage.width = this.cardWidth;
							cardImage.height = this.cardHeight;
							if (!this.isCardValid(this.usersWithData[0].visibleCards[c]) && u.user === user) {
								ctx.fillStyle = "#72717277";
								ctx.globalCompositeOperation = 'destination-over';
								ctx.beginPath();
								ctx.roundRect(c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height,20);
								ctx.fill();
							}
							ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
						}
						ctx.restore();
					}
				}
				this.animationManager.addAnimation(cardsInHandAnimation);
			}
			this.animationManager.addAnimation(dealAnimation);
		}
		this.animationManager.addAnimation(extraCardSpinAnimation);
	}
	//Used to check if card is valid to play with the top pile card
	//the card has to match either suit or value of the top pile card
	//jokers and jacks are wild cards so they always valid to play
	isCardValid(card) {
		let cardData = getCard(card);
		let topCardData = getCard(this.topPileCard);
		//if card is valid for play then they could either play or keep the card they just drawed
		return cardData.suit === this.currentSuit || cardData.value === topCardData.value
			|| cardData.value === "JACK" || cardData.value === "JOKER";
	}
}

let sethHead = new SethHead();
getGameData({
			"extraCardsSize":39,
			"topPileCard":"S1",
			"currentSuit":"SPADES",
			"handsSize":{"f5e66f67-202d-4384-ac92-992afa72a5fd":3,"f5e66f67-202d-4384-ac92-992afa72a5fe":2,"f5e66f67-202d-4384-ac92-992afa72a5ff":1},
			"visibleCards":{"e370c9d9-13a4-4442-990d-7fb36f6eec0b":["S10","H3","DJ"],"f5e66f67-202d-4384-ac92-992afa72a5fd":["SK","H7"],"f5e66f67-202d-4384-ac92-992afa72a5fe":["RJ"],"f5e66f67-202d-4384-ac92-992afa72a5ff":[]},
			"hand":["S7","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","S6","SJ"],
			"playerOnTurn":"e370c9d9-13a4-4442-990d-7fb36f6eec0b"});