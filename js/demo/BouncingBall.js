
var BouncingBall = (function () {
    
    BouncingBall.inherits(Morph);
    function BouncingBall() {
        Morph.call(this);
		
		var speed = Math.random() * -2.5;
		this.speed = function () { return speed; };
		
		var world = World.current();
		var extent = Math.random() * 150;
		//this.color("red");
		this.extent({ w: extent, h: extent });
		//this.alpha(Math.random());
		this.center({
			x: Math.random() * world.width(),
			y: Math.random() * (world.height() * 0.5)
		});
		
		this.on("step", function () {
			// Fall
			this.translate({ x: 0, y: speed });
			
			speed += 0.1; // Accelerate
			
			// Bounce
			if (speed > 0 // Only if it's falling
					&& this.bottom() >= world.bottom()) {
				this.bottom(world.bottom());
				speed *= -0.75;
				if (Math.abs(speed) <= 1) {
					speed = 0;
				}
			}
		});
    }
    
    return BouncingBall;
})();