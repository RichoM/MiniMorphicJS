
var StringMorph = (function () {
    
    StringMorph.inherits(Morph);
    function StringMorph(text) {
        Morph.call(this);
        
        this.text = function () { return text; };
        
        this.color("#D0062A");        
        this.extent({ w: 300, h: 100 });
    }
    
    StringMorph.methods({
        drawOn: function (canvas) {
            canvas.drawText(
                    this.position(), 
                    this.text(), 
                    this.color(),
                    "24px Arial",
                    "left",
                    "top");
        }
    });
    
    return StringMorph;
})();