
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
const menuBody = document.querySelector('.header__main-body');
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

	if (document.querySelector('.thumbs-main-page')) {
		new Swiper('.thumbs-main-page', {
			spaceBetween: 10,
			slidesPerView: 3,
			freeMode: true,
			watchSlidesProgress: true,
		});
	}
	if (document.querySelector('.slider-main-page')) {
		new Swiper('.slider-main-page', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			//loop: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			thumbs: {
		        swiper: '.thumbs-main-page',
		    },
		});
	}
}


initSliders();
// animation in hero
if(document.querySelector("[data-h1-words]")) {
    let words = $("[data-h1-words]").children();
    let wordWidth;
    let currentIndex = 1;

    setInterval(function() {
        let lettersCurrent = words.eq(currentIndex).find("em");
        let lettersPrev = words.eq(currentIndex - 1).find("em");
        let delay = 50;

        lettersCurrent.each(function(index) {
            let element = $(this);
            setTimeout(function() {
                element.addClass("active");
            }, index * delay);
        });

        lettersPrev.each(function(index) {
            let element = $(this);
            setTimeout(function() {
                element.addClass("active done");
            }, index * delay);
        });
        words.find("em").not(lettersCurrent).not(lettersPrev).removeClass("active done");
        wordWidth = words.eq(currentIndex).width();
        $("[data-h1-words]").width(wordWidth + 'px');
        currentIndex = (currentIndex + 1) % words.length;
    }, 3000);
}