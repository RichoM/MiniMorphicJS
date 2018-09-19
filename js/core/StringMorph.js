class StringMorph extends Morph {
	constructor(text) {
		super();
		this.text = text;
		this.color = "#AAAAAA";
	}
	get text() {
		return this._text;
	}
	set text(v) {
		this._text = v;
		let canvas = document.createElement("canvas"); 
		let ctx = canvas.getContext("2d");
		ctx.font = "18px Arial";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		let metrics = ctx.measureText(this.text);
		this.width=metrics.width;
		this.changed();
		return this._text;
	}
	drawOn(canvas) {
		canvas.drawText(
			this.position,
			this.text,
			this.color,
			"18px Arial",
			"left",
			"top");
	}
}
