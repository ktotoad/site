
/*Loading================================================================================*/
let wrapper = document.querySelector('.wrapper');

if (document.querySelector(".preloader")) {
    let tl = gsap.timeline(),
        loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    
    //body.classList.add("lock");

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

    setTimeout(function(){
        wrapper.classList.add('loaded');
        animateall();
    }, 2000);
} else {
    wrapper.classList.add('loaded');
    animateall();
}
function lazyload() {
    const hasSupport = 'loading' in HTMLImageElement.prototype;
    document.documentElement.className = hasSupport ? 'pass' : 'fail';
}
lazyload();

/*Animation================================================================================*/
function animateall() {
	if(document.querySelector('.anim-items')) {
		const animItems = document.querySelectorAll('.anim-items');
		if (wrapper.classList.contains('loaded')) {
			if (animItems.length > 0) {
				window.addEventListener('scroll', animOnScroll);
				function animOnScroll(params) {
					for (let index = 0; index < animItems.length; index++) {
						const animItem = animItems[index];
						const animItemHeight = animItem.offsetHeight;
						const animItemOffset = offset(animItem).top;
						const animStart = 4;

						let animItemPoint = window.innerHeight - animItemHeight /animStart;
						if (animItemHeight > window.innerHeight) {
							animItemPoint = window.innerHeight - window.innerHeight / animStart;
						}

						if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
							animItem.classList.add('active');
						} else {
							if (!animItem.classList.contains('anim-no-hide')) {
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
/*Adaptive================================================================================*/
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
//burger=====================================================================================================================================================
if (document.querySelector('.icon-submenu')) {
	const iconSubmenu = document.querySelector('.icon-submenu');
	const submenuBody = document.querySelector('.submenu__body');
	const body = document.querySelector('body');
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
//fixed_main==================================================================================================================================================================================================================
let header = document.querySelector("header");
window.addEventListener("scroll", function(){
	if(window.scrollY > 100){
    	header.classList.add('fixed');
	}
	else{
	    header.classList.remove('fixed');
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
//Resize_scroll==================================================================================================================================================
gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray("section");

if(document.querySelector("#one")) {
	var tl_one = gsap.timeline({
	  paused: true,
	  scrollTrigger: {
	    trigger: '#one',
	    start: 'top top',
	    end: 'bottom top',
	    scrub: true,
	    pin: true
	  }
	})
	tl_one
	.to('#one', {top: 0, height: '100vh'})
	.to('.resizeOne .slider-full__image', {'border-top-left-radius': '0', 'border-top-right-radius': '0'})
	.to('.resizeOne', {width: '100%', height: '100vh'})
}

if(document.querySelector("#two")) {
	var tl_two = gsap.timeline({
	  paused: true,
	  scrollTrigger: {
	    trigger: '#two',
	    start: 'top top',
	    end: 'bottom top',
	    scrub: true,
	    pin: true
	  }
	})
	tl_two
	.to('#two', {top: 0, height: '100vh'})
	.to('.resizeTwo .slider-full__image', {'border-top-left-radius': '0', 'border-top-right-radius': '0'})
	.to('.resizeTwo', {width: '100%', height: '100vh'})
}

if(document.querySelector("#three")) {
	var tl_three = gsap.timeline({
	  paused: true,
	  scrollTrigger: {
	    trigger: '#three',
	    start: 'top top',
	    end: 'bottom top',
	    scrub: true,
	    pin: true
	  }
	})
	tl_three
	.to('.resizeThree .slider-full__image', {'border-top-left-radius': '0', 'border-top-right-radius': '0'})
	.to('.resizeThree', {left: 0, width: '100%', height: '100%'})
}

if(document.querySelector("#five")) {
	var tl_five = gsap.timeline({
	  paused: true,
	  scrollTrigger: {
	    trigger: '#five',
	    start: 'top top',
	    end: 'bottom top',
	    scrub: true,
	    pin: true
	  }
	})
	tl_five
	.to('.resizeFive', {width: '219px', height: '325px', 'border-top-left-radius': '110px', 'border-top-right-radius': '110px'})
}

if(document.querySelector("#changeBody")) {
	gsap.to('.image-lobby', {
		scrollTrigger: {
	    trigger: '#changeBody',
	    start: 'top center',
	    end: 'center top',
	    scrub: true,
	  },
		'border-top-left-radius': '300px',
		'border-top-right-radius': '300px',
	})
}
//Cards_Filter=====================================================================================================================================================
if(document.querySelector('#optionsblock')) {
    const optionsBlock = document.querySelector('#optionsblock');
    const closeButton = optionsBlock.querySelector('.button-close');
    const cards = document.querySelectorAll('.item-options');
    const cardsInfo = document.querySelectorAll('.info-options__body');

    optionsBlock.addEventListener("click", (e) => {
        if(e.target != closeButton) {
            optionsBlock.classList.add('active');
            let index;
            let currentCard = e.target.closest('.item-options');
            if (currentCard){
                currentCard.classList.add('active');
                index = currentCard.getAttribute('data-circle-index');

                cardsInfo.forEach(function (cardInfo) {
                    if(cardInfo.getAttribute('data-circle-content-index') == index) {
                        cardInfo.classList.add('active');
                    }
                });
            }
        } else {
            optionsBlock.classList.remove('active');
            cards.forEach(function (card) {
                card.classList.remove('active');
            });
            cardsInfo.forEach(function (cardInfo) {
                cardInfo.classList.remove('active');
            });
        }
    });
}
//SPOLLERS========================================================================================================================================

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
//Mouse_plus==================================================================================================================================================
if(document.querySelector("#block_mouse_move")) {
	var blocks_mouse_move = document.querySelectorAll("#block_mouse_move");

	blocks_mouse_move.forEach(block_mouse_move => {
		const itemZoom = block_mouse_move.querySelector("#zoom");

		block_mouse_move.onmouseover = function(event) {
			itemZoom.classList.add("zoom");
			moveAt(event);
		}
		
		block_mouse_move.onmousemove = function(event) {
			moveAt(event);
		}

		block_mouse_move.onmouseout = function() {
			itemZoom.classList.remove("zoom");
			itemZoom.style.removeProperty('left');
			itemZoom.style.removeProperty('top');
		}

		function moveAt(event) {
			itemZoom.style.left = event.clientX + -30 + 'px';
			itemZoom.style.top = event.clientY + -30 + 'px';
		}
	});
}
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

	if (document.querySelector('.slider-club-thumb')) {
		var swiper = new Swiper('.slider-club-thumb', {
  		slidesPerView: 6,
			spaceBetween: 20,
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			autoplay: false,
			watchSlidesProgress: true,
			speed: 800,
			breakpoints: {
				320: {
					spaceBetween: 10,
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 6,
    			direction: "vertical",
				},
			},
		});
	}
	if (document.querySelector('.slider-club')) {
		new Swiper('.slider-club', {
  		observer: true,
			observeParents: true,
  		effect: "fade",
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
      thumbs: {
        swiper: swiper,
      },
			pagination: {
				el: '.slider-club__pagination',
				clickable: true,
			},
			breakpoints: {
				320: {
					allowTouchMove:true,
				},
				768: {
					allowTouchMove:false,
				},
			},
		});
	}

	if (document.querySelector('.slider-hlevel-thumb')) {
		var swiperh = new Swiper('.slider-hlevel-thumb', {
  		slidesPerView: 6,
			spaceBetween: 10,
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			watchSlidesProgress: true,
			speed: 800,
			breakpoints: {
				320: {
					spaceBetween: 10,
					slidesPerView: "auto",
					autoHeight: true,
				},
				992: {
					slidesPerView: 6,
    			direction: "vertical",
				},
			},
		});
	}
	if (document.querySelector('.slider-hlevel')) {
		new Swiper('.slider-hlevel', {
  		observer: true,
			observeParents: true,
  		effect: "fade",
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			allowTouchMove:false,
      thumbs: {
        swiper: swiperh,
      },
		});
	}

	if (document.querySelector('.slider-etalon')) {
		new Swiper('.slider-etalon', {
  		observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 10,
			parallax: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
      thumbs: {
        swiper: swiperh,
      },
			pagination: {
				el: '.slider-etalon__pagination',
				clickable: true,
			}
		});
	}
	if (document.querySelector('.slider-full')) {
		new Swiper('.slider-full', {
  		direction: "vertical",
  		effect: "fade",
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			autoHeight: true,
			speed: 800,
			pagination: {
				el: '.slider-full__pagination',
				clickable: true,
			},
		});
	}
	if (document.querySelector('.resident-sliders__slider')) {
		new Swiper('.resident-sliders__slider', {
      spaceBetween: 30,
			slidesPerView: 1,
			pagination: {
				el: '.resident-sliders__pagination',
				clickable: true,
			}
		});
	}	
	if (document.querySelector('.slider-dzen')) {
		new Swiper('.slider-dzen', {
  		observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 20,
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
			},	
			pagination: {
				el: '.slider-dzen__pagination',
				clickable: true,
			}
		});
	}	
	if (document.querySelector('.slider-privilage')) {
		new Swiper('.slider-privilage', {
  		observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 20,
			parallax: true,
			//loop: true,
			//autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
					autoHeight: true,
				},
				480: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 10,
				},
			},
			pagination: {
				el: '.slider-privilage__pagination',
				clickable: true,
			}
		});
	}	
	if (document.querySelector('.team-page__slider')) {
		new Swiper('.team-page__slider', {
  		observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
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
				el: '.slider-team__pagination',
				clickable: true,
			},
			navigation: {
        nextEl: ".slider-team__next",
        prevEl: ".slider-team__prev",
      },
		});
	}
	if (document.querySelector('.alike-page__slider')) {
		new Swiper('.alike-page__slider', {
  		observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
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
				480: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 20,
				}
			},
		});
	}
	if (document.querySelector('.save-page__slider')) {
		new Swiper('.save-page__slider', {
      spaceBetween: 30,
			slidesPerView: 1,
  		observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 0,
			autoHeight: true,
			parallax: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
			},
			pagination: {
				el: '.save-page__pagination',
				clickable: true,
			},
		});
	}
	if (document.querySelector('.slider-parking-advantages')) {
		new Swiper('.slider-parking-advantages', {
  		observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 30,
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
				470: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
			pagination: {
				el: '.slider-parking-advantages__pagination',
				clickable: true,
			},
			navigation: {
        nextEl: ".slider-parking-advantages__next",
        prevEl: ".slider-parking-advantages__prev",
      },
		});
	}
}
initSliders();
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
//CheckBox_RadioButton====================================================================================================================================================================================
$(document).ready(function () {

	//CHECKBOX
	$.each($('.checkbox'), function(index, val) {
		if($(this).find('input').prop('checked')==true) {
			$(this).addClass('active');
		}
	});
	$(document).on('click', '.checkbox', function(event) {
		if($(this).hasClass('active')) {
			$(this).find('input').prop('checked', false);
		}else{
			$(this).find('input').prop('checked', true);
		}
		$(this).toggleClass('active');

		return false;
	});

	//RADIO
	$.each($('.filter-catalog__radio'), function(index, val) {
		if($(this).find('input').prop('checked')==true) {
			$(this).addClass('active');
		}
	});
	$(document).on('click', '.filter-catalog__radio', function(event) {
		$(this).parents('.filter-catalog__buttons').find('.filter-catalog__radio').removeClass('active');
		$(this).parents('.filter-catalog__buttons').find('.filter-catalog__radio input').prop('checked', false);
		$(this).toggleClass('active');
		$(this).find('input').prop('checked', true);
		return false;
	});
});
//POPUP========================================================================================================================================
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
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
//POPUP-timing========================================================================================================================================
if (document.querySelector("#popuptime")) {
	let popuptime = document.querySelector("#popuptime");
	setTimeout(() => {
        popuptime.classList.add("open");
    }, 5e3);
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

//Video_delay=================================================================================================================================
if(document.querySelector('#background-video')) {
	let videos = document.querySelectorAll('#background-video');
	let bgs = document.querySelectorAll("#fullscreenimage");

	bgs.forEach( image => {
		setTimeout(function(){
		    image.classList.add('hide');
		}, 3000);
	});

	videos.forEach( video => {
		setTimeout(function(){
		    video.play();
		}, 3000);
	});
}
//toggle======================================================================================================================================================
if(document.querySelector("#togglebody")) {
	document.querySelectorAll("#togglebody").forEach(function (togglebody) {
		const toggle = togglebody.querySelector('#toggle');

		toggle.addEventListener("click", function () {
        	togglebody.classList.toggle("active");
        });
    });
}
//Zoom_Image============================================================================================================================================
if(document.querySelector("#zoombody")) {
	document.querySelectorAll("#zoombody").forEach(function (zoomBody, index) {
		const zoomImage = zoomBody.querySelector('#zoomimage');
		const zoomImageBody = zoomImage.closest('div');
		const zoomPlus = zoomBody.querySelector('#zoomplus');
		const zoomMinus = zoomBody.querySelector('#zoomminus');
		let zoomid = 1;
		zoomBody.setAttribute('data-zoom-index', index);
		
		zoomPlus.addEventListener("click", function () {
			if(zoomid < 2) {
	        	zoomid = zoomid + 0.2;
	        	zoomImage.style.transform = `scale(${zoomid})`;
	        	zoomImageBody.classList.add('active');
	        }
        });

	    zoomMinus.addEventListener("click", function () {
	    	if(zoomid > 1) {
	        	zoomid = zoomid - 0.2;
	        	zoomImage.style.transform = `scale(${zoomid})`;
	        	if(zoomid == 1) {
        			zoomImageBody.classList.remove('active');
        			zoomImage.style.removeProperty('left');
					zoomImage.style.removeProperty('top');
	        	}
        	} 
        });

	    zoomImageBody.onmousedown = function(e) {
	    	if(zoomImageBody.classList.contains('active')) {
				//координаты мыши
				const rect = zoomImageBody.getBoundingClientRect();
				let mouseX = e.clientX - rect.left;
				let mouseY = e.clientY - rect.top;
				moveAt(e);

				zoomImageBody.onmousemove = function(e) {
					moveAt(e);
				}

				zoomImage.ondragstart = function() {
					return false;
				}

				zoomImage.onmouseup = function() {
					zoomImageBody.onmousemove = null;
					zoomImage.onmouseup = null;
				}

				function moveAt(e) {
					zoomImage.style.left = e.clientX - rect.left - mouseX + 'px';
					zoomImage.style.top = e.clientY - rect.top - mouseY + 'px';

					console.log(e.clientX + " " + rect.left + " " + rect.right + " " + zoomImage.style.left + " " + index);
				}
			}
		}
	});
}