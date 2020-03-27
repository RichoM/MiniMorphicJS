class GuybrushThreepwood extends Sprite {
	constructor(forms) {
		let key = 0;
		super(forms[key]);

			let world = World.current;
			this.top = (Math.random() * (world.height - this.height));
			this.right = 0;

			let last = 0;

			// Animate
			this.on("step", function (now, delta) {

				// Only animate every 150 ms
				if (now - last < 0.15) return;
				last = now;

				// Next form
				key = (key + 1) % 6;
				this.form = forms[key];

				// Move to the right
				this.moveDelta({
					x : 25,
					y : 0
				});

				// Remove if outside the world
				if (this.left > world.right) {
					this.remove();
				}
			});

		}

	}
