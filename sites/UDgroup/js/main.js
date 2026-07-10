
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
    animateall();
}
//burger=====================================================================================================================================================
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.header__body');
const body = document.querySelector('body');

if (iconMenu) {
	iconMenu.addEventListener('click', function clickButtonBurger(event) {
		burgerFunc();
	});
	menuBody.addEventListener('click', function clickButtonBurger(event) {
		if(event.target.closest("a")) {
			burgerFunc();
		}
	});
}

function burgerFunc() {
	iconMenu.classList.toggle('active');
	menuBody.classList.toggle('active');
	body.classList.toggle('lock');
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
//spollerbutton=====================================================================================================================================================
if (document.querySelector("[drop-body]")){
	const dropBody = document.querySelector("[drop-body]");
	document.addEventListener("click", (event) => {
		const withinBoundaries = event.composedPath().includes(dropBody);

		if (!withinBoundaries) {
			dropBody.classList.remove('active');
		}
		else {
			dropBody.classList.toggle('active');
		}
	});

	document.addEventListener("scroll", (event) => {
		dropBody.classList.remove('active');
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
//POPUP========================================================================================================================================
function popupFunction() {
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
}
popupFunction();	

/*Animation================================================================================*/
function animateall() {
	if(document.querySelector('[anim-item]')) {
		const animItems = document.querySelectorAll('[anim-item]');
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
						if (animItem.getAttribute('anim-item') != "nohide") {
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
};
//Image_hover=====================================================================================================================================================================
document.addEventListener('mouseover', (e) => {
	if(e.target.closest("[data-hover-block]")) {
		document.querySelectorAll("[data-hover-block]").forEach((block) => {
			block.classList.remove('active');
			if(block == e.target.closest("[data-hover-block]")) {
				block.classList.add('active');
			}
		});
	}
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

	if (document.querySelector('.slider-fade')) {
		document.querySelectorAll('.slider-fade').forEach((slider) => {
			const nextArrow = slider.closest("[slider-fade]").querySelector('.slider-fade__next');
			const prevArrow = slider.closest("[slider-fade]").querySelector('.slider-fade__prev');
			new Swiper(slider, {
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				effect: "fade",
				spaceBetween: 100,
				loop: true,
				speed: 800,
				navigation: {
					nextEl: nextArrow,
					prevEl: prevArrow,
				},
			});
		});
	}

	if (document.querySelector('.slider-main-digits')) {
		new Swiper('.slider-main-digits', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 100,
			loop: true,
			speed: 6000,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
		});
	}

	if (document.querySelector('.slider-main-clients')) {
		new Swiper('.slider-main-clients', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 50,
			loop: true,
			speed: 3000,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
		});
	}

	if (document.querySelector('.slider-about-clients')) {
		new Swiper('.slider-about-clients', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 50,
			speed: 800,
		});
	}

	if (document.querySelector('.slider-main-projects')) {
		new Swiper('.slider-main-projects', {
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-main-projects__next",
				prevEl: ".slider-main-projects__prev",
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
					slidesPerView: 1,
				},
				767: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
			},
		});
	}

	if (document.querySelector('.slider-main-news')) {
		document.querySelectorAll('.slider-main-news').forEach((slider) => {
			const nextArrow = slider.closest("section").querySelector('.slider-main-news__next');
			const prevArrow = slider.closest("section").querySelector('.slider-main-news__prev');
			new Swiper(slider, {
				observer: true,
				observeParents: true,
				slidesPerView: 3,
				spaceBetween: 30,
				parallax: true,
				speed: 800,
				navigation: {
					nextEl: nextArrow,
					prevEl: prevArrow,
				},
				breakpoints: {
					320: {
						slidesPerView: 1,
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
			});
		});
	}

	if (document.querySelector('.slider-about-team')) {
		new Swiper('.slider-about-team', {
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-about-team__next",
				prevEl: ".slider-about-team__prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
				},
				480: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				767: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
			},
		});
	}

	if (document.querySelector('.slider-directions-maintenance')) {
		new Swiper('.slider-directions-maintenance', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 50,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-directions-maintenance__next",
				prevEl: ".slider-directions-maintenance__prev",
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				767: {
					spaceBetween: 50,
				},
			},
		});
	}

	if (document.querySelector('.slider-cases-maintenance')) {
		new Swiper('.slider-cases-maintenance', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 50,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-cases-maintenance__next",
				prevEl: ".slider-cases-maintenance__prev",
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				767: {
					spaceBetween: 50,
				},
			},
		});
	}
}

initSliders();
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
//hover_items=====================================================================================================================================================================
document.addEventListener('mouseover', (e) => {
	if(e.target.closest("[data-hover]")) {
		const hoverBlockItem = e.target.closest("[data-hover]");
		const hoverBlock = hoverBlockItem.closest("[data-hover-block]");
		const hoverBlockTextes = hoverBlock.querySelectorAll("[data-hover-item]");
		let value = hoverBlockItem.getAttribute('data-hover');
		
		hoverBlockTextes.forEach((hoverBlockText) => {
			if(hoverBlockText.getAttribute('data-hover-item') == value) {
				hoverBlockText.classList.add("active");
			} else {
				hoverBlockText.classList.remove("active");
			}
			hoverBlockItem.addEventListener('mouseout', (e) => {
				hoverBlockText.classList.remove("active");
			});
		});
	}
});