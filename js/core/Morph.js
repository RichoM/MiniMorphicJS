
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
    
    function Morph() {        
        var owner = undefined;
        /*
         * ACAACA Richo: the position is currently absolute, it should be
         * relative to its owner.
         */
        var bounds = {
            x: 0,
            y: 0,
            w: 40,
            h: 30
        };
        var submorphs = [];
        var eventHandler = new EventHandler();
        var alpha = 1;
        var color = "#0000FF";
        
        this.owner = function (val) {
            if (arguments.length > 0) {
                owner = val;
            }
            return owner;
        };
        this.bounds = function (val) {
            if (val !== undefined) {
				this.changed(); // ACAACA Richo: Merge the two bounds into one and call invalidRect() once?
                bounds = val;
                this.changed();
            }
            return bounds;
        };
        this.position = function (val) {
            if (val !== undefined) {
				this.changed(); // ACAACA Richo: Merge the two bounds into one and call invalidRect() once?
                this.privateMoveDelta({
                    x: val.x - bounds.x,
                    y: val.y - bounds.y
                });
                this.changed();
            }
            return {
                x: bounds.x,
                y: bounds.y
            };
        };
        this.extent = function (val) {
            if (val !== undefined) {
				this.changed(); // ACAACA Richo: Merge the two bounds into one and call invalidRect() once?
                bounds.w = val.w;
                bounds.h = val.h;
                this.changed();
            }
            return {
                w: bounds.w,
                h: bounds.h
            };
        };
        this.submorphs = function () {
            return submorphs;
        };
        this.eventHandler = function () {
            return eventHandler;
        };
        /*
         * Alpha relative to its owner.
         */
        this.alpha = function (val) {
            if (val !== undefined) {
                alpha = val;
                this.changed();
            }
            return alpha;
        };
        /*
         * We also need the absolute alpha in order to draw.
         */
        this.absoluteAlpha = function () {
            return alpha * (owner ? owner.absoluteAlpha() : 1);
        };
        this.color = function (val) {
            if (val !== undefined) {
                color = val;
                this.changed();
            }
            return color;
        };
        this.addMorph = function (morph) {
            morph.remove();
            submorphs.push(morph);
            morph.owner(this);
            this.changed();
            return this;
        };
        this.removeMorph = function (morph) {
            var index = submorphs.indexOf(morph);
            if (index >= 0) {
                morph.owner(undefined);
                submorphs.splice(index, 1);
                this.changed();
                morph.trigger("removed", [this]);
            }
            return this;
        };
        this.submorphsDo = function (callback, that) {
            that = that || this;
            for (var i = 0; i < submorphs.length; i++) {
                if (callback.call(that, submorphs[i]) === true) {
                    break;
                }
            }
            return this;
        };
        this.reversedSubmorphsDo = function (callback, that) {
            that = that || this;
            for (var i = submorphs.length - 1; i >= 0; i--) {
                if (callback.call(that, submorphs[i]) === true) {
                    break;
                }
            }
            return this;
        };
		/*
		This method only updates the bounds but without marking it as dirty.
		Use translate(delta) instead.
		*/
        this.privateMoveDelta = function (delta) {
            bounds.x = bounds.x + delta.x;
            bounds.y = bounds.y + delta.y;
            this.submorphsDo(function (each) {
                each.privateMoveDelta(delta);
            });
        };
    }
    
    Morph.methods({
		width: function (val) {
			if (val !== undefined) {
				this.extent({
					w: val,
					h: this.extent().h
				});
				return val;
			}
			return this.extent().w;
		},
		height: function (val) {
			if (val !== undefined) {
				this.extent({
					w: this.extent().w,
					h: val
				});
				return val;
			}
			return this.extent().h;
		},
		fullBounds: function () {
			// ACAACA Richo: This should return the bounds including all submorphs. I just make a copy for now
			var bounds = this.bounds();
			return {
				x: bounds.x,
				y: bounds.y,
				w: bounds.w,
				h: bounds.h
			};
		},
        remove: function () {
            var owner = this.owner();
            if (owner !== undefined) {
                owner.removeMorph(this);
            }
            return this;
        },
        containsPoint: function (point) {
            var bounds = this.bounds();
            return bounds.x <= point.x 
                    && bounds.y <= point.y
                    && point.x < (bounds.x + bounds.w)
                    && point.y < (bounds.y + bounds.h);
        },
		world: function () {
			var owner = this.owner();			
			return owner !== undefined ? 
				owner.world() : 
				undefined;
		},
        changed: function () {
            this.invalidRect(this.fullBounds());
        },
		invalidRect: function (rect) {
			var world = this.world();
            if (world !== undefined) {
                world.registerDirtyRectangle(rect);
            }
		},
		left: function (val) {
			if (val !== undefined) {
				this.position({
					x: val,
					y: this.position().y
				});
				return val;
			}
			return this.position().x;
		},
		right: function (val) {
			var width = this.width();
			if (val !== undefined) {
				this.position({
					x: val - width,
					y: this.position().y
				});
				return val;
			}
			return this.position().x + width;
		},
		top: function (val) {
			if (val !== undefined) {
				this.position({
					x: this.position().x,
					y: val
				});
				return val;
			}
			return this.position().y;
		},
		bottom: function (val) {
			var height = this.height();
			if (val !== undefined) {
				this.position({
					x: this.position().x,
					y: val - height
				});
				return val;
			}
			return this.position().y + height;
		},
        topCenter: function (val) {
            var width = this.width();
            if (val !== undefined) {
                this.position({
                    x: val.x - (width / 2),
                    y: val.y
                });
                return val;
            }
            var pos = this.position();
            return {
                x: pos.x + (width / 2),
                y: pos.y
            };
        },
        bottomCenter: function (val) {            
            var bounds = this.bounds();
            if (val !== undefined) {
                this.position({
                    x: val.x - (bounds.w / 2),
                    y: val.y - bounds.h
                });
                return val;
            }
            return {
                x: bounds.x + (bounds.w / 2),
                y: bounds.y + bounds.h
            };
        },
        center: function (val) {            
            var bounds = this.bounds();
            if (val !== undefined) {
                this.position({
                    x: val.x - (bounds.w / 2),
                    y: val.y - (bounds.h / 2)
                });
                return val;
            }
            return {
                x: bounds.x + (bounds.w / 2),
                y: bounds.y + (bounds.h / 2)
            };
        },
		translate: function (delta) {
			this.changed();
			this.privateMoveDelta(delta);
			this.changed();
		},
        drawOn: function (canvas) {
            canvas.fillRectangle(this.bounds(), this.color());
        },
        fullDrawOn: function (canvas) {
            canvas.withAlpha(this.absoluteAlpha(), function () {
                this.drawOn(canvas);
                this.submorphsDo(function (submorph) {
                    submorph.fullDrawOn(canvas);
                });                
            }, this);
        },
        on: function (evtType, callback, that) {
			var handler = this.eventHandler();
			if (callback === null) {
				handler.forgetListenersFor(evtType);
			} else {
				handler.registerListener(evtType, callback, that || this);
			}
            return this;
        },
        trigger: function (evtType, args) {
            this.eventHandler().handleEvent(evtType, args);
            return this;
        },
        handleMouseDown: function (evt) {
            return this.eventHandler().handleMouseDown(evt);
        },
        handleMouseUp: function (evt) {
            return this.eventHandler().handleMouseUp(evt);
        },
        handleMouseEnter: function (evt, lastCursorPosition) {
            this.eventHandler().handleMouseEnter(evt, lastCursorPosition);
        },
        handleMouseMove: function (evt, lastCursorPosition) {
            this.eventHandler().handleMouseMove(evt, lastCursorPosition);
        },
        handleMouseLeave: function (evt, lastCursorPosition) {
            this.eventHandler().handleMouseLeave(evt, lastCursorPosition);
        },
        wantsToHandleMouseMove: function () {
            return this.eventHandler().wantsToHandleMouseMove();
        },
        handleKeyDown: function (evt) {
            return this.eventHandler().handleKeyDown(evt);
        },
        handleKeyUp: function (evt) {
            return this.eventHandler().handleKeyUp(evt);
        },
        wantsToHandleKeyboard: function () {
            return this.eventHandler().wantsToHandleKeyboard();
        },
        fullHandleMouseClick: function (evt, isMouseDown) {
            var handled = false;
            if (this.containsPoint({ x: evt.x, y: evt.y })) {
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
        },
        fullHandleMouseMove: function (evt, lastCursorPosition) {
            // Quick check to avoid unnecessary processing
            if (this.wantsToHandleMouseMove()) {
                var pos = { x: evt.x, y: evt.y };
                var isInside = this.containsPoint(pos);
                var wasInside = this.containsPoint(lastCursorPosition);
                if(isInside && !wasInside) {
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
        },
        fullHandleKeyboardEvent: function (evt, isKeyDown) {
            // Quick check to avoid unnecessary processing
            if (this.wantsToHandleKeyboard()) {
                if (isKeyDown) {
                    this.handleKeyDown(evt);
                } else {
                    this.handleKeyUp(evt);
                }
            }            
            this.reversedSubmorphsDo(function (submorph) {
                return submorph.fullHandleKeyboardEvent(evt, isKeyDown);
            });
        },
        handleStep: function (now) {
            return this.eventHandler().handleStep(now);
        },
        wantsToHandleStepping: function () {
            return this.eventHandler().wantsToHandleStepping();
        },
        fullStep: function (now) {
            if (this.wantsToHandleStepping()) {
                this.handleStep(now);
            }
            this.submorphsDo(function (submorph) {
                return submorph.fullStep(now);
            });
        }        
    });
    
    return Morph;
})();
