//location of where users are as follows, bottom is always the client then the user order is top, right, then left
let canvas;
let ctx;

let cardWidth = 100;
let cardHeight = 140;

let hand = [];
let visibleCards = [];
let extraCardsSize;
let topPileCard;
let playerOnTurn;
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
    usersWithData.push({user: user, rotation:0, radius: canvas.height/2});
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
        usersWithData.push(userWithData);
    }
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
}
let cardsHandedOut = 0;
let startTimestamp;
let stillDealing = true;
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
        ctx.fillText(u.user.name, 0,u.radius * .95);
        u.textDimensions = ctx.measureText(u.user.name);
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
	const TIME_TO_FLIP = 1000;
	ctx.save();
	let topPileCardImage = getCard(topPileCard).image;
    topPileCardImage.width = cardWidth;
    topPileCardImage.height = cardHeight;
	ctx.setTransform(1,timestamp/TIME_TO_FLIP,timestamp/TIME_TO_FLIP,1,0,0);
    ctx.drawImage(topPileCardImage,canvas.width/2 - topPileCardImage.width*2,canvas.height/2 - topPileCardImage.height/2,topPileCardImage.width,topPileCardImage.height);
	ctx.restore();
	if (timestamp > TIME_TO_FLIP) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawCanvas();
	}
	window.requestAnimationFrame(animateCardFlip);
}
function drawCanvas() {
    //draws usernames
    ctx.textAlign = "center";
    ctx.font = "30px Arial sans-serif";
	ctx.imageSmoothingEnabled = false;
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
        ctx.fillText(u.user.name, 0,u.radius * .95);
        u.textDimensions = ctx.measureText(u.user.name);
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
}
function onCanvasHover(e) {
    let x = e.layerX;
    let y = e.layerY;
    //if hovering over card in hand then draw outline
    for (let h = 0;h < hand.length;h++) {
        let cardXStart = h * (cardWidth * 1.05) - (hand.length*cardWidth)/2 + canvas.width/2;
        let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*1.7) + canvas.height/2;
        if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            drawCanvas();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.strokeStyle = "rgba(201,188,6,1)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(cardXStart,cardYStart,cardWidth,cardHeight,5);
            ctx.stroke();
        }
    }
	//if hovering over visible cards then draw outline
	for (let c = 0;c < visibleCards.length;c++) {
		let cardXStart = c*(cardWidth * 1.05) - (visibleCards.length*cardWidth)/2 + canvas.width/2;
		let cardYStart = usersWithData.find(u => u.user===user).radius * .95 - (cardWidth*3.2) + canvas.height/2;
		if (x > cardXStart && x < cardXStart + cardWidth && y > cardYStart && y < cardYStart + cardHeight) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            drawCanvas();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.strokeStyle = "rgba(201,188,6,1)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(cardXStart,cardYStart,cardWidth,cardHeight,5);
            ctx.stroke();
        }
	}
    //if hovering over deck of cards (extra cards), then show outline
    let extraCardX = canvas.width/2 - backImage.width/2;
    let extraCardY = canvas.height/2 - backImage.height/2;
    if (x > extraCardX && x < extraCardX + cardWidth && y > extraCardY && y < extraCardY + cardHeight + extraCardsSize) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawCanvas();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.strokeStyle = "rgba(201,188,6,1)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(extraCardX,extraCardY,cardWidth,cardHeight + extraCardsSize,5);
        ctx.stroke();
    }
}
function onCanvasClick(e) {
	if (stillDealing) {
		stillDealing = false;
	}
}