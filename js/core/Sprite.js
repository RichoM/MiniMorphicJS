
var Sprite = (function () {
    
    Sprite.inherits(Morph);
    function Sprite(form) {
        Morph.call(this);
        
        this.form = function (val) {
            if (val !== undefined 
                    && val !== form) {
                form = val;
                this.resize();
            }
            return form;
        };
		
		var superContainsPoint = this.containsPoint;
		this.containsPoint = function (point) {
            return superContainsPoint.call(this, point)
					&& this.alphaAt(point) > 0;
        };
        
        this.resize();
    }
    
    Sprite.methods({
        drawOn: function (canvas) {
            var form = this.form();
            if (form !== undefined) {
                canvas.drawImage(this.bounds(), form);
            }
        },        
        resize: function () {
            var form = this.form();
            if (form !== undefined) {
                this.extent(form.extent());
            }
        },
        alphaAt: function (point) {
            var pos = this.position();
            return this.form().alphaAt({
                x: point.x - pos.x,
                y: point.y - pos.y
            });
        }
    });
        
    return Sprite;
})();