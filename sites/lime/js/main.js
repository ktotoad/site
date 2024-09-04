
//POPUP========================================================================================================================================
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++ ) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener("click", function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if(popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});	
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	if (lockPadding.length > 0) {	
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {	
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
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

	if (document.querySelector('.body-video__slider')) {
		new Swiper('.body-video__slider', {
			observer: true,
			observeParents: true,
			direction: "vertical",
			slidesPerView: 4,
			spaceBetween: 40,
			parallax: true,
			//loop: true,
			autoHeight: true,
			breakpoints: {
				320: {
					direction: "horizontal",
					slidesPerView: 2,
					spaceBetween: 5,
				},
				480: {
					direction: "horizontal",
					slidesPerView: 3,
					spaceBetween: 10,
				},
				768: {
					direction: "horizontal",
					slidesPerView: 4,
					spaceBetween: 10,
					autoHeight: true,
				},
				992: {
					direction: "vertical",
					slidesPerView: 4,
					spaceBetween: 40,
				},
			},
			navigation: {
		        nextEl: ".body-video__button-next",
		        prevEl: ".body-video__button-prev",
		    },
		});
	}

	if (document.querySelector('.sponsors__slider')) {
		new Swiper('.sponsors__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 50,
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
				992: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
			},
			pagination: {
				el: '.sponsors__pagination',
				clickable: true,
			},
		});
	}

	if (document.querySelector('.services-slider')) {
		var swiper = new Swiper(".services-slider-thumbs", {
			spaceBetween: 10,
			slidesPerView: 3,
			freeMode: true,
			watchSlidesProgress: true,
		});
		new Swiper('.services-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 10,
			parallax: true,
			//loop: true,
			autoHeight: true,
			speed: 800,
			thumbs: {
				swiper: swiper,
			},
		});
	}

	if (document.querySelector('.slider-main__slider')) {
		new Swiper('.slider-main__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 10,
			parallax: true,
			//loop: true,
			autoHeight: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.slider-main__pagination',
				clickable: true,
			},
			navigation: {
		        nextEl: ".slider-main__next",
		        prevEl: ".slider-main__prev",
		    },
		});
	}
}

initSliders();
window.addEventListener('DOMContentLoaded', function() {
	let broadcast = document.querySelectorAll('#broadcast');

	for (let i=0; i < broadcast.length; i++) {
		broadcast[i].addEventListener('click', function() {
			let src = broadcast[i].dataset.src;

			if (broadcast[i].classList.contains('ready')) {
				return;
			}
			broadcast[i].classList.add('ready');
			broadcast[i].insertAdjacentHTML('afterbegin', '<iframe src="' + src + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
		});
	}
});
function tabs() {
    const tabs = document.querySelectorAll("[data-tabs]");
    let tabsActiveHash = [];
    if (tabs.length > 0) {
        const hash = functions_getHash();
        if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
        tabs.forEach(((tabsBlock, index) => {
            tabsBlock.classList.add("_tab-init");
            tabsBlock.setAttribute("data-tabs-index", index);
            tabsBlock.addEventListener("click", setTabsAction);
            initTabs(tabsBlock);
        }));
        let mdQueriesArray = dataMediaQueries(tabs, "tabs");
        if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
            mdQueriesItem.matchMedia.addEventListener("change", (function() {
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        }));
    }
    function setTitlePosition(tabsMediaArray, matchMedia) {
        tabsMediaArray.forEach((tabsMediaItem => {
            tabsMediaItem = tabsMediaItem.item;
            let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
            let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
            let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
            tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
            tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
            tabsContentItems.forEach(((tabsContentItem, index) => {
                if (matchMedia.matches) {
                    tabsContent.append(tabsTitleItems[index]);
                    tabsContent.append(tabsContentItem);
                    tabsMediaItem.classList.add("_tab-spoller");
                } else {
                    tabsTitles.append(tabsTitleItems[index]);
                    tabsMediaItem.classList.remove("_tab-spoller");
                }
            }));
        }));
    }
    function initTabs(tabsBlock) {
        let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
        let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
        if (tabsActiveHashBlock) {
            const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
            tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
        }
        if (tabsContent.length) {
            tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsContent.forEach(((tabsContentItem, index) => {
                tabsTitles[index].setAttribute("data-tabs-title", "");
                tabsContentItem.setAttribute("data-tabs-item", "");
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
            }));
        }
    }
    function setTabsStatus(tabsBlock) {
        let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
        let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        function isTabsAnamate(tabsBlock) {
            if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
        }
        const tabsBlockAnimate = isTabsAnamate(tabsBlock);
        if (tabsContent.length > 0) {
            const isHash = tabsBlock.hasAttribute("data-tabs-hash");
            tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
            tabsContent.forEach(((tabsContentItem, index) => {
                if (tabsTitles[index].classList.contains("_tab-active")) {
                    if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                    if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
            }));
        }
    }
    function setTabsAction(e) {
	alert();
        const el = e.target;
        if (el.closest("[data-tabs-title]")) {
            const tabTitle = el.closest("[data-tabs-title]");
            const tabsBlock = tabTitle.closest("[data-tabs]");
            if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                tabTitle.classList.add("_tab-active");
                setTabsStatus(tabsBlock);
            }
            e.preventDefault();
        }
    }
}
tabs();