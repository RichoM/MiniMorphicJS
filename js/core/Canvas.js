class Canvas {
	constructor(html) {
		//TODO: use private fields when it is on the ECMA standard
		this._html = html;
		this._ctx = html.getContext("2d");
	}
	get ctx() {
		return this._ctx;
	}
	get html() {
		return this._html;
	}

	fillRectangle(rect, fillStyle) {
		this.ctx.fillStyle = fillStyle;
		this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}
	fillArc(x, y, radius, startAngle, endAngle, anticlockwise, fillStyle) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		this.ctx.closePath();
		this.ctx.fillStyle = fillStyle;
		this.ctx.fill();
	}
	drawImage(rect, form) {
		this.ctx.drawImage(form.img(), rect.x, rect.y, rect.w, rect.h);
	}
	clearRectangle(rect) {
		this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
	}
	drawText(position, text, fillStyle, font, textAlign, textBaseline) {
		this.ctx.save();
		if (fillStyle) {
			this.ctx.fillStyle = fillStyle;
		}
		if (font) {
			this.ctx.font = font;
		}
		if (textAlign) {
			this.ctx.textAlign = textAlign;
		}
		if (textBaseline) {
			this.ctx.textBaseline = textBaseline;
		}
		this.ctx.fillText(text, position.x, position.y);
		this.ctx.restore();
	}
	withAlpha(alpha, callback, that) {
		var oldAlpha = this.ctx.globalAlpha;
		this.ctx.globalAlpha = alpha;
		callback.apply(that);
		this.ctx.globalAlpha = oldAlpha;
	}
}