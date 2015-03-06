
var Canvas = (function () {
    
    function Canvas(html) {
        var ctx = html.getContext("2d");        
        
        this.html = function () { return html; };
        this.ctx = function () { return ctx; };
        
        this.fillRectangle = function (rect, fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        };
		this.fillArc = function (x, y, radius, startAngle, endAngle, anticlockwise, fillStyle) {
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			ctx.closePath();
			ctx.fillStyle = fillStyle;
			ctx.fill();
		};
        this.drawImage = function (rect, form) {
            ctx.drawImage(form.img(), rect.x, rect.y, rect.w, rect.h);
        };
        this.clearRectangle = function (rect) {
            ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
        };
        this.drawText = function (position, text, fillStyle, font, textAlign, textBaseline) {
            ctx.save();
            if (fillStyle) { ctx.fillStyle = fillStyle; }
            if (font) { ctx.font = font; }
            if (textAlign) { ctx.textAlign = textAlign; }
            if (textBaseline) { ctx.textBaseline = textBaseline; }
            ctx.fillText(text, position.x, position.y);
            ctx.restore();
        };
        this.withAlpha = function (alpha, callback, that) {
            var oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = alpha;
            callback.apply(that);
            ctx.globalAlpha = oldAlpha;
        };
    }
    
    return Canvas;
})();