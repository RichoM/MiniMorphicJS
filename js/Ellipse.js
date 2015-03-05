
var Ellipse = (function () {
    
    Ellipse.inherits(Morph);
    function Ellipse(text) {
        Morph.call(this);
    }
    
    Ellipse.methods({
        drawOn: function (canvas) {
			var c = this.center();
			var w = this.width();
            canvas.fillArc(c.x, c.y, w, 0, Math.PI * 2, false, this.color());
        }
    });
    
    return Ellipse;
})();