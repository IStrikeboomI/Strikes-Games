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
		if (document.documentElement.clientWidth <= 600) {
			this.canvas.width = document.documentElement.clientWidth;
		} else {
			this.canvas.width = document.documentElement.clientWidth;
		}

		document.body.appendChild(this.canvas);
	}
	drawCanvas(siteTimestamp) {
		if (this.animationTimestamp === undefined) {
			this.animationTimestamp = siteTimestamp;
		}
		let timestamp = siteTimestamp - this.animationTimestamp || 0;
		this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
		this.animationManager.drawAll(timestamp, timestamp -  this.lastTimestamp);
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