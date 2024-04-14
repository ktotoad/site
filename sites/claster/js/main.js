
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
			broadcast[i].insertAdjacentHTML('afterbegin', '<iframe src="' + src + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
		});
	}
});