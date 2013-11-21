/*
 imagemonitor v1.0
 Copyright 2013, Restituto P. Rizal
 Released under the MIT License.
 
 example:
 
$(document).ready(function()
{
	$('img').imagemonitor(
	{
		'init' : function()
		{
			// call when this plugin start execute
		},
		'onLoad' : function(loadedImage, totalImage)
		{
			// call every single image loaded
			// loadedImage: number of how many image/images are loaded
			// the total number of image/images loaded or not
		},
		'onComplete' : function(loadedImage)
		{
			// call when all image is loaded
			// loadedImage: number of how many image/images are loaded
		}
	});
});


*/
(function( $ ){
  $.fn.imagemonitor = function(imageEvent) 
  {
	var totalImage = 0;
	var loadedImage = 0;
	var loadedImageSrc = Array();
	var imageObject = Array();
	var isComplete = false;
	var loop_delay = 200; // in miliseconds
	var imgElement = this;
	if(imageEvent.init == null) imageEvent.init = function(){};
	if(imageEvent.onLoad == null) imageEvent.onLoad = function(){};
	if(imageEvent.onComplete == null) imageEvent.onComplete = function(){};
	function createImageObject()
	{
		imgElement.each(function(index)
		{
			imageObject[index] = new Image();
			$(imageObject[index]).attr('src', $(this).attr('src'));
		});
	}
	function count_loaded_image()
	{
		for(var i=0; imageObject[i]; i++)
		{
			if(!checkIfLoaded($(imageObject[i]).attr('src')))
			{
				if(imageObject[i].complete || imageObject[i].readyState === 4) 
				{
					loadedImageSrc.push($(imageObject[i]).attr('src'));
					loadedImage++;
					imageEvent.onLoad(loadedImage, totalImage);
				}
			}
		}
		if((loadedImage == totalImage) && !isComplete) 
		{
			isComplete = true;
			imageEvent.onComplete(loadedImage);
		}
		else setTimeout(count_loaded_image, loop_delay);
		
	}
	function getTotalImage()
	{
		var tempImageSrc = Array();
		imgElement.each(function(index)
		{
			var counted = false;
			for(i=0; tempImageSrc[i]; i++)
			{
				if(tempImageSrc[i] == $(this).attr('src')) counted = true;
			}
			if(!counted) tempImageSrc.push($(this).attr('src'))
		});
		return tempImageSrc.length;
	}
	function checkIfLoaded(src)
	{
		var loaded = false;
		for(var i=0; loadedImageSrc[i]; i++)
		{
			if(loadedImageSrc[i] == src) loaded = true;
		}
		return loaded;
	}
	function setOnloadEvent()
	{
		imgElement.each(function(index)
		{
			$(this).load(function()
			{
				if(!checkIfLoaded($(this).attr('src')))
				{
					loadedImage++;
					loadedImageSrc.push($(this).attr('src'));
					imageEvent.onLoad(loadedImage, totalImage);
					if((loadedImage == totalImage) && !isComplete) 
					{
						isComplete = true;
						imageEvent.onComplete(loadedImage);
					}
				}
			});	
		});
	}
	imageEvent.init();
	totalImage = getTotalImage();
	createImageObject();
	setOnloadEvent();
	count_loaded_image();
  };
})( jQuery );
