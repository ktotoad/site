
/*Loading================================================================================*/
let wrapper = document.querySelector('.wrapper');

if (document.querySelector(".preloader")) {
    let tl = gsap.timeline(),
        loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    
    body.classList.add("lock");

    setTimeout(() => {
        body.classList.remove("lock");
    }, 2e3),
    setTimeout(() => {
        loader.classList.add("hidden");
        tl.to(".preloader-body__logo-light", { clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", duration: 0.1, delay: 0 });
    }, 1e3),
    (function (body, loader) {
        let loading = 0,
        i = setInterval(() => {
            (document.querySelector(".preloader-body__logo-light").style.width = ++loading + "%"),
            (document.querySelector(".preloader-body__percents").innerHTML = ++loading + "%"), 100 === loading && clearInterval(i);
        }, 20);
    })();

    wrapper.classList.add('loaded');

    animateall();
} else {
    window.addEventListener('load', function () {
        wrapper.classList.add('loaded');
        animateall();
    });
}
//fixed_main==================================================================================================================================================================================================================
let header = document.querySelector("header");
window.addEventListener("scroll", function(){
	if(window.scrollY > 50){
    	header.classList.add('fixed');
	}
	else{
	    header.classList.remove('fixed');
	}
});
const body = document.querySelector('body');
//burger=====================================================================================================================================================
if (document.querySelector('.icon-menu')) {
	const iconSubmenu = document.querySelector('.icon-menu');
	const submenuBody = document.querySelector('.submenu__body');
	let submenuItems = document.querySelectorAll('.submenu__nav_links a');

	iconSubmenu.addEventListener('click', 
		function clickButtonBurger(event) {
			iconSubmenu.classList.toggle('active');
			submenuBody.classList.toggle('active');
			body.classList.toggle('lock');
		});

	submenuItems.forEach(submenuItem => {
		submenuItem.addEventListener('click', 
			function clickButtonBurger(event) {
				iconSubmenu.classList.remove('active');
				submenuBody.classList.remove('active');
				body.classList.remove('lock');
			});
	});

	$('.submenu__nav li').on('mouseenter',function(){
		$(this).siblings().addClass('notactive');
		$('.submenu__image[data-link="'+$(this).data('link')+'"]').addClass('active');
	});
	$('.submenu__nav li').on('mouseleave',function(){
		$(this).siblings().removeClass('notactive');
		$('.submenu__image[data-link="'+$(this).data('link')+'"]').removeClass('active');
		if(!$('.submenu__image.active').length){
			$('.submenu__image:first').addClass('active');
		}
	});
}
//spollerbutton=====================================================================================================================================================
let currentDropmenu = null;

document.addEventListener('click', function(event) {
	if (currentDropmenu) {
		currentDropmenu.classList.remove('active');
	}

	if (event.target.matches('[data-dropmenu]') || event.target.closest("[data-dropmenu]")) {
		let dropmenu = event.target.closest("[data-dropmenu]");
		dropmenu.classList.add('active');
		currentDropmenu = dropmenu;

		document.addEventListener("scroll", (event) => {
			spollerbutton.classList.remove('active');
		});
	}
});
//Dynamic_Adapt=========================================================================================================================================

"use strict";
function DynamicAdapt(type) {
	this.type = type;
}
DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");
	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];
		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		//for (let i = 0; i < оbjects.length; i++) {
		for (let i = оbjects.length - 1; i >= 0; i--) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};
// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new DynamicAdapt("max");
da.init();
/*Animation================================================================================*/
function animateall() {
	if(document.querySelector('[data-anim-item]')) {
		const animItems = document.querySelectorAll('[data-anim-item]');
		if (wrapper.classList.contains('loaded')) {
			if (animItems.length > 0) {
				window.addEventListener('scroll', animOnScroll);
				function animOnScroll(params) {
					for (let index = 0; index < animItems.length; index++) {
						const animItem = animItems[index];
						const animItemHeight = animItem.offsetHeight;
						const animItemOffset = offset(animItem).top;
						const animStart = 10;

						let animItemPoint = window.innerHeight - animItemHeight /animStart;
						if (animItemHeight > window.innerHeight) {
							animItemPoint = window.innerHeight - window.innerHeight / animStart;
						}

						if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
							animItem.classList.add('active');
						} else {
							if (!animItem.hasAttribute('data-anim-nohide')) {
								animItem.classList.remove('active');
							}
						}
					}
				}
				function offset(el) {
					const rect = el.getBoundingClientRect(),
						scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
						scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
				}

				setTimeout(() => {
					animOnScroll();
				}, 300);
			}
		}
	}
};
//Buttons_Form==================================================================================================================================================
if(document.querySelector("#buttonsFormBody")) {
	const buttonsFormBody = document.querySelector("#buttonsFormBody");
	const buttonsForm = buttonsFormBody.querySelector("#buttonsForm");

	document.body.onscroll = (e) => {
		var bounds = buttonsForm.getBoundingClientRect();
		//const centerTop = buttonsFormBody.offsetTop - (window.innerHeight/2 - buttonsFormBody.clientHeight/2);
		//const centerBottom = buttonsFormBody.offsetTop - (window.innerHeight/2 - buttonsFormBody.clientHeight/2) + bounds.height;
		const centerTop = buttonsFormBody.offsetTop - (window.innerHeight - buttonsFormBody.clientHeight);
		const centerBottom = buttonsFormBody.offsetTop - (window.innerHeight - buttonsFormBody.clientHeight) + bounds.height;

		if(window.scrollY >= centerTop) {
			buttonsForm.classList.add("change");
		}
		if(window.scrollY <= centerTop) {
			buttonsForm.classList.remove("change");
		}
	}
}
//Paralax=====================================================================================================================================================
if(document.querySelector("[data-paralax]")) {
	document.querySelectorAll("[data-paralax]").forEach((paralaxelement) => {
		let paralaxBody = paralaxelement.closest('section');
		const data = paralaxelement.dataset.paralax.trim();
		const dataArray = data.split(",");
		const turn = dataArray[0].trim();
		const step = dataArray[1].trim();

		document.addEventListener("scroll", function (e) {
			let s;
			switch(turn) {
				case 'top':
					s = 0 + paralaxBody.getBoundingClientRect().top / step;
					break;
				case 'bottom':
					s = 0 - paralaxBody.getBoundingClientRect().top / step;
					break;
				default:
					s = 0 + paralaxBody.getBoundingClientRect().top / step;
			}
			paralaxelement.style.transform  = `translateY(${s}px)`;
		});		
	});
}

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
	  		effect: "fade",
			parallax: true,
			speed: 1800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.slider-main__pagination',
				clickable: true,
			},
		});
	}
	if (document.querySelector('.slider-projects')) {
		new Swiper('.slider-projects', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-projects__next",
				prevEl: ".slider-projects__prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: "auto",
				},
			},
		});
	}
	if (document.querySelector('.images-slider-projects')) {
		new Swiper('.images-slider-projects', {
  		observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			speed: 1800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.images-slider-projects__pagination',
				clickable: true,
			},
		});
	}
	if (document.querySelector('.slider-principses')) {
		new Swiper('.slider-principses', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 70,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-principses__next",
				prevEl: ".slider-principses__prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: "auto",
				},
			},
		});
	}

	if (document.querySelector('.slider-history')) {
		var historythumbs = new Swiper('.slider-history-thumb', {
			spaceBetween: 60,
		    slidesPerView: 'auto',
		    centeredSlides: getCenteredSlides(),
		    initialSlide: 3,
			parallax: true,
			watchSlidesProgress: true,
			speed: 800,
		});
		var historymain = new Swiper('.slider-history', {
	  		observer: true,
			observeParents: true,
	  		effect: "fade",
			slidesPerView: 1,
		    initialSlide: 3,
			autoHeight: true,
			spaceBetween: 0,
			speed: 800,
			parallax: true,
			thumbs: {
				swiper: historythumbs,
			},
			navigation: {
				nextEl: ".slider-history__next",
				prevEl: ".slider-history__prev",
			},
		});

		historymain.controller.control = historythumbs;
		historythumbs.controller.control = historythumbs;

		historymain.on('slideChange', function () {
			const index = historymain.realIndex;
			historythumbs.slideToLoop(index, 300);
		});

		function getCenteredSlides() {
			return window.innerWidth < 767;
		}
	}

	if (document.querySelector('.slider-news')) {
		new Swiper('.slider-news', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 30,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-news__next",
				prevEl: ".slider-news__prev",
			},
		});
	}
	if (document.querySelector('.catalog-slider')) {
		new Swiper('.catalog-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				470: {
					spaceBetween: 20,
				},
			},
			navigation: {
				nextEl: ".catalog-slider__next",
				prevEl: ".catalog-slider__prev",
			},
		});
	}
	if (document.querySelector('.slider-building')) {
		new Swiper('.slider-building', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 30,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-building__next",
				prevEl: ".slider-building__prev",
			},
		});
	}
	if (document.querySelector('.news-slider')) {
		new Swiper('.news-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 30,
			parallax: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
				},
				767: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
			navigation: {
				nextEl: ".news-slider__next",
				prevEl: ".news-slider__prev",
			},
		});
	}
}
initSliders();
//RANGE========================================================================================================================================
if (document.querySelector("[data-range]")) {
    rangeSliderInit();
}

function rangeSliderInit() {
    document.querySelectorAll("[data-range]").forEach((rangeSlider) => {
        const valuesArray = rangeSlider.getAttribute('data-range').split(',').map(value => value.trim());
        var inputMinValue = Number(valuesArray[0]);
        var inputMaxValue = Number(valuesArray[1]);
        if (Number(valuesArray[2])) {
            var inputMinStart = Number(valuesArray[2]);
        } else {
            var inputMinStart = inputMinValue;
        }
        if (Number(valuesArray[3])) {
            var inputMaxStart = Number(valuesArray[3]);
        } else {
            var inputMaxStart = inputMaxValue;
        }
        if (rangeSlider.hasAttribute('data-range-step')) {
            var valueStep = Number(rangeSlider.getAttribute('data-range-step'));
        } else {
            var valueStep = 50;
        }
        var slider = rangeSlider.querySelector("#slider");
        var inputMin = rangeSlider.querySelector(".input-min");
        var inputMax = rangeSlider.querySelector(".input-max");

        const inputs = [inputMin, inputMax]; 

        noUiSlider.create(slider, {
            start: [inputMinStart, inputMaxStart],
            connect: true,
            step: valueStep,
            range: {
                min: [inputMinValue],
                max: [inputMaxValue]
            }
        });

        slider.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = parseInt(values[handle]);
        });

        inputMin.addEventListener('change', function () {
            slider.noUiSlider.set([this.value, null]);
        });

        inputMax.addEventListener('change', function () {
            slider.noUiSlider.set([null, this.value]);
        });
    });
}
//toggle======================================================================================================================================================
document.addEventListener('click', function(event) {
	if (event.target.matches('[data-toggle]') || event.target.closest("[data-toggle]")) {
		event.target.closest("[data-toggle]").classList.toggle("active");
	}
});
//InputMask===============================================================================================================================================
function inputElements() {
	let inputPhones = document.querySelectorAll("input[data-format]");
	inputPhones.forEach(inputPhone => {
		let phoneMask = new IMask(inputPhone, {
			mask: inputPhone.getAttribute("data-format")
		});
	});
}
inputElements();
//POPUP========================================================================================================================================
const popupLinks = document.querySelectorAll('.popup-link');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++ ) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener("click", function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if(popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});	
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	if (lockPadding.length > 0) {	
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {	
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}
//poputext====================================================================================================================================
function popupTextBook() {
	document.querySelector("#popup").querySelector("#popuptitle span").innerText = 'подтверждение бронирования';
	document.querySelector("#popup").querySelector("#popuptext").innerHTML = 'Оставьте свои контактные данные <br> и мы свяжемся для уточнения деталей бронирования';
}
function popupTextMain() {
	document.querySelector("#popup").querySelector("#popuptitle span").innerText = 'Остались вопросы?';
	document.querySelector("#popup").querySelector("#popuptext").innerHTML = 'Оставьте свои контактные данные <br>и мы подробно ответим на все. И расскажем еще больше!';
}

//price_spaces================================================================================================================================
if (document.querySelectorAll(".js_price")) {
  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
  }
  let js_prices = document.querySelectorAll(".js_price");
  js_prices.forEach((js_price) => {
      //let price = Math.round(js_price.textContent);
      let price = js_price.textContent;
      js_price.textContent = numberWithSpaces(price);
  })
}
//map======================================================================================================================================================================
if (document.querySelector("#map")) {
    ymaps.ready(mapInit);
}

if (document.querySelector("#mapcontacts")) {
    ymaps.ready(mapInitCon);
}

function mapInitCon() {
    var myMap = new ymaps.Map("mapcontacts",{
        center: [55.787705, 49.143407],
        zoom: 13,
        controls: ['zoomControl']
    }),
    myIcon = ymaps.templateLayoutFactory.createClass("<div>$[properties.iconContent]</div>"),
    myPlacemark = new ymaps.Placemark([55.787705, 49.143407],
    {
        hintContent: 'Авторы',
    },
    {
        iconLayout: "default#imageWithContent",
        iconImageHref: "./img/icons/map.svg",
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -20],
        iconContentOffset: [15, 15],
        iconContentLayout: myIcon,
        hideIconOnBalloonOpen: !1,
        balloonCloseButton: !1,
        balloonOffset: [0, -20]
    });
    //убираем скрол
    myMap.behaviors.disable('scrollZoom');
    myMap.geoObjects.add(myPlacemark);
}

function mapInit() {
    //модалка карты
    let popupMap = document.getElementById('popupMap');
    // Создаем карту
    var myMap = new ymaps.Map("map",{
        center: [55.823583, 49.092338],
        zoom: 12,
        controls: []
    }),
    // Создадим пользовательский макет ползунка масштаба.
    ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='map__controls-zoom'>" +
        "<div id='zoom-in' class='map__zoom-btn'>+</div>" +
        "<div id='zoom-out' class='map__zoom-btn'>-</div>" +
        "</div>", {

        // Переопределяем методы макета, чтобы выполнять дополнительные действия
        // при построении и очистке макета.
        build: function () {
            // Вызываем родительский метод build.
            ZoomLayout.superclass.build.call(this);

            // Привязываем функции-обработчики к контексту и сохраняем ссылки
            // на них, чтобы потом отписаться от событий.
            this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
            this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

            // Начинаем слушать клики на кнопках макета.
            $('#zoom-in').bind('click', this.zoomInCallback);
            $('#zoom-out').bind('click', this.zoomOutCallback);
        },

        clear: function () {
            // Снимаем обработчики кликов.
            $('#zoom-in').unbind('click', this.zoomInCallback);
            $('#zoom-out').unbind('click', this.zoomOutCallback);

            // Вызываем родительский метод clear.
            ZoomLayout.superclass.clear.call(this);
        },

        zoomIn: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            myMap.behaviors.enable('scrollZoom');
        },

        zoomOut: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            myMap.behaviors.enable('scrollZoom');
        }
    }),
    zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    myMap.controls.add(zoomControl);
    //убираем скрол
    myMap.behaviors.disable('scrollZoom');

    //добавляем точки
    // Создаем коллекцию.
    myCollection = new ymaps.GeoObjectCollection(),
    // Создаем массив с данными.
    myPoints = {
        all : [
            { coords: [55.788143, 49.114728], text: 'Авторы на Астрономической', link: 'https://yandex.ru/maps/-/CHchYS0e' },
            { coords: [55.783718, 49.130394], text: 'Авторы на Петербургской', link: 'https://yandex.ru/maps/-/CHchaNKr' },
            { coords: [55.861984, 49.096856], text: 'Авторы на Годовикова', link: 'https://yandex.ru/maps/-/CHchaKoC' },
            { coords: [55.796461, 49.058097], text: 'Авторы на Большой', link: 'https://yandex.ru/maps/-/CHcha03D' },
            { coords: [55.872772, 48.875660], text: 'Дом у Озера', link: 'https://yandex.ru/maps/-/CHcheJmI' },
        ],
        done : [
            { coords: [55.872772, 48.875660], text: 'Дом у Озера', link: 'https://yandex.ru/maps/-/CHcheJmI' },
        ],
        work : [
            { coords: [55.783718, 49.130394], text: 'Авторы на Петербургской', link: 'https://yandex.ru/maps/-/CHchaNKr' },
            { coords: [55.861984, 49.096856], text: 'Авторы на Годовикова', link: 'https://yandex.ru/maps/-/CHchaKoC' },
            { coords: [55.796461, 49.058097], text: 'Авторы на Большой', link: 'https://yandex.ru/maps/-/CHcha03D' },
        ],
        plan : [
            { coords: [55.788143, 49.114728], text: 'Авторы на Астрономической', link: 'https://yandex.ru/maps/-/CHchYS0e' },
        ],
    };        

    //фильтр
    if(document.querySelector('#mapfilter')) {
        const tabButtons = document.querySelectorAll('.filter__item');
        tabButtons.forEach(elem => { 
            if(elem.classList.contains('active')) {
                let filter = elem.dataset['filter'];
                mapSearchPoints(filter);
            }
        });
        document.querySelector('#mapfilter').addEventListener('click', e => {
            //закрываем модалку при нажатии фильтра
            popupClose(popupMap, true);
            if(e.target.classList.contains('filter__item') || e.target.closest('.filter__item')) {
                let filter = e.target.closest('.filter__item').dataset['filter'];
                tabButtons.forEach(elem => elem.classList.remove('active'));
                e.target.classList.add('active');
                mapSearchPoints(filter);
            }
        });
    }

    function mapSearchPoints(filter) {
        for (const [key, value] of Object.entries(myPoints)) {
            if(key == filter) {
                let result = value;
                mapAddPoints(result, filter);
            }
        }
    }

    function mapAddPoints(result, filter) {
        // Удаляем "старую" коллекцию меток на карту.
        myCollection.removeAll();
        // Выбираем иконку
        let logo = './img/icons/map.svg';
        let logoactive = './img/icons/logomap.png';
        let myCircle;
        // Заполняем коллекцию данными.
        for (var i = 0, l = result.length; i < l; i++) {
            var point = result[i];
            myCollection.add(myCircle = new ymaps.Placemark(
                point.coords, {
                    hintContent: point.text,
                }, {
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: logo,
                    // Размеры метки.
                    iconImageSize: [44, 44],
                    // Смещение левого верхнего угла иконки относительно
                    iconImageOffset: [-22, -22]
                },
            ));
            //модалка карты
            myCircle.events
            .add('mouseenter', function (e) {
                //меняем иконку на активную
                var target = e.get('target');
                target.options.set('preset');
                target.options.set('iconImageHref', logoactive);
                target.options.set('iconImageSize', [64, 72]);
                target.options.set('iconImageOffset', [-32, -51]);
            })
            .add('mouseleave', function (e) {
                var target = e.get('target');
                target.options.unset('preset');
                target.options.set('iconImageHref', logo);
                target.options.set('iconImageSize', [44, 44]);
                target.options.set('iconImageOffset', [-22, -22]);
            })
            .add('click', function (e) {

                //вызываем модалку
                popupOpen(popupMap);
                bodyUnLock();
            });
        }
        // Добавляем коллекцию меток на карту.
        myMap.geoObjects.add(myCollection);
    }
}


//select=====================================================================================================================================================
let currentSelect = null;

document.addEventListener('click', function(event) {
	if (currentSelect) {
		currentSelect.classList.remove('active');
	}

	if (event.target.matches('[data-select]') || event.target.closest("[data-select]")) {
		let select = event.target.closest("[data-select]");
		let spollerbutton = event.target.closest("[data-select-body]");
		select.classList.add('active');
		currentSelect = select;
		
		if(select.querySelector("[data-select-body]")) {
			if(event.target.classList.contains("select__item")) {
				spollerbutton.querySelectorAll(".select__item").forEach((option) => {
					option.classList.remove("active");
				});

				let optionText = event.target.innerText;
				let buttonSpoller = select.querySelector("[data-select-button] span");

				buttonSpoller.textContent = optionText;
				event.target.classList.add("active");
				select.classList.remove('active');
			}
		}

		document.addEventListener("scroll", (event) => {
			select.classList.remove('active');
		});	
	}
});
//Buttons_Form==================================================================================================================================================
if(document.querySelector("#buttonsForm")) {
	const buttonsForm = document.querySelector("#buttonsForm");
	const buttonsFormBody = buttonsForm.closest("section");

	document.body.onscroll = (e) => {
		var bounds = buttonsForm.getBoundingClientRect();
		const centerTop = buttonsFormBody.offsetTop - (window.innerHeight - buttonsFormBody.clientHeight);
		const centerBottom = buttonsFormBody.offsetTop - (window.innerHeight - buttonsFormBody.clientHeight) + bounds.height;

		if(window.scrollY >= centerTop) {
			buttonsForm.classList.add("change");
		}
		if(window.scrollY <= centerTop) {
			buttonsForm.classList.remove("change");
		}
	}
}
// SPOLLERS========================================================================================================================================
function spollers() {
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
spollers();
//Checkbox==========================================================================================================================
if (document.querySelector('#checkboxbody')) { 
	let checkBoxBodies = document.querySelectorAll('#checkboxbody');

	checkBoxBodies.forEach(function (checkBoxBody) {
        checkBoxBody.addEventListener('click', (e) => {

        	if(e.target.closest('#checkbox')) {
        		e.target.closest('#checkbox').classList.toggle('active'); 
        	} 

        });
    });
}

//RadioButton====================================================================================================================================================================================
if(document.querySelector('#radiobuttons')) {
	let radioButtonsBodies = document.querySelectorAll('#radiobuttons');

	radioButtonsBodies.forEach(function (radioButtonsBody) {
        radioButtonsBody.addEventListener('click', (e) => {

        	if(e.target.closest('.radio')) {
        		radioButtonsBody.querySelectorAll('.radio').forEach(function (radio) {
        			radio.classList.remove('active');
        		});
        		e.target.closest('.radio').classList.add('active'); 
        	} 

        });
    });
}
//Filter=====================================================================================================================================================
if(document.querySelector('.catalog__filter')) {
	document.querySelectorAll('.catalog__filter').forEach((catalogFilter) => {
		const catalogSliderSlides = catalogFilter.closest("section").querySelectorAll('.catalog-slider__slide');
		const filterItems = catalogFilter.closest("section").querySelectorAll('.filter__item');

		filterItems.forEach(elem => { if(elem.classList.contains('active')) {
			let filter = elem.dataset['filter'];
			catalogSliderSlides.forEach( elem => {
				elem.classList.remove('hide');
				if(!elem.classList.contains(filter)) {
					elem.classList.add('hide');
				}
			});
		}
		catalogFilter.addEventListener('click', e => {
			if(e.target.classList.contains('filter__item') || e.target.closest('.filter__item')) {
				let filterClass = e.target.closest('.filter__item').dataset['filter'];
				filterItems.forEach(elem => elem.classList.remove('active'));
				e.target.closest('.filter__item').classList.add('active');

				catalogSliderSlides.forEach( elem => {
					elem.classList.remove('hide');
					if(!elem.classList.contains(filterClass)) {
						elem.classList.add('hide');
					}
				});
					
				let mySwiper = catalogFilter.closest("section").querySelector('.catalog-slider').swiper;
				mySwiper.update();
				}
			});
		});
	});
}


//TABS==================================================================================================================================================
// Получение хеша в адресе сайта
function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Указание хеша в адресе сайта
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

	}
	// Установка позиций заголовков
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('_tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('_tab-spoller');
				}
			});
		});
	}
	// Работа с контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]');
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
tabs(); 

//Image_modal=====================================================================================================================================================
if(document.querySelector("#picture-wrap")) {
	document.querySelectorAll("#picture-wrap").forEach(pictureWrap => {
		Fancybox.bind(pictureWrap, {
		  // Your custom options
		});
	});
}

if(document.querySelector("#gallery-wrap")) {
	document.querySelectorAll("#gallery-wrap").forEach(galleryWrap => {
		Fancybox.bind(galleryWrap, {
		  // Your custom options
		});
	});
}

if(document.querySelector("#video-gallery")) {
	document.querySelectorAll("#video-gallery").forEach(videoGallery => {
		Fancybox.bind(videoGallery, {
		  // Your custom options
		});
	});
}
//sunway========================================================================================================================================
if (document.querySelector("#sunway")) {
	let sunway = document.querySelector("#sunway");
	let toggle = sunway.querySelector('[data-toggle="sunway"]');
	toggle.addEventListener('click', (e) => {
		sunway.classList.toggle('active');
    });
}