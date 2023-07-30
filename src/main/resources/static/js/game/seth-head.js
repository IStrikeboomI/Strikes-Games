let canvas;
let ctx;
function init() {
    canvas = document.createElement("canvas");
    canvas.height = document.documentElement.clientHeight;
    if (document.documentElement.clientWidth <= 600) {
        canvas.width = document.documentElement.clientWidth;
    } else {
        canvas.width = document.documentElement.clientWidth;
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
    let backImage = getCard("back").image;
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
            ctx.drawImage(backImage,imageX,canvas.height/2-backImage.height/2-i,backImage.width,backImage.height);
        }
        ctx.restore();
    } else {
        const TIME_TO_DEAL = 300;
        //this block is to deal out the cards
        ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2-(timestamp % TIME_TO_DEAL),backImage.width,backImage.height);
        ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2+(timestamp % TIME_TO_DEAL),backImage.width,backImage.height);
        ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2- (timestamp % TIME_TO_DEAL),canvas.height/2-backImage.height/2,backImage.width,backImage.height);
        ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2+ (timestamp % TIME_TO_DEAL),canvas.height/2-backImage.height/2,backImage.width,backImage.height);
        if (timestamp % TIME_TO_DEAL) {
            cardsHandedOut += 1;
        }
        for (let i = 0; i < 54 - cardsHandedOut;i++) {
            ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2-i,backImage.width,backImage.height);
        }
    }
    window.requestAnimationFrame(animate);
}