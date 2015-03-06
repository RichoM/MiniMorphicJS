
var GuybrushThreepwood = (function () {
    
    GuybrushThreepwood.inherits(Sprite);
    function GuybrushThreepwood() {
        var key = 0;
		Sprite.call(this, Form.get(key.toString()));
		
		var world = World.current();
		this.top(Math.random() * (world.height() - this.height()));
		this.right(0);
				
		// Animate
		var last = 0;
		this.on("step", function (now) {
			// Only step every 150 ms
			if (now - last < 150) return;
			last = now;					
			
			// Next form
			key = (key + 1) % 6;
			this.form(Form.get(key.toString()));
			
			// Move to the right
			this.moveDelta({ x: 25, y: 0 });
			
			// Remove if outside the world
			if (this.left() > world.right()) {
				this.remove();
			}					
		});
    }
    
    return GuybrushThreepwood;
})();