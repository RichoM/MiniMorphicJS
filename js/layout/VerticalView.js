class VerticalView extends Morph {
	constructor() {
		super();
		this.separator = 5;
		this.adjustHeight = true;
		this.adjustWidth=true;
		this.requiredHeight=0;
		this.requiredWidth=0;
		this.color = "black";
		this.on("step", function (now) {
			
			let sep = this.separator;
			let current =  sep;
			let l =  sep;
			let maxW = 0;
			this.submorphsDo((sm) => {
					sm.top = current;
					sm.left = l;
					if (sm.width > maxW) {
						maxW = sm.width;
					}
					current += sm.height + sep;
				});
			this.requiredHeight=current;
			if(this.adjustHeight && this.owner)
			{
				if(this.height!=this.requiredHeight)
					this.height=this.requiredHeight;
			}
			let desiredWidth = maxW + (2 * sep);
			this.requiredWidth=desiredWidth;
			if(this.adjustWidth){
				if(this.width!=desiredWidth)
					this.width = desiredWidth;
			}
		});

	}

}
 