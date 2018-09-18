class Button extends Morph {
	constructor() {
		super();
		this.color = "#D0062A";

		//TODO: use private fields when it is on the ECMA standard
		this._overColor = "#E40D34";
		this._pressedColor = "#BB0022";
		this._textColor = "#000000";
		this._label = "Press me";

		this.extent = {
			w : 300,
			h : 100
		};
		this.initializeEventHandling();
	}
	//Properties
	get overColor() {
		return this._overColor;
	}
	set overColor(val) {
		this._overColor = val;
	}

	get pressedColor() {
		return this._pressedColor;
	}
	set pressedColor(val) {
		this._pressedColor = val;
	}

	get textColor() {
		return this._textColor;
	}
	set textColor(val) {
		this._textColor = val;
	}

	get label() {
		return this._label;
	}
	set label(val) {
		this._label = val;
	}

	//Methods
	initializeEventHandling() {
		let originalColor = this.color;
		this.on("mouseDown", function () {
			this.color = this.pressedColor;
		});
		this.on("mouseEnter", function () {
			this.color = this.overColor;
		});
		this.on("mouseLeave", function () {
			this.color = originalColor;
		});
		this.on("mouseUp", function () {
			this.color = originalColor;
		});
	}
	drawOn(canvas) {
		canvas.fillRectangle(this.bounds, this.color);
		canvas.drawText(
			this.center,
			this.label,
			this.textColor,
			"24px Arial",
			"center",
			"middle");
	}
}
