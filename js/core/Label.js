class Label extends Morph {
	constructor(text) {
		super();
		this._font = "18px Arial";
		this.text = text;
		this.color = "#AAAAAA";
	}

	get text() {
		return this._text;
	}
	set text(v) {
		this._text = v;
		this.resize();
	}

	get font() {
		return this._font;
	}
	set font(v) {
		this._font = v;
		this.resize();
	}

	resize() {
		let ctx = World.current.canvas.ctx;
		ctx.font = this.font;
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		let metrics = ctx.measureText(this.text);
		this.width = metrics.width;
		this.height = metrics.actualBoundingBoxDescent;
		this.changed();
	}
	drawOn(canvas) {
		canvas.drawText({x: 0, y: 0}, this.text, this.color, this.font, "left", "top");
	}
}
