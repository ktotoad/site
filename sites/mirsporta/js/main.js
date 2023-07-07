
//ibg============================================================================================================
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

//LOCK========================================================================================================================================
$(document).ready(function(){
	$('#filterButton').click(function(event) {
		$('body').toggleClass('lock');
	});
});
//BuildSlider======================================================================================================================================================
function buildSliders() {
	let sliders = document.querySelectorAll('[class*="__swiper"]:not(.swiper-wrapper)');
	if (sliders) {
		sliders.forEach(slider => {
			slider.parentElement.classList.add('swiper');
			slider.classList.add('swiper-wrapper');
			for(const slide of slider.children) {
				slide.classList.add('swiper-slide');
			}
		});
	}
}

//Инициализация_Swiper===============================================================================================================================================
function initSliders() {
	buildSliders();

	if (document.querySelector('.slider-main')) {
		new Swiper('.slider-main', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			loop: true,
			autoHeight: true,
			autoplay: {
				delay: 2000,
				disableOnInteraction: false,
			},
			speed: 800,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
	}

	if (document.querySelector('.products-best-slider')) {
		new Swiper('.products-best-slider', {
			observer: true,
			observeParents: true,
			//slidesPerView: "auto",
			slidesPerView: 3,
			spaceBetween: 30,
			//centeredSlides: true,
			autoHeight: true,
			parallax: true,
			slidesPerView: 3,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
      		breakpoints: {
      			320: {
      				slidesPerView: 1,	
					spaceBetween: 0,			
      			},
      			480: {
      				slidesPerView: "auto",
					centeredSlides: true,	
					spaceBetween: 0,	
					initialSlide: 1,			
      			},
      			992: {
      				slidesPerView: 3,
      			}
      		}

		});
	}
}

initSliders();
const ratings = document.querySelectorAll('.rating');

if (ratings.length > 0) {
	initRatings();
}

//Основная функция
function initRatings() {
	let ratingActive, ratingValue;
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];
		initRating(rating);
	}
	//Конкретный рейтинг
	function initRating(rating) {
		initRatingVars(rating);

		setRatingActiveWidth();

		if (rating.classList.contains('rating_set')) {
			setRating(rating);
		}
	}
	//Переменные
	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.rating__active');
		ratingValue = rating.querySelector('.rating__value');
	}
	//Изменяем ширину звёзд
	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.05;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
	//Интерактивное указывание оценки
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.rating__item');
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			//наведение мыши
			ratingItem.addEventListener("mouseenter", function (e) {
				initRatingVars(rating);

				setRatingActiveWidth(ratingItem.value);
			});
			//Курсор убрали
			ratingItem.addEventListener("mouseleave", function (e) {
				setRatingActiveWidth();
			});
			//Нажатие мыши
			ratingItem.addEventListener("click", function (e) {
				initRatingVars(rating);
				if (rating.dataset.ajax) {
					//Отправка на сервер
					setRatingActiveWidth(ratingItem.value, rating);
				} else {
					ratingValue.innerHTML = index + 1;
					setRatingActiveWidth();
				}
			});
		}
	}
}

function map(n){
	google.maps.Map.prototype.setCenterWithOffset= function(latlng, offsetX, offsetY) {
		var map = this;
		var ov = new google.maps.OverlayView();
		ov.onAdd = function() {
			var proj = this.getProjection();
			var aPoint = proj.fromLatlngToContainerPixel(latlng);
			aPoint.x = aPoint.x+offsetX;
			aPoint.y = aPoint.y+offsetY;
			map.panTo(proj.fromLatlngToContainerPixel(aPoint));
			//map.setCenter(proj.fromLatlngToContainerPixel(aPoint));
		}
		ov.draw = function() {};
		ov.setMap(this);
	};
	var markers = new Array();
	var infowindow = new google.maps.InfoWindow({
		//pixelOffset: new google.maps.Size(-230,250)
	});
	var locations = [
		[new google.maps.LatLng(56.1481161,40.4474833)],
	]
	var options = {
		zoom: 15,
		panControl: false,
		mapTypeControl: false,
		center: locations[0][0],
		scrollwheel:false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map'), options);
	var icon={
		url:'img/icons/point.png',
		scaledSize: new google.maps.Size(24, 39),
		anchor: new google.maps.Point(12, 15)
	}
	for (var i = 0; i < locations.length; i++) {
		var market = new google.maps.Marker({
			icon:icon,
			position: locations[i][0],
			map: map,
		});
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				for (var m = 0; m < markers.length; m++) {
					markers[m].setIcon(icon);
				}
					var cnt=i+1;
				infowindow.setContent($('.contacts-map-item_'+cnt).html());
				infowindow.open(map, marker);
				marker.setIcon(icon);
				map.setCenterWithOffset(marker.getPosition(),0,0);
				setTimeout(function (){
					baloonstyle();
				},10);
			}
		})(marker, i));
		markers.push(marker);
	}

	if(n){
			var nc=n-1;
		setTimeout(function(){
			google.maps.event.trigger(marker[nc], 'click');
		}, 500);
	}
}
function baloonstyle(){
	$('.gm-style-iw').parent().addClass('baloon');
	$('.gm-style-iw').prev().addClass('baloon-style');
	$('.gm-style-iw').next().addClass('baloon-close');
	$('.gm-style-iw').addClass('baloon-content');
}
if($("#map").length>0){
	map(1);
}
// SPOLLERS========================================================================================================================================

//Проверка на наличие атрибута
const spollersArray = document.querySelectorAll('[data-spollers]');
//Прорверка наличия
if (spollersArray.length > 0) {
	//Получение обычных спойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
 		return !item.dataset.spollers.split(",")[0];
	});
	//Инициализация обычных спойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	//Получение спойлеров с медиазапросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
 		return item.dataset.spollers.split(",")[0];
	});

	//Прорверка наличия
	if (spollersMedia.length > 0) { 
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0]; 
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		//Получаем брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		//Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			//Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			//Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}

	//Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('spoller-init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('spoller-init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	//Работа с телом спойлера
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('spoller-active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('.spoller-slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('spoller-active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('spoller-active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller].spoller-active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('spoller-active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

//Функции открытия/закрытия
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('spoller-slide')) {
		target.classList.add('spoller-slide');
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('spoller-slide');
		}, duration);
	}
}

let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('spoller-slide')) {
		target.classList.add('spoller-slide');
		if(target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('spoller-slide');
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
//Adaptive functions
$(window).resize(function(event) {
	adaptive_function();
});
function adaptive_header(w,h) {
		var productTitle=$('.product__title-block');
		var productContent=$('.product__content');
		var productBody=$('.product__body');
	if(w<992){
		if(!productTitle.hasClass('done')){
			productTitle.addClass('done').prependTo(productBody);
		}
	}else{
		if(productTitle.hasClass('done')){
			productTitle.removeClass('done').prependTo(productContent);
		}
	}
}
function adaptive_function() {
		var w=$(window).outerWidth();
		var h=$(window).outerHeight();
	adaptive_header(w,h);
}
	adaptive_function();
//Quantity===============================================================================================================================================================================================================================================================================================================================================================
var price_itog = document.getElementById("main_summ");

if (price_itog) {
    var price_itog_value = parseInt(price_itog.innerHTML);

    $('.quantity__button_minus').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $input = $this.closest('div').find('input');
        var value = parseInt($input.val());

        var cena_start = $this.closest('div').find('#cena_start');
        var cena_start_value = parseInt(cena_start.val());

        var parent_div_column = $this.closest('#parent_div_column').find('#cena_itog');
        var price_main = parseInt(parent_div_column.val());
     
        if (value > 1) {
            value = value - 1;
            price_main = cena_start_value * value;

            //price_itog.innerHTML = price_itog_value - cena_start_value;
        } else {
            value = 1;
        }
     
        $input.val(value);
        cena_start.val(cena_start_value);
        parent_div_column.val(price_main);
    });

    $('.quantity__button_plus').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $input = $this.closest('div').find('input');
        var value = parseInt($input.val());

        var cena_start = $this.closest('div').find('#cena_start');
        var cena_start_value = parseInt(cena_start.val());

        var parent_div_column = $this.closest('#parent_div_column').find('#cena_itog');
        var price_main = parseInt(parent_div_column.val());
     
        if (value < 100) {
            value = value + 1;
            price_main = cena_start_value * value;

           // price_itog.innerHTML = price_itog_value + price_main;
        } else {
            value = 100;
        }
     
        $input.val(value);
        cena_start.val(cena_start_value);
        parent_div_column.val(price_main);
    });
}