class GuybrushThreepwood extends Sprite {
	constructor() {
		let key = 0;
		super(Form.get(key.toString()));

			let world = World.current;
			this.top = (Math.random() * (world.height - this.height));
			this.right = 0;
			
			let last = 0;
			
			// Animate
			this.on("step", function (now) {
				// Only step every 150 ms
				if (now - last < 150)
					return;
				last = now;

				// Next form
				key = (key + 1) % 6;
				this.form = Form.get(key.toString());

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