
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
        animateall();
    }, 500);
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
						const animStart = 10;

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
const catalogSliderSlides = document.querySelectorAll('.catalog-slider__slide');
const filterItems = document.querySelectorAll('.filter-catalog-main__item');

if(document.querySelector('.filter-catalog-main')) {

	filterItems.forEach(elem => { if(elem.classList.contains('active')) {
		let filter = elem.dataset['filter'];
		catalogSliderSlides.forEach( elem => {
			elem.classList.remove('hide');
			if(!elem.classList.contains(filter)) {
				elem.classList.add('hide');
			}
		});
	}
});

document.querySelector('.filter-catalog-main').addEventListener('click', e => {

	if(e.target.classList.contains('filter-catalog-main__item') || e.target.closest('.filter-catalog-main__item')) {
		let filterClass = e.target.closest('.filter-catalog-main__item').dataset['filter'];
		filterItems.forEach(elem => elem.classList.remove('active'));
		e.target.closest('.filter-catalog-main__item').classList.add('active');

		catalogSliderSlides.forEach( elem => {
			elem.classList.remove('hide');
			if(!elem.classList.contains(filterClass)) {
				elem.classList.add('hide');
			}
		});
			
		let mySwiper = document.querySelector('.catalog-slider').swiper;
		mySwiper.update();
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
//SVG_script==========================================================================================================================
if(document.querySelector("#zoomimage")) {
	const svgBody = document.querySelector("#zoomimage svg");
	let filterBody = document.querySelector("#filterbody");
	const parkingPopup = document.querySelector("#parkingpopup");
	const parkingOrder = document.querySelector("#parkingorder");
	const parkingPopupDis = document.querySelector("#parkingpopupdisable"); 
	let areaPaths = new Array();
	let familyPaths = new Array();

	filterBody.addEventListener("click", (e) => {

		//радио площади
		if(e.target.closest("#area")) {
			//снимаем чекбокс семейного паркинга
			if(filterBody.querySelector("#family").querySelector(".active")) { 
				filterBody.querySelector("#family").querySelector(".active").querySelector("input").checked = false;
				filterBody.querySelector("#family").querySelector(".active").classList.toggle('active');
			}
			//выбран ли уже фильтр площади
			if(e.target.closest("#area").querySelector(".active")) {
				svgBody.querySelectorAll("path").forEach(function (path) {
					if(path.dataset.area == e.target.closest('div .active').dataset.area && path.dataset.status == "AVAILABLE") {
						path.setAttribute("data-filter", "filtered");
					} else {
						path.setAttribute("data-filter", "disabled");
					}
				});
			} else {
				svgBody.querySelectorAll("path").forEach(function (path) {
					if(path.dataset.area == e.target.closest('div .active').dataset.area && path.dataset.status == "AVAILABLE") {
						path.setAttribute("data-filter", "filtered");
					} else {
						path.setAttribute("data-filter", "disabled");
					}
				});
			}
		}

		//чекбокс семейного паркинга
		if (e.target.closest("#family") && e.target.closest("#checkboxbody")) {
			//снимаем фильтр площади
			if(filterBody.querySelector("#area").querySelector(".active")) { 
				filterBody.querySelector("#area").querySelector(".active").querySelector("input").checked = false;
				filterBody.querySelector("#area").querySelector(".active").classList.toggle('active');
			}
			//нажат ли уже этот чекбокс
			if(e.target.closest("#checkbox").classList.contains("active")) {
				svgBody.querySelectorAll("path").forEach(function (path) {
					if(path.dataset.family && path.dataset.status == "AVAILABLE") {
						path.setAttribute("data-filter", "filtered");
					} else {
						path.setAttribute("data-filter", "disabled");
					}
				});
			} else {
				svgBody.querySelectorAll("path").forEach(function (path) {
					path.removeAttribute("data-filter");
				});
			}
		}

		function svgBodyFilter() {
			svgBody.querySelectorAll("path").forEach(function (path) {
				if(path.dataset.area == e.target.closest('div .active').dataset.area && path.dataset.status == "AVAILABLE") {
					areaPaths.push(path);
				}
			});
		}

	});

	svgBody.addEventListener("mouseover", (event) => {
		if(event.target.tagName == "path") {
			if (event.target.dataset.status == "AVAILABLE") {
				if (event.target.dataset.filter != "disabled") {
					const area = event.target.dataset.area;
					const family = event.target.dataset.family;
					let size;

					switch (area) {
						case "21.6":
							size = "4,07 м х 5,3 м";
							break;
						case "13.25":
							size = "2,3 м х 5,3 м";
					}
					parkingPopupActive(event, area, size);

					event.target.setAttribute("data-engage", "mouseover");

					event.target.addEventListener("mouseout", (event) => {
						event.target.removeAttribute("data-engage");
						parkingPopupNotActive();
					});

					event.target.addEventListener("mousewheel", (event) => {
						event.target.removeAttribute("data-engage");
						parkingPopupNotActive();
					});

					event.target.addEventListener("click", (event) => {
						popupOpen(parkingOrder);

				  		parkingOrder.querySelector("#popupumber").innerText = "№" + event.target.dataset.number;
				  		parkingOrder.querySelector("#popupprice").innerText = numberWithSpaces(event.target.dataset.price) + " ₽";
				  		parkingOrder.querySelector("#popuparea").innerText = area + " м²";
				  		parkingOrder.querySelector("#popupsize").innerText = size;
  						parkingOrder.querySelector("#popupimage img").src = event.target.dataset.photo;
					});
				} else {
					event.target.setAttribute("data-status-enable", "disabled");
				}
			} else {
				event.target.setAttribute("data-status-enable", "disabled");
				parkingPopupDisabled(event);

				event.target.addEventListener("mouseout", (event) => {
					parkingPopupDis.classList.remove("active");
				});

				event.target.addEventListener("mousewheel", (event) => {
					parkingPopupDis.classList.remove("active");
				});
			}
		}
	});

	function parkingPopupDisabled(event) {
		const x = event.clientX;
  		const y = event.clientY;

  		parkingPopupDis.style.left = x + "px";
  		parkingPopupDis.style.top = y + "px";
		parkingPopupDis.classList.add("active");
	}

	function parkingPopupActive(event, area, size) {
		const x = event.clientX;
  		const y = event.clientY;

  		parkingPopup.querySelector("#popupumber").innerText = "№" + event.target.dataset.number;
  		parkingPopup.querySelector("#popupprice").innerText = numberWithSpaces(event.target.dataset.price) + " ₽";
  		parkingPopup.querySelector("#popuparea").innerText = area + " м²";
  		parkingPopup.querySelector("#popupsize").innerText = size;

  		parkingPopup.style.left = x + "px";
  		parkingPopup.style.top = y + "px";
		parkingPopup.classList.add("active");
	}

	function parkingPopupNotActive() {
		parkingPopup.classList.remove("active");
	}
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
		new Swiper('.slider-fade', {
  		observer: true,
			observeParents: true,
  		effect: "fade",
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
		});
	}

	if (document.querySelector('.slider-neighbour')) {
		new Swiper('.slider-neighbour', {
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
					spaceBetween: 0,
				},
				470: {
					spaceBetween: 10,
				},
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
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: ".slider-building__next",
				prevEl: ".slider-building__prev",
			},
		});
	}


	if (document.querySelector('.detail-slider-thumb')) {
		var residentthumbs = new Swiper('.detail-slider-thumb', {
  		slidesPerView: thumbsSliderCount,
			spaceBetween: 10,
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			autoplay: false,
			watchSlidesProgress: true,
			speed: 800,
		});
	}
	if (document.querySelector('.detail-slider')) {
		new Swiper('.detail-slider', {
  		observer: true,
			observeParents: true,
  		//effect: "fade",
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
      thumbs: {
        swiper: residentthumbs,
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
			//autoplay: {
			//	delay: 3000,
			//	disableOnInteraction: false,
			//},
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
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
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  let js_prices = document.querySelectorAll(".js_price");
  js_prices.forEach((js_price) => {
      js_price.textContent = numberWithSpaces(js_price.textContent);
  })
}
//prices===================================================================================================================================
if (document.querySelector(".js_price")) {
    let js_prices = document.querySelectorAll(".js_price");
    js_prices.forEach((js_price) => {
        js_price.textContent = numberWithSpaces(js_price.textContent);
    });
}
//map======================================================================================================================================================================
if (document.querySelector("#map")) {
    ymaps.ready(mapInit);
}
function mapInit() {
    // Создаем карту
    var myMap = new ymaps.Map("map",{
        center: [55.624461, 49.011208],
        zoom: 10,
        controls: ['zoomControl']
    });
    //маршрут с иконками
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [ 
            [55.624461, 49.011208],
            [55.797557, 49.107295]
        ]
    },{
        // Внешний вид начальной точки
        wayPointStartIconLayout: "default#imageWithContent",
        wayPointStartIconImageHref: "../img/icons/logomap.svg",
        wayPointStartIconImageSize: [60, 60],
        wayPointStartIconImageOffset: [-24, -24],

        // Внешний вид конечной точки
        wayPointFinishIconLayout: "default#imageWithContent",
        wayPointFinishIconImageHref: "../img/icons/kr.png",
        wayPointFinishIconImageSize: [40, 40],
        wayPointFinishIconImageOffset: [-20, -20],

        // Внешний вид линии маршрута
        routeStrokeWidth: 2,
        routeStrokeColor: "#202229",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#D69A66",

        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком
        boundsAutoApply: true
    }, function (error) {
        alert('Возникла ошибка: ' + error.message);
    });
    //убираем скрол
    myMap.behaviors.disable('scrollZoom');
    //добавляем маршрут
    myMap.geoObjects.add(multiRoute);

    //добавляем точки
    // Создаем коллекцию.
    myCollection = new ymaps.GeoObjectCollection(),
    // Создаем массив с данными.
    myPoints = {
        storePoints : [
            { coords: [55.621527, 49.014279], text: 'Верный' },
            { coords: [55.625423, 49.139786], text: 'Пятёрочка' },
            { coords: [55.623853, 49.145322], text: 'Магнит' },
            { coords: [55.622222, 49.143119], text: 'Авокадо' },
        ],
        tcPoints : [
            { coords: [55.623361, 49.143905], text: 'Торговый центр У дачи' },
            { coords: [55.625650, 49.140471], text: 'ТК Ковали' },
            { coords: [55.629866, 49.133371], text: 'Капиталъ' },
            { coords: [55.725314, 49.191592], text: 'Порт' },
            { coords: [55.768644, 49.148097], text: 'KazanMall' },
            { coords: [55.786574, 49.124078], text: 'Кольцо' },
            { coords: [55.769446, 49.217446], text: 'Южный' },
            { coords: [55.780657, 49.212967], text: 'Мега' },
        ],
        medPoints : [
            { coords: [55.616163, 49.134729], text: 'Аптека Фарм Планета' },
            { coords: [55.629857, 49.133292], text: 'Фармленд' },
            { coords: [55.623544, 49.145410], text: 'Вита Экспресс' },
        ],
        sportPoints : [
            { coords: [55.625310, 49.015372], text: 'Волга' },
            { coords: [55.624219, 49.147440], text: 'Спортивно-досуговый центр Дружба' },
        ],
        cafePoints : [
            { coords: [55.621277, 49.013950], text: 'Папа Карло' },
            { coords: [55.616415, 49.134692], text: 'Шаурма' },
            { coords: [55.624031, 49.142335], text: 'Император' },
            { coords: [55.631844, 49.132555], text: 'Старые Ковали' },
        ]
    };

    if(document.querySelector('.filter__list')) {
        const tabButtons = document.querySelectorAll('.filter__item');
        tabButtons.forEach(elem => { 
            if(elem.classList.contains('active')) {
                let filter = elem.dataset['filter'];
                mapSearchPoints(filter);
            }
        });
        document.querySelector('.filter__list').addEventListener('click', e => {
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
                mapAddPoints(result);
            }
        }
    }

    function mapAddPoints(result) {
        // Удаляем "старую" коллекцию меток на карту.
        myCollection.removeAll();
        // Заполняем коллекцию данными.
        for (var i = 0, l = result.length; i < l; i++) {
            var point = result[i];
            myCollection.add(new ymaps.Placemark(
                point.coords, {
                    balloonContentBody: [
                        '<address><strong>' + point.text + '</strong><br/>Адрес: ' + point.coords + '</address>'                        
                    ]
                }, {
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: '../img/icons/mapimg.svg',
                    // Размеры метки.
                    iconImageSize: [42, 42],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-21, -21]
                }
            ));
        }
        // Добавляем коллекцию меток на карту.
        myMap.geoObjects.add(myCollection);
    }
}

//Text_color=========================================================================================================================================
if(document.querySelector('[data-text]')) {
	document.querySelectorAll('[data-text]').forEach((textColor) => {	
		window.addEventListener('scroll', function() {
			Visible (textColor);
		});
	});

	var Visible = function (target) {
		var targetPosition = {
			top: window.pageYOffset + target.getBoundingClientRect().top,
			left: window.pageXOffset + target.getBoundingClientRect().left,
			right: window.pageXOffset + target.getBoundingClientRect().right,
			bottom: window.pageYOffset + target.getBoundingClientRect().bottom
		},
		windowPosition = {
			top: window.pageYOffset,
			left: window.pageXOffset,
			right: window.pageXOffset + document.documentElement.clientWidth,
			bottom: window.pageYOffset + document.documentElement.clientHeight
		};

		if (targetPosition.bottom > windowPosition.top &&
			targetPosition.top < windowPosition.bottom &&
			targetPosition.right > windowPosition.left &&
			targetPosition.left < windowPosition.right) {
			
				let overlay = target.querySelector('.overlay');
				overlay.style.clip =  'rect(0 '+ overlay.clientWidth +'px '+ overlay.clientHeight +'px 0)';
		}
	};
}