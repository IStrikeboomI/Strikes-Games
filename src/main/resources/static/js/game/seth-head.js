let cardWidth = 100;
let cardHeight = 140;

let extraCardsSize;
let topPileCard;
let currentSuit;
//stores users along with additional data like where they are on ctx.canvas and what their cards are
//location of where users are as follows, bottom is always the client then the user order is top, right, then left
let usersWithData = [];
function init() {
	create();
    //add client first
    //using polar coordinates to display cards because its much easier and looks nicer
    usersWithData.push({user: user, rotation:0, radius: canvas.height/2, onTurn: false});
    //add all the other users after
    for (let i = 0;i < getOtherUsers().length;i++) {
        let u = getOtherUsers()[i];
        let userWithData = {user: u};
        //first user goes on top
        if (i == 0) {
            userWithData.rotation = Math.PI;
            userWithData.radius = canvas.height/2;
        } else {
            if (i == 1) {
                userWithData.rotation = 3*Math.PI/2;
                userWithData.radius = canvas.width/2;
            } else {
                userWithData.rotation = Math.PI/2;
                userWithData.radius = canvas.width/2;
            }
        }
		userWithData.onTurn = false;
        usersWithData.push(userWithData);
    }
	initAnimations();
}

let animationTimestamp;
//timestamp of previous animation frame
let lastTimestamp = 0;
function drawCanvas(siteTimestamp) {
	if (animationTimestamp === undefined) {
        animationTimestamp = siteTimestamp;
    }
    let timestamp = siteTimestamp - animationTimestamp || 0;
	canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
	animationManager.drawAll(timestamp, timestamp - lastTimestamp);
	lastTimestamp = timestamp;
	window.requestAnimationFrame(drawCanvas);
}
function onCanvasClick(e) {
	let x = e.layerX;
    let y = e.layerY;
    //cancel dealing on click so you don't have to see each time you refresh
	if (stillDealing) {
		stillDealing = false;
	} else {
		if (usersWithData[0].onTurn && !guiManager.isGuiPresent) {
			//if hovering over card in hand
			for (let h = 0;h < usersWithData[0].hand.length;h++) {
				let cardXStart = (h*cardWidth/2.5) - ((usersWithData[0].hand.length+ 1) * cardWidth/2.5)/2 + canvas.width/2 + cardWidth/2;
				let cardYStart = usersWithData[0].radius * .95 - (cardWidth*1.7) + canvas.height/2;
				if (KeyData.mouseIn(cardXStart,cardYStart,cardWidth/2,cardHeight) && isCardValid(usersWithData[0].hand[h])) {
					userPlayCard(usersWithData[0].hand[h])
				}
			}
			//if hovering over visible cards
			for (let c = 0;c < usersWithData[0].visibleCards.length;c++) {
				let cardXStart = c*(cardWidth * 1.05) - (usersWithData[0].visibleCards.length*cardWidth)/2 + canvas.width/2;
				let cardYStart = usersWithData[0].radius * .95 - (cardWidth*3.2) + canvas.height/2;
				if (KeyData.mouseIn(cardXStart,cardYStart,cardWidth,cardHeight) && isCardValid(usersWithData[0].visibleCards[c])) {
					userPlayCard(usersWithData[0].visibleCards[c]);
				}
			}
			//if hovering over deck of cards (extra cards)
			let extraCardX = canvas.width/2 - backImage.width/2;
			let extraCardY = canvas.height/2 - backImage.height/2;
			if (KeyData.mouseIn(extraCardX,extraCardY,cardWidth,cardHeight + extraCardsSize)) {
				userDrawCard(randomCard().name);
			}
			return;
		}
		guiManager.onClick(e);
	}
}
function userPlayCard(card) {
	let cardData = getCard(card);
	
	let visibleCardReplaceGui = new Gui(0, 0, canvas.width, canvas.height,false);
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
	let handCardsBox = new GuiElement(-((usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + canvas.width/2,usersWithData[0].radius * .95 - (cardWidth*1.7) + canvas.height/2,100,cardHeight);
	handCardsBox.draw = (ctx) => {
		ctx.strokeStyle = "green";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.roundRect(0,0,handCardsBox.width,handCardsBox.height,25);
		ctx.stroke();
	}
	visibleCardReplaceGui.addElement(handCardsBox);
	
	if (cardData.value === "JACK" || cardData.value === "JOKER") {
		let chosenSuit;
		let chooseSuitGui = new Gui(canvas.width/2 - 250, canvas.height/2 - 250, 500, 500);

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
					guiManager.cancelGui(chooseSuitGui);
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
				if (usersWithData[0].visibleCards.findIndex(c => c==card) != -1 && usersWithData[0].handSize > 0) {
					guiManager.addGui(visibleCardReplaceGui);
				}
			}
		}
		chooseSuitGui.addElement(chooseSuitTextElement);
		guiManager.addGui(chooseSuitGui);
		guiManager.waitForGui(chooseSuitGui);
	}
	if (usersWithData[0].visibleCards.findIndex(c => c==card) != -1 && usersWithData[0].handSize > 0) {
		guiManager.addGui(visibleCardReplaceGui);
	} else {
		playCard(usersWithData[0],card);
	}
}
function playCard(userToPlay, card) {
	let visibleCardsSizeBefore = userToPlay.visibleCards.length;
	userToPlay.visibleCards.remove(card);
	if (visibleCardsSizeBefore === userToPlay.visibleCards.length) {
		userToPlay.handSize--;
	}
	if (userToPlay.user === user) {
		usersWithData[0].hand.remove(card);
	}

	let playCardAnimation = new Animation(1000);
	playCardAnimation.draw = (ctx, timestamp) => {
		ctx.globalCompositeOperation = "source-over";
		let cardImage = getCard(card).image;
		cardImage.width = cardWidth;
		cardImage.height = cardHeight;

		//where card ends up
		const CARD_DESTINATION_X = ctx.canvas.width/2 - cardWidth*2;
		const CARD_DESTINATION_Y = ctx.canvas.height/2 - cardHeight/2;

		let card_source_x = (-Math.sin(userToPlay.rotation) * userToPlay.radius) * .75 + ctx.canvas.width/2 - cardImage.width/2;
		let card_source_y = (Math.cos(userToPlay.rotation) * userToPlay.radius) * .75 + ctx.canvas.height/2 - cardImage.height/2;

		ctx.translate(card_source_x + ((CARD_DESTINATION_X-card_source_x)/playCardAnimation.length)*playCardAnimation.age + cardWidth/2,
					  card_source_y + ((CARD_DESTINATION_Y-card_source_y)/playCardAnimation.length)*playCardAnimation.age + cardHeight/2);
		ctx.rotate((userToPlay.rotation/playCardAnimation.length) * (playCardAnimation.length - playCardAnimation.age));
		ctx.drawImage(cardImage,-cardImage.width/2,
								-cardImage.height/2,cardImage.width,cardImage.height);
	}
	playCardAnimation.onEnd = () => {
		topPileCard = card;
		let cardData = getCard(card);
	}
	animationManager.addAnimation(playCardAnimation,true);
}
//called when the client draws a card
function userDrawCard(card) {
	let canCardBePlayed = isCardValid(card);
	if (canCardBePlayed) {
		let playOrKeepGui = new Gui(canvas.width/2 - 200, canvas.height/2 - 300, 400, 500,false);

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

		let cardElement = new GuiElement(cardWidth*1.5,cardHeight * 1.75,cardWidth*1.5,cardHeight*1.5);
		cardElement.draw = (ctx) => {
			let cardImage = getCard(card).image;
			cardImage.width = cardWidth;
			cardImage.height = cardHeight;
			ctx.drawImage(cardImage,-cardImage.width,-cardImage.height,cardElement.width,cardElement.height);

			const TEXT = "Drawn Card:";
			ctx.textAlign = "center";
			ctx.font = "30px Arial sans-serif";
			ctx.fillStyle = "black";
			let textMeasurements = ctx.measureText(TEXT);
			ctx.fillText(TEXT,-cardImage.width/4,-cardImage.height - 15);
		}
		playOrKeepGui.addElement(cardElement);
		
		let topCardElement = new GuiElement(playOrKeepGui.width * 7/8,playOrKeepGui.height/2 + cardHeight/2,cardWidth,cardHeight);
		topCardElement.draw = (ctx) => {
			let cardImage = getCard(topPileCard).image;
			cardImage.width = cardWidth;
			cardImage.height = cardHeight;
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
			drawCard(usersWithData[0], card);
			guiManager.cancelGui(playOrKeepGui);
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
			usersWithData[0].hand.push(card);
			usersWithData[0].handSize++;
			playCard(usersWithData[0], card);
			guiManager.cancelGui(playOrKeepGui);
		}
		playOrKeepGui.addElement(playCardButton);
		
		guiManager.addGui(playOrKeepGui);
	} else {
		drawCard(usersWithData[0], card);
	}
}
function drawCard(userToDraw, card) {
	let drawCardAnimation = new Animation(500);
	drawCardAnimation.draw = (ctx, timestamp) => {
		ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
		ctx.rotate(userToDraw.rotation);
		let cardImage = getCard(card).image;
		cardImage.width = cardWidth;
		cardImage.height = cardHeight;
		ctx.drawImage(cardImage,-backImage.width/2, userToDraw.radius * (drawCardAnimation.age / drawCardAnimation.length),cardImage.width,cardImage.height);
		ctx.restore();
	}
	drawCardAnimation.onEnd = () => {
		if (userToDraw.visibleCards.length >= 3) {
			userToDraw.handSize++;
			if (userToDraw.user === user) {
				usersWithData[0].hand.push(card);
			}
		} else {
			userToDraw.visibleCards.push(card);
		}
	}
	animationManager.addAnimation(drawCardAnimation,true);
}
let stillDealing = true;
function initAnimations() {
	backImage.width = cardWidth;
    backImage.height = cardHeight;
	let usernameAnimation = new Animation();
	usernameAnimation.draw = (ctx, timestamp) => {
		ctx.textAlign = "center";
		ctx.font = "30px Arial sans-serif";
		ctx.imageSmoothingEnabled = false;
		for (let u of usersWithData) {
			ctx.save();
			ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
			ctx.rotate(u.rotation);
			ctx.fillStyle = u.onTurn ? "black" : "darkGray";
			ctx.fillText(u.user.name, 0,u.radius * .95);
			ctx.restore();
		}
	}
	animationManager.addAnimation(usernameAnimation);
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
		if (!stillDealing) {
			animationManager.cancelAnimation(extraCardSpinAnimation);
		}
	}
	extraCardSpinAnimation.onEnd = () => {
		let dealAnimation = new Animation();
		dealAnimation.draw = (ctx, timestamp) => {
			ctx.globalCompositeOperation = 'destination-over';
			for (let i = 0; i < extraCardsSize;i++) {
				ctx.drawImage(backImage,ctx.canvas.width/2 - backImage.width/2,ctx.canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
			}
			const TIME_TO_DEAL = 500;
			let cardsDealt = Math.floor(dealAnimation.age / TIME_TO_DEAL);
			let largestCardAmount = 0;
			for (let u of usersWithData) {
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
						let card = getCard(usersWithData[0].hand[h]);
						let cardImage = card.image;
						cardImage.width = cardWidth;
						cardImage.height = cardHeight;
						ctx.drawImage(cardImage,h*(cardImage.width * 1.05) - (Math.min(cardsDealt,u.handSize)*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
					}
				}
				//if the amount of cards already dealt is larger than the size of the hand, that means visible cards are being dealt
				if (cardsDealt > u.handSize) {
					for (let c = 0; c < Math.min(cardsDealt - u.handSize, u.visibleCards.length); c++) {
						let card = getCard(u.visibleCards[c]);
						let cardImage = card.image;
						cardImage.width = cardWidth;
						cardImage.height = cardHeight;
						ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
					}
				}
				if (cardsDealt > largestCardAmount) {
					stillDealing = false;
				}
				if (!stillDealing) {
					animationManager.cancelAnimation(dealAnimation);
				}
				ctx.restore();
			}
		}
		dealAnimation.onEnd = () => {
			let extraCardAnimation = new Animation();
			extraCardAnimation.draw = (ctx, timestamp) => {
				ctx.globalCompositeOperation = 'destination-over';
				for (let i = 0; i < extraCardsSize;i++) {
					ctx.drawImage(backImage,ctx.canvas.width/2 - backImage.width/2,ctx.canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
				}
			}
			animationManager.addAnimation(extraCardAnimation);
			let cardFlipAnimation = new Animation(1000);
			cardFlipAnimation.draw = (ctx, timestamp) => {
				//where card starts at
				const CARD_SOURCE = ctx.canvas.width/2 - cardWidth/2;
				//where card ends up
				const CARD_DESTINATION = ctx.canvas.width/2 - cardWidth*2;
				let image;
				if (cardFlipAnimation.age < cardFlipAnimation.length/2) {
					image = backImage;
				} else {
					image = getCard(topPileCard).image;
				}
				image.width = cardWidth;
				image.height = cardHeight;
				ctx.save();
				//ctx.translate(ctx.canvas.width/2 - image.width/2,ctx.canvas.height/2 - image.width/2);
				//ctx.setTransform(new DOMMatrix().rotate(0,(timestamp/TIME_TO_FLIP) * 100));
				ctx.drawImage(image,CARD_SOURCE + ((CARD_DESTINATION-CARD_SOURCE)/cardFlipAnimation.length)*cardFlipAnimation.age,ctx.canvas.height/2 - image.height/2,image.width,image.height);
				ctx.restore();
			}
			cardFlipAnimation.onEnd = () => {
				let topCardAnimation = new Animation();
				topCardAnimation.draw = (ctx, timestamp) => {
					let topPileCardImage = getCard(topPileCard).image;
					topPileCardImage.width = cardWidth;
					topPileCardImage.height = cardHeight;
					ctx.globalCompositeOperation = 'destination-over';
					ctx.drawImage(topPileCardImage,ctx.canvas.width/2 - topPileCardImage.width*2,ctx.canvas.height/2 - topPileCardImage.height/2,topPileCardImage.width,topPileCardImage.height);
				}
				animationManager.addAnimation(topCardAnimation);
				
				let currentSuitAnimation = new Animation();
				currentSuitAnimation.draw = (ctx, timestamp) => {
					let currentSuitImage = Suit[currentSuit].image;
					currentSuitImage.width = 50;
					currentSuitImage.height = 50;
					ctx.globalCompositeOperation = 'destination-over';
					ctx.drawImage(currentSuitImage,ctx.canvas.width/2 - cardWidth*2 + cardWidth/4,ctx.canvas.height/2 - cardHeight/2 - currentSuitImage.height - 5,currentSuitImage.width,currentSuitImage.height);
				}
				animationManager.addAnimation(currentSuitAnimation);
			}
			animationManager.addAnimation(cardFlipAnimation);

			let cardHoverAnimation = new Animation();
			cardHoverAnimation.draw = (ctx, timestamp) => {
				if (!guiManager.isGuiPresent) {
					//if hovering over card in hand then draw outline
					for (let h = 0;h < usersWithData[0].hand.length;h++) {
						let cardXStart = (h*backImage.width/2.5) - ((usersWithData[0].hand.length+ 1) * backImage.width/2.5)/2 + ctx.canvas.width/2 + cardWidth/2;
						let cardYStart = usersWithData[0].radius * .95 - (cardWidth*1.7) + ctx.canvas.height/2;
						if (KeyData.mouseIn(cardXStart,cardYStart,cardWidth/2,cardHeight) && isCardValid(usersWithData[0].hand[h])) {
							ctx.globalCompositeOperation = 'destination-over';
							ctx.strokeStyle = "rgba(201,188,6,1)";
							ctx.lineWidth = 4;
							ctx.beginPath();
							ctx.roundRect(cardXStart,cardYStart,cardWidth/2,cardHeight,5);
							ctx.stroke();
						}
					}
					//if hovering over visible cards then draw outline
					for (let c = 0;c < usersWithData[0].visibleCards.length;c++) {
						let cardXStart = c*(cardWidth * 1.05) - (usersWithData[0].visibleCards.length*cardWidth)/2 + ctx.canvas.width/2;
						let cardYStart = usersWithData[0].radius * .95 - (cardWidth*3.2) + ctx.canvas.height/2;
						if (KeyData.mouseIn(cardXStart,cardYStart,cardWidth,cardHeight) && isCardValid(usersWithData[0].visibleCards[c])) {
							ctx.globalCompositeOperation = 'destination-over';
							ctx.strokeStyle = "rgba(201,188,6,1)";
							ctx.lineWidth = 4;
							ctx.beginPath();
							ctx.roundRect(cardXStart,cardYStart,cardWidth,cardHeight,5);
							ctx.stroke();
						}
					}
					//if hovering over deck of cards (extra cards), then show outline
					let extraCardX = ctx.canvas.width/2 - backImage.width/2;
					let extraCardY = ctx.canvas.height/2 - backImage.height/2;
					if (KeyData.mouseIn(extraCardX,extraCardY,cardWidth,cardHeight + extraCardsSize)) {
						ctx.globalCompositeOperation = 'destination-over';
						ctx.strokeStyle = "rgba(201,188,6,1)";
						ctx.lineWidth = 4;
						ctx.beginPath();
						ctx.roundRect(extraCardX,extraCardY,cardWidth,cardHeight + extraCardsSize,5);
						ctx.stroke();
					}
				}
			};
			animationManager.addAnimation(cardHoverAnimation);

			let cardsInHandAnimation = new Animation();
			cardsInHandAnimation.draw = (ctx, timestamp) => {
				for (let u of usersWithData) {
					ctx.save();
					ctx.translate(ctx.canvas.width/2,ctx.canvas.height/2);
					ctx.rotate(u.rotation);
					for (let h = 0; h < u.handSize; h++) {
						//if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
						if (u.user != user) {
							ctx.globalCompositeOperation = 'destination-over';
							ctx.drawImage(backImage,-(h*backImage.width/2) + ((u.handSize+ 1) * backImage.width/2)/2 - backImage.width,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
						} else {
							let card = getCard(usersWithData[0].hand[h]);
							let cardImage = card.image;
							cardImage.width = cardWidth;
							cardImage.height = cardHeight;
							ctx.globalCompositeOperation = 'destination-over';
							if (!isCardValid(usersWithData[0].hand[h])) {
								ctx.fillStyle = "#72717277";
								ctx.beginPath();
								ctx.roundRect((h*backImage.width/2.5) - ((u.handSize+ 1) * backImage.width/2.5)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height,20);
								ctx.fill();
							}
							ctx.drawImage(cardImage,(h*backImage.width/2.5) - ((u.handSize+ 1) * backImage.width/2.5)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
						}
					}
					for (let c = 0; c < u.visibleCards.length; c++) {
						let card = getCard(u.visibleCards[c]);
						let cardImage = card.image;
						cardImage.width = cardWidth;
						cardImage.height = cardHeight;	
						if (!isCardValid(usersWithData[0].visibleCards[c]) && u.user === user) {
							ctx.fillStyle = "#72717277";
							ctx.globalCompositeOperation = 'destination-over-over';
							ctx.beginPath();
							ctx.roundRect(c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height,20);
							ctx.fill();
						}
						ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
					}
					ctx.restore();
				}
			}
			animationManager.addAnimation(cardsInHandAnimation);
		}
		animationManager.addAnimation(dealAnimation);
	}
	animationManager.addAnimation(extraCardSpinAnimation);
}
//Used to check if card is valid to play with the top pile card
//the card has to match either suit or value of the top pile card
//jokers and jacks are wild cards so they always valid to play
function isCardValid(card) {
	let cardData = getCard(card);
	let topCardData = getCard(topPileCard);
	//if card is valid for play then they could either play or keep the card they just drawed
	return cardData.suit === currentSuit || cardData.value === topCardData.value
		|| cardData.value === "JACK" || cardData.value === "JOKER";
}