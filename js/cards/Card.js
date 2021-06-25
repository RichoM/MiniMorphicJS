let Card = (function () {

	let picked = null;

	return class Card extends Sprite {
		constructor(form) {
			super(form);

			this.up = false;
			this.cursorOffset = {x: 0, y: 0};

			this.initializeEventHandling();
		}

		initializeEventHandling() {
			this.on("mouseDown", function () {
				if (picked === null) {
					this.up = true;
					this.cursorOffset = {
						x: this.left - World.cursor.x,
						y: this.top - World.cursor.y
					};
					picked = this;
					World.current.addMorph(this);
				}
			});
			this.on("mouseUp", function () {
				if (picked === this) {
					this.up = false;
					this.cursorOffset = {x: 0, y: 0};
					picked = null;
				}
			});
			this.on("step", function () {
				if (this.up) {
					this.followCursor();
				}
			});
		}
		followCursor() {
			this.left = this.cursorOffset.x + World.cursor.x;
			this.top = this.cursorOffset.y + World.cursor.y;
		}
		drawOn(canvas) {
			super.drawOn(canvas);
			/*canvas.drawText({x: this.center.x, y: this.top - 10},
				JSON.stringify(this.center),
				"blue",
				"16px Arial",
				"center",
				"middle");*/
		}

	};


})();
