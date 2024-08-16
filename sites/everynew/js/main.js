
/*Loading================================================================================*/
//window.addEventListener('load', function () {
//    const loader = document.querySelector('.loader');
//    loader.classList.add('hidden');
//});

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
//POPUP========================================================================================================================================
const popupLinks = document.querySelectorAll('.popup-link');
//const body = document.querySelector('body');
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

//button=====================================================================================================================================================
if(document.querySelector('#button')) {
	var buttons = document.querySelectorAll("#button");

	buttons.forEach(button => {
		const itemMove = button.querySelector("span");

		button.onmouseover = function(event) {
			moveAt(event);
		}
		
		button.onmousemove = function(event) {
			moveAt(event);
		}

		button.onmouseout = function() {
			button.style.removeProperty('transform');
			itemMove.style.removeProperty('transform');
		}

		function moveAt(event) {
			// получаем координату мыши
			const x = event.clientX; 
  			const y = event.clientY;
  			// центральное положение блока
  			const buttonX = (button.getBoundingClientRect().left + button.getBoundingClientRect().right)/2;
  			const buttonY = (button.getBoundingClientRect().top + button.getBoundingClientRect().bottom)/2;
  			// центральное положение текста
  			const spanX = (itemMove.getBoundingClientRect().left + itemMove.getBoundingClientRect().right)/2;
  			const spanY = (itemMove.getBoundingClientRect().top + itemMove.getBoundingClientRect().bottom)/2;

			button.style.transform  = `translate(${(x - buttonX)/4}px, ${(y - buttonY)/4}px)`;
			itemMove.style.transform  = `translate(${-(x - spanX)/4}px, ${-(y - spanY)/4}px)`;
		}
	});
}
