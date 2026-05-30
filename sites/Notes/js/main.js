
/*Loading================================================================================*/
let wrapper = document.querySelector('.wrapper');

if (document.querySelector(".preloader")) {
    let loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    
    body.classList.add("lock");

    setTimeout(() => {
        body.classList.remove("lock");
    }, 2e3),
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 2e3),
    (function (body, loader) {
        let loading = 0,
        i = setInterval(() => {
            (document.querySelector(".preloader-body__percents").innerHTML = ++loading + "%"), 100 === loading && clearInterval(i);
        }, 20);
    })();

    wrapper.classList.add('loaded');

    setTimeout(function(){
        wrapper.classList.add('loaded');
        animateall();
    }, 1000);
} else {
    wrapper.classList.add('loaded');
    animateall();
}
/*Animation================================================================================*/
function animateall() {
	if(document.querySelector('[anim-item]')) {
		const animItems = document.querySelectorAll('[anim-item]');
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
if (document.querySelector("[drop-body]")) {
	document.querySelectorAll("[drop-body]").forEach((dropBody) => {
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
  let result = parseInt(number.replaceAll(' ', ''));
  return result;
}
//map======================================================================================================================================================================
if (document.querySelector("#map")) {
    ymaps.ready(mapInit);
}
function mapInit() {
    // Создаем карту
    var myMap = new ymaps.Map("map",{
        center: [55.788157, 49.114736],
        zoom: 15,
        controls: ['zoomControl']
    }), 
    myIcon = ymaps.templateLayoutFactory.createClass("<div>$[properties.iconContent]</div>"),
    myPlacemark = new ymaps.Placemark([55.788157, 49.114736],
    {
        balloonContent: '<div class="popup-map__body"><p class="text">Моменты — 12 элегантных таунхаусов</p></div>',
        balloonContentFooter: '<div class="popup-map__footer"><a href="#catalog" class="popup-map__link"><span>Подробнее</span></a></div>'
    },
    {
        iconLayout: "default#imageWithContent",
        iconImageHref: "../img/icons/logomap.svg",
        iconImageSize: [60, 60],
        iconImageOffset: [-24, -24],
        iconContentOffset: [15, 15],
        iconContentLayout: myIcon,
        hideIconOnBalloonOpen: !1,
        balloonCloseButton: !1,
        balloonOffset: [0, -20]
    });
    //убираем скрол
    myMap.behaviors.disable('scrollZoom');
    //добавляем точку
    myMap.geoObjects.add(myPlacemark);

    //добавляем точки
    // Создаем коллекцию.
    myCollection = new ymaps.GeoObjectCollection(),
    // Создаем массив с данными.
    myPoints = {
        learnPoints : [
            { coords: [55.789609, 49.112580], text: 'Школа танцев', link: 'https://yandex.ru/maps/-/CHFAaV5v' },
            { coords: [55.793655, 49.104845], text: 'Школа №1', link: 'https://yandex.ru/maps/-/CHFAaZ6a' },
            { coords: [55.796709, 49.112604], text: 'Лицей им.Лобачевского', link: 'https://yandex.ru/maps/-/CHFAaCno' },
            { coords: [55.792222, 49.121855], text: 'КФУ', link: 'https://yandex.ru/maps/-/CHFAaG92' },
        ],
        culturePoints : [
            { coords: [55.793468, 49.107464], text: 'Театр на Булаке: 800 м (10 минут)', link: 'https://yandex.ru/maps/-/CHFAaHm~' },
            { coords: [55.770705, 49.129464], text: 'Новое здание Театра Камала: 2,3 км (28 минут)', link: 'https://yandex.ru/maps/-/CHFAa-ks' },
            { coords: [55.795530, 49.135989], text: 'Галерея современного искусства: 2 км (24 минуты)', link: 'https://yandex.ru/maps/-/CHFAeE08' },
            { coords: [55.795735, 49.109635], text: 'Национальный музей Республики Татарстан: 1,2 км (14 минут)', link: 'https://yandex.ru/maps/-/CHFAeQmL' },
            { coords: [55.798760, 49.100544], text: 'Цирк Казани: 1,7 км (20 минут)', link: 'https://yandex.ru/maps/-/CHFAeY4J' },
        ],
        tcPoints : [
            { coords: [55.785465, 49.126462], text: 'ТЦ Республика: 1,2 км (14 минут)', link: 'https://yandex.ru/maps/-/CHFAeKi9' },
            { coords: [55.786574, 49.124078], text: 'ТЦ Кольцо: 800 м (10 минут)', link: 'https://yandex.ru/maps/-/CHFAeWZX' },
            { coords: [55.783242, 49.116186], text: 'Бизнес-центр «Татнефть»: 1,3 км (16 минут)', link: 'https://yandex.ru/maps/-/CHFAeD3r' },
        ],
        cafePoints : [
            { coords: [55.780986, 49.116709], text: 'Татарская усадьба', link: 'https://yandex.ru/maps/-/CHFAeLky' },
            { coords: [55.789217, 49.116044], text: 'Бирхоф', link: 'https://yandex.ru/maps/-/CHFAePl8' },
            { coords: [55.789923, 49.116140], text: 'Угар', link: 'https://yandex.ru/maps/-/CHFAeXZI' },
        ],
        sportPoints : [
            { coords: [55.786923, 49.110068], text: 'Альфа-фитнес', link: 'https://yandex.ru/maps/-/CHFAe-4o' },
            { coords: [55.787181, 49.117865], text: 'Лучано', link: 'https://yandex.ru/maps/-/CHFAiEM0' },
            { coords: [55.786335, 49.121568], text: 'DDX фитнес', link: 'https://yandex.ru/maps/-/CHFAiI59' },
        ],
    };

    if(document.querySelector('#mapfilter')) {
        const tabButtons = document.querySelectorAll('.filter__item');
        tabButtons.forEach(elem => { 
            if(elem.classList.contains('active')) {
                let filter = elem.dataset['filter'];
                mapSearchPoints(filter);
            }
        });
        document.querySelector('#mapfilter').addEventListener('click', e => {
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
        let logo;
        switch (filter) {
            case "learnPoints":
                logo = '../img/icons/maple.svg';
                break;
            case "culturePoints":
                logo = '../img/icons/mapcu.svg';
                break;
            case "tcPoints":
                logo = '../img/icons/maptc.svg';
                break;
            case "cafePoints":
                logo = '../img/icons/mapca.svg';
                break;
            case "sportPoints":
                logo = '../img/icons/mapsp.svg';
                break;
            default:
                logo = '../img/icons/mapicon.svg';
        }
        // Заполняем коллекцию данными.
        for (var i = 0, l = result.length; i < l; i++) {
            var point = result[i];
            myCollection.add(new ymaps.Placemark(
                point.coords, {
                    balloonContentBody: [
                        '<address><strong>' + point.text + '</strong><br/><a href=' + point.link + ' target="_blank">Адрес: ' + point.coords + '<a></address>'                        
                    ]
                }, {
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: logo,
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

//toggle======================================================================================================================================================
if(document.querySelector("#sunway")) {
	document.querySelectorAll("#sunway").forEach(function (sunway) {
		const toggle = sunway.querySelector('#toggle');
		if(sunway.querySelector('#svgway')) {
			const svgway = sunway.querySelector('#svgway');
		}

		toggle.addEventListener("click", function () {
        	sunway.classList.toggle("active");
        });
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

if(document.querySelector("#video-gallery")) {
	document.querySelectorAll("#video-gallery").forEach(videoGallery => {
		Fancybox.bind(videoGallery, {
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

	if (document.querySelector('.slider-collection-main')) {
		new Swiper('.slider-collection-main', {
  		observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 30,
			parallax: true,
		});
	}


	if (document.querySelector('.slider-building-main')) {
		new Swiper('.slider-building-main', {
  		observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 40,
			parallax: true,
		});
	}

	var residentthumbs;
	
	if (document.querySelector('.resident-slider-thumb')) {
		residentthumbs = new Swiper('.resident-slider-thumb', {
  		//slidesPerView: thumbsSliderCount,
  		slidesPerView: "auto",
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			autoplay: false,
			watchSlidesProgress: true,
			speed: 800,
		});
	}

	if (document.querySelector('.resident-slider')) {
		new Swiper('.resident-slider', {
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

	if (document.querySelector('.alike-page__slider')) {
		new Swiper('.alike-page__slider', {
  		observer: true,
			observeParents: true,
			slidesPerView: 3,
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
					autoHeight: true,
				},
				480: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
				}
			},
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