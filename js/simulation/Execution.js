

class Execution	 extends Morph{
	
	constructor(processor,processes){
		super();
		this.processor=processor;
		this.processes=processes.map(e=>e.clone());
		this.view=new VerticalView();
		let state= new HorizontalView();
		state.separator=10;
		this.processes.forEach(e=>state.addMorph(e));
		this.view.addMorph(state);
		this.history=new HorizontalView();
		this.history.separator=0;
		this.view.addMorph(this.history);
		this.addMorph(this.view);
		this.on("step", function (now) {
			this.height=this.view.height;
			this.width=this.view.width;
		});
		
		this.stepWidth=10;
		this.stepHeight=10;
		
		this.state="idle";
		this.switchCost=processor.switchCost;
		this.currentProc=undefined;
		this.idleTime=0;
		this.switchTime=0;
		this.time=0;
		this.nextProc=undefined;
		
	}
	drawOn(canvas){}
	createHistoryStep(color){
		let m = new Morph();
		m.color=color;
		m.bounds={x:0,y:0,w:this.stepWidth,h:this.stepHeight};
		this.history.addMorph(m);
	}
	get finished(){
		return ! this.processes.some(m=>m.work>0);
	}
	tick(){
		let selected=null;
		if(this.finished){return}
		if(this.state=="switch"){
			if(this.switchCost>0){
				this.switchCost--;
				this.createHistoryStep("#FFFF00");
				this.switchTime++;
			}else{
				this.state="processing";
				this.currentProc=this.nextProc;
				this.nextProc=undefined;
				selected=this.currentProc;
				this.switchCost=this.processor.switchCost;
			}
		}
		selected=selected|| this.processor.selectProcess(this.processes,this.time);
		
		if(this.state=="idle"){
			if(selected){	
				this.state="processing";
				this.currentProc=selected;
			}else{ 
					this.createHistoryStep("#FFFFFF");
					this.idleTime++; 
			}
		}
		let workDone=null;
		if(this.state=="processing"){
			if(this.currentProc==selected || this.switchCost==0){
				this.currentProc.work--;
				workDone=this.currentProc;
				this.createHistoryStep(selected.color);
				if(this.currentProc.work==0){this.state="idle";}
			}else{
				//ctxt switch. 
				this.state="switch";
				this.createHistoryStep("#FFFF00");
				this.switchCost=this.processor.switchCost-1;
				this.switchTime++;
				this.nextProc=selected;
				 
			}
		}
		this.processes.forEach((e)=>{if(e!=workDone && e.work>0){e.wait++;}});

		this.time++;
	}
}