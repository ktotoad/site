
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
		var headerMenu=$('.header-menu');
		var headerTop=$('.header-top');
		var headerLeft=$('.column-left__menu');
		var headerRight=$('.column-right__menu');
		var headerCatalog=$('.menu-catalog');
	if(w<992){
		if(!headerRight.hasClass('done')){
			headerRight.addClass('done').appendTo(headerTop);
		}
	}else{
		if(headerRight.hasClass('done')){
			headerRight.removeClass('done').prependTo($('.column-right'));
		}
	}
	if(w<768){
		if(!headerCatalog.hasClass('done')){
			headerCatalog.addClass('done').appendTo(headerMenu);
		}
	}else{
		if(headerCatalog.hasClass('done')){
			headerCatalog.removeClass('done').prependTo($('.catalog-header'));
		}
	}
	if(w<992){
		if(!headerLeft.hasClass('done done-menu')){
			headerLeft.addClass('done done-menu').appendTo(headerMenu);
		}
	}else{
		if(headerLeft.hasClass('done done-menu')){
			headerLeft.removeClass('done done-menu').prependTo($('.column-left'));
		}
	}
}
function adaptive_function() {
		var w=$(window).outerWidth();
		var h=$(window).outerHeight();
	adaptive_header(w,h);
}
adaptive_function();
//burger=====================================================================================================================================================
$('.wrapper').addClass('loaded');

$(document).ready(function(){
	$('.menu-header__icon').click(function(event) {
		$(this).toggleClass('active');
		$('.header-menu').toggleClass('active');
		$('body').toggleClass('lock');
	});
});
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

//SubMenu========================================================================================================================================
document.addEventListener("click", documentActions);

function documentActions(e) {
	const targetElement = e.target;
	if(targetElement.closest('[data-parent]')){
		const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
		const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
		if (subMenu) {
			const activeLink = document.querySelector('.sub-menu-active');
			const activeBlock = document.querySelector('.sub-menu-open');
			if(activeLink && activeLink !== targetElement){
				activeLink.classList.remove('sub-menu-active');
				activeBlock.classList.remove('sub-menu-open');
				//document.documentElement.classList.remove('sub-menu-open');
				//if (!e.target.closest('.menu-catalog')) {
				//	activeLink.classList.remove('sub-menu-active');
				//	activeBlock.classList.remove('sub-menu-open');
				//}
			}
			//document.documentElement.classList.toggle('sub-menu-open');
			targetElement.classList.toggle('sub-menu-active');
			subMenu.classList.toggle('sub-menu-open');
		}
		e.preventDefault();	
	}
	if(targetElement.closest('.menu-catalog_back')){
		document.documentElement.classList.remove('catalog-open');
		document.querySelector('.sub-menu-active') ? document.querySelector('.sub-menu-active').classList.remove('sub-menu-active') : null;
		document.querySelector('.sub-menu-open') ? document.querySelector('.sub-menu-open').classList.remove('sub-menu-open') : null;
		e.preventDefault();
	}
}
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

//ibg============================================================================================================
function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();
// SPOLLERS========================================================================================================================================
$(document).ready(function(){
	$('.icon-equalizer').click(function(event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});
});