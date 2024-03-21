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

/*Animation================================================================================*/
const animItems = document.querySelectorAll('.anim-items');
window.addEventListener('load', (event) => {
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
});
//burger=====================================================================================================================================================
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
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

//Mouse_plus==================================================================================================================================================
var blocks_mouse_move = document.querySelectorAll("#block_mouse_move");

blocks_mouse_move.forEach(block_mouse_move => {
	const itemZoom = block_mouse_move.querySelector("#zoom");

	block_mouse_move.onmouseover = function(event) {
		itemZoom.classList.add("zoom");
		moveAt(event);
	}
	
	block_mouse_move.onmousemove = function(event) {
		moveAt(event);
	}

	block_mouse_move.onmouseout = function() {
		itemZoom.classList.remove("zoom");
		itemZoom.style.removeProperty('left');
		itemZoom.style.removeProperty('top');
	}

	function moveAt(event) {
		itemZoom.style.left = event.clientX + -30 + 'px';
		itemZoom.style.top = event.clientY + -30 + 'px';
	}
});
//ZOOM=====================================================================================================================================================
$('.parent-container').magnificPopup({
	delegate: 'a',
	type: 'image',
	removalDelay: 300,
	mainClass: 'mfp-fade'
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

	if (document.querySelector('.slider-full')) {
		new Swiper('.slider-full', {
  		direction: "vertical",
  		effect: "fade",
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			parallax: true,
			autoHeight: true,
			speed: 800,
			pagination: {
				el: '.slider-full__pagination',
				clickable: true,
			},
		});
	}
	if (document.querySelector('.slider-page__slider')) {
		new Swiper('.slider-page__slider', {
      spaceBetween: 30,
			slidesPerView: 1,
			effect: 'fade',
			pagination: {
				el: '.slider-page__pagination',
				clickable: true,
			}
		});
	}
	if (document.querySelector('.resident-sliders__slider')) {
		new Swiper('.resident-sliders__slider', {
      spaceBetween: 30,
			slidesPerView: 1,
			effect: "creative",
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
			pagination: {
				el: '.resident-sliders__pagination',
				clickable: true,
			}
		});
	}	
	if (document.querySelector('.team-page__slider')) {
		new Swiper('.team-page__slider', {
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
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				}
			},
			pagination: {
				el: '.slider-team__pagination',
				clickable: true,
			},
		});
	}
}
initSliders();
//Resize_scroll==================================================================================================================================================
var tl_one = gsap.timeline({
  paused: true,
  scrollTrigger: {
    trigger: '#one',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true
  }
})
tl_one.to('#one', {'z-index': 100}).to('.resizeOne', {left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible'})

var tl_two = gsap.timeline({
  paused: true,
  scrollTrigger: {
    trigger: '#two',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true
  }
})
tl_two.to('#two', {'z-index': 100, bottom: '0'})
.to('.resizeTwo', {left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible'})

gsap.to('.image-lobby', {
	scrollTrigger: {
    trigger: '#changeBody',
    start: 'top center',
    end: 'center top',
    scrub: true,
  },
	'border-radius': '300px',
})

gsap.to('.resizeThree', {
	scrollTrigger: {
    trigger: '#three',
    start: '-35vh center',
    end: 'bottom center',
    scrub: true,
  },
  width: '100%',
  height: '840px',
})

gsap.to('.resizeFour', {
	scrollTrigger: {
    trigger: '#four',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }, 
  overflow: 'visible',
  'margin-top': '10%',
  width: '100%',
  height: '840px',
})
//Change_Image==================================================================================================================================================
//const sectionChange = document.querySelector("#changeBody");
//const changeImage = sectionChange.querySelector("#change");

//document.body.onscroll = (e) => {
//	var bounds = changeImage.getBoundingClientRect();
//	const centerTop = sectionChange.offsetTop - (window.innerHeight/2 - sectionChange.clientHeight/2);
//	const centerBottom = sectionChange.offsetTop - (window.innerHeight/2 - sectionChange.clientHeight/2) + bounds.height;

//	console.log("windowY: " + window.scrollY);
//	console.log("centerTop: " + centerTop);
//	console.log("centerBottom: " + centerBottom);

//	if(window.scrollY >= centerTop) {
//		changeImage.classList.add("change");
//  }
//  if(window.scrollY <= centerTop) {
//		changeImage.classList.remove("change");
//  }
//}
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
