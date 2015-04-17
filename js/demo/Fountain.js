
var Fountain = (function () {
    
    Fountain.inherits(Morph);
    function Fountain() {
        Morph.call(this);
		
		/*
		Make it as big as the world. ACAACA Richo: I should have a better way of 
		saying this morph must expand on its parent.
		*/
		this.bounds(World.current().bounds());
		this.start();
    }
    
	Fountain.methods({
		drawOn: function () { /* Do nothing */ },
		start: function () {
			var center = this.center();
			var maxTime = 4000; // Max lifetime of each particle (in ms)
			
			// Create particles on each step
			this.on("step", function (now) {
				// Update bounds just in case the windows was resized
				this.bounds(World.current().bounds());
				
				for (var i = 0; i < 5; i++) {
					this.createNewParticle(now, center, maxTime);
				}
			});
			
			// Make the fountain follow the cursor
			this.on("mouseMove", function (evt) {
				center = { x: evt.x, y: evt.y };
			});
		},
		stop: function () {
			this.on("step", null); // Stop creating particles
			// Remove myself when no more particles left
			this.on("step", function () {
				if (this.submorphs().length === 0) {
					this.remove();
				}
			});
		},
		createNewParticle: function (startTime, center, maxTime) {
			var particle = new Morph();
			particle.extent({ w: 5, h: 5 });
			particle.center(center);
			
			var extent = this.extent();
			var speed = {
				x: Math.random() * (extent.w / 200) - (extent.w / 400),
				y: Math.random() * -1 - (extent.h / 150)
			};
			
			particle.on("step", function (now) {
				particle.translate(speed);
				
				speed.y += 0.1; // Accelerate
				
				var progress = now - startTime;
				particle.alpha(1 - (progress / maxTime));
				
				if (progress > maxTime) {
					particle.remove();
				}
			});
					
			this.addMorph(particle);
		}
	});
	
    return Fountain;
})();