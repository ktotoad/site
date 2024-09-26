
/*Content_download================================================================================*/
let wrapper = document.querySelector('.wrapper');
window.addEventListener('load', (event) => {
	wrapper.classList.add('loaded');
});

//burger=====================================================================================================================================================
if (document.querySelector('.icon-menu')) {
	const iconSubmenu = document.querySelector('.icon-menu');
	const submenuBody = document.querySelector('.submenu__body');
	const body = document.querySelector('body');
	let submenuItems = document.querySelectorAll('.submenu__nav_links a');

	iconSubmenu.addEventListener('click', 
		function clickButtonBurger(event) {
			iconSubmenu.classList.toggle('active');
			submenuBody.classList.toggle('active');
			body.classList.toggle('lock');
		});

	submenuItems.forEach(submenuItem => {
		submenuItem.addEventListener('click', 
			function clickButtonBurger(event) {
				iconSubmenu.classList.remove('active');
				submenuBody.classList.remove('active');
				body.classList.remove('lock');
			});
	});

	$('.submenu__nav li').on('mouseenter',function(){
		$(this).siblings().addClass('notactive');
		$('.submenu__image[data-link="'+$(this).data('link')+'"]').addClass('active');
	});
	$('.submenu__nav li').on('mouseleave',function(){
		$(this).siblings().removeClass('notactive');
		$('.submenu__image[data-link="'+$(this).data('link')+'"]').removeClass('active');
		if(!$('.submenu__image.active').length){
			$('.submenu__image:first').addClass('active');
		}
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

	if (document.querySelector('.slider-stoke')) {
		new Swiper(".slider-stoke",{
			observer: true,
			observeParents: true,
	        spaceBetween: 60,
	        centeredSlides: false,
	        parallax: true,
			loop: true,
	        speed: 6000,
	        autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				768: {
					spaceBetween: 30,
				},
				992: {
					spaceBetween: 60,
				},
			},
	        slidesPerView: "auto",
	        allowTouchMove: false,
	    });
	}
	if (document.querySelector('.slider-stoke-inv')) {
		new Swiper(".slider-stoke-inv",{
			observer: true,
			observeParents: true,
	        spaceBetween: 60,
	        centeredSlides: false,
	        parallax: true,
			loop: true,
	        speed: 6000,
	        autoplay: {
				delay: 0,
				disableOnInteraction: false,
				reverseDirection: true,
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				768: {
					spaceBetween: 30,
				},
				992: {
					spaceBetween: 60,
				},
			},
	        slidesPerView: "auto",
	        allowTouchMove: false,
	    });
	}

	if (document.querySelector('.slider-line')) {
		new Swiper(".slider-line",{
			observer: true,
			observeParents: true,
	        spaceBetween: 60,
	        centeredSlides: false,
	        parallax: true,
			loop: true,
	        speed: 6000,
	        autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
			breakpoints: {
				320: {
					spaceBetween: 10,
				},
				768: {
					spaceBetween: 30,
				},
				992: {
					spaceBetween: 60,
				},
			},
	        slidesPerView: "auto",
	        allowTouchMove: false,
	    });
	}
}


initSliders();
//video=================================================================================================================================
let mainBody = document.querySelector('body');

window.document.onkeydown = function(e) {
  if (!e) {
    e = event;
  }
  if (e.keyCode == 27) {
    lightbox_close();
  }
}

function lightbox_open() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  window.scrollTo(0, 0);
  document.getElementById('popupvideo').style.display = 'block';
  document.getElementById('fade').style.display = 'block';
  mainBody.classList.add('lock');
  lightBoxVideo.play();
}

function lightbox_close() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById('popupvideo').style.display = 'none';
  document.getElementById('fade').style.display = 'none';
  mainBody.classList.remove('lock');
  lightBoxVideo.pause();
}