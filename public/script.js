let openImageNewTab = (event)=>{
	console.log("hello");
	console.log('image');
	window.open(event.target.src);
}

let RemoveHandler = (event) => {
	let viewbtn = event.target;
	let fileInput = $(viewbtn).parent().prev('.fileInput').get(0);
	fileInput.value = "";
	$(viewbtn).parent().get(0).innerHTML="";
}

let ShowStudentUnderstandingResult = ()=>{
	ShowResult("./results/Student_understanding.csv");
}
let ShowDifficultyMetricResult = ()=>{
	ShowResult("./results/Difficulty_metric.csv");
}
let ShowResult = (src) => {
	var w = window.open("", "popupWindow", "width=600, height=400, scrollbars=yes");
	let table = w.document.createElement("table");
	table.id = "csvRoot";
	w.document.body.append(table);

	let style = w.document.createElement('style')
	style.innerHTML = `
	table {
		border-collapse: collapse;
		border-radius: 5px;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
		overflow: hidden;
		font-family: "Quicksand", sans-serif;
		font-weight: bold;
		font-size: 14px;
	  }
	  
	  th {
		background: #009578;
		color: #ffffff;
		text-align: left;
	  }
	  
	  th,
	  td {
		padding: 10px 20px;
	  }
	  
	  tr:nth-child(even) {
		background: #eeeeee;
	  }
	
	`;

	w.document.head.append(style);

	const tableRoot = w.document.querySelector("#csvRoot");
	const tableCsv = new TableCsv(tableRoot);

	Papa.parse(src , {
		download:true,
		delimiter: ",",
		skipEmptyLines: true,
		complete: (results) => {
			console.log(results);
			tableCsv.update(results.data.slice(1), results.data[0]);
		}
	});
}

let ViewHandler = (event) => {
	let viewbtn = event.target;
	let fileInput = $(viewbtn).parent().prev('.fileInput').get(0);

	var w = window.open("", "popupWindow", "width=600, height=400, scrollbars=yes");
	let table = w.document.createElement("table");
	table.id = "csvRoot";
	w.document.body.append(table);

	let style = w.document.createElement('style')
	style.innerHTML = `
	table {
		border-collapse: collapse;
		border-radius: 5px;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
		overflow: hidden;
		font-family: "Quicksand", sans-serif;
		font-weight: bold;
		font-size: 14px;
	  }
	  
	  th {
		background: #009578;
		color: #ffffff;
		text-align: left;
	  }
	  
	  th,
	  td {
		padding: 10px 20px;
	  }
	  
	  tr:nth-child(even) {
		background: #eeeeee;
	  }
	
	`;

	w.document.head.append(style);

	const tableRoot = w.document.querySelector("#csvRoot");
	const tableCsv = new TableCsv(tableRoot);

	Papa.parse(fileInput.files[0], {
		delimiter: ",",
		skipEmptyLines: true,
		complete: (results) => {
			console.log(results);
			tableCsv.update(results.data.slice(1), results.data[0]);
		}
	});
}


jQuery(document).ready(function($){


	let FileChangeHandler = (event) => {
		let uploader = event.target;
		if(uploader.files.length==0) {
			console.log($(event.target).next('.controls'));
			$(event.target).next('.controls')[0].innerHTML="";
		} else{
			var controls = `
			<br>
			<label class="filename">${uploader.files[0].name}</label>
			<input class="btn view" type="button" value="View" onClick="ViewHandler(event)" />
			<input class="btn remove" type="button" value="Remove" onclick="RemoveHandler(event)" />
			`
			$(uploader).next('.controls').html(controls);
		}
		
	}

	$('#cie_file').on('change', FileChangeHandler);
	$('#student_feedback_file').on('change', FileChangeHandler);
	$('#teacher_feedback_file').on('change', FileChangeHandler);
	$('#key_file').on('change', FileChangeHandler);


	$('#process-btn').on('click', (event) => {
		let formInputs = document.forms["main-form"].getElementsByClassName("fileInput");
		for(let input of formInputs ) {
			if(input.files.length==0){
				alert("Upload all required files");
				break;
			}
		}
	})

	// onsubmit show the result window with loading
	$('#main-form').on('submit', (event)=>{
		event.preventDefault();

		let process_btn = document.getElementById('process-btn')
		process_btn.disabled = true;

		process_btn.value = "Processing"

		let count = 0;
		var processing = setInterval(()=>{ 
			if(count==3){
				process_btn.value="Processing";
				count = 0;
			} else {
				process_btn.value=process_btn.value+".";
				count++;
			}
		}, 1000);

		const formData = new FormData(document.getElementById("main-form"));
		fetch("/submit",{
			method:'POST',
			mode : 'same-origin',
		    credentials: 'same-origin' ,
		    body : formData
		}).then((Response, err) => {
		 	clearInterval(processing);
		 	process_btn.value="Process";
			if(err) {
				console.log(err);
				window.alert("Server was unable to process the request, try again");
			} else {
				if(!response.status !== 200){
					console.log(err);
					window.alert("Server was unable to process the request, try again");
					process_btn.disabled = false;
					return;
				}
				console.log("received response");
				//trigger the animation - open modal window
				var actionBtn = $('#process-btn'),
				scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));
				
				actionBtn.addClass('to-circle');
				actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
				});
			
				//if browser doesn't support transitions...
				if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
			}
		});
	});


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

		setTimeout(() =>{ document.getElementById('process-btn').disabled = false; }, 2000)
		

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
		$(".fifth").removeClass("active");
		$("#line").removeClass("five");
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
		$(".fifth").removeClass("active");
		$("#line").removeClass("five");
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
		$(".fifth").removeClass("active");
		$("#line").removeClass("five");
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
		$(".fifth").removeClass("active");
		$("#line").removeClass("five");
	})

	$(".fifth").click(function() {
		$(".fifth").addClass("active");
		$(".pay").removeClass("active");
		$(".wrap").removeClass("active");
		$(".gift").removeClass("active");
		$("#line").addClass("five");
		$("#line").removeClass("one");
		$("#line").removeClass("two");
		$("#line").removeClass("three");
		$("#line").removeClass("four");
	})


	
	$(".gift").click(function() {
		$("#first").addClass("active");
		$("#second").removeClass("active");
		$("#third").removeClass("active");
		$("#fourth").removeClass("active");
		$("#fifth").removeClass("active");
	})
	
	$(".pay").click(function() {
		$("#first").removeClass("active");
		$("#second").addClass("active");
		$("#third").removeClass("active");
		$("#fourth").removeClass("active");
		$("#fifth").removeClass("active");
	})
	
	$(".wrap").click(function() {
		$("#first").removeClass("active");
		$("#second").removeClass("active");
		$("#third").addClass("active");
		$("#fourth").removeClass("active");
		$("#fifth").removeClass("active");
	})
	
	$(".ship").click(function() {
		$("#first").removeClass("active");
		$("#second").removeClass("active");
		$("#third").removeClass("active");
		$("#fourth").addClass("active");
		$("#fifth").removeClass("active");
	})

	$(".fifth").click(function() {
		$("#fifth").addClass("active");
		$("#first").removeClass("active");
		$("#second").removeClass("active");
		$("#third").removeClass("active");
		$("#fourth").removeClass("active");
		
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