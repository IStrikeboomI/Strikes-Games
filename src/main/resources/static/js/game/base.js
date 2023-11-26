let canvas;
let ctx;
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
	
	ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
}
function onCanvasHover(e) {
	let x = e.layerX;
    let y = e.layerY;
	
	KeyData.mouseX = x;
	KeyData.mouseY = y;
}