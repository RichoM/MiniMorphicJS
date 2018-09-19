class Ellipse extends Morph {
	constructor() {
		super();
	}
	drawOn(canvas) {
		var c = this.center;
		var w = this.width;
		canvas.fillArc(c.x, c.y, w, 0, Math.PI * 2, false, this.color);
	}
} 