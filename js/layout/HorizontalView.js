class HorizontalView extends Morph {
	constructor() {
		super();
		this.separator = 5;
		this.adjustWidth = true;
		this.adjustHeight=true;
		this.requiredWidth=0;
		this.requiredHeight=0;
		this.color = "black";
		this.on("step", function (now) {
			
			let sep = this.separator;
			let current = sep;
			let t =  sep;
			let maxH = 0;
			this.submorphsDo((sm) => {
					sm.left = current;
					sm.top = t;
					if (sm.height > maxH) {
						maxH = sm.height;
					}
					current += sm.width + sep;
				});
			this.requiredWidth=current;
			if(this.adjustWidth && this.owner)
			{
				if(this.width!=this.requiredWidth)
					this.width=this.requiredWidth;
			}
			let desiredHeight = maxH + (2 * sep);
			this.requiredHeight=desiredHeight;
 			if(this.adjustHeight){
				if(this.height!=desiredHeight)
					this.height = desiredHeight;
			}
		});

	}

}
 