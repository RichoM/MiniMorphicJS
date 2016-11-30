
var Puzzle = (function () {
	
	var picked = null;
	var instances = [];
	
	Puzzle.inherits(Sprite);
	function Puzzle(form) {
		Sprite.call(this, form);
		
		var up = false;
		var collision = null;
		var highlight = false;
		this.collision = function (m) {
			if (collision !== null) {
				collision.highlight(false);
			}
			collision = m;
			if (collision !== null) {
				collision.highlight(true);
			}
		}
		this.highlight = function (v) {
			highlight = v;
		}
		this.on("mouseDown", function () {
			if (picked === null) {
				up = true;
				picked = this;
				World.current().addMorph(this);
			}
		});
		this.on("mouseUp", function () {
			if (picked === this) {
				up = false;
				picked = null;
				if (collision !== null) {
					this.left(collision.right() - 40);
					this.top(collision.top());
					collision.addMorph(this);
					this.collision(null);
				} else {					
					World.current().addMorph(this);
				}
			}
		});
		this.on("step", function () {
			if (up) {
				this.followCursor();
				this.checkCollisions();
			}
		});
		
		var super_drawOn = this.drawOn;
		this.drawOn = function (canvas) {
			if (highlight) {
				var bounds = this.bounds();
				canvas.fillRectangle({
					x: bounds.x + bounds.w - 50,
					y: bounds.y,
					w: 50,
					h: bounds.h
				}, "#00FF00")
			}
			super_drawOn.call(this, canvas);
			canvas.drawText(
                    this.center(), 
                    Math.round(this.left()), 
                    "black",
                    "24px Arial",
                    "center",
                    "middle");
		};
		
		instances.push(this);
	}
	
	Puzzle.methods({
		followCursor: function () {
			this.center(World.cursor());
		},
		checkCollisions: function () {
			var bounds = this.colliderBack();
			this.collision(null);
			for (var i = 0; i < instances.length; i++) {
				var other = instances[i];
				if (other === this ||
					other.submorphs().length > 0 ||
					other.isSubmorphOf(this)) continue;
				if (rectangleIntersect(bounds, other.colliderFront())) {
					this.collision(other);
					break;
				}
			}			
		},
		colliderBack: function () {
			var bounds = this.bounds();
			return {
				x: bounds.x,
				y: bounds.y,
				w: 50,
				h: bounds.h
			};
		},
		colliderFront: function () {
			var bounds = this.bounds();
			return {
				x: bounds.x + bounds.w - 50,
				y: bounds.y,
				w: 50,
				h: bounds.h
			}
		}
	});
	
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
	
	return Puzzle;
})();