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
    window.requestAnimationFrame(animate);
}
function animate(timestamp) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let backImage = getCard("back").image;
    backImage.width = 100;
    backImage.height = 140;
    if ((timestamp) <= (canvas.width / 2 - backImage.width/2)) {
        //Everything here in this block is to show the card deck spinning onto the screen
        ctx.save();
        let imageX = (timestamp);
        ctx.translate(imageX,canvas.height/2-backImage.height/2);
        let rotation = (timestamp / (canvas.width / 2 - backImage.width/2)) * 4 * Math.PI;
        ctx.rotate(rotation);
        ctx.translate(-imageX,-(canvas.height/2-backImage.height/2));
        for (let i = 0; i < 40;i++) {
            ctx.drawImage(backImage,imageX,canvas.height/2-backImage.height/2-i,backImage.width,backImage.height);
        }
        ctx.restore();
    } else {
        //this block is to deal out the cards
        ctx.drawImage(backImage,0,0,backImage.width,backImage.height);
        ctx.resetTransform();
        for (let i = 0; i < 40;i++) {
            ctx.drawImage(backImage,canvas.width / 2 - backImage.width/2,canvas.height/2-backImage.height/2-i,backImage.width,backImage.height);
        }
    }
    window.requestAnimationFrame(animate);
}