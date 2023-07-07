
const step = document.querySelectorAll('.page__step');
const submit =document.getElementById('submit');
const submitForm =document.getElementById('submitForm');
let answers = [];

//Скрываем шаг
function addHidden(event) {
	event.classList.add('hidden');
}

//Показываем шаг
function removeHidden(event) {
	event.classList.remove('hidden');
}

//Проверяем существование шага
if (step) {
	for (let i=0; i < step.length; i++) {
		console.log("=====================================");
		console.log("Шаг "+ step[i].className + " index " + i);
 
		//Номер шага
		const stepNumber = step[i].querySelector("#indexStep");
		const stepAll = step[i].querySelector("#indexAllStep");
		if (stepNumber && stepAll) {
			const indexStep = i + 1;
			//Так как в конце экран удачной отправки, который не является шагом, то количество уменьшаем на один
			const indexAllStep = step.length - 1;

			stepNumber.innerHTML = indexStep;
			stepAll.innerHTML = "/" + indexAllStep;		
			console.log("Шаг номер " + indexStep + " из " + indexAllStep);
		}

		//Проверяем существование Далее
		if(step[i].querySelector('.button-next')) {
			const buttonNext = step[i].querySelector('.button-next');
			console.log("Кнопка " + buttonNext.innerText + " index " + i);

			//Нажали на Далее
			buttonNext.addEventListener('click', 
			function clickButtonNext(event) {
				console.log("Вы нажали на "+ buttonNext.innerText + " index " + i);
				event.preventDefault();
				addHidden(step[i]);
				removeHidden(step[i+1]);
				console.log("Массив ответов "+ answers.length + " Ответы "+ answers);
			});

			//Проверяем существование Назад
			if (step[i].querySelector('.button-prev')) {
				const buttonPrev = step[i].querySelector('.button-prev');
				console.log("Кнопка " + buttonPrev.innerText + " index " + i);

				//Нажали на Назад
				buttonPrev.addEventListener('click', 
				function clickButtonNext(event) {
					console.log("Вы нажали на "+ buttonPrev.innerText + " index " + i);
					event.preventDefault();
					addHidden(step[i]);
					removeHidden(step[i-1]);
				});
			}

			//Проверяем наличие radioButton
			if (step[i].querySelector('.checkbox__input')) {
				const radioButton = step[i].querySelectorAll('.checkbox__input');
				//const radioButton = step[i].querySelector('.checkbox__input');
				console.log("Тут радио " + step[i].className + " всего радио " + radioButton.length);

				//Находим нужный radioButton
				for (let j=0; j < radioButton.length; j++) {
					radioButton[j].addEventListener('click', 
					function clickRadioButton(event) { 
						const chosedRadioButtonBody = radioButton[j].closest('.checkbox');
						const chosedText = chosedRadioButtonBody.querySelector('.checkbox__text').innerHTML;

						//Записываем ответ
						answers[i] = chosedText;
						console.log("Шаг "+ step[i].className + " вы нажали на " + radioButton[j].id + " текст спана " + chosedText + " сам ответ " + answers[i]);

						//Включаем кнопку
						buttonNext.disabled = false;
						//Автонажатие на кнопку
						buttonNext.click();
					});
				}
			} 

			//Проверяем наличие select
			if (step[i].querySelector('.quiz-body__select')) {
				const select = step[i].querySelector('.quiz-body__select');
				console.log("Тут селект "+ step[i].className);
				
				//Записываем значение селекта
				select.addEventListener('click', function () {
				    const selectOption = this;

				    answers[i] = selectOption.options[selectOption.selectedIndex].text;
				    console.log("Шаг "+ step[i].className + " текущий выбор в селекте "+ answers[i]);

				    //Включаем кнопку
					buttonNext.disabled = false;
				});
			}
		}
	}
}

//Получение ответов
function takeFormAnswers() {
	const sectionCurrent = submit.closest('section');
	const sectionLast = sectionCurrent.nextElementSibling;

	//event.preventDefault();

	alert("Вы выбрали "+ answers);
	console.log("Вы выбрали "+ answers);

	addHidden(sectionCurrent);
	removeHidden(sectionLast);
}
"use strict"

document.addEventListener('DOMContentLoaded', function() {
	//Присваиваем весь объект form по id для перехвата отправки
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);
	let errorText;

	async function formSend(e) {
		e.preventDefault();

		//Валидация
		let error = formValidate(form);
		let formData = new FormData(form);

		//Отправка формы
		if(error === 0) {
			takeFormAnswers();
			form.classList.add('sending');
			/*
			const  url = '../php/sendmail.php';
			let response = await fetch(url, {
				method: 'POST',
				body: formData
			});
			if(response.ok) {
				let result = await response.json();
				alert(result.message);
				formPreview.innerHTML = '';
				form.reset();

				takeFormAnswers();
				form.classList.remove('sending');

			} else {
				alert('Ошибка отправки');
				form.classList.remove('sending');
			}
			*/
		} else {
			alert(errorText);
		}
	}

	function formValidate(form) {
		let error = 0;
		//Все классы с обязательным полем
		let formReq = document.querySelectorAll('.req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);


			if (input.value != '') {
				if(input.classList.contains('email')) {
					if(emailTest(input)){
						formAddError(input);
						errorText = 'E-mail введён некорректно';
						error++;
					}
				} 
			} else {
				formAddError(input);
				errorText = 'Заполните обязательные поля';
				error++;
			}
		}
		return error;
	}

	function formAddError(input) {
		input.parentElement.classList.add('error');
		input.classList.add('error');
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove('error');
		input.classList.remove('error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});