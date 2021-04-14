$(function() {

	if ( $(window).width() >= 576 ) {
		$('.main-banner-video-item').each(function() {
			let ths = $(this),
					videoSrc = ths.data('video-src');
			ths.append(`<video src="${videoSrc}" muted autoplay loop preload="none"></video>`);
		});
	}

	const globalColor = getComputedStyle(document.documentElement).getPropertyValue('--global-accent-color');

	const touchPrevent = e => {
		e.preventDefault();
	}

	function bodyNoScroll() {
		$('body').addClass('no-scroll');
  	document.addEventListener('touchmove', touchPrevent, { passive: true });
	}

	function bodyHasScroll() {
		$('body').removeClass('no-scroll');
  	document.removeEventListener('touchmove', touchPrevent, { passive: true });
	}

	let prevArrow = '<div class="slider-nav-arrow slider-prev"><span class="icon-angle-left"></span></div>',
			nextArrow = '<div class="slider-nav-arrow slider-next"><span class="icon-angle-right"></span><svg class="progress-ring" width="39" height="39"><circle class="progress-ring-circle" stroke-width="1" stroke="#171723" cx="19.5" cy="19.5" r="19" fill="transparent" /></svg></div>';

	let mainWindowSlider = $('.main-window-slider'),
			mainWindowSliderIntervar,
			mainWindowSliderIntervarTime = 5000;

	mainWindowSlider.on('init', function() {
		$('.main-window-slider-block .slider-next svg circle').css('animation-duration', `${mainWindowSliderIntervarTime - 10}ms`);
		startAutoPlayMainSlider();
	});

	mainWindowSlider.slick({
		slidesToShow: 1,
		arrows: false,
		dots: false,
		loop: true,
		fade: true,
		touchMove: false,
		draggable: false,
		swipe: false,
		swipeToSlide: false,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 0,
				settings: {
					touchMove: true,
					draggable: true,
					swipe: true,
					swipeToSlide: true,
				}
			},
			{
				breakpoint: 576,
				settings: {
					touchMove: true,
					draggable: true,
					swipe: true,
					swipeToSlide: true,
				}
			},
			{
				breakpoint: 768,
				settings: {
					touchMove: false,
					draggable: false,
					swipe: false,
					swipeToSlide: false,
				}
			}
		]
	});

	let cantNextVideo = true;

	function nextVideoSlide(nextSlide) {
		let nextVideo = $('.main-banner-video-item').eq(nextSlide);
		$('.main-banner-video-item').each(function(i) {
			let ths = $(this);
			if ( i !== nextSlide ) {
				ths.removeClass('current-slide');
				setTimeout(() => {
					ths.hide().removeClass('active');
				}, $(window).width() >= 576 ? 800 : 300);
			}
		});
		nextVideo.show();
		setTimeout(() => {
			nextVideo.addClass('active current-slide');
		}, 10);
	}

	$('.main-window-slider-block .slider-next').on('click', function() {
		console.log(cantNextVideo)
		if ( cantNextVideo ) {
			cantNextVideo = false;
			clearInterval(mainWindowSliderIntervar);
			$('.main-window-slider-block .slider-next').removeClass('ring-animate');
			startAutoPlayMainSlider();
			mainWindowSlider.slick('slickNext');
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	$('.main-window-slider-block .slider-prev').on('click', function() {
		if ( cantNextVideo ) {
			cantNextVideo = false;
			clearInterval(mainWindowSliderIntervar);
			$('.main-window-slider-block .slider-next').removeClass('ring-animate');
			startAutoPlayMainSlider();
			mainWindowSlider.slick('slickPrev');
			setTimeout(() => {
				cantNextVideo = true
			}, 800)
		}
	});

	mainWindowSlider.on('beforeChange', function(e, s, c, n) {
		nextVideoSlide(n);
		cantNextVideo = false;
		setTimeout(() => {
			cantNextVideo = true
		}, 800)
	});

	function startAutoPlayMainSlider() {
		$('.main-window-slider-block .slider-next').removeClass('ring-animate');
		setTimeout(() => {
			$('.main-window-slider-block .slider-next').addClass('ring-animate')
		}, 10);
		mainWindowSliderIntervar = setInterval(() => {
			mainWindowSlider.slick('slickNext');
			if ( $('.main-window-slider-block .slider-next').hasClass('ring-animate') ) {
				$('.main-window-slider-block .slider-next').removeClass('ring-animate');
				setTimeout(() => {
					$('.main-window-slider-block .slider-next').addClass('ring-animate')
				}, 10);
			}
		}, mainWindowSliderIntervarTime);
	}

	$('.phone-mask').inputmask({
  	mask: "+7 999 999 99 99",
  	showMaskOnHover: false
  });

  $('.decimal').inputmask('decimal', {
    rightAlign: false
  });

	$('.select-style').each(function() {
		let ths = $(this),
				options = {
					minimumResultsForSearch: -1,
					width: '100%',
				};
		if ( ths[0].hasAttribute('multiple') ) {
			options.dropdownCssClass = 'select-with-checkboxes';
			options.closeOnSelect = false;
			options.shouldFocusInput = -1;
		}
		ths.select2(options)
	});

	$('.select-style').on('select2:opening select2:closing', function( event ) {
		let $searchfield = $(this).parent().find('.select2-search__field');
		$searchfield.prop('disabled', true);
	});

	$('.popup-flex').on('scroll', function() {
		if ( $(window).width() < 1024 ) {
			$('.select-style').select2('close')
		}
	});

	let unhoverBannerTimeout;

	$('.main-window-projects-nav a').hover(function() {
		let thsId = $(this).data('tab-id'),
				notCurrTab = $(`.main-window-projects-item:not(${thsId})`);
		notCurrTab.removeClass('active');
		$(thsId).addClass('active');
		$('.main-window').addClass('overlay-darkness');
		clearTimeout(unhoverBannerTimeout)
	}, function() {
		$('.main-window-projects-item').removeClass('active');
		unhoverBannerTimeout = setTimeout(() => {
			$('.main-window').removeClass('overlay-darkness')
		}, 300)
	});

	let newsSliderCanMove = true;

	let newsSlider = $('.news-slider').slick({
		slidesToShow: 3,
		arrows: false,
		dots: false,
		infinite: false,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					variableWidth: true,
					contain: true,
					infinite: true
				}
			}
		]
	});

	newsSlider.on('beforeChange', function(e, s, c, n) {
		newsSlider.find('.slick-slide').removeClass('prev-slide').eq(n - 1).addClass('prev-slide')
	});

	newsSlider.on('afterChange', function() {
		newsSliderCanMove = true
	});

	$('.news-slider-arrow-prev').on('click', function() {
		if ( newsSliderCanMove ) {
			newsSliderCanMove = false;
			newsSlider.slick('slickPrev')
		}
	});

	$('.news-slider-arrow-next').on('click', function() {
		if ( newsSliderCanMove ) {
			newsSliderCanMove = false;
			newsSlider.slick('slickNext')
		}
	});

	function openPopup(id) {
  	let notCurrentPopups = $(`.popup-wrapper:not(${id})`);
  	notCurrentPopups.removeClass('opened');
  	setTimeout(() => {
  		notCurrentPopups.hide()
  	}, 400);
  	$(id).show();
  	setTimeout(() => {
  		$(id).addClass('opened')
  	}, 50);
  	bodyNoScroll();
  }

  function closePopup(e) {
  	e !== undefined ? e.preventDefault() : '';
  	$('.popup-wrapper').removeClass('opened');
  	setTimeout(() => {
  		$('.popup-wrapper').hide();
  		$('.video-popup-block').html('');
  	}, 400);
  	bodyHasScroll();
  }

  $(document).on('click', '.open-popup', function(e) {
  	e.preventDefault();
  	let id = $(this).attr('href');
  	openPopup(id);
  });

  $('.popup-close').on('click', closePopup);

  $('.popup-wrapper').on('click', function(e) {
  	let clickTarget = $(e.target);
  	if ( clickTarget.hasClass('popup-flex') ) {
  		closePopup();
  	}
  });

  function initVideo() {

  	$('.video-block').each(function() {

	  	let ths = $(this),
	  			src = ths.data('video-src');

	  	if ( !ths.hasClass('init-scripts') ) {

	  		ths.addClass('init-scripts');

	  		ths.find('.video-play').on('click', function() {
		  		$('.video-popup-block').html(`<iframe width="560" height="315" src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
		  		openPopup('#video-popup');
		  	});

	  	}

	  });

  }

  $('.text-slider').slick({
  	infinite: true,
  	arrows: false,
  	dots: false,
  	draggable: false,
  	autoplay: true,
  	autoplaySpeed: 0,
  	cssEase: 'linear',
  	variableWidth: true,
  	speed: 6000
  });

  let canTextAnimate = true;

  function projectHelpInfoPosition() {
  	$('.project-price-info-dropdown').each(function() {
  		let ths = $(this);
  		if ( ths.offset().left + ths.outerWidth() > $(window).width() ) {
  			ths.addClass('right-position')
  		}
  		else {
  			ths.removeClass('right-position')
  		}
  	});
  }projectHelpInfoPosition();

  function advantageHeight() {
  	$('.advantages-item.type-2').each(function() {
  		let ths = $(this),
  				thsBody = ths.find('.advantages-body'),
  				translateHeight = thsBody.outerHeight() - thsBody.find('.h4').outerHeight(true);
  		thsBody.css('transform', `translateY(${translateHeight}px)`);
  	});
  }advantageHeight();

  let layoutImages = $('.layout-image');
  layoutImages.slick({
  	slidesToShow: 1,
		arrows: false,
		dots: false,
		loop: true,
		fade: true,
		adaptiveHeight: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 0,
				settings: {
					fade: false
				}
			},
			{
				breakpoint: 575,
				settings: {
					fade: true
				}
			}
		]
  });

  let refrestLayoutSlider = setInterval(() => {
  	if ( layoutImages.find('.slick-list').width() == 0 ) {
  		layoutImages.slick("refresh")
  	}
  	else {
  		clearInterval(refrestLayoutSlider)
  	}
  }, 250)

  function layoutsSliderDynamic() {
  	$('.layouts-body-tab').each(function() {

  		let thsTab = $(this);

  		if ( !thsTab.hasClass('init-scripts') ) {

  			thsTab.addClass('init-scripts');

		  	let layoutInfo = thsTab.find('.layout-info-slider');
			  layoutInfo.slick({
			  	slidesToShow: 1,
					arrows: false,
					dots: false,
					loop: true,
					fade: true,
					adaptiveHeight: true
			  });

			  thsTab.find('.select-layout-item').on('click', function() {
			  	let ths = $(this);
			  	if ( !ths.hasClass('active') ) {
			  		let dataAttr = ths.data('for'),
			  				i = parseInt(thsTab.find(`.layout-image [data-img=${dataAttr}]`).parents('.slick-slide').data('slick-index'));
			  		thsTab.find('.select-layout-item').removeClass('active');
			  		ths.addClass('active');
			  		thsTab.find('.select-layout-border').css('transform', `translate(${ths.position().left}px, ${ths.position().top}px)`);
			  		layoutImages.slick('slickGoTo', i);
			  		layoutInfo.slick('slickGoTo', i);
			  	}
			  });

			  layoutImages.on('swipe', function(e, i, a) {
			  	if ( $(window).width() < 576 ) {
			  		layoutInfo.slick('slickGoTo', i.currentSlide)
			  	}
			  });

			  layoutInfo.on('swipe', function(e, i, a) {
			  	if ( $(window).width() < 576 ) {
			  		layoutImages.slick('slickGoTo', i.currentSlide)
			  	}
			  })

  		}

	  });
  }

	$(document).on('click', '.layouts-filter-nav-link', function(e) {
  	e.preventDefault();
  	let thsTab = $(`.layouts-body-tab[data-tab=${$(this).data('tab')}]`);
  	if ( thsTab.is(':hidden') ) {
  		$('.layouts-filter-nav-link').removeClass('active');
  		$(this).addClass('active');
  		$('.layouts-body-tab').hide();
  		thsTab.fadeIn(400);
  		thsTab.find('.layout-image').slick('refresh');
  		thsTab.find('.layout-info-slider').slick('refresh');
  	}
  });

  let calcLoaderTimeout;

	function calculatorLoader() {
		clearTimeout(calcLoaderTimeout);
		$('.calcultator-total-price').addClass('loading');
		calcLoaderTimeout = setTimeout(() => {
			$('.calcultator-total-price').removeClass('loading');
		}, 1500);
	}

	let fullFiltersLoaderTimeout;

	function fullFiltersLoader() {
		clearTimeout(fullFiltersLoaderTimeout);
		$('.full-filter-btns .btn').find('.loader-ellipsis').remove();
		$('.full-filter-btns .btn').append('<span class="loader-ellipsis"><span></span></span').addClass('btn-loading');
		fullFiltersLoaderTimeout = setTimeout(() => {
			$('.full-filter-btns .btn').removeClass('btn-loading').find('.loader-ellipsis').remove();
		}, 1500);
	}

	let mainFiltersLoaderTimeout;

	function mainFiltersLoader() {
		clearTimeout(mainFiltersLoaderTimeout);
		$('.main-window-footer .filter-submit .btn').find('.loader-ellipsis').remove();
		$('.main-window-footer .filter-submit .btn').append('<span class="loader-ellipsis"><span></span></span>').addClass('btn-loading');
		mainFiltersLoaderTimeout = setTimeout(() => {
			$('.main-window-footer .filter-submit .btn').removeClass('btn-loading').find('.loader-ellipsis').remove();
		}, 1500);
	}

  $('.filter-range-solo').each(function() {
		let ths = $(this),
				inp = ths.find('.form-control'),
				val = inp.val(),
				range = ths.find('.filter-range-slider')[0],
				rangeStepData = ths.find('.filter-range-slider').data('step'),
				min = ths.find('.filter-range-slider').data('min'),
				max = ths.find('.filter-range-slider').data('max'),
				options = {
					start: parseFloat(val),
					connect: [true, false],
					range: {
						min: parseFloat(min),
						max: parseFloat(max)
					}
				};

		rangeStepData !== undefined ? options.step = parseFloat(rangeStepData) : options = options;

		noUiSlider.create(range, options);

		range.noUiSlider.on('update', function (values, handle) {
			parseFloat(values[0]) == parseInt(values[0]) ? values[0] = parseInt(values[0]) : values[0] = parseFloat(values[0]);
			inp.val(values[0]);
			inp.parents('.calculator-form').length > 0 ? calculatorLoader() : '';
			inp.parents('.full-filters-block').length > 0 ? fullFiltersLoader() : '';
			inp.parents('.main-window-footer').length > 0 ? mainFiltersLoader() : '';
		});

		inp.on('input', function() {
			range.noUiSlider.setHandle(null, parseFloat($(this).val()))
		});

	});

	$('.filter-range').each(function() {

		let ths = $(this),
				inpFrom = ths.find('.filter-range-input.from'),
				inpTo = ths.find('.filter-range-input.to'),
				fromVal = inpFrom.val(),
				toVal = inpTo.val(),
				min = inpFrom.data('min'),
				max = inpTo.data('max'),
				range = ths.find('.filter-range-slider')[0],
				rangeStepData = ths.find('.filter-range-slider').data('step'),
				inputs = [inpFrom[0], inpTo[0]],
				options = {
					start: [parseFloat(fromVal), parseFloat(toVal)],
					connect: true,
					range: {
						min: parseFloat(min),
						max: parseFloat(max)
					}
				};

		rangeStepData !== undefined ? options.step = parseFloat(rangeStepData) : options = options;

		if ( range ) {

			noUiSlider.create(range, options);

			range.noUiSlider.on('update', function (values, handle) {
				parseFloat(values[handle]) == parseInt(values[handle]) ? values[handle] = parseInt(values[handle]) : values[handle] = parseFloat(values[handle]);
				inputs[handle].value = values[handle];
				inpFrom.parents('.full-filters-block').length > 0 ? fullFiltersLoader() : '';
				inpFrom.parents('.calculator-form').length > 0 ? calculatorLoader() : '';
				inpFrom.parents('.main-window-footer').length > 0 ? mainFiltersLoader() : '';
			});

			inpFrom.on('change', function() {
				range.noUiSlider.setHandle(0, parseFloat($(this).val()))
			});

			inpTo.on('change', function() {
				range.noUiSlider.setHandle(1, parseFloat($(this).val()))
			});

		}

	});

	let canChangeSlider = true;

	function cloneValueForSliders() {

		$('.filter-range').each(function() {

			let ths = $(this),
					range = ths.find('.filter-range-slider')[0];

			if ( range != undefined ) {

				if ( range.classList.contains('noUi-target') ) {
					range.noUiSlider.on('update', function (values, handle) {
						parseFloat(values[handle]) == parseInt(values[handle]) ? values[handle] = parseInt(values[handle]) : values[handle] = parseFloat(values[handle]);
						if ( ths.data('for') != undefined && canChangeSlider ) {
							let cloneId = ths.data('for'),
									cloneRangeItem = $(cloneId).find('.filter-range-slider')[0];
							if ( cloneRangeItem != undefined ) {
								let cloneRange = cloneRangeItem.noUiSlider;
								canChangeSlider = false;
								cloneRange.setHandle(0, parseFloat(values[0]));
								cloneRange.setHandle(1, parseFloat(values[1]));
								canChangeSlider = true;
							}
						}
					});
				}

			}

		});

		$('.filter-range-solo').each(function() {
			let ths = $(this),
					range = ths.find('.filter-range-slider')[0];

			if ( range != undefined ) {

				if ( range.classList.contains('noUi-target') ) {
					range.noUiSlider.on('update', function (values, handle) {
						parseFloat(values[0]) == parseInt(values[0]) ? values[0] = parseInt(values[0]) : values[0] = parseFloat(values[0]);
						if ( ths.data('for') != undefined && canChangeSlider ) {
							let cloneId = ths.data('for'),
									cloneRange = $(cloneId).find('.filter-range-slider')[0].noUiSlider;
							canChangeSlider = false;
							cloneRange.noUiSlider.setHandle(null, parseFloat(values[0]));
							canChangeSlider = true;
						}
					});
				}

			}

		});

	}

	function updateMinMaxForRangeSliders(selector) {
		$(selector).each(function() {
			let ths = $(this),
					inpFrom = ths.find('.filter-range-input.from'),
					inpTo = ths.find('.filter-range-input.to'),
					min = inpFrom.data('min'),
					max = inpTo.data('max'),
					range = ths.find('.filter-range-slider')[0];

			if ( range != undefined ) {

				if ( range.classList.contains('noUi-target') ) {
					range.noUiSlider.updateOptions({
						range: {
							min: parseFloat(min),
							max: parseFloat(max)
						}
					}, true)
				}

			}
		});
	}

	$('.calculator-form input').on('input', calculatorLoader);
	$('.calculator-form select').on('change', calculatorLoader);

	$('.full-filters-block input').on('input', fullFiltersLoader);
	$('.full-filters-block select').on('change', fullFiltersLoader);

	$('.main-window-footer input').on('input', mainFiltersLoader);
	$('.main-window-footer select').on('change', mainFiltersLoader);

	$('.switch-checkbox-input').on('change', function() {
		if ( $(this).is(':checked') ) {
			$('.mortgage-form').slideDown(400)
		}
		else {
			$('.mortgage-form').slideUp(400)
		}
	});

	$('.burger-icon').on('click', function(e) {
		e.preventDefault();
		// $('.header-menu').addClass('opened')
		$('.menu').addClass('opened')
	});

	$('.close-menu-btn').on('click', function(e) {
		e.preventDefault();
		$('.menu').removeClass('opened')
	});

	$('.header-mob-close').on('click', function() {
		$('.header-menu').removeClass('opened')
	});

	$('.main-window-search-group').on('click', function() {
		openPopup('#select-apps-filter')
	});

	function checkMobBanners() {
		$('.main-banner-video-item').each(function() {
			let ths = $(this),
					thsSrc = ths.data('mob-bg');
			ths.css('background-image', `url(${thsSrc})`);
			ths.find('video').remove()
		});
	}

	if ( $(window).width() < 576 ) {
		checkMobBanners()
	}

	function animate() {
		$('.animate').each(function() {
			let ths = $(this),
					thsTop = ths.offset().top;
			if ( $(window).scrollTop() > thsTop - $(window).height() / 1.15 ) {
				ths.addClass('fade-in')
			}
		});
	}

	let pageLoad = false;

	animate();

	let filterInputs = [],
			filterSelects = [];

	function getCurrentFilterValues() {
		$('.full-filters-block').find('input').each(function() {
			let ths = $(this);
			filterInputs.push({
				item: ths,
				value: ths.attr('type') == 'checkbox' || ths.attr('type') == 'radio' ? ths.prop('checked') : ths.val()
			});
		});
		$('.full-filters-block').find('select').each(function() {
			let ths = $(this);
			filterSelects.push({
				item: ths,
				value: ths.val()
			});
		});
	}getCurrentFilterValues();

	$('.full-filter-btns .clear-filter').on('click', function(e) {
		e.preventDefault();
		let currInputs = [],
				currSelect = [];
		$('.full-filters-block').find('input').each(function() {
			let ths = $(this);
			currInputs.push(ths);
		})
		$('.full-filters-block').find('select').each(function() {
			let ths = $(this);
			currSelect.push(ths);
		})
		currInputs.forEach((item, index) => {
			if ( item.attr('type') == 'checkbox' || item.attr('type') == 'radio' ) {
				item.val(filterInputs[index].item.prop('checked', filterInputs[index].value));
			}
			else {
				item.val(filterInputs[index].value);
			}
			filterInputs[index].item.trigger('change input blur click');
			$('.mortgage-form').slideUp(400);
			$('.full-filters-block .filter-range').each(function() {
				if ( $(this).find('.filter-range-slider')[0] != undefined ) {
					$(this).find('.filter-range-slider')[0].noUiSlider.reset()
				}
			});
			$('.full-filters-block .filter-range-solo').each(function() {
				if ( $(this).find('.filter-range-slider')[0] != undefined ) {
					$(this).find('.filter-range-slider')[0].noUiSlider.reset()
				}
			});
		});
		currSelect.forEach((item, index) => {
			item.val(filterSelects[index].value).trigger('change');
		})
	});

	let canLocationScroll = true;

	$('.location-nav-link a').on('click', function(e) {
		e.preventDefault();
		canLocationScroll = false;
		let thsId = $(this).attr('href');
		$('.location-nav-link a').removeClass('active');
		$(this).addClass('active');
		$('html, body').animate({
			scrollTop: $(thsId).offset().top - 40
		}, 1000)
		setTimeout(() => {
			canLocationScroll = true
		}, 1000)
	});

	let cityMap = $('.s-projects-wrapper .s-city-map'),
			locNav = $('.location-nav'),
			locNavH = locNav.outerHeight(),
			secNumb = $('.s-projects-wrapper .section-nmb');

	function locationScroll() {

		let scrTop = $(window).scrollTop();

		$('.location-nav-link a').each(function() {
			let ths = $(this),
					thsId = $(this).attr('href');
			if ( scrTop > $(thsId).offset().top - $(window).outerWidth() / 5 ) {
				$('.location-nav-link a').each(function(i) {
					if ( i !== ths.index('.location-nav-link a') ) {
						$(this).removeClass('active');
					}
				});
				$(this).addClass('active');
			}
		});

		cityMap.each(function() {
			let thsCityMap = $(this);
			locNav.find('> div').each(function() {
				let thsLink = $(this),
						thsLinkTop = thsLink.offset().top,
						thsLinkH = thsLink.outerHeight();
				if ( thsLinkTop > thsCityMap.offset().top - thsLinkH &&
						 thsLinkTop < thsCityMap.offset().top + thsCityMap.outerHeight() - thsLinkH ) {
					thsLink.addClass('white')
				}
				else {
					thsLink.removeClass('white')
				}
			});
		});

		secNumb.each(function() {
			let thsSecNumb = $(this);
			if ( scrTop > thsSecNumb.offset().top - locNavH - 100 ) {
				thsSecNumb.addClass('fade-out')
			}
			else {
				thsSecNumb.removeClass('fade-out')
			}
		});

	}

	function closeContactMapItems() {
		let showItem = $('.contacts-map-objects-list').data('show-items') != undefined ? parseInt($('.contacts-map-objects-list').data('show-items')) : 6;
		$('.contacts-map-objects-list-item').each(function(i) {
			if ( i > showItem - 1 ) {
				$(this).hide()
			}
		});
	}closeContactMapItems();

	$('.contacts-map-objects-all a').on('click', function(e) {
		e.preventDefault();
		if ( $(this).hasClass('active') ) {
			closeContactMapItems();
			$(this).removeClass('active')
		}
		else {
			$(this).addClass('active');
			$('.contacts-map-objects-list-item').fadeIn(400)
		}
	});

	$('.contacts-form').on('submit', function(e) {
		e.preventDefault();
		$('.contacts-form-success').addClass('visible');
		return false;
	});

	$('.has-child span').on('click', function() {
		let dropParent = $(this).parent(),
				ul = dropParent.find('ul'),
				ulTop = ul.offset().top,
				scrTop = $(window).scrollTop();
		if ( !dropParent.hasClass('active') ) {
			if ( ulTop - scrTop < 0 ) {
				ul.addClass('down-view');
			}
			else if ( ( ulTop + ul.outerHeight() - scrTop + $(window).height() ) ) {
				ul.removeClass('down-view')
			}
		}
		else {
			ul.removeClass('down-view')
		}
		dropParent.toggleClass('active');
	});

	let minOneLoop = false; 

	function adaptiveHeader() {
  	if ( $(window).width() >= 576 ) {
	  	let headerContentWidth = 0;
	  	$('.main-window-footer-row > div:visible').each(function() {
	  		headerContentWidth += $(this).outerWidth(true);
	  	});
	  	headerContentWidth += parseInt($('.container').css('padding-left'));
	  	if ( headerContentWidth > $(window).width() ) {
	  		minOneLoop = true;
	  		for ( let i = $('.main-footer-nav > ul > li').length - 1; i--; i >= 0 ) {
	  			let ths = $('.main-footer-nav > ul').find('> li').eq(i);
	  			headerContentWidth = 0;
	  			$('.main-window-footer-row > div:visible').each(function() {
	  				headerContentWidth += $(this).outerWidth(true);
	  			});
	  			if ( headerContentWidth + parseInt($('.container').css('padding-left')) > $(window).width() && !ths.hasClass('has-child') ) {
	  				ths.appendTo('.main-footer-nav .has-child ul').addClass('insert-li')
	  			}
	  		}
	  	}
	  	else if ( minOneLoop ) {
	  		minOneLoop = false;
	  		$('.has-child ul').find('.insert-li').each(function() {
	  			let ths = $(this),
	  					thsHtml = ths.html();
	  			ths.removeClass('insert-li').remove();
	  			$('.has-child ul li:first-child').before(`<li>${thsHtml}</li>`);
	  			if ( headerContentWidth > $(window).width() ) {
			  		for ( let i = $('.main-footer-nav > ul > li').length - 1; i--; i >= 0 ) {
			  			let ths = $('.main-footer-nav > ul').find('> li').eq(i);
			  			headerContentWidth = 0;
			  			$('.main-window-footer-row > div:visible').each(function() {
			  				headerContentWidth += $(this).outerWidth(true);
			  			});
			  			if ( headerContentWidth + parseInt($('.container').css('padding-left')) > $(window).width() && !ths.hasClass('has-child') ) {
			  				ths.appendTo('.main-footer-nav .has-child ul').addClass('insert-li')
			  			}
			  		}
			  	}
	  		});
	  		if ( $('.main-footer-nav').length > 0 ) {adaptiveHeader()};
	  	}
  	}
  }

  let smallStocksSliderDuration = 4000;

 	document.documentElement.style.setProperty('--stocks-duration', `${smallStocksSliderDuration + 490}ms`);

 	let smallStocksSlider = $('.small-stocks-slider');

 	smallStocksSlider.on('init', function() {
 		document.documentElement.style.setProperty('--stocks-duration', `${smallStocksSliderDuration - 10}ms`);
		animateStocksNextBtn();
	});

  smallStocksSlider.slick({
		slidesToShow: 1,
		arrows: true,
		dots: false,
		infinite: false,
		prevArrow: prevArrow,
		nextArrow: nextArrow,
		speed: 500,
  	fade: true,
  	autoplay: true,
  	autoplaySpeed: smallStocksSliderDuration,
  	pauseOnHover:false
	});

	smallStocksSlider.on('beforeChange', function(e, s, c, n) {
		document.documentElement.style.setProperty('--stocks-duration', `${smallStocksSliderDuration + 490}ms`);
		smallStocksSlider.find('.slick-slide').eq(c).addClass('fade-up');
		animateStocksNextBtn();
	});

	smallStocksSlider.on('afterChange', function() {
		smallStocksSlider.find('.slick-slide').removeClass('fade-up');
	});

	function animateStocksNextBtn() {
		smallStocksSlider.find('.slider-next').removeClass('animate-ring');
		setTimeout(() => {
			smallStocksSlider.find('.slider-next').addClass('animate-ring');
		}, 10)
	}

	let layoutBorderPosition;

	$('.select-layout-filter label input').on('change', function() {
		clearTimeout(layoutBorderPosition);
		let filterName = $('.select-layout-filter label input:checked').data('filter');
		if ( filterName == 'all' ) {
			$('.select-layout-item').fadeIn(400);
		}
		else {
			$('.select-layout-item').hide();
			$(`.select-layout-item[data-filter="${filterName}"]`).fadeIn(400)
		}
		$('.select-layout-item:visible').eq(0).click();
	});

	$('.layout-image-item').each(function() {
		let ths = $(this);
		ths.find('.layout-image-item-view a').on('click', function(e) {
			e.preventDefault();
			let thsTab = $(this).data('tab'),
					thsTabItem = ths.find(`img[data-tab="${thsTab}"]`);
			if ( thsTabItem.is(':hidden') ) {
				ths.find('img').hide();
				thsTabItem.show();
				ths.find('.layout-image-item-view a').removeClass('active');
				$(this).addClass('active')
			}
		});
	});

	function initPhotosGallery() {

		let photosGallery = $('.photos-gallery').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true,
			infinite: true,
			asNavFor: '.photos-gallery-thumbs'
		});

		let photosGalleryThumbms = $('.photos-gallery-thumbs').slick({
			slidesToShow: 10,
			slidesToScroll: 1,
			arrows: true,
			dots: false,
			infinite: true,
			variableWidth: true,
			prevArrow: prevArrow,
			nextArrow: nextArrow,
			contain: true,
			asNavFor: '.photos-gallery',
			focusOnSelect: true
		});

	}

	function initLiveInRescom() {

		let liveInRescom = $('.slider-live-in-rescom'),
				liveInRescomPrev = $(`.stocks-nav[data-for="#${liveInRescom.attr('id')}"] .slider-prev`),
				liveInRescomNext = $(`.stocks-nav[data-for="#${liveInRescom.attr('id')}"] .slider-next`);

		let liveInRescomCanMove = true;

		liveInRescom.each(function() {

			let ths = $(this);

			if ( !ths.hasClass('init-scripts') ) {

				ths.addClass('init-scripts');

				let	options = {
					slidesToShow: ths.hasClass('slider-other-projects') ? 3 : 4,
					slidesToScroll: 1,
					arrows: false,
					dots: false,
					infinite: false,
					focusOnSelect: true,
					responsive: [
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 1
							}
						},
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 3
							}
						},
					]
				};
				ths.slick(options);
				ths.on('beforeChange', function(e, s, c, n) {
					ths.find('.slick-slide').removeClass('prev-slide');
					if ( n > 0 ) {
						ths.find('.slick-slide').eq(n - 1).addClass('prev-slide')
					}
				});

			}

		});

		liveInRescom.on('afterChange', function() {
			setTimeout(() => {
				liveInRescomCanMove = true
			}, 200)
		});

		liveInRescomPrev.on('click', function() {
			if ( liveInRescomCanMove ) {
				liveInRescomCanMove = false;
				liveInRescom.slick('slickPrev')
			}
		});

		liveInRescomNext.on('click', function() {
			if ( liveInRescomCanMove ) {
				liveInRescomCanMove = false;
				liveInRescom.slick('slickNext')
			}
		});

	}

	let videosSliderCanMove = true;

	function initVideoSlider() {
		let videosSlider = $('.videos-slider');
		if ( $(window).width() < 575 ) {
			if ( videosSlider.hasClass('slick-initialized') ) {
				videosSlider.slick('unslick')
			}
		}
		else {
			if ( !videosSlider.hasClass('slick-initialized') ) {
				videosSlider.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: false,
					infinite: false,
					focusOnSelect: true,
					responsive: [
						{
							breakpoint: 0,
							settings: {

							}
						}
					]
				});
			}
		}
	}initVideoSlider();

	$('.stocks-nav[data-for-slider]').each(function() {
		let ths = $(this),
				thsId = ths.data('for-slider');
		ths.find('.slider-prev').on('click', function() {
			$(thsId).slick('slickPrev');
		});
		ths.find('.slider-next').on('click', function() {
			$(thsId).slick('slickNext');
		});
	});

	$('.videos-item-link').on('click', function(e) {
		e.preventDefault();
		let thsVideo = $(this).data('video-src');
  	$('.video-popup-block').html(`<iframe width="560" height="315" src="${thsVideo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
  	openPopup('#video-popup');
	});

	function updateSelect(selector) {
		$(selector).trigger('change.select2');
	}

	$('.global-info-nav-link').on('click', function(e) {

		e.preventDefault();
		canLocationScroll = false;

		let thsId = $(this).attr('href'),
				scrTop = $(this).hasClass('skip') ? $(this).parents('.s-global-info').outerHeight() + $(this).parents('.s-global-info').offset().top + 50 : $(thsId).offset().top - 40 - $('.main-window-footer').outerHeight();
		$('.global-info-nav-link').removeClass('active');
		$(this).addClass('active');
		$('html, body').animate({
			scrollTop: scrTop - 40
		}, 1000)
		setTimeout(() => {
			canLocationScroll = true
		}, 1000)
		$('.global-info-nav').removeClass('fixed')
	});

	function globalInfoNavScroll() {

		let scrTop = $(window).scrollTop(),
				section = $('.global-info-navigation-block'),
				sectionOffset = section.length > 0 ? section.offset().top : 0;

		if ( scrTop >= sectionOffset && scrTop < sectionOffset + section.outerHeight() - $('.global-info-nav').outerHeight() - $('.main-window-footer-type-2').outerHeight() ) {
			$('.global-info-nav').addClass('fixed')
		}
		else {
			$('.global-info-nav').removeClass('fixed')
		}

		$('.global-info-nav-link').each(function() {
			let ths = $(this),
					thsId = $(this).attr('href');
			if ( thsId !== '#' ) {
				if ( scrTop > $(thsId).offset().top - $(window).outerWidth() / 5 ) {
					$('.global-info-nav-link').each(function(i) {
						if ( i !== ths.index('.global-info-nav-link') ) {
							$(this).removeClass('active');
						}
					});
					$(this).addClass('active');
				}
			}
		});

	}

	$('.block-info-type-3-img').each(function() {
		let ths = $(this);
		if ( ths.find('img').length > 1 ) {
			ths.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				dots: false,
				infinite: false,
				focusOnSelect: true,
				prevArrow: prevArrow,
				nextArrow: nextArrow,
			});
		}
	});

	$('.menu-list').each(function() {
		let ths = $(this),
				links = ths.find('a');
		links.hover(
			function() {
				ths.addClass('hovered')
			},
			function() {
				ths.removeClass('hovered')
			}
		);
	});

	$('.sales-offices-map-balloon-close').on('click', function() {
		$('.sales-offices-map-balloon').removeClass('opened')
	});

	function fixedMenuBtn() {
		$(window).scrollTop() > $(window).outerHeight() - parseInt($('.header-burger').css('top')) ? $('.burger-icon').addClass('dark') : $('.burger-icon').removeClass('dark');
	}fixedMenuBtn();

	$('.scroll-to').on('click', function(e) {
		let id = $(this).attr('href'),
				section = $(id),
				top = $(this).parents('.main-footer-nav').length > 0 ? section.offset().top - 50 - $('.main-window-footer-type-2').outerHeight() : section.offset().top - 50
		if ( section.length > 0 ) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: section.offset().top - 50
			}, 1000)
		}
	});

	$('.main-footer-nav .scroll-to').on('click', function() {
		$('.main-footer-nav .scroll-to').removeClass('active');
		$(this).addClass('active')
	});

	$(document).on('click', '.open-callback-popup', function(e) {
		e.preventDefault();
		let ths = $(this),
				imgSrc = ths.data('callback-img'),
				selectedOption = ths.data('selected-option'),
				modalID = '#callback-popup';
		if ( imgSrc != undefined && imgSrc.trim().length != 0 ) {
			$(modalID).find('.callback-popup-img').attr('src', imgSrc)
		}
		if ( selectedOption != undefined && selectedOption.trim().length != 0 ) {
			$(modalID).find('.callback-options').val(selectedOption).trigger('change')
		}
		openPopup(modalID);
	});

	let rescomMenu = $('.main-window-footer-type-2');

	let rescomMenuHeight = rescomMenu.outerHeight();

	function scrollRescomMenu(top) {

		if ( !rescomMenu.hasClass('fixed') ) {
			rescomMenuHeight = $('.main-window-footer-type-2').outerHeight();
		}

		if ( rescomMenu.length > 0 && $(window).width() >= 1200 ) {

			if ( top >= $('.main-window').outerHeight() - rescomMenuHeight ) {
				rescomMenu.addClass('fixed')
			}
			else {
				rescomMenu.removeClass('fixed')
			}

		}

	}scrollRescomMenu($(window).scrollTop());

	// Инициализация слайдера планировок
	layoutsSliderDynamic();

	// инициализация видео
	initVideo();

	// Инициализация фотогалереи
	initPhotosGallery();

	// Инициализация слайдеров "Жизнь в ЖК" и "Другие проекты"
	initLiveInRescom();

	$('.mailing-form').on('submit', function(e) {
		$('.mailing-thanks').addClass('opened');
		e.preventDefault();
	});

	$('.js-stocks-filter').on('click', function(e) {
		e.preventDefault();
		let ths = $(this);
		if ( !ths.hasClass('active') ) {
			let filter = ths.data('filter'),
					items = $(`.stocks-item[data-filter=${filter}]`);
			$('.js-stocks-filter').removeClass('active');
			ths.addClass('active');
			if ( filter == 'all' ) {
				$('.stocks-item').fadeIn(400)
			}
			else {
				$('.stocks-item').hide();
				items.fadeIn(400)
			}
		}
	});

	$('.apartment-img-types-link').on('click', function(e) {
		e.preventDefault();
		let ths = $(this),
				img = $(`.apartment-img-list img[data-img="${ths.data('img')}"]`);
		if ( img.is(':hidden') ) {
			$('.apartment-img-types-link').removeClass('active');
			ths.addClass('active');
			$('.apartment-img-list img').hide();
			img.fadeIn(400)
		}
	});

	$('.liked-link').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('active')
	});

	$('.apartment-mortgage-open-btn').on('click', function() {
		$(this).toggleClass('active');
		$('.apartment-mortgage-form-block').slideToggle(400)
	});

	$('.share-link').on('click', function(e) {
		e.preventDefault();
		let ths = $(this);
		ths.toggleClass('active');
		ths.parent().find('.share-dropdown').toggleClass('opened')
	});

	let copyLinkInput = document.createElement('input'),
			link = window.location.href;

	$('.copy-link').on('click', function(e) {
		e.preventDefault();
		document.body.appendChild(copyLinkInput);
		copyLinkInput.value = link;
		copyLinkInput.select();
		document.execCommand('copy');
		document.body.removeChild(copyLinkInput);
		$(this).addClass('success');
		setTimeout(() => {
			$(this).removeClass('success')
		}, 1000)
	});

	$('.img-to-popup').on('click', function() {
		let src = $(this).attr('src'),
				alt = $(this).attr('alt');
		$('.popup-image').html('');
		$('.popup-image').append(`<img src="${src}" alt="${alt}">`)
		openPopup('#image-popup');
	});

	$('.catalog-filter-checkbox-input').on('change', function() {
		let check = $(this).is(':checked');
		if ( check ) {
			$('.catalog-filter-mortgage-body').slideDown(400)
		}
		else {
			$('.catalog-filter-mortgage-body').slideUp(400)
		}
	});

	$('.apartments-list-table tr').each(function() {
		let ths = $(this),
				href = ths.data('href');
		if ( href != undefined ) {
			ths.on('click', function() {
				document.location = href
			})
		}
	});

	$('.catalog-grid-block').each(function() {
		let ths = $(this),
				title = ths.find('.catalog-grid-title'),
				body = ths.find('.catalog-grid-block-body');
		title.on('click', function() {
			title.toggleClass('active');
			body.slideToggle(400);
		});
	});

	$('.catalog-section-cell').each(function() {
		let ths    			= $(this),
				status 			= ths.data('status'),
				src    			= ths.data('src'),
				title  			= ths.data('title'),
				price  			= ths.data('price'),
				link   			= ths.attr('href');
		tippy(ths[0], {
			content: [
				`<div class="catalog-section-cell-dropdown ${ ths.hasClass('disabled') ? 'disabled' : '' } ${ ths.hasClass('lock') ? 'lock' : '' }">`,
					'<div class="catalog-section-cell-dropdown-content">',
						status 			!= undefined ? `<div class="in-sale-stick">${ status }</div>` : '',
						src    			!= undefined ? `<div class="catalog-section-cell-img"><img src="${ src }" alt=""></div>` : '',
						title  			!= undefined ? `<div class="h6">${ title }</div>` : '',
						price  			!= undefined ? `<div class="cell-price">${ price }</div>` : '',
						$(window).width() < 1200 ? `<div class="cell-link"><a href="${link}">Перейти</a></div>` : '',
					'</div>',
				'</div>'
			].join(''),
			allowHTML: true
		})
	});

	$('.catalog-section-cell').on('click', function(e) {
		if ( $(window).width() < 1200 ) {
			e.preventDefault();
		}
	});

	$('.open-mob-filter').on('click', function(e) {
		e.preventDefault();
		$('.catalog-filter-mob-container').addClass('opened')
	});

	$('.catalog-filter-mob-close').on('click', function() {
		$('.catalog-filter-mob-container').removeClass('opened')
	});

	$(document).on('click', function(e) {
		let tg = $(e.target);
		if ( !tg.closest('.header-menu').length && !tg.closest('.header-burger').length ) {
			$('.header-menu').removeClass('opened')
		}
		if ( !tg.closest('.has-child').length ) {
			$('.has-child').removeClass('active') }
		if ( !tg.closest('.menu').length && !tg.closest('.burger-icon').length ) {
			$('.menu').removeClass('opened')
		}
		if ( !tg.closest('.share-dropdown').length && !tg.closest('.share-link').length ) {
			$('.share-link').removeClass('active');
			$('.share-dropdown').removeClass('opened');
		}
		if ( !tg.closest('.catalog-filter-mob-container').length && !tg.closest('.open-mob-filter').length ) {
			$('.catalog-filter-mob-container').removeClass('opened')
		}
	});

	tippy('[data-tippy-content]');

	$('.cookies-alert-close').on('click', function() {
		$('.cookies-alert').removeClass('opened')
	});

	$('.cookies-alert-right .btn').on('click', function() {
		$('.cookies-alert').removeClass('opened')
	});

	$('.parking-nav-link').on('click', function(e) {
		e.preventDefault();
		let ths = $(this),
				thsTab = $(`.parking-tab[data-tab="${ths.data('tab')}"]`);
		if ( thsTab.is(':hidden') ) {
			$('.parking-nav-link').removeClass('active');
			ths.addClass('active');
			$('.parking-tab').hide();
			thsTab.fadeIn(400)
		}
	});

	$('.confirm-parking-btn').on('click', function(e) {
		e.preventDefault();
		closePopup();
	});

  $(window)
  .on('scroll', function() {
  	let top = $(window).scrollTop();
  	if ( pageLoad ) {
  		animate()
  	};
  	if ( canLocationScroll && $(window).width() >= 1200 ) {
  		locationScroll();
  		globalInfoNavScroll();
  	}
  	fixedMenuBtn();
  	$('.has-child').removeClass('active');
  	scrollRescomMenu(top);
  })
  .on('load', function() {
  	cityMap = $('.s-projects-wrapper .s-city-map');
		locNav = $('.location-nav');
		locNavH = locNav.outerHeight();
		secNumb = $('.s-projects-wrapper .section-nmb');
  	projectHelpInfoPosition();
  	advantageHeight();
  	setTimeout(() => {
  		pageLoad = true
  	}, 400)
  	if ( $(window).width() > 576 ) {
  		let currTop = $(window).scrollTop();
  		setTimeout(() => {
  			$(window).scrollTop(currTop - 40);
  		}, 10)
  	}
  	$(window).trigger('resize');
  	if ( $('.main-footer-nav').length > 0 ) {adaptiveHeader()};
  	cloneValueForSliders();
  	layoutImages.slick('resize');
  })
  .on('resize', function() {
  	projectHelpInfoPosition();
  	advantageHeight();
  	cityMap = $('.s-projects-wrapper .s-city-map');
		locNav = $('.location-nav');
		locNavH = locNav.outerHeight();
		secNumb = $('.s-projects-wrapper .section-nmb');
		if ( $('.main-footer-nav').length > 0 ) {adaptiveHeader()};
		initVideoSlider();
  });

});
