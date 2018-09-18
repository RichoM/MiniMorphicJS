class EventHandler {
	constructor() {
		//TODO: use private fields when it is on the ECMA standard
		this._eventListeners = {};
		this._handlesMouseMove = false;
		this._handlesKeyboard = false;
		this._handlesStepping = false;
	}
	get wantsToHandleMouseMove() {
		return this._handlesMouseMove;
	}
	set wantsToHandleMouseMove(val) {
		this._handlesMouseMove = val;
		return this._handlesMouseMove;
	}
	get wantsToHandleKeyboard() {
		return this._handlesKeyboard;
	}
	set wantsToHandleKeyboard(val) {
		this._handlesKeyboard = val;
		return this._handlesKeyboard;
	}
	get wantsToHandleStepping() {
		return this._handlesStepping;
	}

	set wantsToHandleStepping(val) {
		this._handlesStepping = val;
		return this._handlesStepping;
	}
	listenersFor(evtType) {
		return this._eventListeners[evtType] || [];
	}
	registerListener(evtType, listener, that) {
		let listeners = this._eventListeners[evtType];
		if (listeners === undefined) {
			listeners = [];
			this._eventListeners[evtType] = listeners;
		}
		if (evtType === "mouseEnter" ||
			evtType === "mouseMove" ||
			evtType === "mouseLeave") {
			this.wantsToHandleMouseMove = true;
		} else if (evtType === "keyDown" ||
			evtType === "keyUp") {
			this.wantsToHandleKeyboard = true;
		} else if (evtType === "step") {
			this.wantsToHandleStepping = true;
		}
		listeners.push({
			that : that,
			callback : listener
		});
	}
	forgetListenersFor(evtType) {
		this._eventListeners[evtType] = undefined;
	}

	handleEvent(evtType, args) {
		var listeners = this.listenersFor(evtType);
		if (listeners.length > 0) {
			listeners.forEach(function (each) {
				each.callback.apply(each.that, args);
			}, this);
			return true;
		}
		return false;
	}
	handleKeyDown(evt) {
		return this.handleEvent("keyDown", [evt]);
	}
	handleKeyUp(evt) {
		return this.handleEvent("keyUp", [evt]);
	}
	handleMouseDown(evt) {
		return this.handleEvent("mouseDown", [evt]);
	}
	handleMouseUp(evt) {
		return this.handleEvent("mouseUp", [evt]);
	}
	handleMouseEnter(evt, lastCursorPosition) {
		return this.handleEvent("mouseEnter", [evt, lastCursorPosition]);
	}
	handleMouseMove(evt, lastCursorPosition) {
		return this.handleEvent("mouseMove", [evt, lastCursorPosition]);
	}
	handleMouseLeave(evt, lastCursorPosition) {
		return this.handleEvent("mouseLeave", [evt, lastCursorPosition]);
	}
	handleStep(now) {
		return this.handleEvent("step", [now]);
	}

}
