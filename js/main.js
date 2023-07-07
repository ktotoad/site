
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

	if (document.querySelector('.slider-portfolio')) {
		new Swiper('.slider-portfolio', {
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			autoHeight: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			speed: 800,
			navigation: {
				nextEl: '.portfolio__arrow.swiper-button-next',
				prevEl: '.portfolio__arrow.swiper-button-prev',
			},
		});
	}
}
initSliders();
//ibg============================================================================================================
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
$(function() {
    $(window).scroll(function() {
        if($(this).scrollTop() != 0) {
            $('#topNubex').fadeIn();
        } else {
            $('#topNubex').fadeOut();
        }
    });
    $('#topNubex').click(function() {
        $('body,html').animate({scrollTop:0},700);
    });
});
//Scroll=====================================================================================================================================================
$('.goto').on('click', function() {
	  	var el = $(this);
	  	var dest = el.attr('href'); // получаем направление
	if (dest !== undefined && dest !== '') { // проверяем существование
	    $('html').animate({
	        scrollTop: $(dest).offset().top // прокручиваем страницу к требуемому элементу
	    }, 500 // скорость прокрутки
	    );
	}
	return false;
});
//Language================================================================================================================================================
let rus = {
  home: 'Главная',
  portfolio: 'Портфолио',
  now: 'Сейчас в работе',

  about: 'Обо мне',
  skills: 'Навыки',

  hello: 'Привет, Я Деушев Алексей',
  information: 'Frontend-разработчик и веб-верстальщик',
  more: 'Узнать больше',

  info_1: 'Разрабатываю адаптивную верстку на основе макетов для ПК, что существенно экономит Ваш бюджет и не требует заказа дополнительных макетов дизайна.',
  info_2: 'По итогу выполнения работы Вы получите готовый архив со всеми исходными файлами.',
  info_3: 'После принятия Вами работы, в случае, если Вы обнаружите ошибки в верстке, исправлю всё абсолютно бесплатно.',

  profile: 'Профиль',
  profile_main: 'Front-end разработчик',
  design: 'UI дизайн',
  tools: 'Cредства',

  view: 'Увидеть больше',
  info_4: 'Здесь Вы можете увидеть несколько моих работ. Перейдите по ссылке, чтобы увидеть ещё больше.',

  works: 'Мои работы',
  one_page: 'Одностраничные сайты',
  many_page: 'Многостраничные сайты',

  clothing_store: 'Магазин одежды',
  store_main: '1. Главная',
  store_catalog: '2. Каталог',
  store_personal : '3. Страница ЛК',
  store_set: '4. Настройки ЛК',
  store_orders: '5. Заказы ЛК',
  store_order: '6. Заказ ЛК',
  
  sport_store: 'Спортивный магазин',
  sport_store_empty_cart: "2. Пустая корзина",
  sport_store_about: "3. О нас",
  sport_store_registration: "4. Регистрация",
  sport_store_cart: "5. Корзина",
  sport_store_product: "6. Товар",
  sport_store_catalog: "7. Каталог",
  sport_store_enter: "8. Вход",

};

let eng = {
  home: 'Home',
  portfolio: 'Portfolio',
  now: 'At work',

  about: 'About me',
  skills: 'Skills',

  hello: 'Hi, I\'m Alexey Deushev',
  information: 'Frontend-developer and web designer',
  more: 'Learn more',

  info_1: 'I develop adaptive layout based on PC layouts, which significantly saves your budget and does not require ordering additional design layouts.',
  info_2: 'You will receive a ready-made archive with all source files as a result of the work, ',
  info_3: 'If you find any errors in the layout after acception of the work, I will correct everything absolutely free of charge.',

  profile: 'Profile',
  profile_main: 'Front-end Developer',
  design: 'UI Design',
  tools: 'Tools',

  view: 'View all',
  info_4: 'Here you can see some of my works. Follow the link to see even more.',

  works: 'My works',
  one_page: 'One page websites',
  many_page: 'Multipage websites',

  clothing_store: 'Clothing store',
  store_main: '1. Main',
  store_catalog: '2. Catalog',
  store_personal : '3. Personal page',
  store_set: '4. Settings',
  store_orders: '5. Orders',
  store_order: '6. Order',
  
  sport_store: 'Sport store',
  sport_store_empty_cart: "2. Empty cart",
  sport_store_about: "3. About us",
  sport_store_registration: "4. Registration",
  sport_store_cart: "5. Cart",
  sport_store_product: "6. Product",
  sport_store_catalog: "7. Catalog",
  sport_store_enter: "8. Enter",
};

changeLagnuage();

function changeLagnuage(){
  let language = lang.checked ? eng : rus;
  document.querySelectorAll('[text]').forEach(el => {
    el.innerHTML = language[el.getAttribute('text')];
  })
}