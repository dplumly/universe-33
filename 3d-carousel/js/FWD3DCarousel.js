/* 3DCarousel */
(function(window)
{
	var FWD3DCarousel = function(props)
	{
		var self = this;
		
		this.mainDO;
		this.preloaderDO;
		this.customContextMenuDO;
		this.infoDO;
		this.thumbsManagerDO;
		this.bgDO;
		this.thumbsBgDO;
		this.scrollbarBgDO;
		this.comboBoxDO;
		this.disableDO;

		this.stageWidth;
		this.stageHeight;
		this.originalWidth;
		this.originalHeight;
		
		this.resizeHandlerId1;
		this.resizeHandlerId2;
		this.orientationChangeId;
		
		this.rect;
		
		this.autoScale = false;
		this.doNotExceedOriginalSize = true;
		this.orientationChangeComplete = true;
		this.isFullScreen = false;
		this.preloaderLoaded = false;

		this.isMobile = FWDUtils.isMobile;

		/* init */
		this.init = function()
		{
			TweenLite.ticker.useRAF(false);
			
			self.propsObj = props;

			if (!self.propsObj)
			{
				alert("3DCarousel properties object is undefined!");
				return;
			}
			
			if (!self.propsObj.displayType)
			{
				alert("Display type is not specified!");
				return;
			}
		
			self.displayType = props.displayType.toLowerCase();
			self.body = document.getElementsByTagName("body")[0];
			
			if (!self.propsObj.carouselHolderDivId)
			{
				alert("Property carouselHolderDivId is not defined in the FWD3DCarousel object constructor!");
				return;
			}
			
			if (!FWDUtils.getChildById(self.propsObj.carouselHolderDivId))
			{
				alert("FWD3DCarousel holder div is not found, please make sure that the div exists and the id is correct! " + self.propsObj.carouselHolderDivId);
				return;
			}
			
			if (!self.propsObj.carouselWidth)
			{
				alert("The carousel width is not defined, plese make sure that the carouselWidth property is definded in the FWD3DCarousel constructor!");
				return;
			}
			
			if (!self.propsObj.carouselHeight)
			{
				alert("The carousel height is not defined, plese make sure that the carouselHeight property is definded in the FWD3DCarousel constructor!");
				return;
			}
		
			self.stageContainer = FWDUtils.getChildById(self.propsObj.carouselHolderDivId);
			
			self.autoScale = self.propsObj.autoScale == "yes" ? true : false;
			
			self.originalWidth = self.propsObj.carouselWidth;
			self.originalHeight = self.propsObj.carouselHeight;
			
			self.setupMainDO();
			
			self.setupInfo();
			self.setupData();
			
			self.startResizeHandler();
		};

		// #############################################//
		/* setup main do */
		// #############################################//
		this.setupMainDO = function()
		{
			self.mainDO = new FWDDisplayObject("div", "relative");
			self.mainDO.setSelectable(false);
			self.mainDO.setBkColor(self.propsObj.backgroundColor);
			
			self.mainDO.getStyle().msTouchAction = "none";

			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{	
				self.mainDO.getStyle().position = "absolute";
				
				if (FWDUtils.isIE7)
				{
					self.body.appendChild(self.mainDO.screen);
				}
				else
				{
					document.documentElement.appendChild(self.mainDO.screen);
				}
			}
			else
			{
				self.stageContainer.appendChild(self.mainDO.screen);
			}
		};
		
		this.setBackgrounds = function()
		{
			if (self.propsObj.backgroundImagePath)
			{
				self.bgDO = new FWDDisplayObject("div");
				self.mainDO.addChild(self.bgDO);
				
				self.bgDO.setWidth(self.originalWidth);
				self.bgDO.setHeight(self.originalHeight);
				
				self.bgDO.screen.style.backgroundImage = "url(" + self.propsObj.backgroundImagePath + ")";
				self.bgDO.screen.style.backgroundRepeat = self.propsObj.backgroundRepeat;
				
				self.bgDO.setAlpha(0);
				TweenMax.to(self.bgDO, .8, {alpha:1});
			}

			if (self.propsObj.thumbnailsBackgroundImagePath)
			{
				self.thumbsBgDO = new FWDDisplayObject("div");
				self.mainDO.addChild(self.thumbsBgDO);
				
				self.thumbsBgDO.setWidth(self.originalWidth);
				self.thumbsBgDO.setHeight(self.originalHeight - self.data.nextButtonNImg.height);
				
				self.thumbsBgDO.screen.style.backgroundImage = "url(" + self.propsObj.thumbnailsBackgroundImagePath + ")";
				self.thumbsBgDO.screen.style.backgroundRepeat = self.propsObj.backgroundRepeat;
				
				self.thumbsBgDO.setAlpha(0);
				TweenMax.to(self.thumbsBgDO, .8, {alpha:1});
			}

			if (self.propsObj.scrollbarBackgroundImagePath)
			{
				self.scrollbarBgDO = new FWDDisplayObject("div");
				self.mainDO.addChild(self.scrollbarBgDO);
				
				self.scrollbarBgDO.setWidth(self.originalWidth);
				self.scrollbarBgDO.setHeight(self.data.nextButtonNImg.height);
				
				self.scrollbarBgDO.screen.style.backgroundImage = "url(" + self.propsObj.scrollbarBackgroundImagePath + ")";
				self.scrollbarBgDO.screen.style.backgroundRepeat = self.propsObj.backgroundRepeat;
				
				self.scrollbarBgDO.setAlpha(0);
				TweenMax.to(self.scrollbarBgDO, .8, {alpha:1});
			}
		};

		// #############################################//
		/* setup info */
		// #############################################//
		this.setupInfo = function()
		{
			FWDInfo.setPrototype();
			self.infoDO = new FWDInfo();
		};
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function()
		{
			if (window.addEventListener)
			{
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChange);
			}
			else if (window.attachEvent)
			{
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			self.resizeHandlerId2 = setTimeout(self.resizeHandler, 50);
			
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{
				self.resizeHandlerId1 = setTimeout(self.resizeHandler, 800);
			}
		};
		
		this.onResizeHandler = function(e)
		{
			if (self.isMobile)
			{
				clearTimeout(self.resizeHandlerId2);
				self.resizeHandlerId2 = setTimeout(self.resizeHandler, 200);
			}
			else
			{
				self.resizeHandler();
			}	
		};
		
		this.onScrollHandler = function(e)
		{
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{
				self.scrollHandler();
			}
			
			self.rect = self.mainDO.screen.getBoundingClientRect();
		};
		
		this.orientationChange = function()
		{
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{
				self.orientationChangeComplete = false;
				
				clearTimeout(self.scrollEndId);
				clearTimeout(self.resizeHandlerId2);
				clearTimeout(self.orientationChangeId);
				
				self.orientationChangeId = setTimeout(function()
				{
					self.orientationChangeComplete = true; 
					self.resizeHandler();
				}, 1000);
				
				self.mainDO.setX(0);
				self.mainDO.setWidth(0);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		this.scrollHandler = function()
		{
			if (!self.orientationChangeComplete)
				return;
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
		
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{	
				if (self.isMobile)
				{
					clearTimeout(self.scrollEndId);
					self.scrollEndId = setTimeout(self.resizeHandler, 200);		
				}
				else
				{
					self.mainDO.setX(self.pageXOffset);
				}
				
				self.mainDO.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}
		};
		
		this.resizeHandler = function()
		{
			if (!self.orientationChangeComplete)
				return;
			
			var scrollOffsets = FWDUtils.getScrollOffsets();
			var viewportSize = FWDUtils.getViewportSize();
			var scale;
			
			self.viewportWidth = parseInt(viewportSize.w);
			self.viewportHeight = parseInt(viewportSize.h);
			self.pageXOffset = parseInt(scrollOffsets.x);
			self.pageYOffset = parseInt(scrollOffsets.y);
			
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{	
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				
				if (self.autoScale)
				{
					scale = Math.min(self.stageWidth/self.originalWidth, 1);
					self.stageHeight = Math.max(parseInt(scale * self.originalHeight), self.propsObj.thumbnailHeight + 40);
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				else
				{
					self.stageHeight = self.originalHeight;
				}
				
				self.mainDO.setX(self.pageXOffset);
				self.mainDO.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}
			else
			{
				if (self.autoScale)
				{
					self.stageContainer.style.width = "100%";
					
					if (self.stageContainer.offsetWidth > self.originalWidth)
					{
						self.stageContainer.style.width = self.originalWidth + "px";
					}
					
					scale = self.stageContainer.offsetWidth/self.originalWidth;
					
					self.stageWidth = parseInt(scale * self.originalWidth);
					self.stageHeight = Math.max(parseInt(scale * self.originalHeight), self.propsObj.thumbnailHeight + 40);
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				else
				{
					self.stageContainer.style.width = "100%";
					
					if (self.stageContainer.offsetWidth > self.originalWidth)
					{
						self.stageContainer.style.width = self.originalWidth + "px";
					}
					
					self.stageWidth = self.stageContainer.offsetWidth;
					self.stageHeight = self.originalHeight;
					self.stageContainer.style.height = self.originalHeight + "px";
				}
				
				self.mainDO.setX(0);
				self.mainDO.setY(0);
			}
			
			self.mainDO.setWidth(self.stageWidth);
			self.mainDO.setHeight(self.stageHeight);
			
			self.rect = self.mainDO.screen.getBoundingClientRect();
		
			self.positionPreloader();
			
			if (self.thumbsManagerDO)
			{
				self.thumbsManagerDO.resizeHandler();
				
				if(!self.thumbsManagerDO.allowToSwitchCat)
				{
					self.disableDO.setWidth(self.stageWidth);
					self.disableDO.setHeight(self.stageHeight);
				}
			}
			
			if (self.preloaderLoaded)
			{
				if (self.propsObj.backgroundImagePath)
				{
					if (self.displayType == FWD3DCarousel.RESPONSIVE)
					{
						self.bgDO.setX(Math.floor((self.stageWidth - self.originalWidth)/2));
					}
					else
					{
						self.bgDO.setWidth(self.stageWidth);
					}
					
					self.bgDO.setY(Math.floor((self.stageHeight - self.originalHeight)/2));
				}
				
				if (self.propsObj.thumbnailsBackgroundImagePath)
				{
					if (self.displayType == FWD3DCarousel.RESPONSIVE)
					{
						self.thumbsBgDO.setX(Math.floor((self.stageWidth - self.originalWidth)/2));
					}
					else
					{
						self.thumbsBgDO.setWidth(self.stageWidth);
					}
					
					self.thumbsBgDO.setY(Math.floor((self.stageHeight - self.originalHeight)/2));
				}
				
				if (self.propsObj.scrollbarBackgroundImagePath)
				{
					if (self.displayType == FWD3DCarousel.RESPONSIVE)
					{
						self.scrollbarBgDO.setX(Math.floor((self.stageWidth - self.originalWidth)/2));
					}
					else
					{
						self.scrollbarBgDO.setWidth(self.stageWidth);
					}
						
					self.scrollbarBgDO.setY(Math.floor(self.stageHeight - self.data.nextButtonNImg.height));
				}
			}
			
			if (self.comboBoxDO)
			{
				self.comboBoxDO.position();
			}
		};

		// #############################################//
		/* setup context menu */
		// #############################################//
		this.setupContextMenu = function()
		{
			self.customContextMenuDO = new FWDContextMenu(self.mainDO, self.data.showContextMenu);
		};

		// #############################################//
		/* setup data */
		// #############################################//
		this.setupData = function()
		{
			FWDData.setPrototype();
			
			self.data = new FWDData(self.propsObj);
			self.data.addListener(FWDData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDData.LOAD_DONE, self.dataLoadComplete);
		};

		this.onPreloaderLoadDone = function()
		{
			self.setBackgrounds();
			self.setupPreloader();
			self.positionPreloader();
			
			if (!self.isMobile)
			{
				self.setupContextMenu();
			}
			
			self.preloaderLoaded = true;
			self.resizeHandler();
		};

		this.dataLoadError = function(e, text)
		{
			self.mainDO.addChild(self.infoDO);
			self.infoDO.showText(e.text);
		};

		this.dataLoadComplete = function(e)
		{
			if (self.data.showDisplay2DAlways)
			{
				FWDUtils.hasTransform3d = false;
			}
			
			self.preloaderDO.hide(true);
			self.setupThumbsManager();
			
			if (self.data.showComboBox)
			{
				self.setupComboBox();
			}
			
			if (!self.data.enableHtmlContent)
			{
				self.setupLightBox();
			}
		
			self.setupDisable();
		};

		// #############################################//
		/* setup preloader */
		// #############################################//
		this.setupPreloader = function()
		{
			FWDPreloader.setPrototype();
			
			self.preloaderDO = new FWDPreloader(self.data.mainPreloaderImg, 70, 40, 12, 50);
			self.mainDO.addChild(self.preloaderDO);
			
			self.preloaderDO.show();
		};

		this.positionPreloader = function()
		{
			if (self.preloaderDO)
			{
				self.preloaderDO.setX(parseInt((self.stageWidth - self.preloaderDO.getWidth()) / 2));
				self.preloaderDO.setY(parseInt((self.stageHeight - self.preloaderDO.getHeight() - self.data.nextButtonNImg.height) / 2));
			}
		};

		// ###########################################//
		/* setup thumbs manager */
		// ###########################################//
		this.setupThumbsManager = function()
		{
			FWDThumbsManager.setPrototype();
			
			self.thumbsManagerDO = new FWDThumbsManager(self.data, self);
			self.thumbsManagerDO.addListener(FWDThumbsManager.THUMB_CLICK, self.onThumbsManagerThumbClick);
			self.thumbsManagerDO.addListener(FWDThumbsManager.LOAD_ERROR, self.onThumbsManagerLoadError);
			self.thumbsManagerDO.addListener(FWDThumbsManager.THUMBS_HIDE_COMPLETE, self.onThumbsManagerHideComplete);
			self.mainDO.addChild(self.thumbsManagerDO);
			
			if (self.stageWidth)
			{
				self.thumbsManagerDO.resizeHandler();
			}
		};
		
		this.onThumbsManagerThumbClick = function(e)
		{
			if (!self.data.enableHtmlContent)
			{
				if (!self.lightboxDO.isShowed_bl)
				{
					self.thumbsManagerDO.stopSlideshow();
					self.lightboxDO.show(e.id);
				}
			}
		};

		this.onThumbsManagerLoadError = function(e)
		{
			self.mainDO.addChild(self.infoDO);
			self.infoDO.showText(e.text);
		};
		
		this.onThumbsManagerHideComplete = function()
		{
			self.enableAll();
		};
		
		//#############################################//
		/* setup combobox */
		//############################################//
		this.setupComboBox = function()
		{
			FWDComboBox.setPrototype();
			
			self.comboBoxDO = new FWDComboBox(self, 
			{
				upArrowN_img:self.data.comboboxArrowIconN_img,
				upArrowS_img:self.data.comboboxArrowIconS_img,
				categories_ar:self.data.categoriesAr,
				selectorLabel:self.data.selectLabel,
				position:self.data.comboBoxPosition,
				startAtCategory:self.data.startAtCategory,
				comboBoxHorizontalMargins:self.data.comboBoxHorizontalMargins,
				comboBoxVerticalMargins:self.data.comboBoxVerticalMargins,
				comboBoxCornerRadius:self.data.comboBoxCornerRadius,
				selectorBackgroundNormalColor1:self.data.selectorBackgroundNormalColor1,
				selectorBackgroundSelectedColor1:self.data.selectorBackgroundSelectedColor1,
				selectorBackgroundNormalColor2:self.data.selectorBackgroundNormalColor2,
				selectorBackgroundSelectedColor2:self.data.selectorBackgroundSelectedColor2,
				selectorTextNormalColor:self.data.selectorTextNormalColor,
				selectorTextSelectedColor:self.data.selectorTextSelectedColor,
				buttonBackgroundNormalColor1:self.data.buttonBackgroundNormalColor1,
				buttonBackgroundSelectedColor1:self.data.buttonBackgroundSelectedColor1,
				buttonBackgroundNormalColor2:self.data.buttonBackgroundNormalColor2,
				buttonBackgroundSelectedColor2:self.data.buttonBackgroundSelectedColor2,
				buttonTextNormalColor:self.data.buttonTextNormalColor,
				buttonTextSelectedColor:self.data.buttonTextSelectedColor,
				shadowColor:self.data.comboBoxShadowColor
			});
			
			self.comboBoxDO.addListener(FWDComboBox.BUTTON_PRESSED, self.onComboboxButtonPressHandler);
			self.mainDO.addChild(self.comboBoxDO);
		};
		
		this.onComboboxButtonPressHandler = function(e)
		{
			if (self.thumbsManagerDO.allowToSwitchCat)
			{
				self.disableAll();
				self.thumbsManagerDO.showCurrentCat(e.id);
				
				if (!self.data.enableHtmlContent)
				{
					self.lightboxDO.updateData(self.data.lightboxAr[e.id]);
				}
			}
		};
		
		//#############################################//
		/* setup lightbox */
		//#############################################//
		this.setupLightBox = function()
		{
			FWDLightBox.setPrototype();
			
			this.lightboxDO = new FWDLightBox(
			{
				//main data array
				data_ar:self.data.lightboxAr[self.data.startAtCategory],
				//skin
				lightboxPreloader_img:this.data.lightboxPreloader_img,
				slideShowPreloader_img:this.data.slideShowPreloader_img,
				closeN_img:this.data.lightboxCloseButtonN_img,
				closeS_img:this.data.lightboxCloseButtonS_img,
				nextN_img:this.data.lightboxNextButtonN_img,
				nextS_img:this.data.lightboxNextButtonS_img,
				prevN_img:this.data.lightboxPrevButtonN_img,
				prevS_img:this.data.lightboxPrevButtonS_img,
				maximizeN_img:this.data.lightboxMaximizeN_img,
				maximizeS_img:this.data.lightboxMaximizeS_img,
				minimizeN_img:this.data.lightboxMinimizeN_img,
				minimizeS_img:this.data.lightboxMinimizeS_img,
				infoOpenN_img:this.data.lightboxInfoOpenN_img,
				infoOpenS_img:this.data.lightboxInfoOpenS_img,
				infoCloseN_img:this.data.lightboxInfoCloseN_img,
				infoCloseS_img:this.data.lightboxInfoCloseS_img,
				playN_img:this.data.lightboxPlayN_img,
				playS_img:this.data.lightboxPlayS_img,
				pauseN_img:this.data.lightboxPauseN_img,
				pauseS_img:this.data.lightboxPauseS_img,
				//properties
				showContextMenu:self.data.showContextMenu,
				addKeyboardSupport_bl:self.data.addLightBoxKeyboardSupport_bl,
				showNextAndPrevButtons:self.data.showLighBoxNextAndPrevButtons_bl,
				showZoomButton:self.data.showLightBoxZoomButton_bl,
				showInfoButton:self.data.showLightBoxInfoButton_bl,
				showSlideshowButton:self.data.showLighBoxSlideShowButton_bl,
				slideShowAutoPlay:self.data.slideShowAutoPlay_bl,
				showInfoWindowByDefault:self.data.showInfoWindowByDefault_bl,
				lightBoxVideoAutoPlay:self.data.lightBoxVideoAutoPlay_bl,
				infoWindowBackgroundColor:self.data.lightBoxInfoWindowBackgroundColor_str,
				infoWindowBackgroundOpacity:self.data.lightBoxInfoWindowBackgroundOpacity,
				backgroundColor_str:self.data.lightBoxBackgroundColor_str,
				backgroundOpacity:self.data.lightBoxMainBackgroundOpacity,
				itemBackgroundColor_str:self.data.lightBoxItemBackgroundColor_str,
				borderColor_str1:self.data.lightBoxItemBorderColor_str1,
				borderColor_str2:self.data.lightBoxItemBorderColor_str2,
				borderSize:self.data.lightBoxBorderSize,
				borderRadius:self.data.lightBoxBorderRadius,
				slideShowDelay:self.data.lightBoxSlideShowDelay
			});
		};
		
		//##############################################//
		/* setup disable */
		//#############################################//
		this.setupDisable = function()
		{
			self.disableDO = new FWDSimpleDisplayObject("div");
			
			if (FWDUtils.isIE)
			{
				self.disableDO.setBkColor("#000000");
				self.disableDO.setAlpha(.001);
			}
			
			self.mainDO.addChild(self.disableDO);
		};
		
		this.disableAll = function()
		{
			self.disableDO.setWidth(self.stageWidth);
			self.disableDO.setHeight(self.stageHeight);
		};
		
		this.enableAll = function()
		{
			self.disableDO.setWidth(0);
			self.disableDO.setWidth(0);
		};

		/* destroy */
		this.destroy = function()
		{
			if (window.removeEventListener)
			{
				window.removeEventListener("resize", self.onResizeHandler);
				window.removeEventListener("scroll", self.onScrollHandler);
				window.removeEventListener("orientationchange", self.orientationChance);
			}
			else if (window.detachEvent)
			{
				window.detachEvent("onresize", self.onResizeHandler);
				window.detachEvent("onscroll", self.onScrollHandler);
			}
			
			clearTimeout(self.scrollEndId);
			clearTimeout(self.resizeHandlerId1);
			clearTimeout(self.resizeHandlerId2);
			clearTimeout(self.orientationChangeId);
			
			if (self.data)
			{
				self.data.destroy();
			}

			if (self.customContextMenuDO)
			{
				self.customContextMenuDO.destroy();
			}

			if (self.infoDO)
			{
				self.infoDO.destroy();
			}

			if (self.preloaderDO)
			{
				self.preloaderDO.destroy();
			}
			
			if (self.thumbsManagerDO)
			{
				self.thumbsManagerDO.destroy();
			}
			
			if (self.bgDO)
			{
				TweenMax.killTweensOf(self.bgDO);
				self.bgDO.destroy();
			}
			
			if (self.thumbsBgDO)
			{
				TweenMax.killTweensOf(self.thumbsBgDO);
				self.thumbsBgDO.destroy();
			}
			
			if (self.scrollbarBgDO)
			{
				TweenMax.killTweensOf(self.scrollbarBgDO);
				self.scrollbarBgDO.destroy();
			}
			
			if (self.comboBoxDO)
			{
				self.comboBoxDO.destroy();
			}
			
			if (self.disableDO)
			{
				self.disableDO.destroy();
			}
			
			if (self.displayType == FWD3DCarousel.FLUID_WIDTH)
			{	
				if (FWDUtils.isIE7)
				{
					self.body.removeChild(self.mainDO.screen);
				}
				else
				{
					document.documentElement.removeChild(self.mainDO.screen);
				}
			}
			else
			{
				self.stageContainer.removeChild(self.mainDO.screen);
			}
			
			if (self.mainDO)
			{
				self.mainDO.screen.innerHTML = "";
				self.mainDO.destroy();
			}
			
			self.preloaderDO = null;
			self.customContextMenuDO = null;
			self.infoDO = null;
			self.thumbsManagerDO = null;
			self.bgDO = null;
			self.thumbsBgDO = null;
			self.scrollbarBgDO = null;
			self.comboBoxDO = null;
			self.disableDO = null;
			self.mainDO = null;
			self = null;
		};

		this.init();
	};

	FWD3DCarousel.RESIZE = "resize";
	FWD3DCarousel.LIGHTBOX = "lightbox";
	FWD3DCarousel.RESPONSIVE = "responsive";
	FWD3DCarousel.FLUID_WIDTH = "fluidwidth";
	
	window.FWD3DCarousel = FWD3DCarousel;

}(window));