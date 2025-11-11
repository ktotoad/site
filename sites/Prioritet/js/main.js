
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
//gsap_anim===================================================================================================================================
if(document.querySelector("[data-gsap-slide-top]")) {
	gsap.registerPlugin(ScrollTrigger);
	ScrollTrigger.matchMedia({"(min-width: 768px)": () => {
		const tlTop = gsap.timeline({
			scrollTrigger: {
				trigger: "[data-gsap-slide-top]",
				start: "top +=600",
				scrub: true,
				markers: false,
			}
		});
		tlTop.to("[data-gsap-slide-top]", {"y": "-50%"})
	}});
}

if(document.querySelector("[data-gsap-slide-bottom]")) {
	gsap.registerPlugin(ScrollTrigger);
	ScrollTrigger.matchMedia({"(min-width: 768px)": () => {
		const tlBottom = gsap.timeline({
			scrollTrigger: {
				trigger: "[data-gsap-slide-bottom]",
				start: "top bottom",
				scrub: true,
				markers: false,
			}
		});
		tlBottom.to("[data-gsap-slide-bottom]", {"y": "-150%"})
	}});
}