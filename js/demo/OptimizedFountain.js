
var OptimizedFountain = (function () {
    
    OptimizedFountain.inherits(Morph);
    function OptimizedFountain() {
        Morph.call(this);
				
		var particles = [];
		this.particles = function (val) { 
			if (val !== undefined) {
				particles = val;
			}
			return particles; 
		};
		
		var started = false;
		this.started = function (val) {
			if (val !== undefined) {
				started = val;
			}
			return started;
		};
		
		/*
		Make it as big as the world. ACAACA Richo: I should have a better way of 
		saying this morph must expand on its parent.
		*/
		this.bounds(World.current().bounds());
		this.start();
    }
    
	OptimizedFountain.methods({
		drawOn: function (canvas) {
			var particles = this.particles();
			for (var i = 0; i < particles.length; i++) {
				var particle = particles[i];
				canvas.withAlpha(particle.alpha, function () {
					canvas.fillRectangle({
						x: particle.x,
						y: particle.y,
						w: 5,
						h: 5
					}, "blue");
				});
			}
		},
		start: function () {
			this.started(true);
			var center = this.center();
			var maxTime = 4000; // Max lifetime of each particle (in ms)
			
			this.on("step", function (now) {
				// Update bounds just in case the windows was resized
				this.bounds(World.current().bounds());
				
				var particles = this.particles();
				
				// Move all particles
				var keep = []; // Which particles will survive this generation
				for (var i = 0; i < particles.length; i++) {
					var particle = particles[i];
					particle.x += particle.speed.x;
					particle.y += particle.speed.y;
					
					particle.speed.y += 0.1; // Accelerate
					
					var progress = now - particle.startTime;
					particle.alpha = 1 - (progress / maxTime);
					
					// Only keep young particles
					if (progress <= maxTime) {
						keep.push(particle);
					}
				}
				
				// Remove old particles
				this.particles(keep);
				particles = keep;
				
				// Create new particles
				if (this.started()) {
					for (var i = 0; i < 25; i++) {
						this.createNewParticle(now, center, maxTime, particles);
					}
				}
			});
			
			// Make the fountain follow the cursor
			this.on("mouseMove", function (evt) {
				center = { x: evt.x, y: evt.y };
			});
		},
		stop: function () {
			this.started(false);
			// Remove myself when no more particles left
			this.on("step", function () {
				if (this.particles().length === 0) {
					this.remove();
				}
			});
		},
		createNewParticle: function (startTime, center, maxTime, particles) {
			var extent = this.extent();
			
			var particle = {
				x: center.x - 2.5, 
				y: center.y - 2.5,
				startTime: startTime,
				alpha: 1,
				speed: {
					x: Math.random() * (extent.w / 200) - (extent.w / 400),
					y: Math.random() * -1 - (extent.h / 150)
				},				
			};

			particles.push(particle);
		}
	});
	
    return OptimizedFountain;
})();