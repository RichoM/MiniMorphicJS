/*
Essentially, the optimization done here is to avoid having a Morph for each particle. Instead, we store
the important properties of each particle (x, y, dx, and dy) in a contiguous array of floats and let the
drawOn(..) method iterate over this big array drawing each particle.
This way we avoid not only the inherent overhead of a Morph but also we avoid creating and deleting a lot
of objects on every frame, thus making the life easier for the GC.

As it is now, we can have much more particles than on the unoptimized Fountain demo. In my computer I can
have up to 10k particles without a significant drop in the FPS meter, while the Fountain demo gives me up
to about 2k.

I'm not sure this was worth the trouble but it was fun to implement anyway :)

- Richo
 */
class OptimizedFountain extends Morph {
	constructor() {
		super();
		//TODO: use private fields when it is on the ECMA standard
		this.MAX_PARTICLES = 10000; // How many particles we'll draw
		this._offset = 0;
		this._particles = new Float32Array(this.MAX_PARTICLES * 4);
		this._started = false;

		this.bounds = World.current.bounds;
		this.start();
	}

	//Methods
	drawOn(canvas) {
		/*
		To achieve better performance, I batch the drawing of the particles with similar alpha
		and avoid changing the canvas alpha (which is expensive) too often.
		To know the alpha of each particle I just calculate how far it is from the offset. The
		newly created particles are right before the offset while the older ones are right after.
		 */
		let bottom = this.bottom;
		let particles = this._particles;
		let steps = 10; // How many times will I change the alpha.
		let particlesPerStep = this.MAX_PARTICLES / steps; // How many particles will I draw per step
		let offset = this._offset;

		for (let step = 0; step < steps; step++) {
			let alpha = step / (steps - 1);
			canvas.withAlpha(alpha, function () {
				for (let i = 0; i < particlesPerStep; i++) {
					let actualIndex = ((step * particlesPerStep) + i + offset) * 4;
					actualIndex %= particles.length;

					var x = particles[actualIndex];
					if (x === 0)
						continue; // Invalid particle, next please
					var y = particles[actualIndex + 1];
					if (y >= bottom)
						continue; // Not visible, next please

					canvas.fillRectangle({
						x : x,
						y : y,
						w : 5,
						h : 5
					}, "blue");
				}
			});
		}
	}
	start() {
		this._started = true;
		var center = this.center;

		this.on("step", function (now) {
			// Update bounds just in case the windows was resized
			this.bounds = World.current.bounds;

			let particles = this._particles;

			// First we move all the particles
			for (let i = 0; i < particles.length; i += 4) {
				let x = particles[i];
				if (x === 0)
					continue; // Invalid particle, we can ignore it

				let y = particles[i + 1];
				let dx = particles[i + 2];
				let dy = particles[i + 3];

				// Move
				x += dx;
				y += dy;

				// Accelerate
				dy += 0.1;

				// Update array
				particles[i] = x;
				particles[i + 1] = y;
				/* dx is constant */
				particles[i + 3] = dy;
			}

			// Then we add or remove particles
			let step = this.MAX_PARTICLES / 200; // How many particles we'll add/remove
			let extent = this.extent;
			for (var i = 0; i < step * 4; i += 4) {
				let offset = this._offset * 4;
				if (this._started) {
					// Add new particle
					let x = center.x - 2.5;
					let y = center.y - 2.5;
					let dx = Math.random() * (extent.w / 200) - (extent.w / 400);
					let dy = Math.random() * -1 - (extent.h / 150);

					particles[offset + i] = x;
					particles[offset + i + 1] = y;
					particles[offset + i + 2] = dx;
					particles[offset + i + 3] = dy;
				} else {
					// Remove existing particle
					particles[offset + i] = 0;
				}
				// Update the offset so that next time we start on the right place
				this._offset = (this._offset + 1) % this.MAX_PARTICLES;
			}
		});

		// Make the fountain follow the cursor
		this.on("mouseMove", function (evt) {
			this.center = {
				x : evt.x,
				y : evt.y
			};
		});
	}
	stop() {
		this._started = false;
		// Remove myself when no more particles are left
		this.on("step", function () {
			for (let i = 0; i < this._particles.length; i += 4) {
				if (this._particles[i] !== 0) {
					return; // We found one, don't remove!
				}
			}
			this.remove();
		});
	}

}
