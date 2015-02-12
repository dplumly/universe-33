/* Thumb */
(function (window){
	
	var FWDPreloader = function(imageSource_img, segmentWidth, segmentHeight, totalSegments, animDelay){
		
		var self  = this;
		var prototype = FWDPreloader.prototype;
		
		this.imageSource_img = imageSource_img;
		this.image_sdo = null;
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.animDelay = animDelay || 300;
		this.count = 0;
		
		this.delayTimerId_int;
		this.isShowed_bl = true;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			this.setWidth(this.segmentWidth);
			this.setHeight(this.segmentHeight);
		
			this.image_sdo = new FWDSimpleDisplayObject("img");
			this.image_sdo.setScreen(this.imageSource_img);
			this.addChild(this.image_sdo);
			
			this.hide(false);
		};
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		this.start = function(){
			clearInterval(this.delayTimerId_int);
			this.delayTimerId_int = setInterval(this.updatePreloader, this.animDelay);
		};
		
		this.stop = function(){
			clearInterval(this.delayTimerId_int);
		};
		
		this.updatePreloader = function(){
			self.count++;
			if(self.count > self.totalSegments - 1) self.count = 0;
			var posX = self.count * self.segmentWidth;
			self.image_sdo.setX(-posX);
		};
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.show = function(){
			self.setVisible(true);
			self.start();
			TweenMax.killTweensOf(self);
			self.setAlpha(0);
			TweenMax.to(self, 1, {alpha:1});
			self.isShowed_bl = true;
		};
		
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			TweenMax.killTweensOf(self);
			if(animate){
				TweenMax.to(self, 1, {alpha:0, onComplete:self.onHideComplete});
			}else{
				self.setVisible(false);
				self.setAlpha(0);
				self.stop();
			}
			self.isShowed_bl = false;
		};
		
		this.onHideComplete = function(){
			self.setVisible(false);
			self.stop();
			self.dispatchEvent(FWDPreloader.HIDE_COMPLETE);
		};
		
		//###################################//
		/* destroy */
		//##################################//
		this.destroy = function(){
	
			TweenMax.killTweensOf(self);
			self.stop();
			
			self.image_sdo.destroy();
			
			self.imageSource_img = null;
			self.image_sdo = null;
			imageSource_img = null;
			
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDPreloader.prototype = null;
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDPreloader.setPrototype = function(){
    	FWDPreloader.prototype = new FWDDisplayObject("div");
    };
    
    FWDPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDPreloader.prototype = null;
	window.FWDPreloader = FWDPreloader;
}(window));