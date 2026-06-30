/**
*	Hendrie (HTML)
*	Copyright © Hendrie by beshleyua. All Rights Reserved.
**/

$(function () {
	'use strict';
	
	var width = $(window).width();
	var height = $(window).height();
	$('.section.started').css({'height':height});
	
	/* Preloader */
	function hidePreloader() {
		if ($('body').hasClass('ready')) return;
		$(".preloader .spinner").fadeOut(function(){
			$('.preloader').fadeOut();
			$('body').addClass('ready');
		});
	}
	$(window).on('load', hidePreloader);
	setTimeout(hidePreloader, 3000);

	/* Fade animations on scroll */
	if (width > 720) {
		window.sr = ScrollReveal();
		sr.reveal('.animated');
	}

	/* Typed subtitle */
	$('.typed-title').typed({
		stringsElement: $('.typing-title'),
		backDelay: 5000,
		typeSpeed: 0,
		loop: true
	});

	/* Youtube video background */
	if ($('#video-bg').length) {
		$("#video-bg").YTPlayer();
	}

	/* Smoothscroll */
	if($('.section.started').length) {
		$(window).on('scroll', function(){
			var scrollPos = $(window).scrollTop();
			$('.top-menu ul li a').each(function () {
				var currLink = $(this);
				var refElement = $(currLink.attr("href"));
				if (refElement.offset().top <= scrollPos) {
					$('.top-menu ul li').removeClass("active");
					currLink.closest('li').addClass("active");
				}
			});
		});
	}

	/* Top Menu */
	if($('.section.started').length) {
		$('.top-menu ul li a').on('click', function(){
			var id = $(this).attr('href');
			var h = parseFloat($(id).offset().top);
			
			$('body,html').animate({
				scrollTop: h + 10
			}, 800);
			
			return false;
		});
	}

	/* Open Top Menu */
	$('.page').on('click', '.menu-btn', function(){
		if($('.top-menu').hasClass('active')){
			$('.top-menu').removeClass('active');
			$(this).removeClass('active');
		} else {
			$('.top-menu').addClass('active');
			$(this).addClass('active');
		}

		return false;
	});
	
	/* Hide mouse button on scroll */
	$(window).on('scroll', function() {
		if ($(this).scrollTop() >= height-10) {
			$('.mouse-btn').fadeOut();
		}
		if ($(this).scrollTop() <= height-10) {
			$('.mouse-btn').fadeIn();
		}
		if ($(this).scrollTop() <= height-10) {
			$('.top-menu ul li').removeClass("active");
		}
	});

	/* Pause/Play video on scroll */
	if ($('#video-bg').length) {
		$(window).on('scroll', function() {
			if ($(this).scrollTop() >= height-10) {
				$('#video-bg').YTPPause();
			}
			if ($(this).scrollTop() <= height-10) {
				$('#video-bg').YTPPlay();
			}
		});
	}
	
	/* On click mouse button, page scroll down */
	$('.section').on('click', '.mouse-btn', function() {
		$('body,html').animate({
			scrollTop: height
		}, 800);
	});

	/* Menu filled */
	if($(window).scrollTop() > 10) {
		$('header').addClass('filled');
	} else {
		$('header').removeClass('filled');
	}
	$(window).on('scroll', function() {
		if($(window).scrollTop() > 10) {
			$('header').addClass('filled');
		} else {
			$('header').removeClass('filled');
		}
	});

	/* Initialize masonry items */
	var $container = $('.box-items');
	
	$container.imagesLoaded(function() {
		$container.multipleFilterMasonry({
			itemSelector: '.box-item',
			filtersGroupSelector: '.filters',
			percentPosition: true,
			gutter: 0
		});
	});
	

	/* 12. Initialize masonry filter */
	$('.filters label').on('change', 'input[type="radio"]', function() {
		if ($(this).is(':checked')) {
			$('.f_btn').removeClass('active');
			$(this).closest('.f_btn').addClass('active');
		}
		/* Refresh Portfolio magnific popup */
		$('.has-popup').magnificPopup({
			type: 'inline',
			overflowY: 'auto',
			closeBtnInside: true,
			mainClass: 'mfp-fade'
		});
	});

	/* Portfolio magnific popup */
	$('.has-popup').magnificPopup({
		type: 'inline',
		overflowY: 'auto',
		closeBtnInside: true,
		mainClass: 'mfp-fade'
	});
	
	/* gallery */
	$('.post-lightbox').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
		}
	});
	
	/* Validate contact form */
	$("#cform").validate({
		rules: {
			name: {
				required: true
			},
			tel: {
				required: true
			},
			message: {
				required: true
			},
			subject: {
				required: true
			},
			email: {
				required: true,
				email: true
			}
		},
		success: "valid",
		// "No redirect" UX: submit to our Vercel API, then show modal.
		submitHandler: function(form) {
			var $form = $(form);
			$('#contactError').hide();

			$.ajax({
				url: '/api/contact',
				type: 'post',
				dataType: 'json',
				data: $form.serialize(),
				success: function() {
					$('#cform').fadeOut();
					showSuccessModal();
				},
				error: function() {
					$('#contactError').fadeIn();
				}
			});

			// Prevent navigation/reload.
			return false;
		}
	});
	
	/* Validate contact form */
	$("#blog-form").validate({
		rules: {
			name: {
				required: true
			},
			message: {
				required: true
			},
			email: {
				required: true,
				email: true
			}
		},
		success: "valid",
		submitHandler: function() {
			$('#blog-form').fadeOut();
			$('.alert-success').delay(1000).fadeIn();
		}
	});

	/* Success modal (shown after AJAX submit succeeds) */
	function showSuccessModal() {
		var $overlay = $('#successModalOverlay');
		if (!$overlay.length) return;
		$overlay.addClass('show');
		$overlay.attr('aria-hidden', 'false');

		// Focus close button for accessibility
		var $closeBtn = $overlay.find('.success-modal-close').first();
		if ($closeBtn.length) $closeBtn.trigger('focus');
	}

	function hideSuccessModal() {
		var $overlay = $('#successModalOverlay');
		if (!$overlay.length) return;
		$overlay.removeClass('show');
		$overlay.attr('aria-hidden', 'true');
	}

	$(document).on('click', '#successModalOverlay', function(e) {
		// Close only when clicking the overlay itself (not the modal content)
		if (e.target && $(e.target).is('#successModalOverlay')) {
			hideSuccessModal();
		}
	});
	$(document).on('click', '.success-modal-close', function() {
		hideSuccessModal();
	});
	$(document).on('keydown', function(e) {
		if (e.key === 'Escape') hideSuccessModal();
	});

	try {
		var params = new URLSearchParams(window.location.search);
		if (params.get('contact') === 'success') {
			showSuccessModal();

			// Remove the param so refreshing doesn't show it again
			var nextUrl = new URL(window.location.href);
			nextUrl.searchParams.delete('contact');
			window.history.replaceState({}, document.title, nextUrl.toString());
		}
	} catch (err) {
		// If URLSearchParams/URL isn't supported, just do nothing.
	}

});