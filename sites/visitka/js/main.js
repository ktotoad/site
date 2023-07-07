
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

	if (document.querySelector('.slider-portfolio')) {
		new Swiper('.slider-portfolio', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			navigation: {
				nextEl: '.portfolio__arrow.swiper-button-next',
				prevEl: '.portfolio__arrow.swiper-button-prev',
			},
		});
	}
}
initSliders();
//ibg============================================================================================================
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

//burger=====================================================================================================================================================
$('.wrapper').addClass('loaded');

$(document).ready(function(){
	$('.icon-menu').click(function(event) {
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});
});
$(function() {
    $(window).scroll(function() {
        if($(this).scrollTop() != 0) {
            $('#topNubex').fadeIn();
        } else {
            $('#topNubex').fadeOut();
        }
    });
    $('#topNubex').click(function() {
        $('body,html').animate({scrollTop:0},700);
    });
});
//Paralax=====================================================================================================================================================
$(window).scroll(function(event) {
		var s=0-$(this).scrollTop()/2;
	$('.main__image').css('transform','translate3d(0,'+s+'px,0)');
});