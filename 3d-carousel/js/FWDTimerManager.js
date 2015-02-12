/* Slide show time manager */
(function(window){
	
	var FWDTimerManager = function(delay, autoplay){
		
		var self = this;
		var prototpype = FWDTimerManager.prototype;
		
		this.timeOutId;
		this.delay = delay;
		this.isStopped_bl = !autoplay;
		
		this.stop = function(){
			clearTimeout(this.timeOutId);
			this.dispatchEvent(FWDTimerManager.STOP);
		};
		
		this.start = function(){
			if(!this.isStopped_bl){
				this.timeOutId = setTimeout(this.onTimeHanlder, this.delay);
				this.dispatchEvent(FWDTimerManager.START);
			}
		};
		
		this.onTimeHanlder = function(){
			self.dispatchEvent(FWDTimerManager.TIME);
		};
		
		/* destroy */
		this.destroy = function(){
			
			clearTimeout(this.timeOutId);
			
			prototpype.destroy();
			self = null;
			prototpype = null;
			FWDTimerManager.prototype = null;
		};
	};

	FWDTimerManager.setProtptype = function(){
		FWDTimerManager.prototype = new FWDEventDispatcher();
	};
	
	FWDTimerManager.START = "start";
	FWDTimerManager.STOP = "stop";
	FWDTimerManager.TIME = "time";
	
	FWDTimerManager.prototype = null;
	window.FWDTimerManager = FWDTimerManager;
	
}(window));