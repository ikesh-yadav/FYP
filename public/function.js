// morphing modal window
// Code By Webdevtrick ( https://webdevtrick.com )
jQuery(document).ready(function($){
	//trigger the animation - open modal window
	// $('[data-type="modal-trigger"]').on('click', function(){
	// 	var actionBtn = $(this),
	// 		scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));
		
	// 	actionBtn.addClass('to-circle');
	// 	actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	// 		animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
	// 	});

	// 	//if browser doesn't support transitions...
	// 	if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
	// });

	//trigger the animation - close modal window
	$('.container .cd-modal-close').on('click', function(){
		closeModal();
	});
	$(document).keyup(function(event){
		if(event.which=='27') closeModal();
	});

	$(window).on('resize', function(){
		//on window resize - update cover layer dimention and position
		if($('.container.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
	});

	function retrieveScale(btn) {
		var btnRadius = btn.width()/2,
			left = btn.offset().left + btnRadius,
			top = btn.offset().top + btnRadius - $(window).scrollTop(),
			scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

		btn.css('position', 'fixed').velocity({
			top: top - btnRadius,
			left: left - btnRadius,
			translateX: 0,
		}, 0);

		return scale;
	}

	function scaleValue( topValue, leftValue, radiusValue, windowW, windowH) {
		var maxDistHor = ( leftValue > windowW/2) ? leftValue : (windowW - leftValue),
			maxDistVert = ( topValue > windowH/2) ? topValue : (windowH - topValue);
		return Math.ceil(Math.sqrt( Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2) )/radiusValue);
	}

	function animateLayer(layer, scaleVal, bool) {
		layer.velocity({ scale: scaleVal }, 400, function(){
			$('body').toggleClass('overflow-hidden', bool);
			(bool) 
				? layer.parents('.container').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
				: layer.removeClass('is-visible').removeAttr( 'style' ).siblings('[data-type="modal-trigger"]').removeClass('to-circle');
		});
	}

	function updateLayer() {
		var layer = $('.container.modal-is-visible').find('.cd-modal-bg'),
			layerRadius = layer.width()/2,
			layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop(),
			layerLeft = layer.siblings('.btn').offset().left + layerRadius,
			scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());
		
		layer.velocity({
			top: layerTop - layerRadius,
			left: layerLeft - layerRadius,
			scale: scale,
		}, 0);
	}

	function closeModal() {
		var section = $('.container.modal-is-visible');
		section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			animateLayer(section.find('.cd-modal-bg'), 1, false);
		});
		//if browser doesn't support transitions...
		if(section.parents('.no-csstransitions').length > 0 ) animateLayer(section.find('.cd-modal-bg'), 1, false);
	}
});



// image picker
// Code By Webdevtrick ( https://webdevtrick.com )
$(".gift").click(function() {
    $(".gift").addClass("active");
    $(".gift > .icon").addClass("active");
    $(".pay").removeClass("active");
    $(".wrap").removeClass("active");
    $(".ship").removeClass("active");
    $(".pay > .icon").removeClass("active");
    $(".wrap > .icon").removeClass("active");
    $(".ship > .icon").removeClass("active");
    $("#line").addClass("one");
    $("#line").removeClass("two");
    $("#line").removeClass("three");
    $("#line").removeClass("four");
  })
  
  $(".pay").click(function() {
    $(".pay").addClass("active");
    $(".pay > .icon").addClass("active");
    $(".gift").removeClass("active");
    $(".wrap").removeClass("active");
    $(".ship").removeClass("active");
    $(".gift > .icon").removeClass("active");
    $(".wrap > .icon").removeClass("active");
    $(".ship > .icon").removeClass("active");
    $("#line").addClass("two");
    $("#line").removeClass("one");
    $("#line").removeClass("three");
    $("#line").removeClass("four");
  })
  
  $(".wrap").click(function() {
    $(".wrap").addClass("active");
    $(".wrap > .icon").addClass("active");
    $(".pay").removeClass("active");
    $(".gift").removeClass("active");
    $(".ship").removeClass("active");
    $(".pay > .icon").removeClass("active");
    $(".gift > .icon").removeClass("active");
    $(".ship > .icon").removeClass("active");
    $("#line").addClass("three");
    $("#line").removeClass("two");
    $("#line").removeClass("one");
    $("#line").removeClass("four");
  })
  
  $(".ship").click(function() {
    $(".ship").addClass("active");
    $(".ship > .icon").addClass("active");
    $(".pay").removeClass("active");
    $(".wrap").removeClass("active");
    $(".gift").removeClass("active");
    $(".pay > .icon").removeClass("active");
    $(".wrap > .icon").removeClass("active");
    $(".gift > .icon").removeClass("active");
    $("#line").addClass("four");
    $("#line").removeClass("two");
    $("#line").removeClass("three");
    $("#line").removeClass("one");
  })
  
  $(".gift").click(function() {
    $("#first").addClass("active");
    $("#second").removeClass("active");
    $("#third").removeClass("active");
    $("#fourth").removeClass("active");
  })
  
  $(".pay").click(function() {
    $("#first").removeClass("active");
    $("#second").addClass("active");
    $("#third").removeClass("active");
    $("#fourth").removeClass("active");
  })
  
  $(".wrap").click(function() {
    $("#first").removeClass("active");
    $("#second").removeClass("active");
    $("#third").addClass("active");
    $("#fourth").removeClass("active");
  })
  
  $(".ship").click(function() {
    $("#first").removeClass("active");
    $("#second").removeClass("active");
    $("#third").removeClass("active");
    $("#fourth").addClass("active");
  })

