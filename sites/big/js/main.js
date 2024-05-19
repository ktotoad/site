
/*Loading================================================================================*/
if (document.querySelector(".preloader")) {
    var tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: '#one',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true
      }
    })
    const loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    body.classList.add("lock"),
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                body.classList.remove("lock");
            }, 2e3),
                setTimeout(() => {
                    loader.classList.add("hidden");
                }, 3300),
                (function (loader, body) {
                    let n = 0,
                        i = setInterval(() => {
                            (document.querySelector(".preloader-body__percents").innerHTML = ++n + " %"), 100 === n && clearInterval(i);
                        }, 10);
                })(),
                tl.to(".preloader-body__percents", { color: "#131411", duration: 2 }),
                tl.to(".preloader-body__logo-light", { width: "100%", opacity: 1, duration: 2, delay: -1.5 }),
                tl.to(".preloader-body__logo-light", { clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", duration: 0.1, delay: 0.35 }),
                tl.to(".preloader", { scale: 6, duration: 3, delay: 1.5 }),
                tl.to(".preloader", { opacity: 0, duration: 1.3, delay: 1.5 });
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
//Вывод видео==================================================================================================================================================
window.addEventListener('DOMContentLoaded', function() {
	let broadcast = document.querySelectorAll('#broadcast');

	for (let i=0; i < broadcast.length; i++) {
		broadcast[i].addEventListener('click', function() {
			let src = broadcast[i].dataset.src;

			if (broadcast[i].classList.contains('ready')) {
				return;
			}
			broadcast[i].classList.add('ready');
			broadcast[i].insertAdjacentHTML('afterbegin', '<iframe src="' + src + '" title="video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
		});
	}
});
//Filter=====================================================================================================================================================
$('.sliders-page__link').click(function(event) {
	var i=$(this).data('filter');
	
	$('.main-slider__slide').removeClass('show');
	$('.main-slider__slide.f_'+i).addClass('show');

	$('.sliders-page__link').removeClass('_tab-active');
	$(this).addClass('_tab-active');

	console.log("click " + i);

	return false;
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
	if (document.querySelector('.slider-about')) {
		new Swiper('.slider-about', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 5,
			parallax: true,
			autoHeight: true,
			speed: 800,
		});
	}
	if (document.querySelector('.main-slider')) {
		new Swiper('.main-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			spaceBetween: 0,
			parallax: true,
			autoHeight: true,
			speed: 800,
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
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
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
					spaceBetween: 0,
					autoHeight: true,
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
			pagination: {
				el: ".slider-catalog__pagination",
				clickable: true,
				renderBullet: function (index, className) {
					return '<span class="' + className + '">' + (index + 1) + "</span>";
				},
			},
		});
	}
}
initSliders();