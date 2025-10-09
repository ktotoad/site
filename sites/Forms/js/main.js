
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
	const dropBlocks = document.querySelectorAll('[drop-block]');
	document.addEventListener('click', (event) => {
		dropBlocks.forEach(dropBlock => {
			const isClickInside = event.composedPath().includes(dropBlock);
			if (isClickInside) {
				dropBlock.classList.add('active');
			} else {
				dropBlock.classList.remove('active');
			}
		});
	});
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
		select.classList.add('active');
		currentSelect = select;
		
		if(select.querySelector("[data-select-body]")) {
			if(event.target.classList.contains("select__item")) {
				spollerbutton.querySelectorAll(".select__item").forEach((option) => {
					option.classList.remove("active");
				});

				let optionText = event.target.innerText;
				let buttonSpoller = select.querySelector("[data-select-button] span");

				buttonSpoller.textContent = optionText;
				event.target.classList.add("active");
				select.classList.remove('active');
			}
		}

		document.addEventListener("scroll", (event) => {
			select.classList.remove('active');
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
//Checkbox==========================================================================================================================
if (document.querySelector('[checkbox-buttons]')) { 
    let checkBoxBodies = document.querySelectorAll('[checkbox-buttons]');

    checkBoxBodies.forEach(function (checkBoxBody) {
        checkBoxBody.querySelectorAll('.checkbox').forEach(function (checkbox) {
            if (checkbox.classList.contains('disabled')) {
                checkbox.querySelector('input').disabled = true;
            }
        });
        checkBoxBody.addEventListener('click', (e) => {

            if(e.target.closest('.checkbox:not(.disabled)')) {
                e.target.closest('.checkbox').classList.toggle('active'); 
            } 

        });
    });
}

//counter=====================================================================================================================================================
if (document.querySelector(".counter-block")){
    const counters = document.querySelectorAll('.counter-block');
    const instances = [];

	counters.forEach((counter) => {
		let formBlock = counter.closest(".form__block");
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
			countAll(formBlock);
		});

		decreaseBtn.addEventListener('click', () => {
			if (instance.count > 0) {
				instance.count--;
				instance.update();
				// Если этот счётчик — лимит для других, обновляем их
				instances.forEach(c => c.maxSourceId && c.update());
			}
			countAll(formBlock);
		});

		// Сохраняем экземпляр
		instances.push(instance);

		// Инициализируем отображение
		instance.update();
    });
}

function countAll(formBlock) {
	let summary = 0;
	let counterValues = formBlock.querySelectorAll(".value");

	counterValues.forEach((counterValue) => {
		summary = summary + Number(counterValue.textContent);
	});

	formBlock.querySelector("#counted span").textContent = summary;
}
//datepicker===================================================================================================================================
let datepickerInstance = null;
let isRangeMode = true; // по умолчанию диапазон

function initDatepicker(isRange) {
    isRangeMode = isRange; // сохраняем режим
    const input = document.getElementById('date-range');
    if (!input) {
        return;
    }

    // Уничтожаем предыдущий экземпляр
    if (datepickerInstance) {
        datepickerInstance.destroy();
        datepickerInstance = null;
    }

    datepickerInstance = new AirDatepicker('#date-range', {
        range: isRange,
        multipleDatesSeparator: ' - ',
        dateFormat: 'dd.MM.yyyy',
        minDate: new Date(),
        onSelect: function (data) {
            const input = document.getElementById('date-range');
            if (!input) return;

            // Извлекаем значение
		    const valueToSet = extractValueFromData(data);

		    if (valueToSet) {
		        input.value = valueToSet;
		        console.log('✅ Установлено значение:', valueToSet);
		    } else {
		        console.warn('⚠️ Не удалось извлечь значение из данных');
		    }

            if (typeof validateField === 'function') {
                validateField(input);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initDatepicker(true); // по умолчанию — диапазон
});

function extractValueFromData(data) {
    if (!data) return '';

    // 1. Если formattedDate — массив строк
    if (Array.isArray(data.formattedDate)) {
        if (data.formattedDate.length === 1) {
            return data.formattedDate[0];
        } else if (data.formattedDate.length === 2) {
            return `${data.formattedDate[0]} - ${data.formattedDate[1]}`;
        }
    }

    // 2. Если formattedDate — строка
    if (typeof data.formattedDate === 'string') {
        return data.formattedDate;
    }

    // 3. Если ничего не подошло — используем data.date (массив объектов Date)
    if (Array.isArray(data.date) && data.date.length > 0) {
        const formatDate = (d) => {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
        };

        if (data.date.length === 1) {
            return formatDate(data.date[0]);
        } else if (data.date.length === 2) {
            return `${formatDate(data.date[0])} - ${formatDate(data.date[1])}`;
        }
    }

    return '';
}
//toggle======================================================================================================================================================
document.addEventListener("click", function (e) {
	if(e.target.matches("[data-toggle-id]") || e.target.closest("[data-toggle-id]")) {
		const toggleButton = e.target.closest("[data-toggle-id]");
		const itemID = toggleButton.dataset.toggleId;
    	const targetElement = document.getElementById(itemID);

		toggleButton.classList.toggle("active");
		targetElement.classList.toggle("toggle-active");

		if (itemID === "date-range") {
	        const isRangeMode = !toggleButton.classList.contains("active"); // active → не нужен обратный билет → !range
	        initDatepicker(isRangeMode);

	        // Опционально: очищаем значение, если переключились в режим одной даты
	        if (!isRangeMode && targetElement.value.includes(' - ')) {
	            const firstDate = targetElement.value.split(' - ')[0];
	            targetElement.value = firstDate;
	            validateField(targetElement);
	        }
	    }
	}
});

//FORMS====================================================================================================================================================================================
//Валидация
const validators = {
	phone(value) {
		const clean = value.trim().replace(/[\s\-\(\)]/g, '');
		return /^(\+7|8)\d{10}$/.test(clean);
	},
	email(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	},
	text(value) {
		return value.trim().length > 0;
	},
	'date-range'(value) {
        if (!value || !value.trim()) return false;

        // Универсальная очистка: заменяем любые тире/пробелы на " - "
        const cleanValue = value.trim().replace(/\s*[-—–]\s*/g, ' - ');

        // Разделяем по разделителю
        const dates = cleanValue.split(' - ').filter(Boolean); // filter уберёт пустые

        // Должна быть 1 или 2 даты
        if (dates.length < 1 || dates.length > 2) return false;

        // Функция проверки формата даты
        const isValidDate = (dateStr) => {
            const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
            if (!regex.test(dateStr)) return false;

            const [day, month, year] = dateStr.split('.').map(Number);
            const date = new Date(year, month - 1, day);

            return date.getFullYear() === year &&
                   date.getMonth() === month - 1 &&
                   date.getDate() === day;
        };

        // Проверяем все выбранные даты
        const allValid = dates.every(isValidDate);

        // Если две даты — проверяем порядок
        if (dates.length === 2) {
            const start = new Date(dates[0].split('.').reverse().join('-'));
            const end = new Date(dates[1].split('.').reverse().join('-'));
            return allValid && end >= start;
        }

        return allValid; // для одной даты достаточно её корректности
    },
    'passport'(value) {
        if (!value || !value.trim()) return false;
        
        // Убираем всё, кроме цифр
        const digits = value.replace(/\D/g, '');
        
        // Должно быть ровно 10 цифр
        if (digits.length !== 10) return false;

        // Можно дополнительно проверить серию: первые 4 цифры — не 00 00
        const series = digits.slice(0, 4);
        if (series === '0000') return false; // серия не может быть 00 00

        return true;
    },
    'inn'(value) {
        if (!value || !value.trim()) return false;

        const digits = value.replace(/\D/g, '');

        if (digits.length !== 10 && digits.length !== 12) return false;

        return validateINN(digits);
    },
    'snils'(value) {
        if (!value || !value.trim()) return false;

        const digits = value.replace(/\D/g, '');

        if (digits.length !== 11) return false;

        return validateSNILS(digits);
    },
};

//Ошибки
const errorMessages = {
	required: "Это поле обязательно для заполнения.",
	phone: "Введите корректный номер (например: +79991234567).",
	email: "Введите корректный email (например: user@example.com).",
    'date-range': "Введите корректный диапазон дат (например: 01.01.2025 — 10.01.2025).",
	text: "Поле не может быть пустым.",
	minLength: (min) => `Минимальная длина — ${min} символов.`
};

// --- Универсальная функция проверки одного поля ---
function validateField(input) {
	const value = input.value;
	const fieldType = input.dataset.validate;
	const isRequired = input.dataset.required === 'true';
	const minLength = input.dataset.minLength ? parseInt(input.dataset.minLength) : null;

	const errorDiv = document.querySelector(`.error-message[data-for="${input.id}"]`);
	let errorMessage = '';

	// Сброс
	input.closest(".form__input-block").classList.remove('error');
	errorDiv.classList.remove('active');
	errorDiv.textContent = '';

	// Проверка: пустое ли поле
	if (!value.trim()) {
		if (isRequired) {
			errorMessage = errorMessages.required;
		}
	} else {
	// Поле не пустое — проверяем по типу
		if (fieldType && !validators[fieldType](value)) {
			errorMessage = errorMessages[fieldType] || "Неверный формат.";
		}

		// Проверка длины (для текстов)
		if (minLength && value.trim().length < minLength) {
			errorMessage = errorMessages.minLength(minLength);
		}
	}
	// Если есть ошибка — показываем
	if (errorMessage) {
		input.closest(".form__input-block").classList.add('error');
		errorDiv.textContent = errorMessage;
		errorDiv.classList.add('active');
		return false;
	}

	return true;
}

// --- Привязка событий ко всем полям формы ---
document.querySelectorAll('input[data-validate], textarea[data-validate]').forEach(input => {
	input.addEventListener('input', () => {
		input.classList.remove('error');
		const errorDiv = document.querySelector(`.error-message[data-for="${input.id}"]`);
		if (errorDiv) errorDiv.classList.remove('active');
	});
	// При потере фокуса
	input.addEventListener('blur', () => validateField(input));
});

//проверка при нажатии отпраивть
function validateOnSubmit() {
	let isFormValid = true;
	const inputs = document.querySelectorAll('input[data-validate], textarea[data-validate]');

	inputs.forEach(input => {
		const isValid = validateField(input);
		if (!isValid) isFormValid = false;
	});

	if (isFormValid) {
		alert("Форма успешно отправлена!");
		// Здесь можно: myForm.submit(); или fetch(...)
	} else {
		alert("Исправьте ошибки перед отправкой.");
	}

	return isFormValid;
}
//RANGE========================================================================================================================================
if (document.querySelector("[data-range]")) {
    rangeSliderInit();
}

function formatNumber(num) {
    return num.toLocaleString();
};

function rangeSliderInit() {
    document.querySelectorAll("[data-range]").forEach((rangeSlider) => {
        const valuesArray = rangeSlider
            .getAttribute('data-range')
            .split(',')
            .map(value => value.trim())
            .map(value => (value === '' ? NaN : Number(value)))
            .filter(value => !isNaN(value)); // убираем нечисловые

        if (valuesArray.length < 2) {
            console.warn('Not enough values in data-range (min, max required)');
            return;
        }

        const minValue = Number(valuesArray[0]);
        const maxValue = Number(valuesArray[1]);

        // Определяем шаг
        const step = rangeSlider.hasAttribute('data-range-step')
            ? Number(rangeSlider.getAttribute('data-range-step'))
            : 1;

        // Находим элементы
        const slider = rangeSlider.querySelector("#slider");
        const inputMin = rangeSlider.querySelector(".input-min");
        const inputMax = rangeSlider.querySelector(".input-max");
        const fromPriceInput = rangeSlider.querySelector("#fromprice");
        const toPriceInput = rangeSlider.querySelector("#toprice");

        // Определяем, сколько бегунков
        let hasTwoHandles = true;
        let startValues;

        // Логика определения количества бегунков
        if (valuesArray.length === 2) {
            // Только min и max → два бегунка: стартуем с краёв
            startValues = [minValue, maxValue];
            hasTwoHandles = true;
        } else if (valuesArray.length === 3) {
            const start = valuesArray[2];
            if (start >= minValue && start <= maxValue) {
                // Один бегунок: например, "выбрать количество дней"
                startValues = [start];
                hasTwoHandles = false;
            } else {
                // Некорректное значение → fallback: два бегунка
                startValues = [minValue, maxValue];
                hasTwoHandles = true;
            }
        } else if (valuesArray.length >= 4) {
            // Четыре значения: min, max, startMin, startMax → два бегунка
            startValues = [
                valuesArray[2],
                valuesArray[3]
            ];
            hasTwoHandles = true;
        } else {
            startValues = [minValue, maxValue];
            hasTwoHandles = true;
        }

        // Создаём слайдер
        noUiSlider.create(slider, {
            start: startValues,
            connect: true,
            step: step,
            range: {
                min: minValue,
                max: maxValue
            },
            connect: hasTwoHandles ? true : [true, false], // заполнение слева для одного бегунка
        });

        // Определяем, какие input'ы использовать
        const inputs = hasTwoHandles
            ? [inputMin, inputMax]
            : [null, inputMax || inputMin]; // для одного бегунка — только один input (например, max)

        // Обновление input'ов при движении слайдера
        slider.noUiSlider.on('update', function (values, handle) {
            const value = Math.round(+values[handle]);

            if (hasTwoHandles) {
                if (handle === 0 && inputMin) {
                    inputMin.value = formatNumber(value);
                    if (fromPriceInput) fromPriceInput.value = value;
                }
                if (handle === 1 && inputMax) {
                    inputMax.value = formatNumber(value);
                    if (toPriceInput) toPriceInput.value = value;
                }
            } else {
                // Один бегунок → только max (или основное значение)
                if (inputMax) {
                    inputMax.value = formatNumber(value);
                }
                if (toPriceInput) {
                    toPriceInput.value = value; // чистое число
                }
                // fromPriceInput можно оставить 0 или не трогать
                if (fromPriceInput) {
                    fromPriceInput.value = minValue; // или 0
                }
            }
        });

        // === ВВОД С КЛАВИАТУРЫ ===
        if (hasTwoHandles) {
            inputMin?.addEventListener('change', function () {
                const val = Number(this.value.replace(/\D/g, '')) || minValue;
                slider.noUiSlider.set([val, null]);
            });
            inputMax?.addEventListener('change', function () {
                const val = Number(this.value.replace(/\D/g, '')) || maxValue;
                slider.noUiSlider.set([null, val]);
            });
        } else {
            inputMax?.addEventListener('change', function () {
                const rawValue = this.value.replace(/\D/g, '');
                const val = Number(rawValue) || minValue;
                if (val >= minValue && val <= maxValue) {
                    slider.noUiSlider.set(val);
                }
            });
        }
    });
}