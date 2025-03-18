
/*Loading================================================================================*/
window.addEventListener('load', function () {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
});

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
	iconMenu.addEventListener('click', 
		function clickButtonBurger(event) {
			iconMenu.classList.toggle('active');
			menuBody.classList.toggle('active');
			body.classList.toggle('lock');
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
	if (document.querySelector('.slider-detail')) {
		var swiper = new Swiper('.slider-thumb-detail', {
			slidesPerView: 5,
			spaceBetween: 10,
    		direction: "vertical",
			parallax: true,
			//autoHeight: true,
			//freeMode: true,
			watchSlidesProgress: true,
			speed: 800,
			breakpoints: {
				320: {
					spaceBetween: 10,
					slidesPerView: 3,
    				direction: "horizontal",
				},
				480: {
					spaceBetween: 10,
					slidesPerView: 4,
    				direction: "horizontal",
				},
				768: {
					slidesPerView: 5,
    				direction: "vertical",
					spaceBetween: 10,
				},
			},
		});
		new Swiper('.slider-detail', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
    		effect: "fade",
			speed: 800,
			navigation: {
				nextEl: ".slider-detail__next",
				prevEl: ".slider-detail__prev",
			},
			pagination: {
				el: '.slider-detail__pagination',
				clickable: true,
			},
			thumbs: {
				swiper: swiper,
			},
		});
	}
}


initSliders();