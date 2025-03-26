
/*Loading================================================================================*/
let wrapper = document.querySelector('.wrapper');

if (document.querySelector(".preloader")) {
    let loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    
    body.classList.add("lock");

    setTimeout(() => {
        body.classList.remove("lock");
    }, 1500),
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 1500),
    (function (body, loader) {
        let loading = 0,
        i = setInterval(() => {
            (document.querySelector(".preloader-body__decore").style.width = ++loading + "%"),
            (document.querySelector(".preloader-body__percents").innerHTML = ++loading + "%"), 100 === loading && clearInterval(i);
        }, 20);
    })();

    wrapper.classList.add('loaded');

    setTimeout(function(){
        wrapper.classList.add('loaded');
        animateall();
    }, 1500);
} else {
    setTimeout(function(){
        wrapper.classList.add('loaded');
        //animateall();
    }, 500);
}
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
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

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
//spollerbutton=====================================================================================================================================================
if (document.querySelector("#spollerbutton")){
	const spollerbutton = document.querySelector('#spollerbutton');
	document.addEventListener("click", (event) => {
		const withinBoundaries = event.composedPath().includes(spollerbutton);

		if (!withinBoundaries) {
			spollerbutton.classList.remove('active');
		}
		else {
			spollerbutton.classList.toggle('active');
		}
	});
}
//gsap_anim===================================================================================================================================
if(document.querySelector("[data-gsap-slider]")) {
	gsap.registerPlugin(ScrollTrigger);

	document.querySelectorAll("[data-gsap-slider]").forEach((element) => {
		const items = gsap.utils.toArray(element.querySelectorAll('#gsapitem'));
		gsap.to(items, {
			scrollTrigger: {
				trigger: element,
				start: 'top top',
				end: 'bottom top',
				scrub: true,
				pin: true
			},
			yPercent: -100 * (items.length - 1)
		})
	});
}
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
//Filter=====================================================================================================================================================
if(document.querySelector('.catalog-page__filter')) {
	document.querySelectorAll('.catalog-page__filter').forEach((catalogFilter) => {
		const catalogSliderSlides = catalogFilter.closest("section").querySelectorAll('.catalog-page__item');
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
				
				if (catalogFilter.closest("section").querySelector('.catalog-slider')) {
					let mySwiper = catalogFilter.closest("section").querySelector('.catalog-slider').swiper;
					mySwiper.update();
					}
				}
			});
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

	if (document.querySelector('.main__slider')) {
		new Swiper('.main__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 50,
			parallax: true,
			//loop: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				}
			},
			pagination: {
				el: '.control-main-block__dots',
				clickable: true,
				dynamicBullets: true,
			},
			//подсчет фракций
			on: {
				//все
				init: function (swiper) {
					const allSlides = document.querySelector('.fraction-control__all');
					//если loop: true
					//const allSlidesItems = document.querySelector('.slide-main-block:not(.swiper-slide-duplicate)');
					allSlides.innerHTML = swiper.slides.length;
				},
				//текущая
				slideChange: function (swiper) {
					const currentSlide = document.querySelector('.fraction-control__current');
					currentSlide.innerHTML = swiper.activeIndex + 1 < 10 ? `0${swiper.activeIndex + 1}` : swiper.activeIndex + 1;
					//realIndex если loop: true
				}
			}
		});
	}
	if (document.querySelector('.content-question__slider')) {
		var swiper = new Swiper('.question-page__slider-thumb', {
			slidesPerView: 6,
			spaceBetween: 30,
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			watchSlidesProgress: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
					slidesPerView: 1,
					autoHeight: true,
				},
				768: {
					slidesPerView: 6,
    				direction: "vertical",
					spaceBetween: 10,
				},
				992: {
					slidesPerView: 6,
    				direction: "vertical",
					spaceBetween: 30,
				},
			},
		});
		new Swiper('.content-question__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					autoHeight: true,
				},
				992: {
					autoHeight: false,
    				effect: "fade",
				},
			},
			navigation: {
				nextEl: ".content-question__next",
				prevEl: ".content-question__prev",
			},
			pagination: {
				el: '.content-question__pagination',
				clickable: true,
			},
			thumbs: {
				swiper: swiper,
			},
		});
	}


	if (document.querySelector('.slider-catalog')) {
		new Swiper('.slider-catalog', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 50,
			parallax: true,
			speed: 800,
		});
	}
	if (document.querySelector('.slider-image')) {
		new Swiper('.slider-image', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			effect: "fade",
			spaceBetween: 0,
			parallax: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			navigation: {
				nextEl: ".slider-image__next",
				prevEl: ".slider-image__prev",
			},
		});
	}
}


initSliders();