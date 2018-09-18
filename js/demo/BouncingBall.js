class BouncingBall extends Ellipse {
	constructor() {
		super();
		//TODO: use private fields when it is on the ECMA standard
		this._speed = Math.random() * -2.5;
		let extent = Math.random() * 150;

		this.color = "red";
		this.extent = {
			w : extent,
			h : extent
		};
		this.alpha = Math.random();
		let world = World.current();
		this.center = {
			x : Math.random() * world.width(),
			y : Math.random() * (world.height() * 0.5)
		};

		this.on("step", function () {
			// Fall
			let center = this.center;
			this.center = {
				x : center.x,
				y : center.y + speed
			};

			this._speed += 0.1; // Accelerate

			// Bounce
			if (this.speed > 0 // Only if it's falling
				 && this.bottom >= world.bottom) {
				this.bottom(world.bottom());
				this._speed *= -0.75;
				if (Math.abs(this.speed) <= 1) {
					this._speed = 0;
				}
			}
		});
	}

	get speed() {
		return this._speed;
	}
}
