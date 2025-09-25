
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
$( function() {
    var dateFormat = "mm/dd/yy",
    	from = $( "#datefrom" )
	        .datepicker({
				minDate: 0,
	        	defaultDate: "+1w",
	        	changeMonth: true,
	        	numberOfMonths: 2
	        })
	        .on( "change", function() {
	        	to.datepicker( "option", "minDate", getDate( this ) );
	        }),
    	to = $( "#dateto" ).datepicker({
			minDate: 0,
	        defaultDate: "+1w",
	        changeMonth: true,
	        numberOfMonths: 2
    	})
    	.on( "change", function() {
        	from.datepicker( "option", "maxDate", getDate( this ) );
    	});
 
    function getDate( element ) {
    	var date;
    	try {
        	date = $.datepicker.parseDate( dateFormat, element.value );
    	} catch( error ) {
        	date = null;
    	} 
    	return date;
    }
});
//toggle======================================================================================================================================================
document.addEventListener("click", function (e) {
	if(e.target.matches("[data-toggle-id]") || e.target.closest("[data-toggle-id]")) {
		let toggleButton = e.target.closest("[data-toggle-id]");
		let itemID = toggleButton.dataset.toggleId;
		toggleButton.classList.toggle("active");
		document.getElementById(itemID).classList.toggle("active");
	}
});

//FORMS====================================================================================================================================================================================
function formValidate(input){
	var er = 0;
	var form = input.closest('form');
	if(input.attr('name')=='email' || input.hasClass('email')){
		if(input.val()!=input.attr('data-value')){
			var em=input.val().replace(" ","");
			input.val(em);
		}
		if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.val())) || input.val()==input.attr('data-value')){
			er++;
			addError(input);
		}else{
			removeError(input);
		}
	}else{
		if(input.val()=='' || input.attr('data-value')){
			er++;
			addError(input);
		}else{
			removeError(input);
		}
	}
	if(input.attr('type')=='checkbox'){
		if(input.checked){
			input.removeClass('err').parent().removeClass('err');
		}else{
			er++;
			input.addClass('err').parent().addClass('err');
		}
	}
	if(input.hasClass('name')){
		if(!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))){
			er++;
			addError(input);
		}
	}
	return er;
}

function addError(input) {
	input.addClass('err');
	input.parent().addClass('err');
	input.parent().find('.form__error').remove();
	if(input.hasClass('email')){
		var error='';
		if(input.val()=='' || input.val()==input.attr('data-value')){
			error=input.data('error');
		}else{
			error=input.data('error');
		}
		if(error!=null){
			input.parent().append('<div class="form__error">'+error+'</div>');
		}
	}else{
		if(input.data('error')!=null && input.parent().find('.form__error').lenght==0){
			input.parent().append('<div class="form__error">'+input.data('error')+'</div>');
		}
	}
	if(input.parents('.select-block').lenght>0){
		input.parents('.select-block').parent().addClass('err');
		input.parents('.select-block').find('.select').addClass('err');
	}
}

function removeError(input) {

}