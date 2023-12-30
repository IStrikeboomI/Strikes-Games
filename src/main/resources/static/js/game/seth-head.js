let cardWidth = 100;
let cardHeight = 140;

let extraCardsSize;
let topPileCard;
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
				let cardXStart = h * (cardWidth * 1.05) - (usersWithData[0].hand.length*cardWidth)/2 + canvas.width/2;
				let cardYStart = usersWithData[0].radius * .95 - (cardWidth*1.7) + canvas.height/2;
				if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight && isCardValid(usersWithData[0].hand[h])) {
					userPlayCard(usersWithData[0].hand[h])
				}
			}
			//if hovering over visible cards
			for (let c = 0;c < usersWithData[0].visibleCards.length;c++) {
				let cardXStart = c*(cardWidth * 1.05) - (usersWithData[0].visibleCards.length*cardWidth)/2 + canvas.width/2;
				let cardYStart = usersWithData[0].radius * .95 - (cardWidth*3.2) + canvas.height/2;
				if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight && isCardValid(usersWithData[0].visibleCards[c])) {
					userPlayCard(usersWithData[0].visibleCards[c]);
				}
			}
			//if hovering over deck of cards (extra cards)
			let extraCardX = canvas.width/2 - backImage.width/2;
			let extraCardY = canvas.height/2 - backImage.height/2;
			if (x > extraCardX && x < extraCardX + cardWidth && y > extraCardY && y < extraCardY + cardHeight + extraCardsSize) {
				userDrawCard(randomCard().name);
			}
			return;
		}
		guiManager.onClick(e);
	}
}
function userPlayCard(card) {
	let cardData = getCard(card);
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
		let heartElement = new GuiElement(chooseSuitGui.width/4 - suitWidth/2,chooseSuitGui.height/4 - suitHeight/2.5,suitWidth,suitHeight);
		heartElement.onClick = (e) => {
			chosenSuit = Suit.HEARTS;
			guiManager.cancelGui(chooseSuitGui);
		}
		heartElement.draw = (ctx) => {
			heartImage.width = heartElement.width;
			heartImage.height = heartElement.height;
			ctx.drawImage(heartImage,0,0,heartImage.width,heartImage.height);

			if (KeyData.mouseX >= (chooseSuitGui.x + heartElement.x) && KeyData.mouseX <= (chooseSuitGui.x + heartElement.x + heartElement.width)
			 && KeyData.mouseY >= (chooseSuitGui.y + heartElement.y) && KeyData.mouseY <= (chooseSuitGui.y + heartElement.y + heartElement.height)) {
				ctx.globalCompositeOperation = 'destination-over';
				ctx.strokeStyle = "rgba(201,188,6,1)";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.roundRect(0,0,heartElement.width,heartElement.height,5);
				ctx.stroke();
			}
		}

		let spadeElement = new GuiElement(chooseSuitGui.width*3/4 - suitWidth/2,chooseSuitGui.height/4 - suitHeight/2.5,suitWidth,suitHeight);
		spadeElement.onClick = (e) => {
			chosenSuit = Suit.SPADES;
			guiManager.cancelGui(chooseSuitGui);
		}
		spadeElement.draw = (ctx) => {
			spadeImage.width = spadeElement.width;
			spadeImage.height = spadeElement.height;
			ctx.drawImage(spadeImage,0,0,spadeImage.width,spadeImage.height);

			if (KeyData.mouseX >= (chooseSuitGui.x + spadeElement.x) && KeyData.mouseX <= (chooseSuitGui.x + spadeElement.x + spadeElement.width)
			 && KeyData.mouseY >= (chooseSuitGui.y + spadeElement.y) && KeyData.mouseY <= (chooseSuitGui.y + spadeElement.y + spadeElement.height)) {
				ctx.globalCompositeOperation = 'destination-over';
				ctx.strokeStyle = "rgba(201,188,6,1)";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.roundRect(0,0,spadeElement.width,spadeElement.height,5);
				ctx.stroke();
			}
		}

		let diamondElement = new GuiElement(chooseSuitGui.width/4 - suitWidth/2,chooseSuitGui.height*3/4 - suitHeight/2,suitWidth,suitHeight);
		diamondElement.onClick = (e) => {
			chosenSuit = Suit.DIAMONDS;
			guiManager.cancelGui(chooseSuitGui);
		}
		diamondElement.draw = (ctx) => {
			diamondImage.width = diamondElement.width;
			diamondImage.height = diamondElement.height;
			ctx.drawImage(diamondImage,0,0,diamondImage.width,diamondImage.height);

			if (KeyData.mouseX >= (chooseSuitGui.x + diamondElement.x) && KeyData.mouseX <= (chooseSuitGui.x + diamondElement.x + diamondElement.width)
			 && KeyData.mouseY >= (chooseSuitGui.y + diamondElement.y) && KeyData.mouseY <= (chooseSuitGui.y + diamondElement.y + diamondElement.height)) {
				ctx.globalCompositeOperation = 'destination-over';
				ctx.strokeStyle = "rgba(201,188,6,1)";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.roundRect(0,0,diamondElement.width,diamondElement.height,5);
				ctx.stroke();
			}
		}

		let clubElement = new GuiElement(chooseSuitGui.width*3/4 - suitWidth/2,chooseSuitGui.height*3/4 - suitHeight/2,suitWidth,suitHeight);
		clubElement.onClick = (e) => {
			chosenSuit = Suit.CLUBS;
			guiManager.cancelGui(chooseSuitGui);
		}
		clubElement.draw = (ctx) => {
			clubImage.width = clubElement.width;
			clubImage.height = clubElement.height;
			ctx.drawImage(clubImage,0,0,clubImage.width,clubImage.height);

			if (KeyData.mouseX >= (chooseSuitGui.x + clubElement.x) && KeyData.mouseX <= (chooseSuitGui.x + clubElement.x + clubElement.width)
			 && KeyData.mouseY >= (chooseSuitGui.y + clubElement.y) && KeyData.mouseY <= (chooseSuitGui.y + clubElement.y + clubElement.height)) {
				ctx.globalCompositeOperation = 'destination-over';
				ctx.strokeStyle = "rgba(201,188,6,1)";
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.roundRect(0,0,clubElement.width,clubElement.height,5);
				ctx.stroke();
			}
		}
		chooseSuitGui.onEnd = () => {
			if (chosenSuit !== undefined) {
				playCard(usersWithData[0],card);
			}
		}
		chooseSuitGui.addElement(chooseSuitTextElement);
		chooseSuitGui.addElement(heartElement);
		chooseSuitGui.addElement(spadeElement);
		chooseSuitGui.addElement(diamondElement);
		chooseSuitGui.addElement(clubElement);
		guiManager.addGui(chooseSuitGui);
	}
	if (!guiManager.isGuiPresent) {
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
	let playOrKeepGui = new Gui(canvas.width/2 - 200, canvas.height/2 - 300, 400, 600,false);

	let titleElement = new GuiElement(playOrKeepGui.width/2,0);
	titleElement.draw = (ctx) => {
		const TEXT = canCardBePlayed ? "Play or Keep Card" : "Keep Card";
		ctx.textAlign = "center";
		ctx.font = "40px Arial sans-serif";
		ctx.fillStyle = "black";
		let titleMeasurements = ctx.measureText(TEXT);
		ctx.fillText(TEXT,0,titleMeasurements.actualBoundingBoxAscent + 5);
	}
	playOrKeepGui.addElement(titleElement);

	let cardElement = new GuiElement(playOrKeepGui.width - cardWidth,playOrKeepGui.height/2,cardWidth*2,cardHeight*2);
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
		ctx.fillText(TEXT,0,-cardElement.height/2 - 10);
	}
	playOrKeepGui.addElement(cardElement);

	let topCardElement = new GuiElement(playOrKeepGui.width,playOrKeepGui.height,cardWidth,cardHeight);
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
		ctx.fillText(TEXT,-cardImage.width - topCardElement.width/2,-topCardElement.height/2);
	}
	playOrKeepGui.addElement(topCardElement);

	let keepHandButton = new GuiButton(playOrKeepGui.width *.01,playOrKeepGui.height/4,"Keep In Hand");
	keepHandButton.onClick = (e) => {
		drawCard(usersWithData[0], card, true);
		guiManager.cancelGui(playOrKeepGui);
	}
	playOrKeepGui.addElement(keepHandButton);

	let keepVisibleButton = new GuiButton(playOrKeepGui.width * .01,playOrKeepGui.height/2,"Keep In Visible Hand");
	keepVisibleButton.onClick = (e) => {
		drawCard(usersWithData[0], card, false);
		guiManager.cancelGui(playOrKeepGui);
	}
	playOrKeepGui.addElement(keepVisibleButton);

	if (canCardBePlayed) {
		let playCardButton = new GuiButton(playOrKeepGui.width * .01,playOrKeepGui.height * (3/4),"Play Card");
		playCardButton.onClick = (e) => {
			usersWithData[0].hand.push(card);
			usersWithData[0].handSize++;
			playCard(usersWithData[0], card);
			guiManager.cancelGui(playOrKeepGui);
		}
		playOrKeepGui.addElement(playCardButton);
	}

	guiManager.addGui(playOrKeepGui);
}
function drawCard(userToDraw, card, toHand) {
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
		if (toHand) {
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
						ctx.drawImage(backImage,h*(backImage.width * .5) - (Math.min(cardsDealt,u.handSize)*backImage.width)/2 + backImage.width/2,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
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
					ctx.drawImage(topPileCardImage,ctx.canvas.width/2 - topPileCardImage.width*2,ctx.canvas.height/2 - topPileCardImage.height/2,topPileCardImage.width,topPileCardImage.height);
				}
				animationManager.addAnimation(topCardAnimation);
			}
			animationManager.addAnimation(cardFlipAnimation);

			let cardHoverAnimation = new Animation();
			cardHoverAnimation.draw = (ctx, timestamp) => {
				if (!guiManager.isGuiPresent) {
					//if hovering over card in hand then draw outline
					for (let h = 0;h < usersWithData[0].hand.length;h++) {
						let cardXStart = h * (cardWidth * 1.05) - (usersWithData[0].hand.length*cardWidth)/2 + ctx.canvas.width/2;
						let cardYStart = usersWithData[0].radius * .95 - (cardWidth*1.7) + ctx.canvas.height/2;
						if (KeyData.mouseX > cardXStart && KeyData.mouseX < cardXStart + cardWidth && KeyData.mouseY > cardYStart && KeyData.mouseY < cardYStart + cardHeight && isCardValid(usersWithData[0].hand[h])) {
							ctx.globalCompositeOperation = 'destination-over';
							ctx.strokeStyle = "rgba(201,188,6,1)";
							ctx.lineWidth = 4;
							ctx.beginPath();
							ctx.roundRect(cardXStart,cardYStart,cardWidth,cardHeight,5);
							ctx.stroke();
						}
					}
					//if hovering over visible cards then draw outline
					for (let c = 0;c < usersWithData[0].visibleCards.length;c++) {
						let cardXStart = c*(cardWidth * 1.05) - (usersWithData[0].visibleCards.length*cardWidth)/2 + ctx.canvas.width/2;
						let cardYStart = usersWithData[0].radius * .95 - (cardWidth*3.2) + ctx.canvas.height/2;
						if (KeyData.mouseX > cardXStart && KeyData.mouseX < cardXStart + cardWidth && KeyData.mouseY > cardYStart && KeyData.mouseY < cardYStart + cardHeight && isCardValid(usersWithData[0].visibleCards[c])) {
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
					if (KeyData.mouseX > extraCardX && KeyData.mouseX < extraCardX + cardWidth && KeyData.mouseY > extraCardY && KeyData.mouseY < extraCardY + cardHeight + extraCardsSize) {
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
					ctx.globalCompositeOperation = 'destination-over';
					for (let h = 0; h < u.handSize; h++) {
						//if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
						if (u.user != user) {
							ctx.drawImage(backImage,h*(backImage.width/2) - (u.handSize*(backImage.width))/2 + backImage.width/2,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
						} else {
							let card = getCard(usersWithData[0].hand[h]);
							let cardImage = card.image;
							cardImage.width = cardWidth;
							cardImage.height = cardHeight;
							ctx.globalCompositeOperation = 'source-over';
							ctx.drawImage(cardImage,h*(cardImage.width * 1.05) - (u.handSize*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
							if (!isCardValid(usersWithData[0].hand[h])) {
								ctx.fillStyle = "#72717277";
								ctx.beginPath();
								ctx.roundRect(h*(cardImage.width * 1.05) - (u.handSize*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height,20);
								ctx.fill();

							}
						}
					}
					for (let c = 0; c < u.visibleCards.length; c++) {
						let card = getCard(u.visibleCards[c]);
						let cardImage = card.image;
						cardImage.width = cardWidth;
						cardImage.height = cardHeight;
						ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
						if (!isCardValid(usersWithData[0].visibleCards[c]) && u.user === user) {
							ctx.fillStyle = "#72717277";
							ctx.globalCompositeOperation = 'source-over';
							ctx.beginPath();
							ctx.roundRect(c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height,20);
							ctx.fill();
						}
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
	//if card is valid for play then they could eitehr play or keep the card they just drawed
	return cardData.suit === topCardData.suit || cardData.value === topCardData.value
		|| cardData.value === "JACK" || cardData.value === "JOKER";
}