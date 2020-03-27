var World = (function () {
	/*
	 * Polyfill for window.requestAnimationFrame()
	 * taken from: https://gist.github.com/paulirish/1579671
	 */
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license
	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
				 || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					},
						timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
	}
		());

	let instances = [];
	let cursor = {
		x : 0,
		y : 0
	};

	return class World extends Morph {
		constructor(htmlCanvas) {
			super();

			//TODO: use private fields when it is on the ECMA standard
			this._html = htmlCanvas || document.getElementById("world");
			this.html.width = window.innerWidth;
			this.html.height = window.innerHeight;
			this.html.style.position = "fixed";
			this._canvas = new Canvas(this.html);
			this._invalidRect = false;

			this.initializeEventHandling();
			this.initializeStepping();

			instances.push(this);

		}
		get html() {
			return this._html;
		}
		get canvas() {
			return this._canvas;
		}
		get invalidRect() {
			return this._invalidRect;
		}
		set invalidRect(val) {
			this._invalidRect = val;
		}
		get owner() {
			return undefined;
		}
		get position() {
			return {
				x : 0,
				y : 0
			};
		}
		get extent() {
			return {
				w : this.html.width,
				h : this.html.height
			};
		}
		get bounds() {
			return {
				x : 0,
				y : 0,
				w : this.html.width,
				h : this.html.height
			};
		}

		//methods.

		changed() {
			this.invalidRect=this.bounds;
		}
		draw() {
			this.fullDrawOn(this.canvas);
		}
		drawOn(canvas) {
			canvas.clearRectangle(this.bounds);
		}
		initializeEventHandling() {
			let that = this; // FUCKING Javascript!
			let html = this.html;
			let lastCursorPosition = {
				x : 0,
				y : 0
			};

			window.addEventListener("resize", function () {
				html.width = window.innerWidth;
				html.height = window.innerHeight;
				that.changed();
			});
			window.addEventListener("keydown", function (evt) {
				that.fullHandleKeyboardEvent(evt, true);
			});
			window.addEventListener("keyup", function (evt) {
				that.fullHandleKeyboardEvent(evt, false);
			});
			html.addEventListener("mousedown", function (evt) {
				that.fullHandleMouseClick(evt, true);
			});
			html.addEventListener("mouseup", function (evt) {
				that.fullHandleMouseClick(evt, false);
			});
			html.addEventListener("mousemove", function (evt) {
				that.fullHandleMouseMove(evt, lastCursorPosition);
				cursor = lastCursorPosition = {
					x : evt.x,
					y : evt.y
				};
			});
		}
		initializeStepping() {
			var that = this; // FUCKING Javascript!
			let last = 0;
			function step(now) {
				let delta = now - last;
				last = now;
				that.fullStep(now/1000, delta/1000);
				if (that.invalidRect) {
					that.draw();
					that.invalidRect=undefined;
				}
				window.requestAnimationFrame(step);
			}
			window.requestAnimationFrame(step);
		}

		//static methods

		static get instances() {
			return instances;
		}
		static get current() {
			return instances[instances.length - 1];
		}
		static get cursor() {
			return cursor;
		}
	};
})();
