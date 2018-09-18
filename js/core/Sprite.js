class Sprite extends Morph {
	constructor(form) {
		super();
		//TODO: use private fields when it is on the ECMA standard
		this._originalForm = form;
		this._form = form;
		this.resize();
	}
	//Properties
	get originalForm() {
		return this._originalForm;
	}
	get form() {
		return this._form;
	}
	set form(val) {
		if (val !== undefined && val !== this._form) {
			this._form = val;
			this.resize();
		}
		return this.form;
	}
	//Methods
	containsPoint(point) {
		return super.containsPoint(point) && this.alphaAt(point) > 0;
	}

	drawOn(canvas) {
		let form = this.form;
		if (form !== undefined) {
			canvas.drawImage(this.bounds, form);
		}
	}
	resize() {
		let form = this.form;
		if (form !== undefined) {
			this.extent = form.extent;
		}
	}
	alphaAt (point) {
		let pos = this.position;
		return this.form.alphaAt({
			x : point.x - pos.x,
			y : point.y - pos.y
		});
	}
	tint  (r, g, b) {
		this.form = this.originalForm.tint(r, g, b);
	}
}
