
var Form = (function () {
    
    /*
     * Forms get cached
     */
    var forms = {};
    function setForm(key, form) {
        forms[key] = form;
    }
    function getForm(key) {
        return forms[key];
    }
    
    function Form(img) {        
        this.img = function () {
            return img;
        };
        
        var extent = { w: img.width, h: img.height };
        this.extent = function () {
            return extent;
        };
        
        /*
         * Draw the image on an internal canvas in order to be able to use
         * getImageData() to ask for the colors at a specific pixel.
         */
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        
        this.colorAt = function (point) {
            var data = ctx.getImageData(point.x, point.y, 1, 1).data;
            return {
                r: data[0],
                g: data[1],
                b: data[2],
                a: data[3]
            };
        };
        this.alphaAt = function (point) {
            var data = ctx.getImageData(point.x, point.y, 1, 1).data;
            return data[3];
        };
    }
	
	Form.methods({
		tint: function (r, g, b) {
			var img = this.img();
			var rgbks = generateRGBKs(img);
			var tintImg = generateTintImage(img, rgbks, r, g, b);
			
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			//ctx.fillRect(0, 0, canvas.width, canvas.height);			
			ctx.drawImage(tintImg, 0, 0);
			var result = new Image();
			result.src = canvas.toDataURL();
			return new Form(result);
		}
	});
       
    Form.classMethods({
        load: function (sources, callback) {
            var entries = new Array(sources.length);
            var count = 0;
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                var src = source.src;
                var key = source.key || src;
                
                var img = new Image();
                img.onload = function () {
                    count++;
                    if (count >= sources.length) {
                        callback(entries.map(function (assoc) {
                            var form = new Form(assoc.img);
                            setForm(assoc.key, form);
                            return form;
                        }));
                    }
                };
                img.src = src;
                entries[i] = {
                    key: key,
                    img: img
                };
            }
        },
        get: function (key) {
            return getForm(key);
        }
    });

    /*
     * Code taken from: http://www.playmycode.com/blog/2011/06/realtime-image-tinting-on-html5-canvas/
     */
    function generateRGBKs( img ) {
        var w = img.width;
        var h = img.height;
        var rgbks = [];

        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        
        var ctx = canvas.getContext("2d");
        ctx.drawImage( img, 0, 0 );
        
        var pixels = ctx.getImageData( 0, 0, w, h ).data;

        // 4 is used to ask for 3 images: red, green, blue and
        // black in that order.
        for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
            var canvas = document.createElement("canvas");
            canvas.width  = w;
            canvas.height = h;
            
            var ctx = canvas.getContext('2d');
            ctx.drawImage( img, 0, 0 );
            var to = ctx.getImageData( 0, 0, w, h );
            var toData = to.data;
            
            for (
                    var i = 0, len = pixels.length;
                    i < len;
                    i += 4
            ) {
                toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                toData[i+3] =                pixels[i+3]    ;
            }
            
            ctx.putImageData( to, 0, 0 );
            
            // image is _slightly_ faster then canvas for this, so convert
            var imgComp = new Image();
            imgComp.src = canvas.toDataURL();
            
            rgbks.push( imgComp );
        }

        return rgbks;
    }	

    /*
     * Code taken from: http://www.playmycode.com/blog/2011/06/realtime-image-tinting-on-html5-canvas/
     */
	function generateTintImage( img, rgbks, red, green, blue ) {
        var buff = document.createElement( "canvas" );
        buff.width  = img.width;
        buff.height = img.height;
        
        var ctx  = buff.getContext("2d");

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage( rgbks[3], 0, 0 );

        ctx.globalCompositeOperation = 'lighter';
        if ( red > 0 ) {
            ctx.globalAlpha = red   / 255.0;
            ctx.drawImage( rgbks[0], 0, 0 );
        }
        if ( green > 0 ) {
            ctx.globalAlpha = green / 255.0;
            ctx.drawImage( rgbks[1], 0, 0 );
        }
        if ( blue > 0 ) {
            ctx.globalAlpha = blue  / 255.0;
            ctx.drawImage( rgbks[2], 0, 0 );
        }

        return buff;
    }

    
    return Form;
})();

