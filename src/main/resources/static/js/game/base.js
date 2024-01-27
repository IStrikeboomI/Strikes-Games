class Game {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.animationManager = new AnimationManager(this.canvas);
		this.guiManager = new GuiManager(this.animationManager);
		this.forceLandscape = false;
		this.animationTimestamp;
		this.canvas.addEventListener('mousedown', (e) => this.onCanvasClick(e));
		this.canvas.addEventListener('mousemove', (e) => this.onCanvasHover(e));
		addEventListener("orientationchange", (e) => this.onOrientationChange(e));

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
		this.forceLandscape = bool;
		if (bool) {
			this.onOrientationChange(null);
		}
	}
	onOrientationChange(e) {
		console.log(screen.orientation.type.match(/\w+/)[0]);
		let rotateGui = new Gui(0, 0, this.canvas.width, this.canvas.height,false);
		rotateGui.easeIn = false;
		if (this.forceLandscape && screen.orientation.type.match(/\w+/)[0] != "landscape") {
			this.rotateGuiId = this.guiManager.addGui(rotateGui,true);
		} else {
			this.guiManager.cancelGui(rotateGui);
		}
	}
}