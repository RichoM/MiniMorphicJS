class Ellipse extends Morph {
	drawOn(canvas) {
		var w = this.width;
		var h = this.height;
		canvas.fillEllipse(w/2, h/2, w/2, h/2, 0, Math.PI * 2, false, this.color);
	}
}
