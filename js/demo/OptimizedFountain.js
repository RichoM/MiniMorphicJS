
var OptimizedFountain = (function () {

	var MAX_PARTICLES = 10000; // How many particles we support
    
    OptimizedFountain.inherits(Morph);
    function OptimizedFountain() {
        Morph.call(this);

		this.index = 0;
		this.particles = new Float32Array(MAX_PARTICLES * 4);
		this.started = false;
		
		/*
		Make it as big as the world. ACAACA Richo: I should have a better way of 
		saying this morph must expand on its parent.
		*/
		this.bounds(World.current().bounds());
		this.start();
    }
    
	OptimizedFountain.methods({
		drawOn: function (canvas) {
			var bottom = this.bottom();
			var particles = this.particles;
			for (var i = 0; i < particles.length; i += 4) {
				var x = particles[i];
				if (x === 0) continue;
				var y = particles[i + 1];
				if (y > bottom) continue;
				
				//canvas.withAlpha(1, function () {
					canvas.fillRectangle({
						x: x,
						y: y,
						w: 5,
						h: 5
					}, "blue");
				//});
			}
		},
		start: function () {
			this.started = true;
			var center = this.center();
			
			this.on("step", function (now) {
				// Update bounds just in case the windows was resized
				this.bounds(World.current().bounds());
				
				var particles = this.particles;
				for (var i = 0; i < particles.length; i += 4) {
					var x = particles[i];
					if (x === 0) continue;
					
					var y = particles[i + 1];
					var dx = particles[i + 2];
					var dy = particles[i + 3];
					
					// Move
					x += dx;
					y += dy;
					
					// Accelerate
					dy += 0.1;
					
					// Update
					particles[i] = x;
					particles[i + 1] = y;
					/* dx is constant */
					particles[i + 3] = dy;
				}
				
				// Create new particles
				if (this.started) {
					var extent = this.extent();
					var s = MAX_PARTICLES / 200; // How many particles we'll add
					for (var i = 0; i < s * 4; i += 4) {
						var x = center.x - 2.5;
						var y = center.y - 2.5;
						var dx = Math.random() * (extent.w / 200) - (extent.w / 400);
						var dy = Math.random() * -1 - (extent.h / 150);
						
						var index = this.index * 4;
						particles[index + i] = x;
						particles[index + i + 1] = y;
						particles[index + i + 2] = dx;
						particles[index + i + 3] = dy;
						this.index = (this.index + 1) % MAX_PARTICLES;
					}
				}
			});
			
			// Make the fountain follow the cursor
			this.on("mouseMove", function (evt) {
				center = { x: evt.x, y: evt.y };
			});
		},
		stop: function () {
			this.started = false;
			// Remove myself when no more particles left
			this.on("step", function () {
				var count = 0;
				for (var i = 0; i < this.particles.length; i += 4) {
					if (this.particles[i] !== undefined) {
						count++;
					}
				}
				if (count === 0) {
					this.remove();
				}
			});
		}
	});
	
    return OptimizedFountain;
})();