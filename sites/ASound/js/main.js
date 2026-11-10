
/*Loading================================================================================*/
let wrapper = document.querySelector('.wrapper');

if (document.querySelector(".preloader")) {
    let tl = gsap.timeline(),
        loader = document.querySelector('.preloader'),
        body = document.querySelector("body");
    
    body.classList.add("lock");

    setTimeout(() => {
        body.classList.remove("lock");
    }, 2e3),
    setTimeout(() => {
        loader.classList.add("hidden");
        tl.to(".preloader-body__logo-light", { clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)", duration: 0.1, delay: 0 });
    }, 1e3),
    (function (body, loader) {
        let loading = 0,
        i = setInterval(() => {
            (document.querySelector(".preloader-body__logo-light").style.width = ++loading + "%"),
            (document.querySelector(".preloader-body__percents").innerHTML = ++loading + "%"), 100 === loading && clearInterval(i);
        }, 20);
    })();

    wrapper.classList.add('loaded');

    animateall();
} else {
    animateall();
}
//burger=====================================================================================================================================================
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.header__body');
const body = document.querySelector('body');

if (iconMenu) {
	iconMenu.addEventListener('click', function(e) {
		burgerFunc();
	});
	menuBody.addEventListener('click', function(e) {
		if(menuBody.classList.contains("active")){
			burgerFunc();
		}
	});
}

function burgerFunc() {
	iconMenu.classList.toggle('active');
	menuBody.classList.toggle('active');
	body.classList.toggle('lock');
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

"use strict";
function DynamicAdapt(type) {
	this.type = type;
}
DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");
	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];
		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		//for (let i = 0; i < оbjects.length; i++) {
		for (let i = оbjects.length - 1; i >= 0; i--) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};
// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new DynamicAdapt("max");
da.init();
//fixed_main==================================================================================================================================================================================================================
let header = document.querySelector("header");
window.addEventListener("scroll", function(){
	if(window.scrollY > 100){
    	header.classList.add('fixed');
	}
	else{
	    header.classList.remove('fixed');
	}
});
//video=================================================================================================================================
let mainBody = document.querySelector('body');
let closeButton = document.getElementById('fade');
let currentPopup;

window.document.onkeydown = function(e) {
    if (!e) {
        e = event;
    }
    if (e.keyCode == 27) {
        lightbox_close();
    }
}

function lightbox_open(videoid) {
    var lightBoxVideo = videoid;
    currentPopup = videoid.closest('.popup-video');

    currentPopup.closest('.popup-video').classList.add("open");
    closeButton.style.display = 'block';
    mainBody.classList.add('lock');
    lightBoxVideo.play();
}

function lightbox_close() {
    currentPopup.classList.remove("open");
    closeButton.style.display = 'none';
    mainBody.classList.remove('lock');
    currentPopup.querySelector("video").pause();
}
/*Animation================================================================================*/
function animateall() {
	if(document.querySelector('[anim-item]')) {
		const animItems = document.querySelectorAll('[anim-item]');
		if (animItems.length > 0) {
			window.addEventListener('scroll', animOnScroll);
			function animOnScroll(params) {
				for (let index = 0; index < animItems.length; index++) {
					const animItem = animItems[index];
					const animItemHeight = animItem.offsetHeight;
					const animItemOffset = offset(animItem).top;
					const animStart = 10;

					let animItemPoint = window.innerHeight - animItemHeight /animStart;
					if (animItemHeight > window.innerHeight) {
						animItemPoint = window.innerHeight - window.innerHeight / animStart;
					}

					if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
						animItem.classList.add('active');
					} else {
						if (animItem.getAttribute('anim-item') != "nohide") {
							animItem.classList.remove('active');
						}
					}
				}
			}
			function offset(el) {
				const rect = el.getBoundingClientRect(),
					scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
					scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
			}

			setTimeout(() => {
				animOnScroll();
			}, 300);
		}
	}
};
//audio_player==================================================================================================================================================
if(document.getElementById('audioplayer')) {
    const mainPlayBtn = document.querySelector('.fullscreen-page__button');
	const audioplayer = document.getElementById('audioplayer');
	const audio = audioplayer.querySelector('#audio');
	const source = audio.querySelector('#source');
    const playBtn = audioplayer.querySelector('#playBtn');
    const progress = audioplayer.querySelector('#waveform');
    const timeEl = audioplayer.querySelector('#time');
    const titleEl = audioplayer.querySelector('#title');
    const artistEl = audioplayer.querySelector('#artist');

    // Генерируем случайные данные волны (в реальности тут будут реальные данные)
    const barsCount = 100;
    const waveformData = generateWaveformData(barsCount);

    let isPlaying = false;    

    // Play
    playBtn.addEventListener('click', function () {
        if (!audio.src) return;

        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶';
        } else {
            audio.play();
            playBtn.textContent = '⏸';
        }
        isPlaying = !isPlaying;
    });

    mainPlayBtn.addEventListener('click', function () {
        if (!audio.src) return;
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸';
        audioplayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Конец трека
    audio.addEventListener('ended', function() {
        isPlaying = false;
        playBtn.textContent = '▶';
        progressFill.style.width = '0%';
    });
    
    // Создаём полоски
    waveformData.forEach((height, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = height + '%';
        bar.dataset.index = index;
        waveform.appendChild(bar);
    });

    const bars = waveform.querySelectorAll('.bar');
    
    // ========== Обновление времени и waveform ==========
	audio.addEventListener('timeupdate', () => {
	    if (!audio.duration) return;

	    // Текущее время
	    timeEl.textContent = formatTime(audio.currentTime);

	    // Подсветка полосок
	    const percent = audio.currentTime / audio.duration;
	    const activeIndex = Math.floor(percent * barsCount);

	    bars.forEach((bar, index) => {
	        if (index <= activeIndex) {
	            bar.classList.add('active');
	        } else {
	            bar.classList.remove('active');
	        }
	    });
	});

    // ========== Клик по waveform для перемотки ==========
	progress.addEventListener('click', (e) => {
	    if (!audio.duration) return;

	    const rect = progress.getBoundingClientRect();
	    const clickX = e.clientX - rect.left;
	    const percent = clickX / rect.width;

	    audio.currentTime = percent * audio.duration;
	});

    //скролл плеера
    const initialTopOffset = audioplayer.offsetTop; 
    window.addEventListener('scroll', () => {
        const sectionRect = audioplayer.closest("section").getBoundingClientRect();
        if (window.scrollY >= audioplayer.closest("section").offsetTop) {
            if (sectionRect.top <= -initialTopOffset) {
                audioplayer.classList.add('fixed');
            } else {
                audioplayer.classList.remove('fixed');
            }
        }
    });

	// ========== Форматирование времени ==========
	function formatTime(seconds) {
	    if (isNaN(seconds)) return '0:00';
	    const mins = Math.floor(seconds / 60);
	    const secs = Math.floor(seconds % 60);
	    return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

    // Генерация фейковых данных волны
    function generateWaveformData(count) {
        const data = [];
        for (let i = 0; i < count; i++) {
            // Имитация волны с пиками и спадами
            const base = Math.sin(i * 0.2) * 30 + 50;
            const noise = Math.random() * 20;
            data.push(Math.min(100, base + noise));
        }
        return data;
    }
}
