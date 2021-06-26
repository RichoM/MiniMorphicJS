class Processor extends Morph {
	constructor(name, color,switchCost, selectionFunction) {
		super();
		this.name = name;
		this.selectionFunction=selectionFunction;
		this.switchCost=switchCost;
	}

	get name() {
		return this._name;
	}
	set name(val) {
		this._name = val;
		this.changed();
		return this.name;
	}
	selectProcess(state,time){
		return this.selectionFunction(state,time);
	}


	drawOn(canvas) {
		// TODO(Richo): Isn't this exactly the default implementation??
		canvas.fillRectangle({x: 0, y: 0, w: this.width, h: this.height}, this.color);
	}
}
