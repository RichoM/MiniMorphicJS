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
		canvas.fillRectangle(this.bounds, this.color);
	}
}
