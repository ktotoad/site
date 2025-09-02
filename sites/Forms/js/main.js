
/*Loader================================================================================*/
if(document.querySelector('.loader')) {
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        loader.classList.add('hidden');
    });
}
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
	iconMenu.addEventListener('click', function clickButtonBurger(event) {
		burgerFunc();
	});
	menuBody.addEventListener('click', function clickButtonBurger(event) {
		if(menuBody.querySelector("a")) {
			burgerFunc();
		}
	});
}

function burgerFunc() {
	iconMenu.classList.toggle('active');
	menuBody.classList.toggle('active');
	body.classList.toggle('lock');
}
//spollerbutton=====================================================================================================================================================
if (document.querySelector("[drop-block]")){
	const dropBlock = document.querySelector('[drop-block]');
	document.addEventListener("click", (event) => {
		const withinBoundaries = event.composedPath().includes(dropBlock);

		if (!withinBoundaries) {
			dropBlock.classList.remove('active');
		}
		else {
			dropBlock.classList.add('active');
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
//select=====================================================================================================================================================
let currentSelect = null;

document.addEventListener('click', function(event) {
	if (currentSelect) {
		currentSelect.classList.remove('active');
	}

	if (event.target.matches('[data-select]') || event.target.closest("[data-select]")) {
		let select = event.target.closest("[data-select]");
		let spollerbutton = event.target.closest("[data-select-body]");

		if(event.target.matches('[data-select-body]')) {
			event.target.classList.add('active');
			currentSelect = event.target;
		}
		
		if(select.querySelector("[data-select-body]")) {
			if(event.target.classList.contains("select__item")) {
				spollerbutton.querySelectorAll(".select__item").forEach((option) => {
					option.classList.remove("active");
				});

				let optionText = event.target.innerText;
				let buttonSpoller = select.querySelector("[data-select-button] span");

				buttonSpoller.textContent = optionText;
				event.target.classList.add("active");
				spollerbutton.classList.remove('active');
			}
		}

		document.addEventListener("scroll", (event) => {
			spollerbutton.classList.remove('active');
		});	
	}
});
//RadioButton====================================================================================================================================================================================
if(document.querySelector('[radio-buttons]')) {
    let radioButtonsBodies = document.querySelectorAll('[radio-buttons]');

    radioButtonsBodies.forEach(function (radioButtonsBody) {
        radioButtonsBody.querySelectorAll('.radio').forEach(function (radio) {
            if (radio.classList.contains('disabled')) {
                radio.querySelector('input').disabled = true;
            }
        });
        radioButtonsBody.addEventListener('click', (e) => {

            if(e.target.closest('.radio')) {
                radioButtonsBody.querySelectorAll('.radio').forEach(function (radio) {
                    radio.classList.remove('active');
                });
                e.target.closest('.radio').classList.add('active'); 
            } 

        });
    });
}
//counter=====================================================================================================================================================
if (document.querySelector(".counter-block")){
    const counters = document.querySelectorAll('.counter-block');
    const instances = [];

	counters.forEach((counter) => {
		let valueEl = counter.querySelector(".value");
		let decreaseBtn = counter.querySelector(".decrease");
		let increaseBtn = counter.querySelector(".increase");
      	const maxSourceId = counter.getAttribute("data-max-source"); 
      	const id = counter.getAttribute("data-id"); // Уникальное имя для ссылки

		let count = parseInt(counter.getAttribute("data-counter")) || 0;

		// Создаём объект-счётчик
		const instance = {
			element: counter,
			valueEl,
			decreaseBtn,
			increaseBtn,
			count,
			maxSourceId,
			id,

			// Обновление UI и состояния кнопок
			update() {
				// Если есть источник ограничения — проверяем
				let maxVal = Infinity;
				if (this.maxSourceId) {
					const target = instances.find(c => c.id === this.maxSourceId);
					if (target) {
						maxVal = target.count;
						// Авто-коррекция: нельзя быть больше лимита
						if (this.count > maxVal) {
							this.count = maxVal;
						}
					}
				}

				// Обновляем отображение
				this.valueEl.textContent = this.count;

				// Блокировка кнопок
				this.decreaseBtn.disabled = this.count <= 0;
				this.increaseBtn.disabled = this.count >= maxVal;
			}
		};

		// Обработчики событий
		increaseBtn.addEventListener('click', () => {
			// Проверяем лимит перед увеличением
			if (instance.maxSourceId) {
				const target = instances.find(c => c.id === instance.maxSourceId);
				const max = target ? target.count : Infinity;
				if (instance.count < max) {
					instance.count++;
					instance.update();
					// Обновляем все зависящие счётчики
					instances.forEach(c => c.maxSourceId && c.update());
				}
			} else {
				instance.count++;
				instance.update();
			}
		});

		decreaseBtn.addEventListener('click', () => {
			if (instance.count > 0) {
				instance.count--;
				instance.update();
				// Если этот счётчик — лимит для других, обновляем их
				instances.forEach(c => c.maxSourceId && c.update());
			}
		});

		// Сохраняем экземпляр
		instances.push(instance);

		// Инициализируем отображение
		instance.update();
    });
}