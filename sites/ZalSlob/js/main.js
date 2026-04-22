
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
  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
  }
  let js_prices = document.querySelectorAll(".js_price");
  js_prices.forEach((js_price) => {
      let price = Math.round(js_price.textContent);
      js_price.textContent = numberWithSpaces(price);
  })
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

	svgBody.addEventListener("mousewheel", (event) => {
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
		let zoomid = 1;
		
		zoomBody.setAttribute('data-zoom-index', index);
		
		zoomPlus.addEventListener("click", function () {
			zoomPlusIn();
        });

	    zoomMinus.addEventListener("click", function () {
	    	zoomMinusOut();
        });

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
	    }

	    /*zoomImageBody.onmousedown = function(e) {
	    	if(zoomImageBody.classList.contains('active')) {
				imageMove(e);
			}
		}

		function imageMove(e) {
			const rect = zoomImageBody.getBoundingClientRect();
			let mouseX = e.clientX - rect.left;
			let mouseY = e.clientY - rect.top;

			zoomImageBody.onmousemove = function(e) {
				moveAt(e);
			}

			zoomImage.ondragstart = function() {
				return false;
			}

			zoomImage.onmouseup = function() {
				moveEnd();
			}

			zoomImage.onmousewheel = function() {
				moveEnd();
			} 

			function moveAt(e) {
				zoomImage.style.left = e.clientX - rect.left - mouseX + 'px';
				zoomImage.style.top = e.clientY - rect.top - mouseY + 'px';

				//console.log(e.clientX + " " + rect.left + " " + rect.right + " " + zoomImage.style.left + " " + index);
			}

			function moveEnd() {
				zoomImageBody.onmousemove = null;
				zoomImage.onmouseup = null;
			}
		}*/
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

