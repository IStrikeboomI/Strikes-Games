class Game {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.animationManager = new AnimationManager(this.canvas);
		this.guiManager = new GuiManager(this.animationManager);
		this.forceLandscape = false;
		this.animationTimestamp;
		this.canvas.addEventListener('mousedown', (e) => this.onCanvasClick(e));
		this.canvas.addEventListener('mousemove', (e) => this.onCanvasHover(e));

		this.canvas.height = document.documentElement.clientHeight;
		this.canvas.width = document.documentElement.clientWidth;

		//this.canvas.style.height = this.canvas.height + "px";
		//this.canvas.style.width = this.canvas.width + "px";
		this.canvas.style.imageRendering = 'pixelated';

		document.body.appendChild(this.canvas);
	}
	drawCanvas(siteTimestamp) {
		if (this.animationTimestamp === undefined) {
			this.animationTimestamp = siteTimestamp;
		}
		let timestamp = siteTimestamp - this.animationTimestamp || 0;
		let ctx = this.canvas.getContext("2d",{antialias:false});
		ctx.mozImageSmoothingEnabled    = false;
		ctx.oImageSmoothingEnabled      = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled     = false;
		ctx.imageSmoothingEnabled       = false;

		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		ctx.translate(.5,.5);
		this.animationManager.drawAll(timestamp, timestamp -  this.lastTimestamp);
		ctx.translate(-.5,-.5);
		this.lastTimestamp = timestamp;
		window.requestAnimationFrame(this.drawCanvas.bind(this));
	}
	onCanvasHover(e) {
		let x = e.layerX;
		let y = e.layerY;

		KeyData.mouseX = x;
		KeyData.mouseY = y;
	}
	forceLandscape(bool) {
		screen.orientation.lock("landscape");
	}
}