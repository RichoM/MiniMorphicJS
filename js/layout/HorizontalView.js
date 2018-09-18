class HorizontalView extends Morph {
	constructor() {
		super();
		this.separator = 5;
		this.expandsWidth = false;
		this.adjustHeight=false;
		this.requiredWidth=0;
		this.color = "black";
		this.on("step", function (now) {
			if(this.expandsWidth && this.owner)
			{
				this.width=this.owner.width;
			}
			let sep = this.separator;
			let current = this.left + sep;
			let t = this.top + sep;
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
 			if(this.adjustHeight){
				let desiredHeight = maxH + (2 * sep);
				this.height = (this.owner)? (this.owner.height<desiredHeight)?this.owner.height:desiredHeight :desiredHeight;
			}
		});

	}

}
 