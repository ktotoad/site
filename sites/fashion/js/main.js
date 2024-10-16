
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

	if (document.querySelector('.main-slider')) {
		let mainSliders = document.querySelectorAll('.main-slider');
		mainSliders.forEach(function (mainSlider) {
        	let section = mainSlider.closest("section");
        	let sliderNext = section.querySelector(".main-slider__next");
        	let sliderPrev = section.querySelector(".main-slider__prev");
			new Swiper(mainSlider, {
	  			observer: true,
				observeParents: true,
				slidesPerView: 4,
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
						spaceBetween: 0,
						autoHeight: true,
					},
					480: {
						slidesPerView: 2,
						spaceBetween: 10,
					},
					769: {
						slidesPerView: 3,
						spaceBetween: 10,
					},
					992: {
						slidesPerView: 4,
						spaceBetween: 10,
					},
				},
				navigation: {
					nextEl: sliderNext,
					prevEl: sliderPrev,
				},
			});
		});
	}
}
initSliders();