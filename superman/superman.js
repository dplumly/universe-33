/*
 * jQuery Raptorize Plugin 1.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

    $.fn.superman = function(options) {

        //Yo' defaults
        var defaults = {  
            enterOn: 'click', //timer, konami-code, click
            delayTime: 5000 //time before raptor attacks on timer mode
            };  
        
        //Extend those options
        var options = $.extend(defaults, options); 
	
        return this.each(function() {

			var _this = $(this);
			var audioSupported = false;
			//Stupid Browser Checking which should be in jQuery Support
			var audioSupported = true;
			
			
			//Dog Vars
			var raptorImageMarkup = '<img id="superman" style="display: none" src="js/dog.png" />'
			var raptorAudioMarkup = '<audio id="zoom" preload="auto"><source src="js/superman.mp3" /><source src="js/superman.ogg" /></audio>';	
			var locked = false;
			
			//Append Dog and Style
			$('body').append(raptorImageMarkup);
 			if(audioSupported) { $('body').append(raptorAudioMarkup); }
			var raptor = $('#superman').css({
				"position":"fixed",
				"bottom": "-700px",
				"right" : "0",
				"display" : "block"
			})
			
			// Animating Code
			function init() {
				locked = true;
			
				//Sound Hilarity
				if(audioSupported) { 
					function playSound() {
						document.getElementById('zoom').play();
					}
					playSound();
				}
								
				// Movement Hilarity	
			/*	raptor.animate({
					"bottom" : "320"
				}, function() { 			
					$(this).animate({
						"bottom" : "220px"
					}, 100, function() {
						var offset = (($(this).position().left)+400);
						$(this).delay(1300).animate({
							"bottom" : "-500px"
						}, 1500, function() {
							raptor = $('#duckHuntDog').css({
								"bottom": "-700px",
								"right" : "0"
							})
							locked = false;
						})
					});
				});
			}
*/

			// Movement Hilarity	
				raptor.animate({
					"bottom" : "200"
				}, function() { 			
					$(this).animate({
						"bottom" : "220px"
					}, 100, function() {
						var offset = (($(this).position().left)+800);
						$(this).delay(100).animate({
							"right" : offset
						}, 2200, function() {
							raptor = $('#superman').css({
								"bottom": "-700px",
								"right" : "200"
							})
							locked = false;
						})
					});
				});
			}
			
			
			//Determine Entrance
			if(options.enterOn == 'timer') {
				setTimeout(init, options.delayTime);
			} else if(options.enterOn == 'click') {
				_this.bind('click', function(e) {
					e.preventDefault();
					if(!locked) {
						init();
					}
				})
			} else if(options.enterOn == 'konami-code'){
			    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
			    $(window).bind("keydown.raptorz", function(e){
			        kkeys.push( e.keyCode );
			        if ( kkeys.toString().indexOf( konami ) >= 0 ) {
			        	init();
			        	$(window).unbind('keydown.raptorz');
			        }
			    });
	
			}
			
        });//each call
    }//orbit plugin call
})(jQuery);




