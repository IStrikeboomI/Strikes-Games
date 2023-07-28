
function init() {
    let canvas = document.createElement("canvas");
    canvas.height = document.documentElement.clientHeight;
    if (document.documentElement.clientWidth <= 600) {
        canvas.width = document.documentElement.clientWidth;
    } else {
        canvas.width = document.documentElement.clientWidth;
    }

    const ctx = canvas.getContext("2d");
    const img = new Image(100,140);
    img.src = "card/back.png"
    img.onload = (e) => {
        window.requestAnimationFrame(animate);
    }

    function animate(timestamp) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if ((timestamp) <= (canvas.width / 2 - img.width/2)) {
            //Everything here in this block is to show the card deck spinning onto the screen
            ctx.save();
            let imageX = (timestamp);
            ctx.translate(imageX,canvas.height/2-img.height/2);
            let rotation = (timestamp / (canvas.width / 2 - img.width/2)) * 4 * Math.PI;
            ctx.rotate(rotation);
            ctx.translate(-imageX,-(canvas.height/2-img.height/2));
            for (let i = 0; i < 40;i++) {
                ctx.drawImage(img,imageX,canvas.height/2-img.height/2-i,img.width,img.height);
            }
            ctx.restore();
        } else {
            //this block is to deal out the cards
            ctx.drawImage(img,0,0,img.width,img.height);
            ctx.resetTransform();
            for (let i = 0; i < 40;i++) {
                ctx.drawImage(img,canvas.width / 2 - img.width/2,canvas.height/2-img.height/2-i,img.width,img.height);
            }
        }
        window.requestAnimationFrame(animate);
    }

    document.body.appendChild(canvas);
}