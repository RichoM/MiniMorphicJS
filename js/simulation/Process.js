class Process extends Morph {
	constructor(name, work, priority, color) {
		super();
		this.name = name;
		this.work = work;
		this.priority = priority;
		this.wait = 0;
		this.color = color;
		this.border = 5;
		this.view = new VerticalView();
		this.addMorph(this.view);
		this.view.adjustWidth=true;
		this.on("step", function (now) {
			this.height=this.view.requiredHeight+2*this.border;
			this.width=this.view.requiredWidth+2*this.border;
			this.view.bounds = {
				x : this.border,
				y : this.border,
				w:this.width-(2*this.border),
				h:this.height-(2*this.border)
			};
			this.view.removeAllSubmorphs();
			this.view.addMorph(new StringMorph(this.name));
			this.view.addMorph(new StringMorph("w: "+ this.work));
			this.view.addMorph(new StringMorph("t: "+ this.wait));
			this.view.addMorph(new StringMorph("p: "+ this.priority));
		});
	}

	get name() {
		return this._name;
	}
	set name(val) {
		this._name = val;
		this.changed();
		return this.name;
	}

	get work() {
		return this._work;
	}
	set work(val) {
		this._work = val;
		this.changed();
		return this.work;
	}

	get priority() {
		return this._priority;
	}
	set priority(val) {
		this._priority = val;
		this.changed();
		return this.priority;
	}

	get wait() {
		return this._wait;
	}
	set wait(val) {
		this._wait = val;
		this.changed();
		return this.wait;
	}

	get border() {
		return this._border;
	}
	set border(val) {
		this._border = val;
		this.changed();
		return this.border;
	}

	drawOn(canvas) {
		canvas.fillRectangle(this.bounds, this.color);
	}
}
