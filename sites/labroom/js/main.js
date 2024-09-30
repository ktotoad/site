
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

	if (document.querySelector('.slider-toilet')) {
		new Swiper(".slider-toilet",{
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			//loop: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				480: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 20,
				}
			},
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
//TABS==================================================================================================================================================
// Получение хеша в адресе сайта
function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Указание хеша в адресе сайта
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

	}
	// Установка позиций заголовков
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('_tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('_tab-spoller');
				}
			});
		});
	}
	// Работа с контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]');
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
tabs();