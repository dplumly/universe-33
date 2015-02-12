//FWDUtils
(function (window){
	
	var FWDUtils = function(){};
	
	FWDUtils.dumy = document.createElement("div");
	
	//###################################//
	/* String */
	//###################################//
	FWDUtils.trim = function(str){
		return str.replace(/\s/gi, "");
	};
			
	FWDUtils.trimAndFormatUrl = function(str){
		str = str.toLocaleLowerCase();
		str = str.replace(/ /g, "-");
		str = str.replace(/ä/g, "a");
		str = str.replace(/â/g, "a");
		str = str.replace(/â/g, "a");
		str = str.replace(/à/g, "a");
		str = str.replace(/è/g, "e");
		str = str.replace(/é/g, "e");
		str = str.replace(/ë/g, "e");
		str = str.replace(/ï/g, "i");
		str = str.replace(/î/g, "i");
		str = str.replace(/ù/g, "u");
		str = str.replace(/ô/g, "o");
		str = str.replace(/ù/g, "u");
		str = str.replace(/û/g, "u");
		str = str.replace(/ÿ/g, "y");
		str = str.replace(/ç/g, "c");
		str = str.replace(/œ/g, "ce");
		return str;
	};
	
	FWDUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDUtils.trim(array[i]);
		};
		return array;
	};

	//#############################################//
	//Array //
	//#############################################//
	FWDUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDUtils.randomizeArray = function(aArray) {
		var randomizedArray = [];
		var copyArray = aArray.concat();
			
		var length = copyArray.length;
		for(var i=0; i< length; i++) {
				var index = Math.floor(Math.random() * copyArray.length);
				randomizedArray.push(copyArray[index]);
				copyArray.splice(index,1);
			}
		return randomizedArray;
	};
	

	//#############################################//
	/*DOM manipulation */
	//#############################################//
	FWDUtils.parent = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDUtils.sibling = function(e, n){
		while (e && n !== 0){
			if(n > 0){
				if(e.nextElementSibling){
					 e = e.nextElementSibling;	 
				}else{
					for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
				}
				n--;
			}else{
				if(e.previousElementSibling){
					 e = e.previousElementSibling;	 
				}else{
					for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
				}
				n++;
			}
		}
		return e;
	};
	
	FWDUtils.getChildAt = function (e, n){
		var kids = FWDUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDUtils.getChildren = function(e, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};
	
	FWDUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDUtils.getAttributeValue = function(e, attr){
		if(!FWDUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.attributes[attr];
			return  test ? true : false;
		}
	};
	
	FWDUtils.insertNodeAt = function(parent, child, n){
		var children = FWDUtils.children(parent);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			parent.insertBefore(child, children[n]);
		};
	};
	
	FWDUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	//###################################//
	/* DOM geometry */
	//##################################//
	FWDUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true;
		return false;
	};
	
	FWDUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDUtils.getViewportSize = function(){
		if(FWDUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDUtils.getScrollOffsets();
		
		if(e.touches){
			return{
				screenX:e.touches[0] == undefined ? e.touches.pageX - offsets.x :e.touches[0].pageX - offsets.x,
				screenY:e.touches[0] == undefined ? e.touches.pageY - offsets.y :e.touches[0].pageY - offsets.y
			};
		}
		
		return{
			screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
			screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
		};
	};
	
	
	//###################################//
	/* Browsers test */
	//##################################//
	FWDUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled);
	}());
	
	FWDUtils.isMobile = (function (){
		if(FWDUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
	    for(i in agents) {
	    	 if(navigator.userAgent.toLowerCase().indexOf(agents[i].toLowerCase()) != -1) {
	            return true;
	        }
	    }
	    return false;
	}());
	
	FWDUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDUtils.isChrome = (function(){
		return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
	}());
	
	FWDUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opera') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDUtils.isIE = (function(){
		return navigator.userAgent.toLowerCase().indexOf('msie') != -1;;
	}());
	
	FWDUtils.isIEAndLessThen9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	}());
	
	FWDUtils.isIEAndLessThen10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());
	
	FWDUtils.isIE7 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1;
	}());
	
	FWDUtils.isIE9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());
	
	FWDUtils.isIE10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 10") != -1;
	}());
	
	FWDUtils.isApple = (function(){
		return navigator.appVersion.toLowerCase().indexOf('mac') != -1;;
	}());
	
	FWDUtils.isAndroidAndWebkit = (function(){
		return  (FWDUtils.isOpera || FWDUtils.isChrome) && FWDUtils.isAndroid;
	}());
	
	FWDUtils.hasFullScreen = (function(){
		return FWDUtils.dumy.requestFullScreen || FWDUtils.dumy.mozRequestFullScreen || FWDUtils.dumy.webkitRequestFullScreen || FWDUtils.dumy.msieRequestFullScreen;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDUtils.dumy.style[p] !== 'undefined') {
	    	   FWDUtils.dumy.style.position = "absolute";
	    	   position = FWDUtils.dumy.getBoundingClientRect().left;
	    	   FWDUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDUtils.dumy);}catch(e){}
	    return false;
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDUtils.dumy);}catch(e){}
	    return false;
	};
	
	//###############################################//
	/* various utils */
	//###############################################//
	FWDUtils.onReady =  function(callbalk){
		if (document.addEventListener) {
			document.addEventListener( "DOMContentLoaded", function(){
				FWDUtils.checkIfHasTransofrms();
				callbalk();
			});
		}else{
			document.onreadystatechange = function () {
				FWDUtils.checkIfHasTransofrms();
				if (document.readyState == "complete") callbalk();
			};
		 }
		
	};
	
	FWDUtils.checkIfHasTransofrms = function(){
		document.documentElement.appendChild(FWDUtils.dumy);
		FWDUtils.hasTransform3d = get3d();
		FWDUtils.hasTransform2d = get2d();
		FWDUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDUtils.getUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	FWDUtils.validateEmail = function(mail){  
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
			return true;  
		}  
		return false;  
    }; 
    
	//################################//
	/* resize utils */
	//################################//
	FWDUtils.resizeDoWithLimit = function(
			displayObject,
			containerWidth,
			containerHeight,
			doWidth,
			doHeight,
			removeWidthOffset,
			removeHeightOffset,
			offsetX,
			offsetY,
			animate,
			pDuration,
			pDelay,
			pEase
		) {
		var containerWidth = containerWidth - removeWidthOffset;
		var containerHeight = containerHeight - removeHeightOffset;
			
		var scaleX = containerWidth/doWidth;
		var scaleY = containerHeight/doHeight;
		var totalScale = 0;
				
		if(scaleX <= scaleY){
			totalScale = scaleX;
		}else if(scaleX >= scaleY){
			totalScale = scaleY;
		}
			
		var finalWidth = Math.round((doWidth * totalScale));
		var finalHeight = Math.round((doHeight * totalScale));
		var x = Math.floor((containerWidth -  (doWidth * totalScale))/2  + offsetX);
		var y = Math.floor((containerHeight -  (doHeight * totalScale))/2 + offsetY);
			
		if(animate){
			TweenMax.to(displayObject, pDuration, {x:x, y:y, w:finalWidth, h:finalHeight, delay:pDelay, ease:pEase});
		}else{
			displayObject.x = x;
			displayObject.y = y;
			displayObject.w = finalWidth;
			displayObject.h = finalHeight;
		}
	};
	
	//#########################################//
	/* request animation frame */
	//########################################//
	window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame || 
	        window.oRequestAnimationFrame || 
	        window.msRequestAnimationFrame || 
	        function(/* function */ callback, /* DOMElement */ element){
	            return window.setTimeout(callback, 1000 / 60);
	        };
	})();
	
	window.cancelRequestAnimFrame = ( function() {
	    return window.cancelAnimationFrame ||
	        window.webkitCancelRequestAnimationFrame ||
	        window.mozCancelRequestAnimationFrame ||
	        window.oCancelRequestAnimationFrame ||
	        window.msCancelRequestAnimationFrame ||
	        clearTimeout;
	} )();
	
	FWDUtils.isReadyMethodCalled_bl = false;
	
	window.FWDUtils = FWDUtils;
}(window));

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());