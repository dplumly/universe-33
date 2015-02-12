/* thumb */
(function(window)
{
	var FWDThumb = function(id, data, parent)
	{
		var self = this;
		var prototype = FWDThumb.prototype;

		this.id = id;
		this.borderSize = data.thumbBorderSize;
		this.backgroundColor = data.thumbBackgroundColor;
		this.borderColor1 = data.thumbBorderColor1;
		this.borderColor2 = data.thumbBorderColor2;

		this.mainDO = null;
		this.borderDO = null;
		this.bgDO = null;
		this.imageHolderDO = null;
		this.imageDO = null;
		this.htmlContentDO = null;
		
		this.overDO = null;
		
		this.gradientDO = null;
		this.gradientLeftDO = null;
		this.gradientRightDO = null;
		
		this.textHolderDO = null;
		this.textGradientDO = null;
		this.textDO = null;
		
		this.finalW = data.thumbWidth;
		this.finalH = data.thumbHeight;
		
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.pos;
		this.thumbScale = 1;
		
		this.showBoxShadow = data.showBoxShadow;
		
		this.curDataListAr;
		
		this.isOver = false;
		this.hasText = false;
		
		this.isMobile = FWDUtils.isMobile;
		this.hasPointerEvent = FWDUtils.hasPointerEvent;

		/* init */
		this.init = function()
		{
			self.setupScreen();
		};

		/* setup screen */
		this.setupScreen = function()
		{
			self.mainDO = new FWDDisplayObject("div");
			self.borderDO = new FWDSimpleDisplayObject("div");
			self.bgDO = new FWDSimpleDisplayObject("div");
			self.imageHolderDO = new FWDDisplayObject("div");
			
			self.addChild(self.mainDO);
			
			self.mainDO.addChild(self.borderDO);
			self.mainDO.addChild(self.bgDO);
			self.mainDO.addChild(self.imageHolderDO);

			self.overDO = new FWDSimpleDisplayObject("div");
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			
			self.mainDO.setWidth(self.finalW);
			self.mainDO.setHeight(self.finalH);

			self.borderDO.setCSSGradient(self.borderColor1, self.borderColor2);
			
			self.borderDO.setWidth(self.finalW);
			self.borderDO.setHeight(self.finalH);
			
			self.bgDO.setBkColor(self.backgroundColor);
			
			self.bgDO.setWidth(self.finalW - self.borderSize * 2);
			self.bgDO.setHeight(self.finalH - self.borderSize * 2);
			
			self.bgDO.setX(self.borderSize);
			self.bgDO.setY(self.borderSize);
			
			self.overDO.setWidth(self.finalW);
			self.overDO.setHeight(self.finalH);
			
			if (!self.isMobile)
			{
				self.overDO.setButtonMode(true);
				
				if (!FWDUtils.isIEAndLessThen9)
				{
					self.setupGradient();
				}
			}
			
			if (FWDUtils.isIE)
			{
				self.overDO.setBkColor("#000000");
				self.overDO.setAlpha(.001);
			}
			
			if (FWDUtils.isAndroid)
			{
				self.setBackfaceVisibility();
				self.mainDO.setBackfaceVisibility();
				self.borderDO.setBackfaceVisibility();
				self.bgDO.setBackfaceVisibility();
				self.imageHolderDO.setBackfaceVisibility();
				self.overDO.setBackfaceVisibility();
			}
			
			self.addChild(self.overDO);
			
			if (self.showBoxShadow)
			{
				self.screen.style.boxShadow = data.thumbBoxShadowCss;
			}
			
			self.curDataListAr = parent.curDataListAr;
		};

		this.addImage = function(image)
		{
			self.imageDO = new FWDSimpleDisplayObject("img");
			self.imageDO.setScreen(image);
			self.imageHolderDO.addChild(self.imageDO);
			
			if (FWDUtils.isAndroid)
			{
				self.imageDO.setBackfaceVisibility();
			}
			
			self.imageDO.setWidth(self.finalW - self.borderSize * 2);
			self.imageDO.setHeight(self.finalH - self.borderSize * 2);
			
			self.imageHolderDO.setX(self.borderSize);
			self.imageHolderDO.setY(self.borderSize);
			
			self.imageHolderDO.setWidth(self.finalW - self.borderSize * 2);
			self.imageHolderDO.setHeight(self.finalH - self.borderSize * 2);

			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.overDO.screen.addEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.overDO.screen.addEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.screen.addEventListener("click", self.onMouseClickHandler);
				}
				else
				{
					self.overDO.screen.attachEvent("onclick", self.onMouseClickHandler);
				}
			}
		};
		
		this.addHtmlContent = function()
		{
			self.htmlContentDO = new FWDSimpleDisplayObject("div");
			self.htmlContentDO.setInnerHTML(self.curDataListAr[self.id].htmlContent);
			self.imageHolderDO.addChild(self.htmlContentDO);
			
			if (FWDUtils.isAndroid)
			{
				self.htmlContentDO.setBackfaceVisibility();
			}
			
			self.htmlContentDO.setWidth(self.finalW - self.borderSize * 2);
			self.htmlContentDO.setHeight(self.finalH - self.borderSize * 2);
			
			self.imageHolderDO.setX(self.borderSize);
			self.imageHolderDO.setY(self.borderSize);
			
			self.imageHolderDO.setWidth(self.finalW - self.borderSize * 2);
			self.imageHolderDO.setHeight(self.finalH - self.borderSize * 2);
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.overDO.screen.addEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.overDO.screen.addEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.overDO.screen.addEventListener("click", self.onMouseClickHandler);
				}
				else
				{
					self.overDO.screen.attachEvent("onclick", self.onMouseClickHandler);
				}
			}
		};
		
		this.setupGradient = function()
		{
			self.gradientDO = new FWDDisplayObject("div");
			self.mainDO.addChild(self.gradientDO);
			
			self.gradientDO.setWidth(self.finalW);
			self.gradientDO.setHeight(self.finalH);
			
			self.gradientLeftDO = new FWDSimpleDisplayObject("img");
			self.gradientDO.addChild(self.gradientLeftDO);
			
			self.gradientLeftDO.setWidth(self.finalW);
			self.gradientLeftDO.setHeight(self.finalH);
			
			self.gradientLeftDO.screen.src = data.thumbGradientLeftPath;
			
			self.gradientRightDO = new FWDSimpleDisplayObject("img");
			self.gradientDO.addChild(self.gradientRightDO);
			
			self.gradientRightDO.setWidth(self.finalW);
			self.gradientRightDO.setHeight(self.finalH);
			
			self.gradientRightDO.screen.src = data.thumbGradientRightPath;
			
			self.gradientLeftDO.setAlpha(0);
			self.gradientRightDO.setAlpha(0);
		};
		
		this.setGradient = function(pos)
		{
			if (self.pos == pos)
				return;

			self.pos = pos;
			
			if (!self.isMobile && !FWDUtils.isIEAndLessThen9)
			{
				switch (self.pos)
				{
					case 0:
						TweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						TweenMax.to(self.gradientRightDO, .8, {alpha:0, onComplete:self.setGradPos});
						break;
					case 1:
						self.gradientDO.setY(0);
						TweenMax.to(self.gradientLeftDO, .8, {alpha:0});
						TweenMax.to(self.gradientRightDO, .8, {alpha:1});
						break;
					case -1:
						self.gradientDO.setY(0);
						TweenMax.to(self.gradientLeftDO, .8, {alpha:1});
						TweenMax.to(self.gradientRightDO, .8, {alpha:0});
						break;
				}
			}
			
			if (data.showThumbnailsHtmlContent && data.enableHtmlContent)
			{
				switch (self.pos)
				{
					case 0:
						if (FWDUtils.isIE10)
						{
							self.overDO.setVisible(false);
						}
						else
						{
							self.overDO.setX(2000);
						}
						break;
					default:
						if (FWDUtils.isIE10)
						{
							self.overDO.setVisible(true);
						}
						else
						{
							self.overDO.setX(0);
						}
				}
			}
		};
		
		this.setGradPos = function()
		{
			self.gradientDO.setY(2000);
		};
		
		this.addText = function(textHolderDO, textGradientDO, textDO)
		{
			self.textHolderDO = textHolderDO;
			self.textGradientDO = textGradientDO;
			self.textDO = textDO;
			
			self.textHolderDO.setX(self.borderSize);
			self.textHolderDO.setY(self.borderSize);
			
			self.mainDO.addChild(self.textHolderDO);
			self.textDO.setInnerHTML(self.curDataListAr[self.id].thumbText);
			
			self.textTitleOffset = self.curDataListAr[self.id].textTitleOffset;
			self.textDescriptionOffsetTop = self.curDataListAr[self.id].textDescriptionOffsetTop;
			self.textDescriptionOffsetBottom = self.curDataListAr[self.id].textDescriptionOffsetBottom;
			
			self.textGradientDO.setY(self.finalH - self.borderSize * 2 - self.textTitleOffset);
			self.textDO.setY(self.finalH - self.borderSize * 2 - self.textTitleOffset + self.textDescriptionOffsetTop);
			
			self.textHolderDO.setAlpha(0);

			self.setTextHeightId = setTimeout(self.setTextHeight, 10);
		};
		
		this.setTextHeight = function()
		{
			if (!self.textHolderDO)
				return;
			
			self.textHeight = self.textDO.getHeight();
			
			TweenMax.to(self.textHolderDO, .8, {alpha:1, ease:Expo.easeOut});
			
			self.hasText = true;
			
			self.checkThumbOver();
		};
		
		this.removeText = function()
		{
			TweenMax.to(self.textHolderDO, .6, {alpha:0, ease:Expo.easeOut, onComplete:self.removeTextFinish});
		};
		
		this.removeTextFinish = function()
		{
			TweenMax.killTweensOf(self.textHolderDO);
			TweenMax.killTweensOf(self.textGradientDO);
			TweenMax.killTweensOf(self.textDO);
			
			self.mainDO.removeChild(self.textHolderDO);
			self.textHolderDO = null;
			self.textGradientDO = null;
			self.textDO = null;
			
			self.isOver = false;
			self.hasText = false;
		};
		
		this.checkThumbOver = function()
		{
			if (!self.hasText)
				return;

			if ((parent.thumbMouseX >= 0) && (parent.thumbMouseX <= self.finalW) && (parent.thumbMouseY >= 0) && (parent.thumbMouseY <= self.finalH))
			{
				self.onThumbOverHandler();
			}
			else
			{
				self.onThumbOutHandler();
			}
		};
		
		this.onThumbOverHandler = function()
		{
			if (!self.isOver)
			{
				self.isOver = true;

				TweenMax.to(self.textGradientDO, .8, {y:self.finalH - self.borderSize * 2 - self.textDescriptionOffsetTop - self.textHeight - self.textDescriptionOffsetBottom, ease:Expo.easeOut});
				TweenMax.to(self.textDO, .8, {y:self.finalH - self.borderSize * 2 - self.textHeight - self.textDescriptionOffsetBottom, ease:Expo.easeOut});
			}
		};

		this.onThumbOutHandler = function()
		{
			if (self.isOver)
			{
				self.isOver = false;
				
				TweenMax.to(self.textGradientDO, .8, {y:self.finalH - self.borderSize * 2 - self.textTitleOffset, ease:Expo.easeOut});
				TweenMax.to(self.textDO, .8, {y:self.finalH - self.borderSize * 2 - self.textTitleOffset + self.textDescriptionOffsetTop, ease:Expo.easeOut});
			}
		};
		
		this.showThumb3D = function()
		{
			var imgW = self.finalW - self.borderSize * 2;
			var imgH = self.finalH - self.borderSize * 2;
			
			self.imageHolderDO.setX(parseInt(self.finalW/2));
			self.imageHolderDO.setY(parseInt(self.finalH/2));
			
			self.imageHolderDO.setWidth(0);
			self.imageHolderDO.setHeight(0);
			
			TweenMax.to(self.imageHolderDO, .8, {x:self.borderSize, y:self.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});
			
			if (data.showThumbnailsHtmlContent)
			{
				self.htmlContentDO.setWidth(imgW);
				self.htmlContentDO.setHeight(imgH);
				
				self.htmlContentDO.setX(-parseInt(imgW/2));
				self.htmlContentDO.setY(-parseInt(imgH/2));
				
				TweenMax.to(self.htmlContentDO, .8, {x:0, y:0, ease:Expo.easeInOut});
			}
			else
			{
				self.imageDO.setWidth(imgW);
				self.imageDO.setHeight(imgH);
				
				self.imageDO.setX(-parseInt(imgW/2));
				self.imageDO.setY(-parseInt(imgH/2));
				
				TweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
			}
		};
		
		this.showThumb2D = function()
		{
			if (!FWDUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.finalW * self.thumbScale);
				var scaleH = Math.floor(self.finalH * self.thumbScale);
				var borderScale = Math.floor(self.borderSize * self.thumbScale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
			
				var imgW = scaleW - borderScale * 2;
				var imgH = scaleH - borderScale * 2;
				
				self.imageHolderDO.setX(parseInt(scaleW/2));
				self.imageHolderDO.setY(parseInt(scaleH/2));
				
				self.imageHolderDO.setWidth(0);
				self.imageHolderDO.setHeight(0);
				
				TweenMax.to(self.imageHolderDO, .8, {x:borderScale, y:borderScale, w:imgW, h:imgH, ease:Expo.easeInOut});
				
				if (data.showThumbnailsHtmlContent)
				{
					if (self.htmlContentDO)
					{
						self.htmlContentDO.setWidth(imgW);
						self.htmlContentDO.setHeight(imgH);
						
						self.htmlContentDO.setX(-parseInt(imgW/2));
						self.htmlContentDO.setY(-parseInt(imgH/2));
						
						TweenMax.to(self.htmlContentDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					}
				}
				else
				{
					if (self.imageDO)
					{
						self.imageDO.setWidth(imgW);
						self.imageDO.setHeight(imgH);
						
						self.imageDO.setX(-parseInt(imgW/2));
						self.imageDO.setY(-parseInt(imgH/2));
						
						TweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					}
				}
			}
			else
			{
				self.setScale2(self.thumbScale);
				
				var imgW = self.finalW - self.borderSize * 2;
				var imgH = self.finalH - self.borderSize * 2;
				
				self.imageHolderDO.setX(parseInt(self.finalW/2));
				self.imageHolderDO.setY(parseInt(self.finalH/2));
				
				self.imageHolderDO.setWidth(0);
				self.imageHolderDO.setHeight(0);
				
				TweenMax.to(self.imageHolderDO, .8, {x:self.borderSize, y:self.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});
				
				if (data.showThumbnailsHtmlContent)
				{
					if (self.htmlContentDO)
					{
						self.htmlContentDO.setWidth(imgW);
						self.htmlContentDO.setHeight(imgH);
						
						self.htmlContentDO.setX(-parseInt(imgW/2));
						self.htmlContentDO.setY(-parseInt(imgH/2));
						
						TweenMax.to(self.htmlContentDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					}
				}
				else
				{
					if (self.imageDO)
					{
						self.imageDO.setWidth(imgW);
						self.imageDO.setHeight(imgH);
						
						self.imageDO.setX(-parseInt(imgW/2));
						self.imageDO.setY(-parseInt(imgH/2));
						
						TweenMax.to(self.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
					}
				}
			}
		};
		
		this.showThumbIntro2D = function(scale, del)
		{
			self.thumbScale = scale;

			if (!FWDUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.finalW * scale);
				var scaleH = Math.floor(self.finalH * scale);
				var borderScale = Math.floor(self.borderSize * scale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
				
				var imgW = scaleW - borderScale * 2;
				var imgH = scaleH - borderScale * 2;
				
				self.setWidth(scaleW);
				self.setHeight(scaleH);
				
				self.borderDO.setWidth(scaleW);
				self.borderDO.setHeight(scaleH);
	
				self.mainDO.setWidth(scaleW);
				self.mainDO.setHeight(scaleH);
				
				self.overDO.setWidth(scaleW);
				self.overDO.setHeight(scaleH);
				
				self.bgDO.setX(borderScale);
				self.bgDO.setY(borderScale);
				
				self.bgDO.setWidth(imgW);
				self.bgDO.setHeight(imgH);
				
				self.setX(-self.finalW/2);
				self.setY(-self.finalH/2);
				
				TweenMax.to(self, .8, {x:Math.floor(self.newX + (self.finalW - scaleW)/2), y:-Math.floor(scaleH/2), delay:del, ease:Expo.easeOut});
			}
			else
			{
				self.setScale2(self.thumbScale);
				
				self.setX(-self.finalW/2);
				self.setY(-self.finalH/2);

				TweenMax.to(self, .8, {x:self.newX, scale:self.thumbScale, delay:del, ease:Quart.easeOut, onComplete:self.setThumbVisibility});
			}
		};
		
		this.setScale = function(scale)
		{
			self.thumbScale = scale;
			
			self.setVisible(true);
			
			if (!FWDUtils.hasTransform2d)
			{
				var scaleW = Math.floor(self.finalW * scale);
				var scaleH = Math.floor(self.finalH * scale);
				var borderScale = Math.floor(self.borderSize * scale);
				
				if ((self.borderSize > 0) && (borderScale < 1))
				{
					borderScale = 1;
				}
				
				TweenMax.to(self, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				TweenMax.to(self.borderDO, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				TweenMax.to(self.mainDO, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				TweenMax.to(self.overDO, .8, {w:scaleW, h:scaleH, ease:Quart.easeOut});
				TweenMax.to(self.bgDO, .8, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				TweenMax.to(self.imageHolderDO, .8, {x:borderScale, y:borderScale, w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
				
				TweenMax.to(self, .8, {x:Math.floor(self.newX + (self.finalW - scaleW)/2), y:-Math.floor(scaleH/2), ease:Quart.easeOut});
				
				if (data.showThumbnailsHtmlContent)
				{
					if (self.htmlContentDO)
					{
						TweenMax.to(self.htmlContentDO, .8, {w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
					}
				}
				else
				{
					if (self.imageDO)
					{
						TweenMax.to(self.imageDO, .8, {w:scaleW - borderScale * 2, h:scaleH - borderScale * 2, ease:Quart.easeOut});
					}
				}
			}
			else
			{
				TweenMax.to(self, .8, {x:Math.floor(self.newX), scale:self.thumbScale, ease:Quart.easeOut, onComplete:self.setThumbVisibility});
			}
		};
		
		this.setThumbVisibility = function()
		{
			if (self.getZIndex() == 0)
			{
				self.setVisible(false);
			}
		};
		
		this.hide = function(del)
		{
			var imgW = self.finalW - self.borderSize * 2;
			var imgH = self.finalH - self.borderSize * 2;
			
			TweenMax.to(self.imageHolderDO, .8, {x:parseInt(self.finalW/2), y:parseInt(self.finalH/2), w:0, h:0, delay:del, ease:Expo.easeInOut});
			
			if (data.showThumbnailsHtmlContent)
			{
				TweenMax.to(self.htmlContentDO, .8, {x:-parseInt(imgW/2), y:-parseInt(imgH/2), delay:del, ease:Expo.easeInOut});
			}
			else
			{
				TweenMax.to(self.imageDO, .8, {x:-parseInt(imgW/2), y:-parseInt(imgH/2), delay:del, ease:Expo.easeInOut});
			}
		};

		this.onMouseClickHandler = function()
		{
			self.dispatchEvent(FWDThumb.CLICK, {id:self.id});
		};
		
		this.onMouseTouchHandler = function(e)
		{
			if(e.preventDefault) e.preventDefault();
			
			self.dispatchEvent(FWDThumb.CLICK, {id:self.id});
		};
		
		/* destroy */
		this.destroy = function()
		{
			TweenMax.killTweensOf(self);
			TweenMax.killTweensOf(self.borderDO);
			TweenMax.killTweensOf(self.mainDO);
			TweenMax.killTweensOf(self.overDO);
			TweenMax.killTweensOf(self.bgDO);
			TweenMax.killTweensOf(self.imageHolderDO);
			
			if (self.isMobile)
			{
				if (self.hasPointerEvent)
				{
					self.overDO.screen.removeEventListener("MSPointerUp", self.onMouseTouchHandler);
				}
				else
				{
					self.overDO.screen.removeEventListener("touchend", self.onMouseTouchHandler);
				}
			}
			else
			{
				if (self.screen.addEventListener)
				{
					self.overDO.screen.removeEventListener("click", self.onMouseClickHandler);
				}
				else
				{
					self.overDO.screen.detachEvent("onclick", self.onMouseClickHandler);
				}
			}
			
			clearTimeout(self.setTextHeightId);
			
			if (self.imageDO)
			{
				TweenMax.killTweensOf(self.imageDO);
				self.imageDO.disposeImage();
				self.imageDO.destroy();
			}
			
			if (self.htmlContentDO)
			{
				TweenMax.killTweensOf(self.htmlContentDO);
				self.htmlContentDO.destroy();
			}
			
			if (self.gradientLeftDO)
			{
				TweenMax.killTweensOf(self.gradientLeftDO);
				self.gradientLeftDO.destroy();
			}
			
			if (self.gradientRightDO)
			{
				TweenMax.killTweensOf(self.gradientRightDO);
				self.gradientRightDO.destroy();
			}
			
			if (self.textGradientDO)
			{
				TweenMax.killTweensOf(self.textGradientDO);
				self.textGradientDO = null;
			}
			
			if (self.textDO)
			{
				TweenMax.killTweensOf(self.textDO);
				self.textDO = null;
			}
			
			if (self.textHolderDO)
			{
				TweenMax.killTweensOf(self.textHolderDO);
				self.textHolderDO = null
			}

			self.borderDO.destroy();
			self.bgDO.destroy();
			self.imageHolderDO.destroy();
			self.overDO.destroy();
			self.mainDO.destroy();
			
			self.mainDO = null;
			self.borderDO = null;
			self.bgDO = null;
			self.imageHolderDO = null;
			self.imageDO = null;
			self.htmlContentDO = null;
			self.overDO = null;
			self.gradientDO = null;
			self.gradientLeftDO = null;
			self.gradientRightDO = null;
			self.textHolderDO = null;
			self.textGradientDO = null;
			self.textDO = null;
			
			self.id = null;
			self.data = null;
			self.parent = null;
			self.backgroundColor = null;
			self.borderColor = null;
			
			self.screen.innerHTML = "";
			prototype.destroy();
			prototype = null;
			self = null;
			FWDThumb.prototype = null;
		};

		this.init();
	};

	/* set prototype */
	FWDThumb.setPrototype = function()
	{
		FWDThumb.prototype = new FWDDisplayObject3D("div", "absolute", "visible");
	};

	FWDThumb.CLICK = "click";

	FWDThumb.prototype = null;
	window.FWDThumb = FWDThumb;
}(window));