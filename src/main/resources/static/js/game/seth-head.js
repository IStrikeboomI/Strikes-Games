//location of where users are as follows, bottom is always the client then the user order is top, right, then left
let canvas;
let ctx;

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
    canvas.height = document.documentElement.clientHeight;
    if (document.documentElement.clientWidth <= 600) {
        canvas.width = document.documentElement.clientWidth;
    } else {
        canvas.width = document.documentElement.clientWidth;
    }
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
    backImage.width = 100;
    backImage.height = 140;
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
        window.requestAnimationFrame(animate);
    } else {
        drawCanvas();
    }
   //else {
   //    const TIME_TO_DEAL = canvas.width/2;
   //    //ctx.drawImage(backImage,0,timestamp % TIME_TO_DEAL,backImage.width,backImage.height);

   //    //this block is to deal out the cards
   //    //ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2-(timestamp % TIME_TO_DEAL),backImage.width,backImage.height);
   //    //ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2+(timestamp % TIME_TO_DEAL),backImage.width,backImage.height);
   //    //ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2- (timestamp % TIME_TO_DEAL),canvas.height/2-backImage.height/2,backImage.width,backImage.height);
   //    //ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2+ (timestamp % TIME_TO_DEAL),canvas.height/2-backImage.height/2,backImage.width,backImage.height);
   //    //since timestamp is a float it wont work properly with modulo, still needs testing/fixing
   //    if (Math.round(timestamp) % 10 == 0) {
   //        cardsHandedOut += 1;
   //    }
   //    for (let i = 0; i < 54 - cardsHandedOut;i++) {
   //        ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2-i,backImage.width,backImage.height);
   //    }
   //}
}
function drawCanvas() {
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

    let topPileCardImage = getCard(topPileCard).image;
    topPileCardImage.width = 100;
    topPileCardImage.height = 140;
    ctx.drawImage(topPileCardImage,canvas.width/2 - topPileCardImage.width*2,canvas.height/2 - topPileCardImage.height/2,topPileCardImage.width,topPileCardImage.height);
    for (let i = 0; i < extraCardsSize;i++) {
        ctx.drawImage(backImage,canvas.width/2 - backImage.width/2,canvas.height/2-backImage.height/2+i,backImage.width,backImage.height);
    }
    //displays all the cards in the hand
    for (let u of usersWithData) {
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(u.rotation);
        for (let h = 0;h < u.handSize;h++) {
            //if drawing the current user then draw the client's hand otherwise draw everyone else's card using the back card texture
            if (u.user != user) {
                ctx.drawImage(backImage,h*(backImage.width/2) - (u.handSize*backImage.width/2)/2,u.radius * .95 - (backImage.width*1.75),backImage.width,backImage.height);
            } else {
                let card = getCard(hand[h]);
                let cardImage = card.image;
                cardImage.width = 100;
                cardImage.height = 140;
                ctx.drawImage(cardImage,h*(cardImage.width * 1.05) - (u.handSize*cardImage.width)/2,u.radius * .95 - (cardImage.width*1.75),cardImage.width,cardImage.height);
            }
        }
        ctx.restore();
    }
}
function onCanvasHover(e) {
    let x = e.layerX;
    let y = e.layerY;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCanvas();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = "rgba(201,188,6,1)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(e.layerX,e.layerY,100,100,5);
    ctx.stroke();
}
function onCanvasClick(e) {

}