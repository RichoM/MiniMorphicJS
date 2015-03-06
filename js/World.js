
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
    
    World.inherits(Morph);
    function World(htmlCanvas) {
        Morph.call(this);
        
        var html = htmlCanvas || document.getElementById("world");
        html.width = window.innerWidth;
        html.height = window.innerHeight;
        html.style.position = "fixed";
        var canvas = new Canvas(html);
        var invalidRect = false;
                
        this.html = function () {
            return html;
        };
        this.canvas = function () {
            return canvas;
        };
        this.invalidRect = function (val) {
            if (arguments.length > 0) {
                invalidRect = val;
            }
            return invalidRect;
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
    }
    
    World.methods({
        changed: function () {
            this.invalidRect(this.bounds());
        },
        draw: function () {
            var canvas = this.canvas();
            this.fullDrawOn(canvas);
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
                that.fullStep(now);
                if (that.invalidRect()) {
                    that.draw();
					that.invalidRect(undefined);
                }
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }
    });
    
    
    return World;
})();
