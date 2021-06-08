jQuery(document).ready(function($){

	// onsubmit show the result window with loading
	$('#main-form').on('submit', (event)=>{
		event.preventDefault();
		console.log("submit event");
		var actionBtn = $('#process-btn'),
		scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));
		
		actionBtn.addClass('to-circle');
		actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
		});
	
		//if browser doesn't support transitions...
		if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
	
	
		const formData = new FormData(document.getElementById("main-form"));
		console.log(formData);
		// fetch("/submit",{
		// 	method:'POST',
		// 	mode : 'same-origin',
		//     credentials: 'same-origin' ,
		//     body : formData
		// }).then((data, err) => {
		// 	if(err) console.log(err);
		// 	else
		// 		console.log(data);
		// });
	
		console.log("something");
	});



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
			scale = scaleValue(top, left, btnRadius, $(window).width(), $(window).height());

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

});





class TableCsv {
  /**
   * @param {HTMLTableElement} root The table element which will display the CSV data.
   */
  constructor(root) {
    this.root = root;
  }

  /**
   * Clears existing data in the table and replaces it with new data.
   *
   * @param {string[][]} data A 2D array of data to be used as the table body
   * @param {string[]} headerColumns List of headings to be used
   */
  update(data, headerColumns = []) {
    this.clear();
    this.setHeader(headerColumns);
    this.setBody(data);
  }

  /**
   * Clears all contents of the table (incl. the header).
   */
  clear() {
    this.root.innerHTML = "";
  }

  /**
   * Sets the table header.
   *
   * @param {string[]} headerColumns List of headings to be used
   */
  setHeader(headerColumns) {
    this.root.insertAdjacentHTML(
      "afterbegin",
      `
            <thead>
                <tr>
                    ${headerColumns.map((text) => `<th>${text}</th>`).join("")}
                </tr>
            </thead>
        `
    );
  }

  /**
   * Sets the table body.
   *
   * @param {string[][]} data A 2D array of data to be used as the table body
   */
  setBody(data) {
    const rowsHtml = data.map((row) => {
      return `
                <tr>
                    ${row.map((text) => `<td>${text}</td>`).join("")}
                </tr>
            `;
    });

    this.root.insertAdjacentHTML(
      "beforeend",
      `
            <tbody>
                ${rowsHtml.join("")}
            </tbody>
        `
    );
  }
}

// const tableRoot = document.querySelector("#csvRoot");
// const csvFileInput = document.querySelector("#csvFileInput");
// const tableCsv = new TableCsv(tableRoot);

// console.log("hello");

// csvFileInput.addEventListener("change", (e) => {
//   Papa.parse(csvFileInput.files[0], {
//     delimiter: ",",
//     skipEmptyLines: true,
//     complete: (results) => {
//       tableCsv.update(results.data.slice(1), results.data[0]);
//     }
//   });
// });


