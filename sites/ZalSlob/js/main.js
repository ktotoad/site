
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
//map======================================================================================================================================================================
if (document.querySelector("#map")) {
    ymaps.ready(mapInit);
}
function mapInit() {
    var myMap = new ymaps.Map("map",{
        center: [55.443179, 49.194763],
        zoom: 14,
        controls: []
    }), 
    myIcon = ymaps.templateLayoutFactory.createClass("<div>$[properties.iconContent]</div>"),
    myPlacemark = new ymaps.Placemark([55.443179, 49.194763],
    {},
    {
        iconLayout: "default#imageWithContent",
        iconImageHref: "../img/map.png",
        iconImageSize: [66, 74],
        iconImageOffset: [-33, -74],
    });
    myMap.behaviors.disable('scrollZoom');
    myMap.geoObjects.add(myPlacemark);
}

//price_spaces================================================================================================================================
if (document.querySelectorAll(".js_price")) {
  priceFunction();
}

function priceFunction() {
  let js_prices = document.querySelectorAll(".js_price");
  js_prices.forEach((js_price) => {
    //let price = Math.round(js_price.textContent);
    let price = js_price.textContent;
    js_price.textContent = numberWithSpaces(price);
  })
}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

//убирем пробелы, делаем из строки число
function toNumber(number) {
  let result = parseInt(number.replace(/\s/g, ''), 10);
  return result;
}
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

	if (document.querySelector('.mobile-images-slider')) {
		new Swiper('.mobile-images-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
		});
	}
	if (document.querySelector('.slider-main-smi')) {
		new Swiper('.slider-main-smi', {
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 50,
			parallax: true,
			autoHeight: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},
			navigation: {
			    nextEl: '.slider-main-smi__next',
			    prevEl: '.slider-main-smi__prev',
			}
		});
	}
	if (document.querySelector('.slider-main-gallery')) {
		new Swiper('.slider-main-gallery', {
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 20,
			parallax: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
			},
			navigation: {
			    nextEl: '.slider-main-gallery__next',
			    prevEl: '.slider-main-gallery__prev',
			}
		});
	}
	if (document.querySelector('.slider-main-catalog')) {
		new Swiper('.slider-main-catalog', {
			observer: true,
			observeParents: true,
			observeSlideChildren: true,
			slidesPerView: 2,
			spaceBetween: 60,
			parallax: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2,
					spaceBetween: 40,
				},
			},
			navigation: {
			    nextEl: '.slider-main-catalog__next',
			    prevEl: '.slider-main-catalog__prev',
			}
		});
	}
	if (document.querySelector('.slider-images')) {
		document.querySelectorAll('.slider-images').forEach((nestedEl) => {
			const paginationEl = nestedEl.closest('.slider-images-body').querySelector('.slider-images__pagination');
			new Swiper(nestedEl, {
				observer: true,
				observeParents: true,
				effect: "fade",
				parallax: true,
				speed: 800,
				pagination: {
					el: paginationEl,
					clickable: true,
				},
				nested: true,
			});
		});
	}
}

initSliders();
//RANGE========================================================================================================================================
if (document.querySelector("[data-range]")) {
    rangeSliderInit();
}

function formatNumber(num) {
    return num.toLocaleString();
};

function rangeSliderInit() {
    document.querySelectorAll("[data-range]").forEach((rangeSlider) => {
        const valuesArray = rangeSlider
            .getAttribute('data-range')
            .split(',')
            .map(value => value.trim())
            .map(value => (value === '' ? NaN : Number(value)))
            .filter(value => !isNaN(value)); // убираем нечисловые

        if (valuesArray.length < 2) {
            console.warn('Not enough values in data-range (min, max required)');
            return;
        }

        const minValue = Number(valuesArray[0]);
        const maxValue = Number(valuesArray[1]);

        // Определяем шаг
        const step = rangeSlider.hasAttribute('data-range-step')
            ? Number(rangeSlider.getAttribute('data-range-step'))
            : 1;

        // Находим элементы
        const slider = rangeSlider.querySelector("#slider");
        const inputMin = rangeSlider.querySelector(".input-min");
        const inputMax = rangeSlider.querySelector(".input-max");
        const fromPriceInput = rangeSlider.querySelector("#fromprice");
        const toPriceInput = rangeSlider.querySelector("#toprice");

        // Определяем, сколько бегунков
        let hasTwoHandles = true;
        let startValues;

        // Логика определения количества бегунков
        if (valuesArray.length === 2) {
            // Только min и max → два бегунка: стартуем с краёв
            startValues = [minValue, maxValue];
            hasTwoHandles = true;
        } else if (valuesArray.length === 3) {
            const start = valuesArray[2];
            if (start >= minValue && start <= maxValue) {
                // Один бегунок: например, "выбрать количество дней"
                startValues = [start];
                hasTwoHandles = false;
            } else {
                // Некорректное значение → fallback: два бегунка
                startValues = [minValue, maxValue];
                hasTwoHandles = true;
            }
        } else if (valuesArray.length >= 4) {
            // Четыре значения: min, max, startMin, startMax → два бегунка
            startValues = [
                valuesArray[2],
                valuesArray[3]
            ];
            hasTwoHandles = true;
        } else {
            startValues = [minValue, maxValue];
            hasTwoHandles = true;
        }

        // Создаём слайдер
        noUiSlider.create(slider, {
            start: startValues,
            connect: true,
            step: step,
            range: {
                min: minValue,
                max: maxValue
            },
            connect: hasTwoHandles ? true : [true, false], // заполнение слева для одного бегунка
        });

        // Определяем, какие input'ы использовать
        const inputs = hasTwoHandles
            ? [inputMin, inputMax]
            : [null, inputMax || inputMin]; // для одного бегунка — только один input (например, max)

        // Обновление input'ов при движении слайдера
        slider.noUiSlider.on('update', function (values, handle) {
            const value = Math.round(+values[handle]);

            if (hasTwoHandles) {
                if (handle === 0 && inputMin) {
                    inputMin.value = formatNumber(value);
                    if (fromPriceInput) fromPriceInput.value = value;
                }
                if (handle === 1 && inputMax) {
                    inputMax.value = formatNumber(value);
                    if (toPriceInput) toPriceInput.value = value;
                }
            } else {
                // Один бегунок → только max (или основное значение)
                if (inputMax) {
                    inputMax.value = formatNumber(value);
                }
                if (toPriceInput) {
                    toPriceInput.value = value; // чистое число
                }
                // fromPriceInput можно оставить 0 или не трогать
                if (fromPriceInput) {
                    fromPriceInput.value = minValue; // или 0
                }
            }
        });

        // === ВВОД С КЛАВИАТУРЫ ===
        if (hasTwoHandles) {
            inputMin?.addEventListener('change', function () {
                const val = Number(this.value.replace(/\D/g, '')) || minValue;
                slider.noUiSlider.set([val, null]);
            });
            inputMax?.addEventListener('change', function () {
                const val = Number(this.value.replace(/\D/g, '')) || maxValue;
                slider.noUiSlider.set([null, val]);
            });
        } else {
            inputMax?.addEventListener('change', function () {
                const rawValue = this.value.replace(/\D/g, '');
                const val = Number(rawValue) || minValue;
                if (val >= minValue && val <= maxValue) {
                    slider.noUiSlider.set(val);
                }
            });
        }
    });
}
//Image_modal=====================================================================================================================================================
const options = {
	contentClick: "toggleCover",
	Images: {
		Panzoom: {
			panMode: "mousemove",
			mouseMoveFactor: 1.1,
			mouseMoveFriction: 0.12,
		},
	},
};

if(document.querySelector("#picture-wrap")) {
	document.querySelectorAll("#picture-wrap").forEach(pictureWrap => {
		Fancybox.bind(pictureWrap, {options});
	});
}

if(document.querySelector("#gallery-wrap")) {
	document.querySelectorAll("#gallery-wrap").forEach(galleryWrap => {
		Fancybox.bind(galleryWrap, {options});
	});
}
//SVG_script==========================================================================================================================
if(document.querySelector("#zoomimage")) {
	const svgBody = document.querySelector("#zoomimage svg");
	const housesPopup = document.querySelector("#housespopup");
	const housesOrder = document.querySelector("#housesorder");
	const housesPopupDis = document.querySelector("#housespopupdisable"); 
	const svgPaths = svgBody ? svgBody.querySelectorAll("path") : [];
	let activePath = null;

	function getPathFromTarget(target) {
		if (!target) return null;
		if (target.tagName && target.tagName.toLowerCase() === "path") {
			return target;
		}
		return target.closest ? target.closest("path") : null;
	}

	function clearSvgPopups() {
		housesPopupNotActive();
		housesPopup.classList.remove("active");
		housesPopupDis.classList.remove("active");
	}

	function stopAtivity(event) {
		const path = getPathFromTarget(event.target);
		if (!path) return;
		if (event.relatedTarget && path.contains(event.relatedTarget)) return;
		if (activePath === path) {
			activePath = null;
		}
		clearSvgPopups();
	}

	svgBody.addEventListener("mouseover", (event) => {
		const path = getPathFromTarget(event.target);
		if (!path || path === activePath) return;
		activePath = path;

		if (path.dataset.status == "AVAILABLE") {
			if (path.dataset.filter != "disabled") {
				housesPopupActive(event);
			} else {
				path.setAttribute("data-status-enable", "disabled");
			}
		} else {
			if (path.dataset.type) {
				parkingPopupInfo(event);
			} else {
				path.setAttribute("data-status-enable", "disabled");
				housesPopupDisabled(event);
			}
		}
	});

	svgBody.addEventListener("mouseout", (event) => {
		stopAtivity(event);
	});

	document.addEventListener("mousewheel", (event) => {
		stopAtivity(event);
	});

	svgBody.addEventListener("click", (event) => {
		const path = getPathFromTarget(event.target);
		if (!path) return;
		if (path.dataset.status != "AVAILABLE" || path.dataset.filter == "disabled") return;

		popupOpen(housesOrder);
		body.classList.remove('lock');
		const prefix = 'type-';

  		housesOrder.querySelector("#houseordertype b").innerText = event.target.dataset.type;
  		const classesToRemove = Array.from(housesOrder.querySelector("#houseordertype").classList).filter(c => c.startsWith(prefix));
		housesOrder.querySelector("#houseordertype").classList.remove(...classesToRemove);
  		housesOrder.querySelector("#houseordertype").classList.add("type-" + event.target.dataset.type);

  		housesOrder.querySelector("#houseorderarea").innerText = event.target.dataset.area + " м²";
  	});

	function housesPopupDisabled(event) {
		const x = event.clientX;
  		const y = event.clientY;

  		housesPopupDis.style.left = x + "px";
  		housesPopupDis.style.top = y + "px";
		housesPopupDis.classList.add("active");
	}

	function housesPopupActive(event) {
		const x = event.clientX;
  		const y = event.clientY;

  		housesPopup.querySelector("#housenumber").innerText = "№" + event.target.dataset.number;
  		housesPopup.querySelector("#houseprice").innerText = numberWithSpaces(event.target.dataset.price) + " ₽";
  		housesPopup.querySelector("#housearea").innerText = event.target.dataset.area + " м²";

  		housesPopup.style.left = x + "px";
  		housesPopup.style.top = y + "px";
		housesPopup.classList.add("active");
	}

	function housesPopupNotActive() {
		housesPopup.classList.remove("active");
	}
}

//Zoom_Image============================================================================================================================================
if(document.querySelector("#zoombody")) {
	document.querySelectorAll("#zoombody").forEach(function (zoomBody, index) {
		const zoomImage = zoomBody.querySelector('#zoomimage');
		const zoomImageBody = zoomImage.closest('#zoomimagebody');
		const zoomPlus = zoomBody.querySelector('#zoomplus');
		const zoomMinus = zoomBody.querySelector('#zoomminus');
		const gestureArea = zoomImage.closest('#gesture-area');
		var resetTimeout;
		var scale = 1;
		let zoomid = 1;
		
		zoomBody.setAttribute('data-zoom-index', index);
		
		zoomPlus.addEventListener("click", function () {
			zoomPlusIn();
        });

	    zoomMinus.addEventListener("click", function () {
	    	zoomMinusOut();
        });


		zoomBody.addEventListener("mouseenter", function () {
			if(zoomid > 1) {
				moveListeners();
			} else {
				interact(gestureArea).unset();
			}
        });

		function moveListeners(event) {
			interact(gestureArea)
				.gesturable({
					listeners: {
						move (event) {
					    	var currentScale = event.scale * scale;

					    	zoomImage.style.transform = 'scale(' + currentScale + ')';

					    	dragMoveListener(event);
					  	},
					  	end (event) {
						    scale = scale * event.scale;
					  	}
					}
				})
				.draggable({
					listeners: { move: dragMoveListener }
			});
		}

		function dragMoveListener (event) {
			if(zoomid > 1) {
				var target = event.target;
				var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
				var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

				target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
			}
		}

		function removeEvent(event) {
			const index = evCache.findIndex(
				(cachedEv) => cachedEv.pointerId === event.pointerId,
			);
			evCache.splice(index, 1);
		}

	    function zoomPlusIn() {
	    	if(zoomid < 4) {
	        	zoomid = zoomid + 0.5;
	        	zoomImage.style.transform = `scale(${zoomid})`;
	        	zoomImageBody.classList.add('active');
	        }
	    }

	    function zoomMinusOut() {
	    	if(zoomid > 1) {
	        	zoomid = zoomid - 0.5;
	        	zoomImage.style.transform = `scale(${zoomid})`;
	        	if(zoomid == 1) {
        			zoomImageBody.classList.remove('active');
        			zoomImage.style.removeProperty('left');
					zoomImage.style.removeProperty('top');
	        	}
        	} 
        	if(zoomid == 1) {
        		gestureArea.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
        	}
	    }
	});
}
//Mobile_Zoom=============================================================================================================================================================================================================================
if(document.querySelector("#zoombody")) {
	document.querySelectorAll("#zoombody").forEach(function (zoomBody, index) {
		const scaleElement = zoomBody.querySelector('#zoomimage');
		const gestureArea = scaleElement.closest('#gesture-area');
		var scale = 1;
		var resetTimeout;

		interact(gestureArea)
			.gesturable({
				listeners: {
					move (event) {
				    	var currentScale = event.scale * scale;

				    	scaleElement.style.transform = 'scale(' + currentScale + ')';

				    	dragMoveListener(event);
				  	},
				  	end (event) {
					    scale = scale * event.scale;
				  	}
				}
			})
			.draggable({
				listeners: { move: dragMoveListener }
		});

		function dragMoveListener (event) {
			var target = event.target;
			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		}
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
//Credit_calculator=======================================================================================================================================
if(document.querySelector("#creditresult")) {
	const creditResultBlock = document.querySelector("#creditresult");
	const toYear = creditResultBlock.querySelector("#toyear");
	const toPrice = creditResultBlock.querySelector("#toprice");
	const fullPrice = creditResultBlock.querySelector("#fullprice");

	//считаем сумму кредита
	toPrice.closest("[data-range]").querySelector("#slider").noUiSlider.on('update', (e) => {
		calculateMounthPayment();
	});

	//считаем общую сумму 
	fullPrice.closest("[data-range]").querySelector("#slider").noUiSlider.on('update', (e) => {
		calculateMounthPayment();
	});
	
	//считаем ежемесячную выплату для каждой ставки
	toYear.closest("[data-range]").querySelector("#slider").noUiSlider.on('update', (e) => {
		calculateMounthPayment();
	});

	//выводим ежемесячный платёж
	function calculateMounthPayment() {
		document.querySelectorAll("[data-credit-block]").forEach((creditBlock) => {
			const percent = creditBlock.querySelector("[data-percent]").getAttribute("data-percent");
			const mounthPay = creditBlock.querySelector("[data-mounth-pay]");
			const fullCredit = creditBlock.querySelector("[data-fullcredit]");
			const overPrice = creditBlock.querySelector("[data-overprice]");

			let payment = calculateMortgagePayment(percent, toYear.value);

			mounthPay.querySelector("span").textContent = numberWithSpaces(payment);
			mounthPay.setAttribute("data-mounth-pay", payment);

			const credit = payment * toYear.value * 12;
			const overCredit = toNumber(fullPrice.value) - toPrice.value;

			overPrice.querySelector("span").textContent = numberWithSpaces(credit - overCredit);
			overPrice.setAttribute("data-overprice", credit - overCredit);

			fullCredit.querySelector("span").textContent = numberWithSpaces(overCredit);
			fullCredit.setAttribute("data-fullcredit", overCredit);
		});
	}

	//считаем платёж
	function calculateMortgagePayment(annualInterestRate, loanTermYears) {
	    const principal = toNumber(fullPrice.value) - toPrice.value; // сумма кредита
	    const monthlyRate = parseInt(annualInterestRate) / 100 / 12; // месячная ставка
	    const numberOfPayments = loanTermYears * 12; // общее количество платежей

	    // Проверка на нулевую ставку (чтобы избежать деления на ноль)
	    if (monthlyRate === 0) {
	        return principal / numberOfPayments;
	    }

	    const x = Math.pow(1 + monthlyRate, numberOfPayments);
	    const monthlyPayment = principal * (monthlyRate * x) / (x - 1);

	    return Math.round(Math.round(monthlyPayment * 100) / 100);
	}
}

//Image_hover=====================================================================================================================================================================
document.addEventListener('mouseover', (e) => {
	if(e.target.closest(".main-houses__image")) {
		document.querySelectorAll(".main-houses__image").forEach((image) => {
			if(image != e.target.closest(".main-houses__image")) {
				image.classList.add('nothover');
			}
		});
	}
});
document.addEventListener('mouseout', (e) => {
	if(e.target.closest(".main-houses__image")) {
		document.querySelectorAll(".main-houses__image").forEach(image => image.classList.remove('nothover'));
	}
});
//mobile_fancy_gallery=====================================================================================================================================================================
document.querySelector(".mobile-images-slider").querySelectorAll(".main-houses__image").forEach((fancyImage) => {
	console.log(fancyImage);
	fancyImage.removeAttribute('id');
	fancyImage.setAttribute("data-fancybox", "gallery");
});