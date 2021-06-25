class Ellipse extends Morph {
	drawOn(canvas) {
		var c = this.center;
		var w = this.width;
		var h = this.height;
		canvas.fillEllipse(c.x, c.y, w/2, h/2, 0, Math.PI * 2, false, this.color);
	}
}
