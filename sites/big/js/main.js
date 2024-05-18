
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