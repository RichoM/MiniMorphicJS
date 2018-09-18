var Morph = (function () {
	/*
	 * Reimplemented because Array.prototype.indexOf is not fully supported in
	 * all browsers.
	 */
	if (Array.prototype.indexOf === undefined) {
		Array.prototype.indexOf = function (obj) {
			for (var i = 0; i < this.length; i++) {
				if (obj === this[i]) {
					return i;
				}
			}
			return -1;
		};
	}

	return class Morph {
		constructor() {
			//TODO: use private fields when it is on the ECMA standard
			this._owner = undefined;
			/*
			 * ACAACA Richo: the position is currently absolute, it should be
			 * relative to its owner.
			 */
			this._bounds = {
				x : 0,
				y : 0,
				w : 40,
				h : 30
			};
			this._submorphs = [];
			this._eventHandler = new EventHandler();
			this._alpha = 1;
			this._color = "#0000FF";
		}
		//Properties
		get owner() {
			return this._owner;
		}
		set owner(val) {
			this._owner = val;
			return this._owner;
		}

		get bounds() {
			return this._bounds;
		}
		set bounds(val) {
			this._bounds = val;
			this.changed();
			return this._bounds;
		}

		get position() {
			return {
				x : this.bounds.x,
				y : this.bounds.y
			};
		}
		set position(val) {
			this.moveDelta({
				x : val.x - this.bounds.x,
				y : val.y - this.bounds.y
			});
			this.changed();
			return this.position;
		}

		get extent() {
			return {
				w : this.bounds.w,
				h : this.bounds.h
			};
		}
		set extent(val) {

			this.bounds.w = val.w;
			this.bounds.h = val.h;
			this.changed();
			return this.extent;
		}
		get width() {
			return this.extent.w;
		}
		set width(val) {
			this.extent = {
				w : val,
				h : this.extent.h
			};
			return this.width;
		}
		get height() {
			return this.extent.h;
		}
		set height(val) {
			this.extent = {
				w : this.extent.w,
				h : val
			};
			return this.height;
		}
		get submorphs() {
			return this._submorphs;
		}
		get eventHandler() {
			return this._eventHandler;
		}
		/*
		 * Alpha relative to its owner.
		 */
		get alpha() {
			return this._alpha;
		}
		set alpha(val) {
			this._alpha = val;
			this.changed();
			return this._alpha;
		}
		/*
		 * We also need the absolute alpha in order to draw.
		 */
		get absoluteAlpha() {
			return alpha * (owner ? owner.absoluteAlpha() : 1);
		}
		get color() {
			return this._color;
		}
		set color(val) {
			this._color = val;
			this.changed();
			return this._color;
		}

		get left() {
			return this.position.x;
		}
		set left(val) {
			this.position = {
				x : val,
				y : this.position.y
			};
			return this.left;
		}
		get right() {
			return this.position.x + this.width;
		}
		set right(val) {
			this.position = {
				x : val - this.width,
				y : this.position.y
			};
			return this.right;
		}

		get top() {
			return this.position.y;
		}
		set top(val) {
			this.position = {
				x : this.position.x,
				y : val
			};
			return this.top;
		}

		get bottom() {
			return this.position.y + this.height;
		}
		set bottom(val) {
			this.position = {
				x : this.position.x,
				y : val - this.height
			};
			return this.bottom;
		}

		get topCenter() {
			let pos = this.position;
			return {
				x : pos.x + (this.width / 2),
				y : pos.y
			};
		}
		set topCenter(val) {
			this.position = {
				x : val.x - (this.width / 2),
				y : val.y
			};
			return this.topCenter;
		}

		get bottomCenter() {
			let bounds = this.bounds;
			return {
				x : bounds.x + (bounds.w / 2),
				y : bounds.y + bounds.h
			};
		}
		set bottomCenter(val) {
			let bounds = this.bounds;
			this.position = {
				x : val.x - (bounds.w / 2),
				y : val.y - bounds.h
			};
			return this.bottomCenter;
		}

		get center() {
			let bounds = this.bounds;
			return {
				x : bounds.x + (bounds.w / 2),
				y : bounds.y + (bounds.h / 2)
			};
		}
		set center(val) {
			let bounds = this.bounds;
			this.position = {
				x : val.x - (bounds.w / 2),
				y : val.y - (bounds.h / 2)
			};
			return this.center;
		}

		get wantsToHandleMouseMove() {
			return this.eventHandler.wantsToHandleMouseMove;
		}
		get wantsToHandleKeyboard() {
			return this.eventHandler.wantsToHandleKeyboard;
		}

		//Methods
		addMorph(morph) {
			morph.remove();
			this.submorphs.push(morph);
			morph.owner(this);
			this.changed();
			return this;
		}
		removeMorph(morph) {
			let index = this.submorphs.indexOf(morph);
			if (index >= 0) {
				morph.owner(undefined);
				this.submorphs.splice(index, 1);
				this.changed();
				morph.trigger("removed", [this]);
			}
			return this;
		}
		submorphsDo(callback, that) {
			that = that || this;
			for (var i = 0; i < this.submorphs.length; i++) {
				if (callback.call(that, this.submorphs[i]) === true) {
					break;
				}
			}
			return this;
		}
		reversedSubmorphsDo(callback, that) {
			that = that || this;
			for (var i = this.submorphs.length - 1; i >= 0; i--) {
				if (callback.call(that, this.submorphs[i]) === true) {
					break;
				}
			}
			return this;
		}
		moveDelta(delta) {
			this.bounds.x = this.bounds.x + delta.x;
			this.bounds.y = this.bounds.y + delta.y;
			//TODO: remove this when the position becomes relative to the owner
			this.submorphsDo(function (each) {
				each.moveDelta(delta);
			});
		}
		bringToFront() {
			if (this.owner) {
				this.owner.bringToFront(this);
			}
		}
		bringToFront(morph) {
			let index = this.submorphs.indexOf(morph);
			if (index >= 0) {
				this.submorphs.splice(index, 1);
				this.submorphs.push(morph);
				this.changed();
			}
		}
		sendToBack() {
			if (this.owner) {
				this.owner.sendToBack(this);
			}
		}
		sendToBack(morph) {
			var index = this.submorphs.indexOf(morph);
			if (index >= 0) {
				this.submorphs.splice(index, 1);
				this.submorphs.unshift(morph);
				this.changed();
			}
		}

		isSubmorphOf(morph) {
			let owner = this.owner;
			if (owner === undefined)
				return false;
			return owner === morph || owner.isSubmorphOf(morph);
		}

		remove() {
			var owner = this.owner;
			if (owner !== undefined) {
				owner.removeMorph(this);
			}
			return this;
		}

		containsPoint(point) {
			var bounds = this.bounds;
			return bounds.x <= point.x
			 && bounds.y <= point.y
			 && point.x < (bounds.x + bounds.w)
			 && point.y < (bounds.y + bounds.h);
		}
		changed() {
			var owner = this.owner;
			if (owner !== undefined) {
				owner.changed();
			}
		}

		drawOn(canvas) {
			canvas.fillRectangle(this.bounds, this.color);
		}

		fullDrawOn(canvas) {
			canvas.withAlpha(this.absoluteAlpha, function () {
				this.drawOn(canvas);
				this.submorphsDo(function (submorph) {
					submorph.fullDrawOn(canvas);
				});
			}, this);
		}

		on(evtType, callback, that) {
			let handler = this.eventHandler;
			if (callback === null) {
				handler.forgetListenersFor(evtType);
			} else {
				handler.registerListener(evtType, callback, that || this);
			}
			return this;
		}
		trigger(evtType, args) {
			this.eventHandler.handleEvent(evtType, args);
			return this;
		}
		handleMouseDown(evt) {
			return this.eventHandler.handleMouseDown(evt);
		}
		handleMouseUp(evt) {
			return this.eventHandler.handleMouseUp(evt);
		}
		handleMouseEnter(evt, lastCursorPosition) {
			this.eventHandler.handleMouseEnter(evt, lastCursorPosition);
		}
		handleMouseMove(evt, lastCursorPosition) {
			this.eventHandler.handleMouseMove(evt, lastCursorPosition);
		}
		handleMouseLeave(evt, lastCursorPosition) {
			this.eventHandler.handleMouseLeave(evt, lastCursorPosition);
		}

		handleKeyDown(evt) {
			return this.eventHandler.handleKeyDown(evt);
		}
		handleKeyUp(evt) {
			return this.eventHandler.handleKeyUp(evt);
		}

		fullHandleMouseClick(evt, isMouseDown) {
			let handled = false;
			if (this.containsPoint({
					x : evt.x,
					y : evt.y
				})) {
				handled = isMouseDown ?
					this.handleMouseDown(evt) :
					this.handleMouseUp(evt);
			}
			if (!handled) {
				this.reversedSubmorphsDo(function (submorph) {
					handled = submorph.fullHandleMouseClick(evt, isMouseDown);
					return handled;
				});
			}
			return handled;
		}
		fullHandleMouseMove(evt, lastCursorPosition) {
			// Quick check to avoid unnecessary processing
			if (this.wantsToHandleMouseMove) {
				let pos = {
					x : evt.x,
					y : evt.y
				};
				let isInside = this.containsPoint(pos);
				let wasInside = this.containsPoint(lastCursorPosition);
				if (isInside && !wasInside) {
					this.handleMouseEnter(evt, lastCursorPosition);
				} else if (isInside && wasInside) {
					this.handleMouseMove(evt, lastCursorPosition);
				} else if (!isInside && wasInside) {
					this.handleMouseLeave(evt, lastCursorPosition);
				}
			}
			this.reversedSubmorphsDo(function (submorph) {
				return submorph.fullHandleMouseMove(evt, lastCursorPosition);
			});
		}

		fullHandleKeyboardEvent(evt, isKeyDown) {
			// Quick check to avoid unnecessary processing
			if (this.wantsToHandleKeyboard) {
				if (isKeyDown) {
					this.handleKeyDown(evt);
				} else {
					this.handleKeyUp(evt);
				}
			}
			this.reversedSubmorphsDo(function (submorph) {
				return submorph.fullHandleKeyboardEvent(evt, isKeyDown);
			});
		}

		handleStep(now) {
			return this.eventHandler.handleStep(now);
		}

		wantsToHandleStepping() {
			return this.eventHandler.wantsToHandleStepping();
		}
		fullStep(now) {
			if (this.wantsToHandleStepping) {
				this.handleStep(now);
			}
			this.submorphsDo(function (submorph) {
				return submorph.fullStep(now);
			});
		}

	};
})();
