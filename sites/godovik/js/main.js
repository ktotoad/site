
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
    }, 1e3),
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
    window.addEventListener('load', function () {
        wrapper.classList.add('loaded');
        animateall();
    });
}
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
						const animStart = 4;

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
//burger=====================================================================================================================================================
const body = document.querySelector('body');
if(document.querySelector('.icon-menu')) {
	const iconMenu = document.querySelector('.icon-menu');
	const menuBody = document.querySelector('.header__body');
	const menuItems = document.querySelectorAll('.header__link');

	iconMenu.addEventListener('click', 
		function clickButtonBurger(event) {
			iconMenu.classList.toggle('active');
			menuBody.classList.toggle('active');
			body.classList.toggle('lock');
		});

	menuItems.forEach(menuItem => {
		menuItem.addEventListener('click', 
			function clickButtonBurger(event) {
				iconMenu.classList.remove('active');
				menuBody.classList.remove('active');
				body.classList.remove('lock');
			});
	});
}
//fixed_main==================================================================================================================================================================================================================
let header = document.querySelector("header");
window.addEventListener("scroll", function(){
	if(window.scrollY > 100){
    	header.classList.add('fixed');
	}
	else{
	    header.classList.remove('fixed');
	}
});
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
			parallax: true,
			autoHeight: true,
			speed: 800,
			pagination: {
				el: ".slider-main__pagination",
				clickable: true,
			},
		});
	}
	if (document.querySelector('.main-slider')) {
		let mainSliders = document.querySelectorAll('.main-slider');
		mainSliders.forEach(function (mainSlider) {
        	let section = mainSlider.closest("section");
        	let swipernav = section.querySelector(".nav-slider");
			new Swiper(swipernav, {
				spaceBetween: 60,
				slidesPerView: "auto",
				freeMode: true,
				watchSlidesProgress: true,
				breakpoints: {
					320: {
						spaceBetween: 10,
					},
					479: {
						spaceBetween: 20,
					},
					767: {
						spaceBetween: 30,
					},
					991: {
						spaceBetween: 40,
					},
					1023: {
						spaceBetween: 60,
					}
				},
			});
			new Swiper(mainSlider, {
				observer: true,
				observeParents: true,
				allowTouchMove: false,
				slidesPerView: "auto",
				spaceBetween: 10,
				parallax: true,
				autoHeight: true,
				speed: 800,
				thumbs: {
					swiper: swipernav,
				},
				navigation: {
					nextEl: ".main-slider__next",
					prevEl: ".main-slider__prev",
				},
			});
		});
	}
	if (document.querySelector('.picture-slider')) {
		new Swiper('.picture-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			autoHeight: true,
			speed: 800,
			navigation: {
				nextEl: ".picture-slider__next",
				prevEl: ".picture-slider__prev",
			},
		});
	}
	if (document.querySelector('.slider-catalog__slider')) {
		new Swiper('.slider-catalog__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 30,
			parallax: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
				},
				479: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				767: {
					slidesPerView: 3,
					spaceBetween: 10,
				},
				991: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1023: {
					slidesPerView: 4,
					spaceBetween: 20,
				}
			},
			//pagination: {
			//	el: ".slider-catalog__pagination",
			//	clickable: true,
			//	renderBullet: function (index, className) {
			//		return '<span class="' + className + '">' + (index + 1) + "</span>";
			//	},
			//},
			navigation: {
				nextEl: ".slider-catalog__next",
				prevEl: ".slider-catalog__prev",
			},
		});
	}
	if (document.querySelector('.builder-page__slider')) {
		new Swiper('.builder-page__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 40,
			parallax: true,
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
					autoHeight: true,
				},
				767: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
			},
			navigation: {
				nextEl: ".builder-page__next",
				prevEl: ".builder-page__prev",
			},
		});
	}
}
initSliders();