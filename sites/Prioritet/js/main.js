
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
    		effect: "fade",
			parallax: true,
			speed: 800,
			navigation: {
				nextEl: ".slider-main__next",
				prevEl: ".slider-main__prev",
			},
		});
	}
}

initSliders();