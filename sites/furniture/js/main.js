
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

	let date = ['Office Furniture', 'Our Services', 'Talk to an expert'];

	if (document.querySelector('.main-slider')) {
		new Swiper('.main-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
      		direction: "vertical",
			//loop: true,
			//autoHeight: true,
			threshold: 0,
			touchReleaseOnEdges: true,
			autoplay: {
				delay: 7000,
				disableOnInteraction: false,
			},
			speed: 1800,
			pagination: {
				el: '.main-slider__dots',
				clickable: true,
				renderBullet: (index, className) => {
			   		return `<span class='${className}'><span class="main-slider__dots-circle"></span><span class="main-slider__dots-title">${date[index]}</span></span>`;
			    },
			},
		});
	}

	if (document.querySelector('.slider-running')) {
		new Swiper('.slider-running',{
			observer: true,
			observeParents: true,
	        spaceBetween: 20,
	        centeredSlides: false,
	        parallax: true,
			loop: true,
	        speed: 3000,
	        autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
	        slidesPerView: 'auto',
	        allowTouchMove: false,
	    });
	}
}

initSliders();
//Paralax=====================================================================================================================================================
if (document.querySelector('#paralax')) {
	let paralaxImage = document.querySelector('#paralax');
	let paralaxBody = paralaxImage.closest('section');

	document.addEventListener("scroll", function (e) {
		let s = 0 + paralaxBody.getBoundingClientRect().top/2;
		console.log(s);
		paralaxImage.style.transform  = `translateY(${s}px)`;
	});
}
