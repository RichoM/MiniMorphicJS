
var Button = (function () {
    
    Button.inherits(Morph);
    function Button() {
        Morph.call(this);
        
        this.color("#D0062A");
        
        var overColor = "#E40D34";
        this.overColor = function (val) {
            if (val !== undefined) {
                overColor = val;
            }
            return overColor;
        };
        
        var pressedColor = "#BB0022";
        this.pressedColor = function (val) {
            if (val !== undefined) {
                pressedColor = val;
            }
            return pressedColor;
        };
        
        var textColor = "#000000";
        this.textColor = function (val) {
            if (val !== undefined) {
                textColor = val;
            }
            return textColor;
        };
        
        var label = "Press me";
        this.label = function (val) {
            if (val !== undefined) {
                label = val;
            }
            return label;
        };
        
        this.extent({ w: 300, h: 100 });
        this.initializeEventHandling();
    }
    
    Button.methods({
        initializeEventHandling: function () {
            var originalColor = this.color();
            this.on("mouseDown", function () {
                this.color(this.pressedColor());
            });
            this.on("mouseEnter", function () {
                this.color(this.overColor());
            });
            this.on("mouseLeave", function () {
                this.color(originalColor);
            });
            this.on("mouseUp", function () {
                this.color(originalColor);
            });
        },
        drawOn: function (canvas) {
            canvas.fillRectangle(this.bounds(), this.color());
            canvas.drawText(
                    this.center(), 
                    this.label(), 
                    this.textColor(),
                    "24px Arial",
                    "center",
                    "middle");
        }
    });
    
    return Button;
})();