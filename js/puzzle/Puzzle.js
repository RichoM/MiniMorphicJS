
var Puzzle = (function () {
	
	var picked = null;
	
	Puzzle.inherits(Sprite);
	function Puzzle(form) {
		Sprite.call(this, form);
		
		var up = false;
		this.on("mouseDown", function () {
			if (picked === null) {
				up = true;
				picked = this;
				this.bringToFront();
			}
		});
		this.on("mouseUp", function () {
			if (picked === this) {
				up = false;
				picked = null;
			}
		});
		this.on("step", function () {
			if (up) {
				this.center(World.cursor());
			}
		});
	}
	
	return Puzzle;
})();