
var EventHandler = (function () {
    
    function EventHandler() {        
        var eventListeners = {};
        var handlesMouseMove = false;
        var handlesKeyboard = false;
        var handlesStepping = false;
        
        this.listenersFor = function (evtType) {
            return eventListeners[evtType] || [];
        };
        this.registerListener = function (evtType, listener, that) {
            var listeners = eventListeners[evtType];
            if (listeners === undefined) {
                listeners = [];
                eventListeners[evtType] = listeners;
            }
            if (evtType === "mouseEnter" ||
                    evtType === "mouseMove" ||
                    evtType === "mouseLeave") {
                handlesMouseMove = true;
            } else if (evtType === "keyDown" ||
                    evtType === "keyUp") {
                handlesKeyboard = true;
            } else if (evtType === "step") {
                handlesStepping = true;
            }
            listeners.push({
                that: that,
                callback: listener
            });
        };
		this.forgetListenersFor = function (evtType) {
			eventListeners[evtType] = undefined;
		};
        this.wantsToHandleMouseMove = function () {
            return handlesMouseMove;
        };
        this.wantsToHandleKeyboard = function () {
            return handlesKeyboard;
        };
        this.wantsToHandleStepping = function () {
            return handlesStepping;
        };
    }
    
    EventHandler.methods({
        handleEvent: function (evtType, args) {
            var listeners = this.listenersFor(evtType);
            if (listeners.length > 0) {
                listeners.forEach(function (each) {
                    each.callback.apply(each.that, args);
                }, this);
                return true;
            }
            return false;
        },
        handleKeyDown: function (evt) {
            return this.handleEvent("keyDown", [evt]);
        },
        handleKeyUp: function (evt) {
            return this.handleEvent("keyUp", [evt]);
        },
        handleMouseDown: function (evt) {
            return this.handleEvent("mouseDown", [evt]);
        },
        handleMouseUp: function (evt) {
            return this.handleEvent("mouseUp", [evt]);
        },
        handleMouseEnter: function (evt, lastCursorPosition) {
            return this.handleEvent("mouseEnter", [evt, lastCursorPosition]);
        },
        handleMouseMove: function (evt, lastCursorPosition) {
            return this.handleEvent("mouseMove", [evt, lastCursorPosition]);
        },
        handleMouseLeave: function (evt, lastCursorPosition) {
            return this.handleEvent("mouseLeave", [evt, lastCursorPosition]);
        },
        handleStep: function (now) {
            return this.handleEvent("step", [now]);
        }
    });
    
    return EventHandler;
})();

