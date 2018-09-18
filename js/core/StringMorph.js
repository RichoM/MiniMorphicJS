class StringMorph extends Morph {
	constructor(text) {
		super();
		this._text = text;
		this.color="#AAAAAA";
	}
	get text() {
		return this._text;
	}
	set text(v) {
		this._text = v;
		this.changed();
		return this._text;
	}
	drawOn(canvas) {
		let m = canvas.drawText(
			this.position,
			this.text,
			this.color,
			"18px Arial",
			"left",
			"top");
		this.width=m.width; 
	}
}
