
/*Loader================================================================================*/
if(document.querySelector('.loader')) {
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        loader.classList.add('hidden');
    });
}
/*Content_download================================================================================*/
let wrapper = document.querySelector('.wrapper');
window.addEventListener('load', (event) => {
	wrapper.classList.add('loaded');
});

//burger=====================================================================================================================================================
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.header__body');
const body = document.querySelector('body');

if (iconMenu) {
	iconMenu.addEventListener('click', function clickButtonBurger(event) {
		burgerFunc();
	});
	menuBody.addEventListener('click', function clickButtonBurger(event) {
		if(menuBody.querySelector("a")) {
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
//prices===================================================================================================================================
if (document.querySelectorAll(".js_price")) {
  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  let js_prices = document.querySelectorAll(".js_price");
  js_prices.forEach((js_price) => {
      js_price.textContent = numberWithSpaces(js_price.textContent);
  })
}
//Page_Up==========================================================================================================================================
document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.getElementById("back-to-top");
 
  // Показать/скрыть кнопку при прокрутке страницы
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  });
 
  // Плавная прокрутка при клике на кнопку
  backToTop.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			effect: 'cards',
			cardsEffect: {
				perSlideOffset: 10,
				perSlideRotate: 30
			},
		});
	}

	if (document.querySelector('.slider-examples')) {
		new Swiper('.slider-examples', {
			observer: true,
			observeParents: true,
			slidesPerView: 6,
			spaceBetween: 16,
			parallax: true,
			autoHeight: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: "auto",
					centeredSlides: true,
					initialSlide: 1,
				},
				480: {
					slidesPerView: 3,
					centeredSlides: false,
					initialSlide: 0,
				},
				768: {
					slidesPerView: 4,
				},
				992: {
					slidesPerView: 5,
				},
				1024: {
					slidesPerView: 6,
				},
			},
			navigation: {
			    nextEl: '.slider-examples__next',
			    prevEl: '.slider-examples__prev',
			},
		});
	}

	if (document.querySelector('.slider-news')) {
		const options = {
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 60,
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-news__next",
				prevEl: ".slider-news__prev",
			},
			breakpoints: {
				320: {
					slidesPerView: "auto",
					centeredSlides: true,
					initialSlide: 1,
					spaceBetween: 10,
				},
				480: {
					slidesPerView: 2,
					centeredSlides: false,
					initialSlide: 0,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				992: {
					spaceBetween: 40,
				},
				1024: {
					spaceBetween: 60,
				},
			}
		}
		initFilteredSlider('#swiperNewsBody', '.slider-news', options);
	}
}

function initFilteredSlider(containerSelector, itemsContainerSelector, options) {
	const categoriesList = document.querySelector(containerSelector + ' .filter-list');
	const categoriesButtons = Array.from(document.querySelector(containerSelector + ' .filter-list').querySelectorAll('.filter-button'));
	const items = document.querySelector(containerSelector + ' ' + itemsContainerSelector).querySelectorAll('[data-filter-item]');
	const itemsSwiper = new Swiper(itemsContainerSelector, options);

	if (categoriesButtons && categoriesButtons.length) {
	    categoriesList.addEventListener("click", (e) => {
	    	if(e.target.closest('[data-filter-button]')) {
	    		let button = e.target.closest('[data-filter-button]');
	    		activateCategoryButton(button);
		    }
	    });
	}

	function activateCategoryButton(button) {
	    const categoryId = button.getAttribute('data-filter-button');
	    console.log(categoryId);
	    categoriesButtons.forEach((button) => {
	    	button.classList.remove('active');
	    });
	    button.classList.add('active');
		itemsSwiper.removeAllSlides();

    	if(categoryId == 'all') {
		    itemsSwiper.appendSlide(items);
		    console.log(items);
		} else { 
			const newSlides = [];
		    items.forEach( filterItem => {
				const valuesArray = filterItem.getAttribute('data-filter-item').split(',').map(value => value.trim());
				let check = 0;
				for (let i = 0; i < valuesArray.length; i++) {
					if(valuesArray[i] == categoryId) {
						check++;
					}
				}
				if(check != 0) {
					newSlides.push(filterItem);
				}
			});
		    itemsSwiper.appendSlide(newSlides);
		}
	}
};

initSliders();