
var World = (function () {
    
    /*
     * Polyfill for window.requestAnimationFrame()
     * taken from: https://gist.github.com/paulirish/1579671
     */
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());
	
	var instances = [];
    
    World.inherits(Morph);
    function World(htmlCanvas) {
        Morph.call(this);
        
        var html = htmlCanvas || document.getElementById("world");
        html.width = window.innerWidth;
        html.height = window.innerHeight;
        html.style.position = "fixed";
        var canvas = new Canvas(html);
        var dirtyRectangles = [];
                
        this.html = function () {
            return html;
        };
        this.canvas = function () {
            return canvas;
        };
        this.dirtyRectangles = function (val) {
            if (val !== undefined) {
                dirtyRectangles = val;
            }
            return dirtyRectangles;
        };
        this.owner = function () {
            return undefined;
        };
        this.position = function () {
            return {x: 0, y: 0};
        };
        this.extent = function () {
            return {
                w: html.width,
                h: html.height
            };
        };
        this.bounds = function () {
            return {
                x: 0,
                y: 0,
                w: html.width,
                h: html.height
            };
        };
        this.initializeEventHandling();
        this.initializeStepping();
		
		instances.push(this);
    }
    
    World.methods({
		registerDirtyRectangle: function (rect) {
			this.dirtyRectangles().push(rect);
		},
		clearDirtyRectangles: function () {
			this.dirtyRectangles([]);
		},
		world: function () {
			return this;
		},
        fullRedraw: function () {
            var canvas = this.canvas();
			this.fullDrawOn(canvas);
			this.clearDirtyRectangles();
        },
		redrawDirtyRectangles: function () {
			var canvas = this.canvas();
			var dirtyRectangles = this.dirtyRectangles();
			
			dirtyRectangles.forEach(function (rect) {
				canvas.clipped(rect, function () {
					this.fullDrawOn(canvas);
				}, this);
			}, this);
			
			this.clearDirtyRectangles();
			return true;
		},
        drawOn: function (canvas) {
            canvas.clearRectangle(this.bounds());
        },
        initializeEventHandling: function () {
            var that = this; // FUCKING Javascript!
            var html = this.html();
            var lastCursorPosition = {x: 0, y: 0};
            
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
                lastCursorPosition = { x: evt.x, y: evt.y };
            });
        },
        initializeStepping: function () {
            var that = this; // FUCKING Javascript!
            function step (now) {
				// Perform all steps
                that.fullStep(now);
				
				// First try to redraw only the dirty rectangles
				if (!that.redrawDirtyRectangles()) {
					// If that didn't work, redraw the whole screen
					that.fullRedraw();
				}
				
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }
    });
    
	World.classMethods({
		instances: function () {
			return instances;
		},
		current: function () {
			return instances[instances.length - 1];
		}
	});
    
    return World;
})();
