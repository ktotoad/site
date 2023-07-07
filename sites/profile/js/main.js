
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

//burger=====================================================================================================================================================

$('.wrapper').addClass('loaded');

$(document).ready(function(){
	$('.icon-menu').click(function(event) {
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});
});

//Adaptive functions
$(window).resize(function(event) {
	adaptive_function();
});
function adaptive_header(w,h) {
		var headerMenu=$('.menu__body');
		var headerLang=$('.person__language');
	if(w<479){
		if(!headerLang.hasClass('done')){
			headerLang.addClass('done').appendTo(headerMenu);
		}
	}else{
		if(headerLang.hasClass('done')){
			headerLang.removeClass('done').appendTo('.person__lang-box');
		}
	}
}
function adaptive_function() {
		var w=$(window).outerWidth();
		var h=$(window).outerHeight();
	adaptive_header(w,h);
}
	adaptive_function();
//Language================================================================================================================================================
let rus = {
  home: 'Главная',
  about: 'Обо мне',
  skills: 'Навыки',
  portfolio: 'Портфолио',
  contacts: 'Контакты',
  name: 'Новик Денис',
  job_title: 'UX | UI дизайнер',
  information: '24 года, Минск',
  hello: 'Примет, Я Денис – UX/UI дизайнер из Минска.',
  interested: 'Меня интересует дизайн и всё, что с ним связано.',
  studying: 'Я изучаю курсы "Интерфейсы веб-дизайна и мобильного',
  academy: 'дизайна" в IT академиях.',
  projects: 'Готов реализовать отличные проекты',
  people: 'с замечательными людьми.',
  programs: 'Для работы я использую такие программы как',
  question: 'Хотите знать больше или пообщаться?',
  welcome: 'Добро пожаловать!',
  message: 'Отправить сообщение',
  follow: 'Я на',
  contact: 'Свяжитесь со мной',
  mail: 'Ваш E-mail',
  text: 'Напишите мне!',
};

let eng = {
  home: 'Home',
  about: 'About me',
  skills: 'Skills',
  portfolio: 'Portfolio',
  contacts: 'Contacts',
  name: 'Denis Novik',
  job_title: 'UX | UI designer',
  information: '24 years old, Minsk',
  hello: 'Hi, I\'m Denis – UX/UI designer from Minsk.',
  interested: 'I\'m interested in design and everything connected with it.',
  studying: 'I\'m studying at courses "Web and mobile design',
  academy: 'interfaces" in IT-Academy.',
  projects: 'Ready to implement excellent projects',
  people: 'with wonderful people.',
  programs: 'I work in such programs as',
  question: 'Want to know more or just chat?',
  welcome: 'You are welcome!',
  message: 'Send message',
  follow: 'Like me on',
  contact: 'Contact with me',
  mail: 'Your E-mail',
  text: 'Text me something!',
};

changeLagnuage();

function changeLagnuage(){
  let language = lang.checked ? rus : eng;
  document.querySelectorAll('[text]').forEach(el => {
    el.innerHTML = language[el.getAttribute('text')];
  })
}
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
