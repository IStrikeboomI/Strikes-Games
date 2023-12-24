let canvas;
let animationManager;
let guiManager;
function create() {
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

    document.body.appendChild(canvas);

	animationManager = new AnimationManager(canvas);
	guiManager = new GuiManager(animationManager);
}
function onCanvasHover(e) {
	let x = e.layerX;
    let y = e.layerY;
	
	KeyData.mouseX = x;
	KeyData.mouseY = y;
}