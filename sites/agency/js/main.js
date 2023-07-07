
//burger=====================================================================================================================================================
$('.wrapper').addClass('loaded');

$(document).ready(function(){
	$('.icon-menu').click(function(event) {
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});
});
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

//BuildSlider======================================================================================================================================================

//Инициализация_Swiper===============================================================================================================================================
function initSliders() {

	if (document.querySelector('.slider-main')) {
		new Swiper('.slider-main', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			loop: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			pagination: {
				el: '.slider-main-pagination',
				clickable: true,
				renderBullet: function (index, pagination__number) {
					return '<span class="' + pagination__number + '">' + '0<span class="slider-main-pagination_number">' + (index + 1) + "</span></span>";
				},
			},
		});
	}

	if (document.querySelector('.slider-reviews')) {
		new Swiper('.slider-reviews', {
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
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			speed: 800,
		});
	}

}

initSliders();
$('.tab__navitem').click(function(event) {
		var i=$(this).data('filter');
	if(i==0) {
		$('.tab__item').show();
	}else{
		$('.tab__item').hide();
		$('.tab__item.t_'+i).show();
	}	
	$('.tab__navitem').removeClass('tab_active');
	$(this).addClass('tab_active');

	return false;
});