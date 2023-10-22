//location of where users are as follows, bottom is always the client then the user order is top, right, then left
let canvas;
let ctx;
let currentAnimationId;
let animations = [];

let cardWidth = 100;
let cardHeight = 140;

let hand = [];
let visibleCards = [];
let extraCardsSize;
let topPileCard;
//stores users along with additional data like where they are on canvas and what their cards are
let usersWithData = [];
function init() {
    canvas = document.createElement("canvas");
    canvas.addEventListener('mousedown', (e) => onCanvasClick(e));
    canvas.addEventListener('mousemove', (e) => onCanvasHover(e));
    canvas.height = document.documentElement.clientHeight * window.devicePixelRatio;
    if (document.documentElement.clientWidth <= 600) {
        canvas.width = document.documentElement.clientWidth;
    } else {
        canvas.width = document.documentElement.clientWidth;
    }
	canvas.width *= window.devicePixelRatio;
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
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
}
let cardsHandedOut = 0;
let startTimestamp;
let stillDealing = true;
//animates cards coming into frame and dealing
function animate(siteTimestamp) {
    if (startTimestamp === undefined) {
        startTimestamp = siteTimestamp;
    }
    let timestamp = siteTimestamp - startTimestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //draws usernames
    ctx.textAlign = "center";
    ctx.font = "30px Arial sans-serif";
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
		ctx.fillStyle = u.onTurn ? "black" : "darkGray";
        ctx.fillText(u.user.name, 0,u.radius * .95);
        u.textDimensions = ctx.measureText(u.user.name);
        ctx.restore();
    }
    backImage.width = cardWidth;
    backImage.height = cardHeight;
    if (timestamp <= (canvas.width / 2 - backImage.width/2)) {
        //Everything here in this block is to show the card deck spinning onto the screen
        ctx.save();
        let imageX = canvas.width - backImage.width/2 - timestamp;
        ctx.translate(imageX,canvas.height/2-backImage.height/2);
        let rotation = (timestamp / (canvas.width / 2 - backImage.width/2)) * 4 * Math.PI;
        ctx.rotate(rotation);
        ctx.translate(-imageX,-(canvas.height/2-backImage.height/2));
        for (let i = 0; i < 54;i++) {
            ctx.drawImage(backImage,imageX,canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
        }
        ctx.restore();
    } else {
		const TIME_TO_DEAL = canvas.width/4;
		let dealTimestamp = timestamp - (canvas.width / 2 - backImage.width/2);
		let cardsDealt = Math.floor(dealTimestamp / TIME_TO_DEAL);
		let largestCardAmount = 0;
		ctx.globalCompositeOperation = 'destination-over';
		for (let i = 0; i < extraCardsSize;i++) {
            ctx.drawImage(backImage,canvas.width/2 - backImage.width/2,canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
        }
        for (let u of usersWithData) {
			largestCardAmount = Math.max(largestCardAmount, u.handSize + u.visibleCards.length);
			if (u.handSize + u.visibleCards.length > cardsDealt) {
				ctx.save();
				ctx.translate(canvas.width/2,canvas.height/2);
				ctx.rotate(u.rotation);
				ctx.drawImage(backImage, -backImage.width/2, u.radius * ((dealTimestamp % TIME_TO_DEAL) / TIME_TO_DEAL),backImage.width,backImage.height);
				ctx.restore();
			}
			ctx.save();
			ctx.translate(canvas.width/2,canvas.height/2);
			ctx.rotate(u.rotation);
			for (let h = 0; h < Math.min(cardsDealt,u.handSize); h++) {
				//if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
				if (u.user != user) {
					ctx.drawImage(backImage,h*(backImage.width * .5) - (Math.min(cardsDealt,u.handSize)*backImage.width)/2 + backImage.width/2,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
				} else {
					let card = getCard(hand[h]);
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
			ctx.restore();
		}

		if (cardsDealt > largestCardAmount) {
			stillDealing = false;
		}
    }
	if (stillDealing) {
		window.requestAnimationFrame(animate);
	} else {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		window.requestAnimationFrame(animateCardFlip);
	}
}
let cardFlipStartTimestamp;
//an entirely different animate function for flipping the top card over
function animateCardFlip(siteTimestamp) {
	if (cardFlipStartTimestamp === undefined) {
        cardFlipStartTimestamp = siteTimestamp;
    }
    let timestamp = siteTimestamp - cardFlipStartTimestamp;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//copied from drawCanvas()
	//draws usernames
    ctx.textAlign = "center";
    ctx.font = "30px Arial sans-serif";
	ctx.imageSmoothingEnabled = false;
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
		ctx.fillStyle = u.onTurn ? "black" : "darkGray";
        ctx.fillText(u.user.name, 0,u.radius * .95);
        ctx.restore();
    }
	ctx.globalCompositeOperation = 'destination-over';
	for (let i = 0; i < extraCardsSize;i++) {
        ctx.drawImage(backImage,canvas.width/2 - backImage.width/2,canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
    }
    //displays all the cards
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
        //draw cards in hand
        for (let h = 0; h < u.handSize; h++) {
            //if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
            if (u.user != user) {
                ctx.drawImage(backImage,h*(backImage.width/2) - (u.handSize*(backImage.width))/2 + backImage.width/2,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
            } else {
                let card = getCard(hand[h]);
                let cardImage = card.image;
                cardImage.width = cardWidth;
                cardImage.height = cardHeight;
                ctx.drawImage(cardImage,h*(cardImage.width * 1.05) - (u.handSize*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
            }
        }
        //draw visible cards
		for (let c = 0; c < u.visibleCards.length; c++) {
			let card = getCard(u.visibleCards[c]);
			let cardImage = card.image;
			cardImage.width = cardWidth;
			cardImage.height = cardHeight;
			ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
		}
        ctx.restore();
    }
	const TIME_TO_FLIP = 500;
	//where card starts at
	const CARD_SOURCE = canvas.width/2 - cardWidth/2;
	//where card ends up
	const CARD_DESTINATION = canvas.width/2 - cardWidth*2;

	let image;
	if (timestamp < TIME_TO_FLIP/2) {
		image = backImage;
	} else {
		image = getCard(topPileCard).image;
	}
    image.width = cardWidth;
    image.height = cardHeight;
	ctx.save();
	//ctx.translate(canvas.width/2 - image.width/2,canvas.height/2 - image.width/2);
	//ctx.setTransform(new DOMMatrix().rotate(0,(timestamp/TIME_TO_FLIP) * 100));
	ctx.drawImage(image,CARD_SOURCE + ((CARD_DESTINATION-CARD_SOURCE)/TIME_TO_FLIP)*timestamp,canvas.height/2 - image.height/2,image.width,image.height);
	ctx.restore();
	if (timestamp > TIME_TO_FLIP) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawCanvas();
	} else {
		window.requestAnimationFrame(animateCardFlip);
	}
}
let animationTimestamp;
function drawCanvas(siteTimestamp) {
	if (animationTimestamp === undefined) {
        animationTimestamp = siteTimestamp;
    }
    let timestamp = siteTimestamp - animationTimestamp;
	ctx.clearRect(0,0,canvas.width,canvas.height);
    //draws usernames
    ctx.textAlign = "center";
    ctx.font = "30px Arial sans-serif";
	ctx.imageSmoothingEnabled = false;
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
		ctx.fillStyle = u.onTurn ? "black" : "darkGray";
        ctx.fillText(u.user.name, 0,u.radius * .95);
        ctx.restore();
    }
    let topPileCardImage = getCard(topPileCard).image;
    topPileCardImage.width = cardWidth;
    topPileCardImage.height = cardHeight;
    ctx.drawImage(topPileCardImage,canvas.width/2 - topPileCardImage.width*2,canvas.height/2 - topPileCardImage.height/2,topPileCardImage.width,topPileCardImage.height);
	ctx.globalCompositeOperation = 'destination-over';
	for (let i = 0; i < extraCardsSize;i++) {
        ctx.drawImage(backImage,canvas.width/2 - backImage.width/2,canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
    }
    //displays all the cards
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
        for (let h = 0; h < u.handSize; h++) {
            //if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
            if (u.user != user) {
                ctx.drawImage(backImage,h*(backImage.width/2) - (u.handSize*(backImage.width))/2 + backImage.width/2,u.radius * .95 - (backImage.width*1.7),backImage.width,backImage.height);
            } else {
                let card = getCard(hand[h]);
                let cardImage = card.image;
                cardImage.width = cardWidth;
                cardImage.height = cardHeight;
                ctx.drawImage(cardImage,h*(cardImage.width * 1.05) - (u.handSize*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.7),cardImage.width,cardImage.height);
            }
        }
		for (let c = 0; c < u.visibleCards.length; c++) {
			let card = getCard(u.visibleCards[c]);
			let cardImage = card.image;
			cardImage.width = cardWidth;
			cardImage.height = cardHeight;
			ctx.drawImage(cardImage,c*(cardImage.width * 1.05) - (u.visibleCards.length*cardImage.width)/2,u.radius * .95 - (cardImage.width*3.2),cardImage.width,cardImage.height);
		}
        ctx.restore();
    }
	for (let animation of animations) {
		animation.draw(canvas, timestamp);
	}
	window.requestAnimationFrame(drawCanvas);
}
function animateCard(card, rotation, radius, time) {
	let cardImage = getCard(card).image;
	cardImage.width = cardWidth;
	cardImage.height = cardHeight;
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.rotate(rotation);
	ctx.drawImage(cardImage,0,radius,cardImage.width,cardImage.height);
	ctx.restore();
}
function onCanvasHover(e) {
    let x = e.layerX;
    let y = e.layerY;
    //if hovering over card in hand then draw outline
    for (let h = 0;h < hand.length;h++) {
        let cardXStart = h * (cardWidth * 1.05) - (hand.length*cardWidth)/2 + canvas.width/2;
        let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*1.7) + canvas.height/2;
        if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {

        }
    }
	//if hovering over visible cards then draw outline
	for (let c = 0;c < visibleCards.length;c++) {
		let cardXStart = c*(cardWidth * 1.05) - (visibleCards.length*cardWidth)/2 + canvas.width/2;
		let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*3.2) + canvas.height/2;
		if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {

        }
	}
    //if hovering over deck of cards (extra cards), then show outline
    let extraCardX = canvas.width/2 - backImage.width/2;
    let extraCardY = canvas.height/2 - backImage.height/2;
    if (x > extraCardX && x < extraCardX + cardWidth && y > extraCardY && y < extraCardY + cardHeight + extraCardsSize) {

    }
}
function onCanvasClick(e) {
	let x = e.layerX;
    let y = e.layerY;
    //cancel dealing on click so you don't have to see each time you refresh
	if (stillDealing) {
		stillDealing = false;
	}
	//if hovering over card in hand
    for (let h = 0;h < hand.length;h++) {
        let cardXStart = h * (cardWidth * 1.05) - (hand.length*cardWidth)/2 + canvas.width/2;
        let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*1.7) + canvas.height/2;
        if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {
            playCard(usersWithData[0],hand[h]);
        }
    }
	//if hovering over visible cards
	for (let c = 0;c < visibleCards.length;c++) {
		let cardXStart = c*(cardWidth * 1.05) - (visibleCards.length*cardWidth)/2 + canvas.width/2;
		let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*3.2) + canvas.height/2;
		if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {
			console.log(visibleCards[c]);
        }
	}
	//if hovering over deck of cards (extra cards)
    let extraCardX = canvas.width/2 - backImage.width/2;
    let extraCardY = canvas.height/2 - backImage.height/2;
    if (x > extraCardX && x < extraCardX + cardWidth && y > extraCardY && y < extraCardY + cardHeight + extraCardsSize) {

    }
}
function playCard(user, card) {

}