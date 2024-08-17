
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
		new Swiper('.main-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
      		direction: "vertical",
			//loop: true,
			//autoHeight: true,
			autoplay: {
				delay: 7000,
				disableOnInteraction: false,
			},
			speed: 1800,
			breakpoints: {
		        320: {
		        	allowTouchMove: false
		        },
		        1024: {
		        	allowTouchMove: true
		        },
		    },
			pagination: {
				el: '.main-slider__dots',
				clickable: true,
			},
		});
	}

	if (document.querySelector('.slider-running')) {
		new Swiper('.slider-running',{
			observer: true,
			observeParents: true,
	        spaceBetween: 50,
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
