let Puzzle = (function () {

	let picked = null;
	let instances = [];

	function rectangleIntersect(r1, r2) {
		if (r2.x + r2.w <= r1.x) return false;
		if (r2.y + r2.h <= r1.y) return false;
		if (r2.x >= r1.x + r1.w) return false;
		if (r2.y >= r1.y + r1.h) return false;
		if (r1.w <= 0) return false;
		if (r1.h <= 0) return false;
		if (r2.w <= 0) return false;
		if (r2.h <= 0) return false;
		return true;
	}

	return class Puzzle extends Sprite {

		constructor(form) {
			super(form);

			this._up = false;
			this._collision = null;
			this._highlight = false;

			this.initializeEventHandling();

			instances.push(this);
		}

		// Properties
		get collision () { return this._collision; }
		set collision(m) {
			if (this._collision !== null) {
				this._collision.highlight = false;
			}
			this._collision = m;
			if (this._collision !== null) {
				this._collision.highlight = true;
			}
		}

		get highlight() { return this._highlight; }
		set highlight(v) { this._highlight = v; }

		// Methods
		initializeEventHandling() {
			this.on("mouseDown", function () {
				if (picked === null) {
					this._up = true;
					picked = this;
					World.current.addMorph(this);
				}
			});
			this.on("mouseUp", function () {
				if (picked === this) {
					this._up = false;
					picked = null;
					if (this.collision !== null) {
						this.left = this.collision.right - 40;
						this.top = this.collision.top;
						this.collision.addMorph(this);
						this.collision = null;
					} else {
						World.current.addMorph(this);
					}
				}
			});
			this.on("step", function () {
				if (this._up) {
					this.followCursor();
					this.checkCollisions();
				}
			});
		}
		drawOn(canvas) {
			if (this.highlight) {
				let bounds = this.bounds;
				canvas.fillRectangle({
					x: bounds.w - 50,
					y: 0,
					w: 50,
					h: bounds.h
				}, "#00FF00")
			}
			super.drawOn(canvas);
			canvas.drawText({x: this.width/2, y: this.height/2},
											Math.round(this.left),
											"black",
											"24px Arial",
											"center",
											"middle");
		}
		followCursor() {
			this.center = World.cursor;
		}
		checkCollisions() {
			let bounds = this.colliderBack();
			this.collision = null;
			for (let i = 0; i < instances.length; i++) {
				let other = instances[i];
				if (other === this ||
					other.submorphs.length > 0 ||
					other.isSubmorphOf(this)) continue;

				if (rectangleIntersect(bounds, other.colliderFront())) {
					this.collision = other;
					break;
				}
			}
		}
		colliderBack() {
			let bounds = this.bounds;
			return {
				x: bounds.x,
				y: bounds.y,
				w: 50,
				h: bounds.h
			};
		}
		colliderFront() {
			let bounds = this.bounds;
			return {
				x: bounds.x + bounds.w - 50,
				y: bounds.y,
				w: 50,
				h: bounds.h
			}
		}

	};


})();
