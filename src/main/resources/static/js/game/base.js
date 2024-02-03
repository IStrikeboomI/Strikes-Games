class Game {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.animationManager = new AnimationManager(this.canvas);
		this.guiManager = new GuiManager(this.animationManager);
		this.forceLandscape = false;
		this.animationTimestamp;
		this.canvas.addEventListener('mousedown', (e) => this.onCanvasClick(e));
		this.canvas.addEventListener('mousemove', (e) => this.onCanvasHover(e));
		window.addEventListener('resize', (e) => this.onResize(e));

		this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio;
		this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio;

		this.canvas.style.height = (this.canvas.height / window.devicePixelRatio) + "px";
		this.canvas.style.width = (this.canvas.width / window.devicePixelRatio) + "px";

		document.body.appendChild(this.canvas);
	}
	drawCanvas(siteTimestamp) {
		if (this.animationTimestamp === undefined) {
			this.animationTimestamp = siteTimestamp;
		}
		let timestamp = siteTimestamp - this.animationTimestamp || 0;
		let ctx = this.canvas.getContext("2d");

		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		ctx.save();
		ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
		console.log(window.devicePixelRatio);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";
		this.animationManager.drawAll(timestamp, timestamp -  this.lastTimestamp);
		ctx.restore();
		this.lastTimestamp = timestamp;
		window.requestAnimationFrame(this.drawCanvas.bind(this));
	}
	onResize(e) {
		this.canvas.height = document.documentElement.clientHeight * window.devicePixelRatio;
		this.canvas.width = document.documentElement.clientWidth * window.devicePixelRatio;

		this.canvas.style.height = (this.canvas.height / window.devicePixelRatio) + "px";
		this.canvas.style.width = (this.canvas.width / window.devicePixelRatio) + "px";
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