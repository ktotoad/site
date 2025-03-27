//////////////////////////////////////////////////////////////////////
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
//////////////////////////////////////////////////////////////////////
var userGeneral={};                // общие настройки
var userCourses={};                // настройки книг и результатов обучения
                                   // ключ: идентификатор книги
var book=null;                     // настройки текущей книги для текущего пользователя
var bookSettings=                  // настройки текущей главы для текущего пользователя, которые не сохраняются в storage
  {
    allowChapters:[],              // массив глав, на которые разрешен переход (пустая строка - можно на все)
    firstAuthorContent:"",         // данные первого автора
  }
var maxPageNum=0;                  // максимальный номер страницы
var prevPageNum=0;                 // номер предыдущей страницы
var cardBodyContext="";            // контекст главы
var elemCardBody=null;             // элемент страницы, который содержит текст главы
var curChapterId="";               // идентификатор текущей главы
var isStationar=!isMobileDevice(); // признак работы на стационарном (не мобильном) устройстве
var currTestMode=false;            // признак режима тестирования на текущей странице
var nextTestMode=false;            // признак режима тестирования на следующей странице
var isPreview = false;             // Режим предварительного просмотра

// Результаты тестов/курса - ссылается на book.testres
// Структура результатов:
// testres = {
//   tests = { // результаты тестов
//     "идентификатор_теста1": { результаты теста 1 },
//     ...
//     "идентификатор_тестаN": { результаты теста N }
//   },
//   kurs = { // результаты курса в целом
//   }
// };
var testres = null;

//////////////////////////////////////////////////////////////////////
// ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ (НЕ должна входить ни в одну функцию!)
//////////////////////////////////////////////////////////////////////
// загрузка настроек - должна выполняться самой первой
loadParams();
// подключение обработчиков событий
window.addEventListener("hashchange",onWindowHashChange,false);
window.addEventListener("scroll",onWindowScroll,false);
// отключаем стандартный поиск ctrl+f
window.addEventListener("keydown",function (e)
{
  if (e.keyCode===114 || (e.ctrlKey && e.keyCode===70))
  {
    var search_box=document.getElementById("search_box");
    if (search_box)
    {
      e.preventDefault();
      search_box.focus();
    }
  }
});
// запрет обработки событий
document.oncopy=protectPage;
document.oncontextmenu=protectPage;

//////////////////////////////////////////////////////////////////////
// ИНИЦИАЛИЗАЦИЯ
//////////////////////////////////////////////////////////////////////
function initBook(initData)
{
  book.title = initData.title;
  book.bookId = initData.bookId;
  // идентификатор книги и отметка времени (проверяется только вместе с идентификатором книги)
  if (initData.bookId)
  {
    let clear=false;
    if (book.settings.bookId!=initData.bookId)
    {
      // изменился идентификатор книги
      book.settings.bookId=initData.bookId;
      if (initData.timestamp)
        book.settings.timestamp=initData.timestamp;
      else
        book.settings.timestamp=initTimeStamp;
      clear=true;
    }
    else if (initData.timestamp && book.settings.timestamp!=initData.timestamp)
    {
      // изменилась временная метка при том же идентификаторе книги
      book.settings.timestamp=initData.timestamp;
      clear=true;
    }
    if (clear)
    {
      // очистка данных при загрузке книги с другим идентификатором / временной меткой
      book.chapters={};
      book.bookMarks={};
      book.notes={};
      book.curDifficulty=3;
      userGeneral.lastChapterId="";
    }
  }
  // данные глав
  if (initData.chapters && initData.chapters instanceof Array)
  {
    for (var i=0;i<initData.chapters.length;i++)
      addChapter(initData.chapters[i]);
  }
  // данные первого автора
  // ФИО и описание разделяются символом #
  if (initData.author)
  {
    var arr=initData.author.split("#",2);
    bookSettings.firstAuthorContent="<b>Об авторе</b>";
    if (arr.length > 0) {
      bookSettings.firstAuthorContent += "<br>" + arr[0]; // ФИО
    }
    if (arr.length > 1) {
      bookSettings.firstAuthorContent += "<br><br>" + arr[1]; // Описание
    }
  }
  else bookSettings.firstAuthorContent="";
  // минимальное время изучения главы (в мс)
  if (initData.minTime)
    book.settings.minTime=Number(initData.minTime);
  else
    book.settings.minTime=0;
  // главы, на которые разрешен переход
  if (initData.allowChapters) bookSettings.allowChapters=initData.allowChapters.split(";");
  if (initData.nocopy) {
    book.nocopy = Number(initData.nocopy);
  }
  else {
    book.nocopy = 1; 
  }
  // сохранение настроек
  saveGeneralParams();
  saveCoursesParams();
}

function setNextTestMode(value)
{
  nextTestMode=value;
}

//////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИКИ СОБЫТИЙ
//////////////////////////////////////////////////////////////////////
function generalLoad()
{
  // инициализация глобальных переменных
  maxPageNum=0;
  elemCardBody=null;
  // скрытие элементов, работающих только на мобильных устройствах
  if (isStationar)
  {
    elem=document.getElementById("night_mode");
    if (elem) elem.style.display="none";
  }
  // предобработка элементов всего документа
  processingAllPageElements();
  // применение параметров настройки к документу
  elem=document.getElementById("night_mode_id"); // ночной режим
  if (elem)
  {
    elem.checked=userGeneral.isNight;
    setNightMode();
  }
  elem=document.getElementById("scale_box_id");  // масштабирование
  if (elem)
  {
    elem.value=userGeneral.zoom;
    onZoomChange();
  }
  showTabOfCont();                               // показ/скрытие оглавления
  elem=document.getElementById("difficulty");    // фильтр по уровню сложности
  if (elem)
  {
    elem.value=book.curDifficulty;
    setDifficulty();
  }
}

function onWindowLoad()
// для страниц книги
{
  var elem,elems,i,n;
  generalLoad();
  // инициализация глобальных переменных
  currTestMode=false;
  elemCardBody = document.getElementById("xbody");
  // идентификатор текущей главы
  if (typeof selChapterId !== "undefined")
    curChapterId=selChapterId;
  else
    curChapterId=nodeIdFromURL(window.location.pathname);
  // текущая открытая страница в книге
  userGeneral.lastChapterId=curChapterId;
  saveGeneralParams();
  // разбор параметров
  var params=getURLParams();
  // действия с контентом страницы
  if (elemCardBody)
  {
    let el = document.getElementsByTagName("xhtml");
    if (!el.length) {
      let el2 = document.getElementById("contentCard");
      if (el2) {
        el2.style.height = "100%";
      }
      let el3 = document.getElementById("cbody");
      if (el3) {
        el3.style.height = "100%";
      }
    }
    // запомнить содержимое главы для показа по страницам
    cardBodyContext=elemCardBody.innerHTML;
    // определить максимальный номер страницы
    elems=elemCardBody.querySelectorAll("[id^=pagenum]");
    for(i=0;i<elems.length;i++)
    {
      n=Number(elems[i].id.substr(7));
      if (n>maxPageNum) maxPageNum=n;
    }
    elem=document.getElementById('page_box_id');
    if (elem) elem.max=maxPageNum;
    // обработчики событий тача для мобильных устройств
    elemCardBody.addEventListener("touchstart",onCardBodyTouchStart,false);
    elemCardBody.addEventListener("touchend",onCardBodyTouchEnd,false);
    document.addEventListener("click",onCardBodyMouseClick,false);
  }
  else
    cardBodyContext="";
  // переустановка номера страницы
  var pd=getCurPageData();
  if ("pagenum" in params)
  {
    // номер указан явно
    switch (params["pagenum"].toLowerCase())
    {
      case "first":
        pd.pagenum=1;
        break;
      case "last":
        pd.pagenum=maxPageNum;
        break;
      default:
        pd.pagenum=Number(params["pagenum"]);
        break;
    }
  }
  else
  {
    // проверка последнего использованного термина
    if (userGeneral.lastTab==TAB_TERMINS && userGeneral.lastItem!="")
    {
      n=getPageNumWithText(userGeneral.lastItem);
      if (n>0) pd.pagenum=n;
    }
  }
  setCurPageData(pd);
  // показ текущей страницы
  goPage();
  // скругление надписи на этикетке
  elem=document.getElementById('overexitdata');
  if (elem) new CircleType(elem).radius(225);
  // установка обработчиков
  elem=document.getElementById("IDFirstAuthor");
  if (elem)
  {
    elem.onmouseover=showAuthor;
    elem.onclick=showAuthor;
    elem.onmouseout=hideAuthor;
  }
  // запуск таймера времени просмотра страницы
  setInterval(onTimer,100);
}

function onWindowLoadTest()
// для вопросов тестов
{
  generalLoad();
  // инициализация глобальных переменных
  currTestMode=true;
  // действия с контентом страницы
  processingPageAudioVideo();
  var elem=document.getElementById("question");
  if (elem) processingPageElements(elem);
  elem=document.getElementById("answers");
  if (elem) processingPageElements(elem);
  // Обновление состояния кнопки перехода к теории
  updateGotoTheoryButton();
}

function onWindowLoadTestStart()
// для стартовой страницы тестов
{
  generalLoad();
  // инициализация глобальных переменных
  currTestMode=false;
  // Обновление состояния кнопки перехода к теории
  updateGotoTheoryButton();
}

// Обновляет состояние кнопки перехода к теории.
// Кнопка скрывается для теста-аттестации и в режиме просмотра.
// Если resultPage = true, то на странице с результатами теста.
function updateGotoTheoryButton(resultPage = false) {
  var elem = document.getElementById("btnGotoTheory");
  if (!elem) {
    return;
  }
  if (isPreview) {
    // В режиме предварительного просмотра из tmaker кнопка неактивна
    elem.disabled = true;
  }
  if (resultPage) {
    // На странице с результатами теста кнопка есть
    return;
  }
  // На странице запуска теста и на странице прохождения теста проверяется тип теста
  var testId = localStorage_getItem(currentTestId);
  var test = getTest(testId);
  if (test.destination == TEST_DEST_EXERCISE) {
    // Для теста-упражнения кнопка есть
    elem.style.visibility = 'visible';
  } else {
    elem.style.visibility = 'hidden';
  }
}

function onWindowLoadTestRes()
// для результатов тестов
{
  generalLoad();
  // инициализация глобальных переменных
  currTestMode=false;
  // текущая открытая страница в книге
  let cid=userGeneral.lastChapterId;
  if (!cid) {
    cid = getFirstChapterId();
  }
  if (cid)
  {
    userGeneral.lastChapterId=cid;
    saveGeneralParams();
  }
}

function onWindowUnload(event)
{
  // сохранение параметров
  saveGeneralParams();
  saveCoursesParams();
}

function onWindowHashChange()
{
  window.location.reload();
}

function onWindowScroll()
{
  processingPageAudioVideo();
}

function onTimer()
{
  if (!book || currTestMode) return; // еще не загружены параметры книги или режим тестирования
  var pd=getCurPageData();
  pd.time=pd.time+100;
  if (!pd.visited)
  {
    if (book.settings.minTime>0)
    {
      // проверить истечение времени изучения главы
      if (pd.time>book.settings.minTime) pd.visited=true;
    }
    else
      pd.visited=true;
    if (pd.visited) {
      // Отправить данные (прогресс) изучения курса
      sendCourseProgressData();
    }
  }
  setCurPageData(pd);
}

function protectPage()
{
  return book.nocopy == 0;
}

//очистка элементов страницы
function clearPage()
{
  var elem=document.getElementById('chapterTitle');
  if (elem) elem.innerHTML="";
  elem=document.getElementById('chapterHeader');
  if (elem) elem.innerHTML="";
  elem=document.getElementById('bookHeader');
  if (elem) elem.innerHTML="";
  elem=document.getElementById('cardBody');
  if (elem) elem.innerHTML="";
  elem=document.getElementById('bookFooter');
  if (elem) elem.innerHTML = "";
  elem = document.getElementById("cbody");
  if (elem) elem.style["background"] = "";
}

function onTabChange(event)
{
  if (!event) event=window.event;
  userGeneral.lastTab=event.target.id;
  saveGeneralParams();
  // действия, зависящие от вкладки
  switch (userGeneral.lastTab)
  {
    case TAB_BOOK:
      location.reload();
      break;
    case TAB_TERMINS:
      clearPage();
      break;
    case TAB_AUTHORS:
      clearPage();
      curChapterId="authors";
      break;
  }
}

// увеличение/уменьшение номера страницы
function onPageChange(event)
{
  var elem=document.getElementById('page_box_id');
  if(elem && elem.value!="")
  {
    var n=Number(elem.value)
    if (n<=0) elem.value=1;
    else if (n>maxPageNum) elem.value=maxPageNum;
  }
}

//////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИКИ СОБЫТИЙ КОНТЕКСТА
//////////////////////////////////////////////////////////////////////
var touch_start=0;  // для прокрутки страниц нажатием на экран
var winAuthor=null; // окно с данными автора

function onCardBodyTouchStart()
{
  // получить координаты нажатия
  touch_start=event.changedTouches[0].clientX;
}

function onCardBodyTouchEnd()
{
  var sel=window.getSelection();
  if (String(sel)!="") return; // был выделен текст
  var touch_end=event.changedTouches[0].clientX;
  var delta=touch_end-touch_start;
  // сдвиг
  if (Math.abs(delta)<100) return;
  if (delta<0)
    goNextPage();
  else
    goPrevPage();
  touch_start=0;
}

function onCardBodyMouseClick(event)
{
  if (!event) event=window.event;
  if (event.target.id!="speakBtn") speakStop(); // прекратить воспроизведение текста
}

function showAuthor(event)
{
  if (!winAuthor)
  {
    winAuthor=createModalWindow(false,mmRight,mcNone);
    showModalWindow(winAuthor, bookSettings.firstAuthorContent + "<br>Чтобы записаться на консультацию к преподавателю, щелкните на его фамилии.");
  }
}

function hideAuthor()
{
  if (winAuthor)
  {
    deleteModalWindow(winAuthor);
    winAuthor=null;
  }
}

//////////////////////////////////////////////////////////////////////
// РАБОТА С ХРАНИЛИЩЕМ ПАРАМЕТРОВ
//////////////////////////////////////////////////////////////////////
// Функции работы с локальным хранилищем
function localStorage_getItem(key) {
  return localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
}

function localStorage_setItem(key, value) {
  localStorage.setItem(LOCAL_STORAGE_PREFIX + key, value);
}

function localStorage_removeItem(key) {
  localStorage.removeItem(LOCAL_STORAGE_PREFIX + key);
}

function loadParams()
{
  // восстановить параметры, сохраненные в предыдущем сеансе
  var elem,value,chapterId,key2;
  // загрузка общих настроек
  userGeneral = JSON.parse(localStorage_getItem(sectionGeneralParams));
  if (!userGeneral) userGeneral={};
  if (!userGeneral.lastChapterId) userGeneral.lastChapterId=""; // идентификатор последней открытой главы
  if (!userGeneral.lastTab) userGeneral.lastTab="book-contents-tab"; // идентификатор последней открытой вкладки
  if (!userGeneral.lastItem) userGeneral.lastItem=""; // последний использованный элемент на вкладке
  if (typeof(userGeneral.isTOCVisible)=="undefined") userGeneral.isTOCVisible=true; // признак видимости оглавления
    else if (typeof(userGeneral.isTOCVisible)=="string") userGeneral.isTOCVisible=(userGeneral.isTOCVisible=="true");
  if (typeof(userGeneral.isNight)=="undefined") userGeneral.isNight=false; // признак ночного режима
    else if (typeof(userGeneral.isNight)=="string") userGeneral.isNight=(userGeneral.isNight=="true");
  if (typeof(userGeneral.zoom)=="undefined") userGeneral.zoom=100; // масштаб
    else if (typeof(userGeneral.zoom)=="string") userGeneral.zoom=Number(userGeneral.zoom);
  // загрузка настроек книг
  userCourses = JSON.parse(localStorage_getItem(sectionCoursesParams));
  if (!userCourses) userCourses={};
  // настройки книги
  key2=bookIdent();
  var exist=(key2 in userCourses);
  if (exist)
  {
    book=userCourses[key2];
    if (!book)
    {
      book={}; // на тот случай, если по этому ключу лежит null
      exist=false;
    }
  }
  else
    book={};
  if (!book.settings) // настройки книги, приходящие извне
    book.settings=
    {
      bookId:"",      // идентификатор книги
      timestamp:"",   // временная метка книги (дата и время выгрузки)
      minTime:0,      // минимальное время изучения главы в миллисекундах (0 - не учитывается)
    };
  if (!book.chapters) book.chapters={};   // массив параметров для каждой просмотренной главы
                                          // ключ: идентификатор главы
  if (!book.bookMarks) book.bookMarks={}; // массив закладок для всей книги
                                          // ключ: идентификатор главы
                                          // ключ 2: страница
  if (!book.notes) book.notes={};         // массив заметок для всей книги
                                          // ключ: идентификатор главы
                                          // ключ 2: страница_смещение_длина
  if (!book.testres) book.testres={};
  if (!book.testres.tests) book.testres.tests={}; // результаты прохождения тестов (ключ: идентификатор теста)
  if (!book.testres.kurs) book.testres.kurs={};
  testres=book.testres;
  // заполнение начальных значений
  if (!book.settings.timestamp) book.settings.timestamp=initTimeStamp;
  if (!book.enterDate) book.enterDate=new Date(); //дата первого входа в книгу
  if (!book.curDifficulty) book.curDifficulty=3;  // уровень сложности
  // добавление в массив книг, если книга новая
  if (!exist) userCourses[key2]=book;
  // преобразование типов (потому что localStorage хранит все в виде строк)
  if (typeof book.settings.minTime=="string") book.settings.minTime=Number(book.settings.minTime);
  if (typeof book.enterDate=="string") book.enterDate=new Date(book.enterDate);
  if (typeof book.curDifficulty=="string") book.curDifficulty=Number(book.curDifficulty);
  for (chapterId in book.chapters)
    if (typeof(book.chapters[chapterId].pagenum)=="string") book.chapters[chapterId].pagenum=Number(book.chapters[chapterId].pagenum);
  for (chapterId in book.bookMarks)
    for (key2 in book.bookMarks[chapterId])
      if (typeof(book.bookMarks[chapterId][key2].pagenum)=="string") book.bookMarks[chapterId][key2].pagenum=Number(book.bookMarks[chapterId][key2].pagenum);
  for (chapterId in book.notes)
    for (key2 in book.notes[chapterId])
    {
      if (typeof(book.notes[chapterId][key2].pagenum)=="string") book.notes[chapterId][key2].pagenum=Number(book.notes[chapterId][key2].pagenum);
      if (typeof(book.notes[chapterId][key2].offset)=="string") book.notes[chapterId][key2].offset=Number(book.notes[chapterId][key2].offset);
      if (typeof(book.notes[chapterId][key2].length)=="string") book.notes[chapterId][key2].length=Number(book.notes[chapterId][key2].length);
    }
  // Результаты тестов
  for (let key in testres.tests)
  {
    var tres = testres.tests[key];
    tres.tryCount = Number(tres.tryCount);
    tres.score = Number(tres.score);
    tres.percentnum = Number(tres.percentnum);
  }
}

function saveGeneralParams()
{
  localStorage_setItem(sectionGeneralParams, JSON.stringify(userGeneral));
}

function saveCoursesParams()
{
  if (book)
  {
    book.testres=testres;
    userCourses[bookIdent()]=book;
    // сохранить настройки книг
    localStorage_setItem(sectionCoursesParams, JSON.stringify(userCourses));
  }
}

function restoreLastPage(url)
{
  function onLoadURL(url)
  {
    location.assign(url);
  }

  function onErrorURL(url)
  {
    alert(url+" не существует. Переход не будет выполнен"); // showMessage использовать нельзя!
  }

  if (window.location.protocol.toLowerCase()!="file:")
  {
    // серверный вариант
    let req=new XMLHttpRequest();
    req.open("HEAD",url,false); // асинхронный запрос - так надо!
    req.send();
    // переход при успешном завершении
    if (req.status==200)
    {
      window.location=url;
      return;
    }
    else onErrorURL(url);
  }
  else
  {
    // локальный вариант
    let script=document.createElement('script');
    script.onload = () => onLoadURL(url);
    script.onerror = () => onErrorURL(url);
    script.src=url;
    document.documentElement.appendChild(script);
    script.remove();
  }
}

//////////////////////////////////////////////////////////////////////
// ПЕРЕХОД ПО СТРАНИЦАМ
//////////////////////////////////////////////////////////////////////
function getPageData(chapterId)
{
  if (!(chapterId in book.chapters)) book.chapters[chapterId]={};
  return book.chapters[chapterId];
}

function setPageData(chapterId,pageData)
{
  book.chapters[chapterId]=pageData;
}

function getCurPageData()
{
  return getPageData(curChapterId);
}

function setCurPageData(pageData)
{
  setPageData(curChapterId,pageData);
}

function goPrevPage()
{
  var pd=getCurPageData();
  if (pd.pagenum>1)
  {
    // переход на предыдущую страницу текущей главы
    prevPageNum=pd.pagenum;
    pd.pagenum--;
    setCurPageData(pd);
    goPage();
  }
  else
  {
    // переход на последнюю страницу предыдущей главы
    var cid=getPrevChapterId(curChapterId);
    if (cid!="" && allowTrans(cid)) window.location=cid+".html?pagenum=last";
  }
}

function goNextPage()
{
  var pd=getCurPageData();
  if (pd.pagenum<maxPageNum)
  {
    // переход на следующую страницу текущей главы
    prevPageNum=pd.pagenum;
    pd.pagenum++;
    setCurPageData(pd);
    goPage();
  }
  else
  {
    // переход на первую страницу следующей главы
    var cid=getNextChapterId(curChapterId);
    if (cid!="" && allowTrans(cid)) window.location=cid+".html?pagenum=1";
  }
}

function goPageByNum()
{
  var elem=document.getElementById("page_box_id");
  if (elem)
  {
    var n=Number(elem.value);
    if (n>=1 && n<=maxPageNum)
    {
      var pd=getCurPageData();
      prevPageNum=pd.pagenum;
      pd.pagenum=n;
      setCurPageData(pd);
      goPage();
    }
    else showPageNum();
  }
}

function goPage()
{
  if (!elemCardBody) return;
  var elems,pageB,pageE,i,fn,ext;
  var pd=getCurPageData();
  if (pd.pagenum==0) pd.pagenum=1;
  // отсановить чтение
  speakStop();
  // ищем начало страницы
  pageB=cardBodyContext.indexOf('pagenum'+pd.pagenum);
  if (pageB>=0)
  {
    // страница найдена
    pageB=cardBodyContext.lastIndexOf("<",pageB); // ищем начало тега страницы
    if (pageB<0) pageB=0;
    // ищем конец страницы
    pageE=cardBodyContext.indexOf('pagenum'+(pd.pagenum+1),pageB);
    if (pageE >= 0) {
      // ищем начало тега следующей страницы
      pageE = cardBodyContext.lastIndexOf("<", pageE);
    } else {
      // если следующей страницы нет, берем все до конца
      pageE=cardBodyContext.length;
    }
	elemCardBody.innerHTML = cardBodyContext.substring(pageB, pageE);
    window.scroll(0,0);
  }
  else
  {
    // страница не найдена
    if (pd.pagenum != 1) {
      // остаться на текущей странице
      showMessage("Страница не найдена",mtWarning,3);
      if (prevPageNum!=0) pd.pagenum=prevPageNum;
    }
  }
  setCurPageData(pd); // мог измениться номер текущей страницы
  saveCoursesParams();
  showPageNum();
  processingPageElements(elemCardBody);
  showNotes();
  processingPageAudioVideo();
  // завершающие действия
  prevPageNum=0;
  var search = document.getElementById("search_box");
  var v = localStorage_getItem(lastSearchString);
  if (v != "undefined" && v != null)
  {
    search.value = v;
    markTextInContentBody(elemCardBody, v);
  }
  if (userGeneral.lastTab==TAB_TERMINS && userGeneral.lastItem!="")
    markTextInContentBody(elemCardBody, userGeneral.lastItem);
}

function showPageNum()
{
  var elem=document.getElementById("page_box_id");
  if (elem)
  {
    var pd=getCurPageData();
    elem.value=pd.pagenum;
  }
}

function extIconImg(ext, additionAttributes = "")
// возвращает тег img с иконкой для указанного расширения файла
// в каталоге img должны находиться иконки для расширений
// соответствия иконок и расширений описываются в константе extIcons
// для расширений, у которого нет соответствия, выводится иконка по умолчанию
{
  var icon;
  if (ext in extIcons)
    icon=extIcons[ext];
  else
    icon="document.png";
  return "<img src=\'" + DIR_OFFSET + "../img/" + icon + "'\ width=128 height=128 "+additionAttributes+">";
}

function syncListSizes() {
  const offset = 0.5;
  const imgSize = "15rem";
  let list1 = document.getElementById("matchedList1");
  let list2 = document.getElementById("matchedList2");
  if (list1 && list2) {
    let L1 = list1.children.length;
    let L2 = list2.children.length;
    if (L1 && L2 && L1 === L2) {
      for (let i = 0; i < L1; i++) {
        let element1 = list1.children[i];
        let element2 = list2.children[i];
        setSizes(element1.children);
        setSizes(element2.children);
        let res = checkMedia(element1.children);
        let m1_img = false, m1_par = false;
        if (res === 1) {
          m1_par = res;
        } else if (res === 2) {
          m1_img = res;
        }
        let m2_img = false, m2_par = false;
        res = checkMedia(element2.children);
        if (res === 1) {
          m2_par = res;
        } else if (res === 2) {
          m2_img = res;
        }
        if (m1_img) element1.style.height = imgSize;
        if (m2_img) element2.style.height = imgSize;
        if ((m1_par || m1_img) && !(m2_par || m2_img)) {
          element2.style.height = ((element1.clientHeight + offset) + "px");
        } else if ((m2_par || m2_img) && !(m1_par || m1_img)) {
          element1.style.height = ((element2.clientHeight + offset) + "px");
        } else if ((m1_par || m1_img) && (m2_par || m2_img)) {
          if (m1_par && !m2_par) {
            element2.style.height = ((element1.clientHeight + offset) + "px");
          } else if (!m1_par && m2_par) {
            element1.style.height = ((element2.clientHeight + offset) + "px");
          } else if (m1_img && m2_img) {
            element1.style.height = imgSize;
            element2.style.height = imgSize;
          }
        } else {
          element1.style.height = "100%";
          element2.style.height = "100%";
        }
      }
    }
  }

  function setSizes(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      const element = nodeList[i];
      element.style.width = "auto";
      element.style.height = "100%";
      for (let y = 0; y < element.children.length; y++) {
        const el = element.children[y];
        el.style.width = "auto";
        el.style.height = "100%";
      }
    }
  }

  function checkMedia(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      const element = nodeList[i];
      if (checkParagraph(element)
        || checkNodeTagName(element, 'math')
        || checkNodeTagName(element, 'table')
        || checkNodeTagName(element, 'control')) {
        return 1;
      } else if (checkNodeTagName(element, 'img')
        || checkNodeTagName(element, 'canvas')
        || checkPanorama(element)) {
        return 2;
      }
    }
    return false;
  }

  function checkParagraph(e) {
    return e.className.includes("paragraph");
  }

  function checkNodeTagName(node, tagName) {
    for (let i = 0; i < node.children.length; i++) {
      const element = node.children[i];
      if (element.tagName.toLowerCase() === tagName) {
        return true;
      }
    }
    return false;
  }

  function checkPanorama(node) {
    return node.querySelectorAll('div[content="Panorama"]').length > 0;
  }
}

function processingPageElements(pageElement)
{
  if (!pageElement) return;
  // обработка изображений
  var id, src, n, i, elems, ext, html;
  elems=pageElement.querySelectorAll("img");
  for (i=0;i<elems.length;i++)
  {
    // определение типа изображения
    if (elems[i].getAttribute("filesize") > 0) {
      elems[i].style.cursor = "pointer";
      src = elems[i].src;
      pageB = src.indexOf("data:image/");
      pageE = src.indexOf(";", pageB);
      ext = src.substring(pageB + 11, pageE).toUpperCase();
      switch (ext) {
        case "TIF":
        case "TIFF":
          id = generateId("tiff");
          fn = '<div id="' + id + '"></div>';
          elems[i].outerHTML = fn;
          n = src.indexOf("base64,", pageE);
          showTiffId(id, "", src.substr(n + 7));
          break;
        default:
          // для скрипта галереи
          elems[i].onclick = onImageClick;
          break;
      }
    }
  }
  // обработка сносок
  elems=pageElement.querySelectorAll(".footnote");
  n=0;
  for (i=0;i<elems.length;i++)
  {
    n++;
    elems[i].setAttribute("data-tooltip",elems[i].innerHTML);
    elems[i].classList.add("no_night");
    elems[i].innerHTML="<sup>&nbsp;"+n+"&nbsp;</sup>";
    elems[i].onmousemove=onFoototeShow;
    elems[i].onmouseout=onFoototeHide;
    elems[i].onclick=onFoototeShow;
  }
  // подключение обработчиков для просмотра объектов
  elems=pageElement.querySelectorAll("control");
  for (i=0;i<elems.length;i++)
  {
    // получить имя файла из атрибута filename
    ext=getFileExt(elems[i].attributes["filename"].value);
    fn = DIR_OFFSET + "../media/" + elems[i].id + "." + ext;
    let savefileinweb = "";
    if (
      elems[i].attributes &&
      elems[i].attributes.savefileinweb &&
      elems[i].attributes.savefileinweb.value === "True"
    ) {
      savefileinweb = `filesrc='${fn}'`;
    }
    html = `
    <center>
      <a href='javascript:void(0)' onclick=showDocumentFullScreen('${fn}')>
        ${extIconImg(ext, savefileinweb)}
      </a>
    </center>`;
    // подключить обработчик
    switch (ext.toUpperCase())
    {
      case "DAE":
      case "OBJ":
      case '3DS':
      case 'WRL':
      case 'WRM':
      case 'FBX':
        show3DModel(elems[i],fn,"",1,1,1,1);
        break;
      case 'PDF':
        if (elems[i].innerHTML.indexOf(extIcons[ext]) < 0) {
		  elems[i].innerHTML = html + elems[i].innerHTML;
		}
        elems[i].style.height = "auto";
        break;
      case 'DJVU':
        if (elems[i].innerHTML.indexOf(extIcons[ext]) < 0) {
		  elems[i].innerHTML = html + elems[i].innerHTML;
		}
        elems[i].style.height = "auto";
        break;
      case 'SWF':
        showSwf(elems[i],fn);
        break;
      default:
        var elem=elems[i].querySelector("a");
        if (elem)
        {
          html = "<center>" + extIconImg(ext) + "</center>";
          if (elems[i].innerHTML.indexOf(extIcons[ext]) < 0) {
            elem.innerHTML = html + elem.innerHTML;
		  }
        }
        break;
    }
  }
  // обработка панорам
  elems=pageElement.querySelectorAll('div[content="Panorama"]');
  for (i=0;i<elems.length;i++)
    showPanorama(elems[i]);
  // обработка видео 360
  elems = pageElement.querySelectorAll('div[content="Video360"]');
  for (i = 0; i < elems.length; i++) { 
    let elem = elems[i];
    let autoplay = elem.hasAttribute('autoplay') && (elem.getAttribute('autoplay').toLowerCase() == "true"); 
    let muted = elem.hasAttribute('muted') && (elem.getAttribute('muted').toLowerCase() == "true"); 	
    showVideo360(elems[i], autoplay, muted);
  }
  // обработка iframe - запрет всплывающего меню
  elems=pageElement.querySelectorAll("iframe");
  for (i=0;i<elems.length;i++)
    elems[i].onload=onFrameLoad;
  syncListSizes();
}

function onFrameLoad()
{
  protect(this.contentDocument);
}

function protect(elem)
{
  elem.oncontextmenu=protectPage;
  if (elem.tagName=="IFRAME")
    protect(elem.contentDocument);
  else
  {
    var elems=elem.querySelectorAll("*");
    for (var i=0;i<elems.length;i++)
      protect(elems[i]);
  }
}

function processingPageAudioVideo()
// автозапуск видео/аудио, оказавшихся в области просмотра
{
  var controls=document.querySelectorAll("control");
  for (var i=0;i<controls.length;i++)
  {
    var control=controls[i];
    // проверить установку флага автовоспроизведения
    if (!control.hasAttribute('autoplay') || control.getAttribute('autoplay').toLowerCase()!="true") continue;
    // проверить наличие медиафайла
    var avObj=control.querySelector('video');
    if (!avObj) avObj=control.querySelector('audio');
    if (!avObj) continue; // нет вложенного тега audio или video
    // проверить появление в видимой области экрана
    var tl=getLeftTop(avObj);
    var x1=tl.left;
    var y1=tl.top;
    var x2=x1+avObj.offsetWidth;
    var y2=y1+avObj.offsetHeight;
    var dx=avObj.offsetWidth*0.25;
    var dy=avObj.offsetHeight*0.25;
    var px1=window.pageXOffset;
    var py1=window.pageYOffset;
    var px2=px1+window.innerWidth;
    var py2=py1+window.innerHeight;
    if (inRect(x1+dx,y1+dy,px1,py1,px2,py2) || inRect(x2-dx,y2-dy,px1,py1,px2,py2))
    {
      // если аудио/видеофайл вставлен в самое начало страницы и виден сразу после ее загрузки, при выполнении play() может возникать ошибка
      // "Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first"
      // в современных браузерах реализована схема защиты пользователя от автозапуска звука на странице
      // т.е. воспроизвести аудио или видео со звуком можно только после того, как пользователь провзаимодействовал со страницей
      // (щелкнул мышью, сделал прокрутку, нажал клавишу на клавиатуре)
      // до этого допускается только вопроизведение видео без звука
      if (avObj.paused) avObj.play();
    }
    else
      avObj.pause();
  }
}

function processingAllPageElements()
// обработка всех элементов документа (до разбивки по страницам)
{
  // некоторые элементы не должны обрабатываться ночным режимом:
  // - кнопки инструментальных панелей
  var elems=document.querySelectorAll('button.btn-primary, button.btn-outline-primary, table, div.jumbotron');
  for (var i=0;i<elems.length;i++)
    elems[i].classList.add("no_night");
  // div с классом shape, содержащие изображения, не должны обрабатываться ночным режимом
  // (не объединять с предыдущим - алгоритм отличается)
  var elems=document.querySelectorAll('div.shape img');
  for (var i=0;i<elems.length;i++)
    elems[i].parentElement.classList.add("no_night");
  
//добавление контейнера и скролла вокруг таблицы
  var elems=document.querySelectorAll('table');
  for (var i=0;i<elems.length;i++)
  {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('style','overflow-x: auto;');
    elems[i].parentNode.insertBefore(wrapper,elems[i]);
    wrapper.appendChild(elems[i]);
  }

  // обработка аудио-видео
  // вписываем атрибут muted прямо в тег,
  // потому что установка средствами JavaScript не приводит
  // к автовоспроизведению после загрузки страницы
  var media,mediaStr,str,p;
  var controls = document.querySelectorAll('control');
  for (var i = 0; i < controls.length; i++)
  {
    media=controls[i].querySelector('video');
    if (!media) media=controls[i].querySelector('audio');
    if (!media) continue; // нет вложенного тега audio или video
    str="";
    if (controls[i].hasAttribute('nosound') && controls[i].getAttribute('nosound').toLowerCase()=="true")
      str=str+' muted';
    if (str!="")
    {
      mediaStr=media.outerHTML;
      p=mediaStr.indexOf('>');
      if (p>=0)
      {
        mediaStr=mediaStr.substring(0,p)+str+mediaStr.substr(p);
        media.outerHTML=mediaStr;
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////
// СКРЫТИЕ-ПОКАЗ СОДЕРЖАНИЯ
//////////////////////////////////////////////////////////////////////
function setShowTabOfCont()
{
  userGeneral.isTOCVisible=!userGeneral.isTOCVisible;
  saveGeneralParams();
  showTabOfCont();
}

function showTabOfCont()
{
  var elemTOC=document.getElementById("tab_of_cont");
  var elemTOCBtn=document.getElementById("showTOC");
  var elemContent=document.getElementById("content");
  let elemTitle=document.getElementById("chapterTitle");
  if (!elemTOC || !elemTOCBtn || !elemContent || !elemTitle) return;
  if (userGeneral.isTOCVisible)
  {
    elemTOC.style.display="inherit";
    elemTOCBtn.innerHTML="&#9668;";
    elemTitle.style.display="none";
  }
  else
  {
    elemTOC.style.display="none";
    elemTOCBtn.innerHTML="&#9658;";
    elemTitle.style.display="inherit";
  }
}

//////////////////////////////////////////////////////////////////////
// НОЧНОЙ РЕЖИМ (только для мобильных устройств)
//////////////////////////////////////////////////////////////////////
const classListRules=
[
  {srcTag:"",  srcClass:"jstree-clicked",          destClass:"night_jstree-clicked", destRecursive:false},
  {srcTag:"",  srcClass:"list-group-item-warning", destClass:"night_warn",           destRecursive:false},
  {srcTag:"",  srcClass:"list-group-item-info",    destClass:"night_info",           destRecursive:false},
  {srcTag:"",  srcClass:"jstree-search",           destClass:"night_jstree-search",  destRecursive:false},
  {srcTag:"A", srcClass:"",                        destClass:"night_link",           destRecursive:true},
];

function setNightMode()
{
  if (isStationar) return;
  var elem=document.getElementById("night_mode_id");
  if (!elem) return;
  userGeneral.isNight=elem.checked;
  saveGeneralParams();
  setNightModeElem(document.documentElement);
}

function setNightModeElem(elem)
{
  if (!elem || !elem.classList) return;
  if (elem.classList.contains("no_night") && !elem.classList.contains("disable_no_night")) {
    // для элементов с таким классом и всех их дочерних элементов ночной режим не меняется
    // класс disable_no_night отменяет действие класса no_night
    return;
  }
  let recursive=true;
  if (userGeneral.isNight)
  {
    let found=false;
    for (let i=0;i<classListRules.length;i++)
      if (elem.tagName==classListRules[i]["srcTag"] || elem.classList.contains(classListRules[i]["srcClass"]))
      {
        elem.classList.add(classListRules[i]["destClass"]);
        recursive=classListRules[i]["destRecursive"];
        found=true;
        break;
      }
    if (!found) elem.classList.add("night");
  }
  else
  {
    elem.classList.forEach(function(item,index,arr)
    {
      if (item.substr(0,5)=="night") elem.classList.remove(item);
    });
  }
  if (recursive)
  {
    for (var i=0;i<elem.childNodes.length;i++)
      setNightModeElem(elem.childNodes[i]);
  }
}

//////////////////////////////////////////////////////////////////////
// МАСШТАБИРОВАНИЕ
//////////////////////////////////////////////////////////////////////
function onZoomChange()
{
  var elemR=document.getElementById("scale_box_id");
  if (!elemR) return;
  var zoom=elemR.value+"%";
  document.body.style.zoom=zoom;
  document.body.style.MozTransform="scale("+zoom+")";
  document.body.style.MozTransformOrigin="0 0";
  onWindowScroll(); // чтобы появились кнопки прокрутки
  var elemV=document.getElementById("scale_box_value");
  if (elemV) elemV.value=elemR.value+"%";
  userGeneral.zoom=elemR.value;
  saveGeneralParams();
}

function onZoomInput()
{
  var elemR=document.getElementById("scale_box_id");
  if (!elemR) return;
  var elemV=document.getElementById("scale_box_value");
  if (elemV) elemV.value=elemR.value+"%";
}

//////////////////////////////////////////////////////////////////////
// МОДАЛЬНЫЕ ОКНА
//////////////////////////////////////////////////////////////////////
const mrUndef="";
const mrYes="yes";
const mrNo="no";
const mrOk="ok";
const mrCancel="cancel";

const mwModal="modal";
const mwMessage="message";
const mwConfirm="confirm";
const mwPrompt="prompt";
const mwInput="input";

const mmCenter=0;
const mmLeft=1;
const mmRight=2;
const mmTop=3;
const mmBottom=4;
const mmFullScreen=5;

const mcNone=-1;
const mcExit=0;
const mcX=1;

const mtWarning="w";
const mtError="e";
const mtInformation="i";

var modalResult=-1;
var modalPrompt="";

function createMessageWindow(callbackFunc=null)
{
  var win=createModalWindow(false,mmTop,mcX,callbackFunc);
  win.setAttribute("data-wintype",mwMessage);
  return win;
}

function createConfirmWindow(callbackFunc=null, buttonTextArray=null)
{
  var win=createModalWindow(false,mmTop,mcX,callbackFunc);
  win.setAttribute("data-wintype",mwConfirm);
  var elemData=win.querySelector(".modal_data");
  if (elemData)
  {
    // контейнер для кнопок
    var elem=document.createElement("div");
    elemData.appendChild(elem);
    elem.style.textAlign="center";
    // кнопка подтверждения
    var btn=document.createElement("button");
    elem.appendChild(btn);
    btn.innerHTML = (buttonTextArray && buttonTextArray.length > 0) ? buttonTextArray[0] : "Да";
    btn.className="modal_btn";
    btn.setAttribute("modalResult",mrYes);
    btn.onclick=onCloseModalWindow;
    if (!buttonTextArray || buttonTextArray && buttonTextArray.length > 1) {
      // кнопка отказа
      btn = document.createElement("button");
      elem.appendChild(btn);
      btn.innerHTML = (buttonTextArray && buttonTextArray.length > 1) ? buttonTextArray[1] : "Нет";
      btn.className = "modal_btn";
      btn.setAttribute("modalResult", mrNo);
      btn.onclick = onCloseModalWindow;
    }
  }
  return win;
}

function createInputWindow(password = false, callbackFunc = null, closeresult = mrUndef)
{
  var win = createModalWindow(false, mmTop, mcX, callbackFunc, closeresult);
  win.setAttribute("data-wintype",mwInput);
  var elemData=win.querySelector(".modal_data");
  if (elemData)
  {
    // поле ввода
    var elem=document.createElement("input");
    elemData.appendChild(elem);
    elem.className="modal_input";
    if (password)
      elem.type="password";
    else
      elem.type="text";
    // кнопка подтверждения
    var btn=document.createElement("button");
    elemData.appendChild(btn);
    btn.innerHTML="OK";
    btn.className="modal_btn";
    btn.setAttribute("modalResult",mrOk);
    btn.onclick=onCloseModalWindow;
    // кнопка отмены
    btn=document.createElement("button");
    elemData.appendChild(btn);
    btn.innerHTML="Отмена";
    btn.className="modal_btn";
    btn.setAttribute("modalResult",mrCancel);
    btn.onclick=onCloseModalWindow;
  }
  return win;
}

function createTextareaWindow(callbackFunc=null)
{
  var win=createModalWindow(false,mmCenter,mcExit,callbackFunc);
  win.setAttribute("data-wintype",mwPrompt);
  var elemData=win.querySelector(".modal_data");
  if (elemData)
  {
    // поле ввода
    var elem=document.createElement("textarea");
    elemData.appendChild(elem);
    elem.className="modal_input modal_textarea";
    // кнопка подтверждения
    var btn=document.createElement("button");
    elemData.appendChild(btn);
    btn.innerHTML="OK";
    btn.className="modal_btn";
    btn.setAttribute("modalResult",mrOk);
    btn.onclick=onCloseModalWindow;
    // кнопка отмены
    btn=document.createElement("button");
    elemData.appendChild(btn);
    btn.innerHTML="Отмена";
    btn.className="modal_btn";
    btn.setAttribute("modalResult",mrCancel);
    btn.onclick=onCloseModalWindow;
  }
  return win;
}

function createModalWindow(bkg=false, position = mmCenter, close = mcExit, callbackFunc = null, closeresult = mrUndef)
// создание модального окна
// position - положение окна (см. константы mm*)
// close - стиль кнопки закрытия (см. константы mc*)
// closeresult - modalresult при нажатии на кнопку закрытия 
{
  // главный элемент
  var win=document.createElement("div");
  document.body.appendChild(win);
  win.id=generateId("modal");
  win.className="modal_main";
  // фон
  if (bkg)
  {
    win.classList.add("modal_background");
    win.onclick=onCloseModalWindow;
  }
  // элемент контента
  var elemCont=document.createElement("div");
  win.appendChild(elemCont);
  switch (position)
  {
    case mmLeft:
      className="modal_content_left";
      break;
    case mmRight:
      className="modal_content_right";
      break;
    case mmTop:
      className="modal_content_top";
      break;
    case mmBottom:
      className="modal_content_bottom";
      break;
    case mmFullScreen:
      className="modal_content_fullscreen";
      break;
    default:
      className="modal_content_center";
      break;
  }
  elemCont.className="modal_content "+className;
  // кнопка закрытия
  var btnClose=document.createElement("span");
  elemCont.appendChild(btnClose);
  switch (close)
  {
    case mcNone:
      className="modal_close_none";
      break;
    case mcX:
      className="modal_close_2";
      break;
    default:
      className="modal_close_1";
      break;
  }
  btnClose.className="modal_close "+className;
  btnClose.setAttribute("modalResult", closeresult);
  btnClose.onclick=onCloseModalWindow;
  // элемент содержания
  var elemData=document.createElement("div");
  elemCont.appendChild(elemData);
  elemData.className="modal_data";
  // элемент для сообщения пользователя (нужен, т.к. в modal_data могут быть другие элементы)
  elem=document.createElement("div");
  elemData.appendChild(elem);
  elem.className="modal_user_data";
  // технический элемент
  elem=document.createElement("span");
  win.appendChild(elem);
  elem.style.display="none";
  elem.className="modal_tech"
  elem.onclick=callbackFunc;
  // завершение
  win.setAttribute("data-wintype",mwModal);
  setModalWindowAttributes(win,false,0);
  return win;
}

function setModalWindowAttributes(win,autoDelete,closeTime)
{
  if (win)
  {
    win.setAttribute("data-autodelete",autoDelete);
    win.setAttribute("data-closetime",closeTime);
  }
}

function getModalWindowAttributes(win,autoDelete,closeTime)
{
  if (win)
  {
    return
    {
      autoDelete: (win.getAttribute("data-autodelete")=="true") ? true : false
      closeTime:  win.hasAttribute("data-closetime") ? Number(win.getAttribute("data-closetime")) : 0
    }
  }
  else return null;
}

function onCloseModalWindow(event)
{
  if (!event) event=window.event;
  var btn=event.target;
  if (!btn) return;
  if (!btn.classList.contains("modal_btn") && !btn.classList.contains("modal_close")) return;
  // поиск элемента-окна
  var win=event.target;
  while (win && !win.classList.contains("modal_main"))
    win=win.parentElement;
  if (!win) return;
  // возврат значений
  modalResult=mrUndef;
  if (btn.hasAttribute("modalResult")) modalResult=btn.getAttribute("modalResult");
  switch (win.getAttribute("data-wintype"))
  {
    case mwInput:
    case mwPrompt:
      var elem=win.querySelector(".modal_input");
      if (elem) modalPrompt=elem.value;
      break;
  }
  // закрытие окна
  win.style.display="none";
  if (modalResult != mrCancel) {
    // вызов пользовательской функции
    var elem = win.querySelector(".modal_tech");
    if (elem) {
      elem.click();
    }
  }
  // удаление окна
  if (win.getAttribute("data-autodelete")=="true") deleteModalWindow(win);
}

function showModalWindow(win,content="",value="",callbackFunc=null,closeTime=0)
{
  if (!win) return;
  var elem;
  // применение ночного режима
  elem=win.querySelector(".modal_content");
  if (elem) setNightModeElem(elem);
  // установка пользовательской функции
  if (callbackFunc)
  {
    elem=win.querySelector(".modal_tech");
    if (elem) elem.onclick=callbackFunc;
  }
  // установка контента
  elem=win.querySelector(".modal_user_data");
  if (elem) elem.innerHTML=content;
  // установка значения поля ввода
  var winType=win.getAttribute("data-wintype");
  switch (winType)
  {
    case mwInput:
    case mwPrompt:
      elem=win.querySelector(".modal_input");
      if (elem)
      {
        elem.value=value;
        elem.focus();
      }
      break;
  }
  // запуск таймера закрытия
  var ct=Number(closeTime);
  if (ct==0) ct=Number(win.getAttribute("data-closetime"));
  if (ct!=0) setTimeout(closeModalWindow,ct*1000,win);
  // показ окна
  win.style.display="block";
}

function closeModalWindow(win)
{
  if (win)
  {
    let btn=win.querySelector(".modal_close");
    if (btn) btn.click(); // чтобы сработало событие onCloseModalWindow
  }
}

function deleteModalWindow(win)
{
  if (win && win.id && document.getElementById(win.id)) win.parentElement.removeChild(win);
}

function showMessage(msg,msgType,closeTime=0,callbackFunc=null)
{
  if (msg=="") return;
  let win=createMessageWindow();
  setModalWindowAttributes(win,true,closeTime);
  let message="";
  switch (msgType)
  {
    case mtWarning:
      message="<font color=#FFFF88><b>"+msg+"</b></font>";
      break;
    case mtError:
      message="<font color=red><b>"+msg+"</b></font>";
      break;
    default:
      message=msg;
      break;
  }
  showModalWindow(win,message,'',callbackFunc);
}

function showInformation(msg,closeTime=0,callbackFunc=null)
{
  if (msg=="") return;
  let win=createModalWindow(false);
  setModalWindowAttributes(win,true,closeTime);
  showModalWindow(win,msg,'',callbackFunc);
}

function showConfirmation(quest,callbackFunc=null,buttonTextArray=null,closeTime=0)
{
  if (quest=="") return;
  let win=createConfirmWindow(null,buttonTextArray);
  setModalWindowAttributes(win,true,closeTime);
  showModalWindow(win,quest,"",callbackFunc);
}

function showPrompt(msg,value="",callbackFunc=null)
{
  let win=createTextareaWindow();
  setModalWindowAttributes(win,true,0);
  showModalWindow(win,msg,value,callbackFunc);
}

function showInput(msg, value = "", password = false, callbackFunc = null, closeresult = mrUndef)
// password - включает/выключает режим ввода пароля
{
  let win = createInputWindow(password, null, closeresult);
  setModalWindowAttributes(win,true,0);
  showModalWindow(win,msg,value,callbackFunc);
}

//////////////////////////////////////////////////////////////////////
// ЗАМЕТКИ
//////////////////////////////////////////////////////////////////////
document.write('<div id="tooltip_note" class="no_night"></div>');
document.write('<input id="fileInput" type="file" onchange="processFiles(this.files)" accept=".xml" style="display:none;">');
var noteSelParams,noteTableElement=null,noteChapterId="",noteKey2="";

function createNote()
// создание заметки
{
  noteSelParams=getSelectionParams();
  if (noteSelParams.selStart<0 || noteSelParams.selLength==0)
  {
    showMessage("Выделите текст внутри главы",mtWarning,3);
    return;
  }
  var pd=getCurPageData();
  var key2=pd.pagenum+"_"+noteSelParams.selStart+"_"+noteSelParams.selLength;
  var value="";
  if (book.notes[curChapterId] && book.notes[curChapterId][key2])
    value=book.notes[curChapterId][key2].textNote;
  showPrompt("Заметка",value,createNoteFromWindow);
}

function createNoteFromWindow()
{
  var textNote=modalPrompt;
  if (!textNote) return;
  var pd=getCurPageData();
  noteObj=
    {
      pagenum:pd.pagenum,             // номер страницы
      offset:noteSelParams.selStart,  // смещение выделенного текста
      length:noteSelParams.selLength, // длина выделенного текста
      textNote:textNote,              // текст заметки
    };
  var key2=pd.pagenum+"_"+noteSelParams.selStart+"_"+noteSelParams.selLength;
  if (!book.notes[curChapterId]) book.notes[curChapterId]={};
  book.notes[curChapterId][key2]=noteObj;
  saveCoursesParams();
  setBookmarksNotesMarker(curChapterId);
  showNotes();
}

function deleteNoteInt(chapterId,key2)
// удаление заметки по ключам
{
  if ((chapterId in book.notes) && (key2 in book.notes[chapterId]))
  {
    // заметка существует
    noteChapterId=chapterId;
    noteKey2=key2;
    showConfirmation("Удалить заметку?",deleteNoteConfirm);
  }
}

function deleteNoteConfirm()
{
  if (modalResult!=mrYes) return;
  delete book.notes[noteChapterId][noteKey2];
  if (isEmptyObject(book.notes[noteChapterId]))
    delete book.notes[noteChapterId];
  saveCoursesParams();
  setBookmarksNotesMarker(noteChapterId);
  var elems=document.querySelectorAll("[id='"+noteKey2+"']");
  for (var ind in elems)
    elems[ind].outerHTML=elems[ind].innerHTML;
  // удалить в таблице
  if (noteTableElement)
  {
    // удалить строку в таблице или всю таблицу (если удалены все заметки)
    var elem=null;
    if (isEmptyObject(book.notes))
      elem=noteTableElement.closest("table");
    else
      elem=noteTableElement.closest("tr");
    if (elem)
    {
      elem.parentElement.removeChild(elem);
      noteTableElement=null;
    }
  }
}

function deleteNoteFromList(listElem,chapterId,key2)
// удаление заметки из списка
// listElem - нажатая ссылка
{
  noteTableElement=listElem;
  deleteNoteInt(chapterId,key2);
}

function deleteAllNotesFromList(listElem)
{
  noteTableElement=listElem;
  showConfirmation("Удалить все заметки?",deleteAllNotesConfirm);
}

function deleteAllNotesConfirm()
{
  if (modalResult!=mrYes) return;
  for (var key in book.notes)
  {
    for (var key2 in book.notes[key])
      delete book.notes[key][key2];
    delete book.notes[key];
    setBookmarksNotesMarker(key);
  }
  saveCoursesParams();
  showNotes();
  // удалить таблицу
  if (noteTableElement)
  {
    var elem=noteTableElement.closest("table");
    if (elem)
    {
      elem.parentElement.removeChild(elem);
      noteTableElement=null;
    }
  }
}

function listNotes()
// список заметок
// заметки сортируются по названию главы + номер страницы + смещение
{
  if (isEmptyObject(book.notes))
  {
    showMessage("Заметки отсутствуют",mtInformation,5);
    return;
  }
  var list="<center><font size=6>Заметки</font></center><br><table border style=\"width:100%;\">"+
           "<tr><th style='text-align:center;'>Название раздела (гиперссылка)</th><th style='text-align:center;'>Текст заметки</th><th style='text-align:center;'>Удалить</th></tr>"+
           "<tr><td colspan=2></td><td width=40 valign=top align=center><a href=\"javascript:void(0)\" onclick=\"deleteAllNotesFromList(this)\"><img src=\"" + DIR_OFFSET + "../img/remove-all.png\" height=25 title=\"Удалить все\"></a></td></tr>";
  var obj,pagenum,loc;
  var objList={};
  for (let chapterId in book.notes)
  {
    loc=getChapterName(chapterId);
    for (let key2 in book.notes[chapterId])
    {
      objList[loc+" "+key2]=
      {
        name:loc,
        chapterId:chapterId,
        key2:key2,
        object:book.notes[chapterId][key2],
      }
    }
  }
  var keys=Object.keys(objList);
  keys.sort();
  for (let i=0;i<keys.length;i++)
  {
    obj=objList[keys[i]];
    pagenum=obj.object.pagenum;
    loc=obj.chapterId+".html?pagenum="+pagenum;
    list=list+"<tr>"+
      "<td width=45% valign=top><a target=_blank href=\""+loc+"\">"+obj.name+", страница "+pagenum+"</a></td>"+
      "<td width=50% valign=top>"+obj.object.textNote+"</td>"+
      "<td width=40 valign=top align=center><a href=\"javascript:void(0)\" onclick=\"deleteNoteFromList(this,'"+obj.chapterId+"','"+obj.key2+"')\"><img src=\"" + DIR_OFFSET + "../img/remove.png\" height=25 title=\"Удалить\"></a></td>"+
      "</tr>";
  }
  list=list+"</table>";
  let win=createModalWindow(true,mmFullScreen);
  setModalWindowAttributes(win,true,0);
  showModalWindow(win,list);
}

function exportNotes()
// сохранение заметок в файл
{
  var chapterId,key2,note;
  var text_note = '<?xml version="1.0" encoding="UTF-8"?><notes book_id="'+bookIdent()+'">'
  for (chapterId in book.notes)
  {
    for (key2 in book.notes[chapterId])
    {
      note=book.notes[chapterId][key2];
      text_note=text_note+'<note chapter="'+chapterId+'" id="'+key2+'" pagenum="'+note.pagenum+
                          '" offset="'+note.offset+'" length="'+note.length+
                          '" textNote="'+note.textNote+'"/>';
    }
  }
  text_note=text_note+'</notes>';
  writeFile("notes.xml",text_note);
  showNotes();
  setBookmarksNotesMarker(curChapterId);
}

function importNotes()
// загрузка заметок из файла
{
  var el=document.getElementById("fileInput");
  if (el) el.click();
}

function showNotes()
// показ заметок на текущей странице
{
  if (!elemCardBody) return;
  var note,rng,rngs=[];
  var pd=getCurPageData();
  for (key2 in book.notes[curChapterId])
  {
    note=book.notes[curChapterId][key2];
    if (note.pagenum!=pd.pagenum) continue; // выделяем только на текущей странице
    rng=
    {
      start:note.offset,
      length:note.length,
      id:key2
    };
    rngs[rngs.length]=rng;
  }
  var options=
  {
    element:"span",
    className:"text_with_note",
    each:onMarkRange,
  };
  var instance = new Mark(elemCardBody);
  instance.unmark(options);
  instance.markRanges(rngs,options);
}

function onMarkRange(elem,rng)
{
  if (!elem || !rng.id) return;
  var note=book.notes[curChapterId][rng.id];
  elem.id=rng.id;
  elem.classList.add("no_night");
  elem.onmousemove=onNoteShow;
  elem.onmouseout=onNoteHide;
  elem.onclick=onNoteShow;
  elem.setAttribute("data-tooltip",note.textNote);
}

function onNoteShow(event)
{
  $data_tooltip=$(this).attr("data-tooltip");
  $("#tooltip_note").text($data_tooltip);
  var x;
  if (event.pageX<0.5*window.innerWidth)
    x=event.pageX+5;
  else
    x=event.pageX-5-$("#tooltip_note").width();
  var y;
  if (event.pageY+$("#tooltip_note").height()<window.innerHeight)
    y=event.pageY+5;
  else
    y=event.pageY-30-$("#tooltip_note").height();
  $("#tooltip_note")
    .css({
      "top" : y,
      "left" : x
      })
    .show();
}

function onNoteHide(event)
{
  $("#tooltip_note").hide()
    .text("")
    .css({
      "top" : 0,
      "left" : 0
      });
}

function onLoadNotes(ev)
{
  var doc=ev.target.result;
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(doc,"application/xml");
  // проверка, относятся ли заметки к текущей книге
  var elems=xmlDoc.getElementsByTagName("notes");
  if (!elems) return;
  if (elems[0].getAttribute("book_id")!=bookIdent())
  {
    showMessage("Заметки относятся к другой книге. Загрузка невозможна");
    return;
  }
  // загрузка заметок
  var chapterId,key2,cnt=0;
  elems=xmlDoc.getElementsByTagName("note");
  for (var i=0;i<elems.length;i++)
  {
    chapterId=elems[i].getAttribute('chapter');
    noteObj=
      {
      pagenum:elems[i].getAttribute("pagenum"),  // номер страницы
      offset:elems[i].getAttribute("offset"),    // смещение выделенного текста
      length:elems[i].getAttribute("length"),    // длина выделенного текста
      textNote:elems[i].getAttribute("textNote"),  // текст заметки
      };
    key2=elems[i].getAttribute("id");
    if (!book.notes[chapterId]) book.notes[chapterId]={};
    if (String(book.notes[chapterId][key2])!=noteObj)
    {
      book.notes[chapterId][key2]=noteObj;
      cnt++;
    }
    setBookmarksNotesMarker(chapterId);
  }
  saveCoursesParams();
  showNotes();
  var msg="";
  if (cnt==0)
    msg="Заметки уже присутствуют в ЭУ/ЭОК. Перенос заметок не требуется.";
  else if (cnt==elems.length)
    msg="Заметки загружены";
  else
    msg="Часть заметок уже присутствует в ЭУ/ЭОК. Недостающие заметки перенесены.";
  showMessage(msg);
}

function onErrorLoadNotes(ev)
{
  showMessage("Ошибка загрузки файла",mtError);
}

function processFiles(files)
{
  var file=files[0];
  var reader=new FileReader();
  reader.onload=onLoadNotes;
  reader.onerror=onErrorLoadNotes;
  reader.readAsText(file);
}

function writeFile(name,value)
{
  var val = value;
  if (value === undefined) val = "";
  var download = document.createElement("a");
  download.href = "data:text/plain;content-disposition=attachment;filename=file," + val;
  download.download = name;
  download.style.display = "none";
  download.id = "download";
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
}

//////////////////////////////////////////////////////////////////////
// ЗАКЛАДКИ
//////////////////////////////////////////////////////////////////////
var bmTableElement=null,bmChapterId="",bmKey2="";

function createBookmark()
// создание закладки
{
  var pd=getCurPageData();
  if (book.bookMarks[curChapterId]==pd.pagenum) return; // есть закладка на текущую страницу текущей главы
  bookMarkObj=
    {
      pagenum:pd.pagenum, // номер страницы
    };
  var key2=pd.pagenum;
  if (!book.bookMarks[curChapterId]) book.bookMarks[curChapterId]={};
  book.bookMarks[curChapterId][key2]=bookMarkObj;
  saveCoursesParams();
  setBookmarksNotesMarker(curChapterId);
}

function deleteBookmarkInt(chapterId,key2)
// удаление закладки по ключу
{
  if ((chapterId in book.bookMarks) && (key2 in book.bookMarks[chapterId]))
  {
    // есть закладка на текущую страницу текущей главы
    bmChapterId=chapterId;
    bmKey2=key2;
    showConfirmation("Удалить закладку?",deleteBookmarkConfirm);
  }
}

function deleteBookmarkConfirm()
{
  if (modalResult!=mrYes) return;
  delete book.bookMarks[bmChapterId][bmKey2];
  if (isEmptyObject(book.bookMarks[bmChapterId]))
    delete book.bookMarks[bmChapterId];
  saveCoursesParams();
  setBookmarksNotesMarker(bmChapterId);
  // удалить в таблице
  if (bmTableElement)
  {
    // удалить строку в таблице или всю таблицу (если удалены все закладки)
    var elem=null;
    if (isEmptyObject(book.bookMarks))
      elem=bmTableElement.closest("table");
    else
      elem=bmTableElement.closest("tr");
    if (elem)
    {
      elem.parentElement.removeChild(elem);
      bmTableElement=null;
    }
  }
}

function deleteBookmark()
// удаление закладки
{
  var pd=getCurPageData();
  deleteBookmarkInt(curChapterId,pd.pagenum);
}

function deleteBookmarkFromList(listElem,chapterId,key2)
// удаление закладки из списка
// listElem - нажатая ссылка
{
  bmTableElement=listElem;
  deleteBookmarkInt(chapterId,key2);
}

function deleteAllBookmarksFromList(listElem)
{
  noteTableElement=listElem;
  showConfirmation("Удалить все закладки?",deleteAllBookmarksConfirm);
}

function deleteAllBookmarksConfirm()
{
  if (modalResult!=mrYes) return;
  for (var key in book.bookMarks)
  {
    for (var key2 in book.bookMarks[key])
      delete book.bookMarks[key][key2];
    delete book.bookMarks[key];
    setBookmarksNotesMarker(key);
  }
  saveCoursesParams();
  // удалить таблицу
  if (noteTableElement)
  {
    var elem=noteTableElement.closest("table");
    if (elem)
    {
      elem.parentElement.removeChild(elem);
      noteTableElement=null;
    }
  }
}

function listBookmarks()
// список закладок
// закладки сортируются по названию главы + номер страницы
{
  if (isEmptyObject(book.bookMarks))
  {
    showMessage("Закладки отсутствуют",mtInformation,5);
    return;
  }
  var list="<center><font size=6>Закладки</font></center><br><table border width=100%>"+
           "<tr><th style='text-align:center;'>Название раздела (гиперссылка)</th><th style='text-align:center;'>Удалить</th></tr>"+
           "<tr><td></td><td width=40 valign=top align=center><a href=\"javascript:void(0)\" onclick=\"deleteAllBookmarksFromList(this)\"><img src=\"" + DIR_OFFSET + "../img/remove-all.png\" height=25 title=\"Удалить все\"></a></td></tr>";
  var obj,pagenum,loc;
  var objList={};
  for (let chapterId in book.bookMarks)
  {
    loc=getChapterName(chapterId);
    for (let key2 in book.bookMarks[chapterId])
    {
      objList[loc+" "+key2]=
      {
        name:loc,
        chapterId:chapterId,
        key2:key2,
        object:book.bookMarks[chapterId][key2],
      }
    }
  }
  var keys=Object.keys(objList);
  keys.sort();
  for (let i=0;i<keys.length;i++)
  {
    obj=objList[keys[i]];
    pagenum=obj.object.pagenum;
    loc=obj.chapterId+".html?pagenum="+pagenum;
    list=list+"<tr>"+
              "<td valign=top><a target=_blank href=\""+loc+"\">"+obj.name+", страница "+pagenum+"</a></td>"+
              "<td width=40 valign=top align=center><a href=\"javascript:void(0)\" onclick=\"deleteBookmarkFromList(this,'"+obj.chapterId+"','"+obj.key2+"')\"><img src=\"" + DIR_OFFSET + "../img/remove.png\" height=25 title=\"Удалить\"></a></td>"+
              "</tr>";
  }
  list=list+"</table>";
  let win=createModalWindow(true,mmFullScreen);
  setModalWindowAttributes(win,true,0);
  showModalWindow(win,list);
}

//////////////////////////////////////////////////////////////////////
// СНОСКИ
//////////////////////////////////////////////////////////////////////
document.write('<div id="tooltip_footnote" class="no_night"></div>');

function onFoototeShow(event)
{
  $data_tooltip=$(this).attr("data-tooltip");
  $("#tooltip_footnote").text($data_tooltip);
  var x;
  if (event.pageX<0.5*window.innerWidth)
    x=event.pageX+5;
  else
    x=event.pageX-5-$("#tooltip_footnote").width();
  var y;
  if (event.pageY+$("#tooltip_footnote").height()<window.innerHeight)
    y=event.pageY+5;
  else
    y=event.pageY-30-$("#tooltip_footnote").height();
  $("#tooltip_footnote")
    .css({
      "top" : y,
      "left" : x
      })
    .show();
}

function onFoototeHide(event)
{
  $("#tooltip_footnote").hide()
    .text("")
    .css({
      "top" : 0,
      "left" : 0
      });
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР 3D-МОДЕЛЕЙ
//////////////////////////////////////////////////////////////////////
var settings3D=
{
  showAxes:true,       // отображение осей координат на сцене
  controlType:0,       // тип элемента управления:
                       //  0 - TrackballControls (также по умолчанию)
                       //  1 - OrbitControl
  lightType:0,         // тип источника света
                       //  0 - PointLight (также по умолчанию)
                       //  1 - DirectionalLight
  lightColor:0xffffff, // цвет источника света
}

function show3DModelId(containerId,modelName,textureName,cameraX,cameraY,cameraZ,step)
// containerId - ид. элемента-контейнера
{
  if (containerId=="" || modelName=="") return;
  var container=document.getElementById(containerId);
  if (container) show3DModel(container,modelName,textureName,cameraX,cameraY,cameraZ,step);
}

function show3DModel(container,modelName,textureName,cameraX,cameraY,cameraZ,step)
// просмотр 3D-модели (dae, obj, 3ds, wrl, wrm, fbx)
// container   - элемент-контейнер, в котором отображается модель
// modelName   - путь к файлы модели
// textureName - путь к файлы текстуры (не обязателен)
// cameraX     - позиция X камеры после загрузки модели
// cameraY     - позиция Y камеры после загрузки модели
// cameraZ     - позиция Z камеры после загрузки модели
// step        - величина шага приближения/отдаления при прокрутке мышью
{
  if (!container || modelName=="") return;
  // инициализация
  var fullScreen3D=false;
  var containerM=container; // контейнер для оконного просмотра (имя которого передается в процедуру)
  var containerFS=null;     // контейнер для полноэкранного просмотра
  var container3D=null;     // ссылка на контейнер, в котором модель отображается в текущий момент
  var camera,scene,light,renderer,model,texture,controls;
  var cwidth=0,cheight=0;
  var delta=1;
  if (step>0) delta=step;
  container3D=null;
  // определение и очистка контейнера
  containerM.ondblclick=contDblClick;
  container3D=containerM;
  cwidth=container3D.clientWidth;
  cheight=container3D.clientHeight;
  deleteChildren(container3D);
  // создание камеры
  camera=new THREE.PerspectiveCamera(50,cwidth/cheight,0.001,1000000);
  camera.position.set(cameraX,cameraY,cameraZ);
  // создание источника света
  switch (settings3D.lightType)
  {
    case 1:
      light=new THREE.DirectionalLight(settings3D.lightColor,1.0);
      break;
    default:
      light=new THREE.PointLight(settings3D.lightColor,1.0);
      break;
  }
  camera.add(light);
  // создание сцены
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0xcccccc);
  scene.add(camera);
  // оси координат
  if (settings3D.showAxes)
  {
    var axes=new THREE.AxesHelper(10000);
    scene.add(axes);
  }
  // загрузка текстуры и модели
  var loader;
  if (textureName!="")
  {
    var textureLoader=new THREE.TextureLoader( );
    texture=textureLoader.load( textureName );
  }
  else texture=null;
  switch (getFileExt(modelName).toUpperCase())
  {
    case "DAE":
      loader=new THREE.ColladaLoader( );
      loader.load( modelName, function ( collada ) {
          model = collada.scene;
          loadModel();
        } );
      break;
    case "OBJ":
      loader=new THREE.OBJLoader( );
      loader.load( modelName, function ( obj ) {
          model = obj;
          loadModel();
        } );
      break;
    case '3DS':
      loader=new THREE.TDSLoader( );
      loader.load(modelName, function ( obj ) {
          model = obj;
          loadModel();
        } );
      break;
    case 'WRL':
    case 'WRM':
      loader=new THREE.VRMLLoader( );
      loader.load(modelName, function ( obj ) {
          model = obj;
          loadModel();
        } );
      break;
    case 'FBX':
      loader=new THREE.FBXLoader( );
      loader.load(modelName, function ( obj ) {
          model = obj;
          loadModel();
        } );
      break;
    default:
      return;
  }
  // создание рендера
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  container3D.appendChild(renderer.domElement);
  renderer.setSize(cwidth,cheight);
  // создание элемента управления
  switch (settings3D.controlType)
  {
    case 1:
      controls=new THREE.OrbitControls(camera,renderer.domElement);
      break;
    default:
      controls=new THREE.TrackballControls(camera,renderer.domElement);
      break;
  }
  controls.rotateSpeed=1.0;
  controls.zoomSpeed=1.2;
  controls.panSpeed=0.8;
  controls.addEventListener('change',onControlChange);
  // установка обработчиков
  window.addEventListener('resize',onWindowResize,false);
  // запуск анимации модели
  animate();

  function loadModel()
  {
    if (texture)
    {
      model.traverse( function ( child ) {
          if ( child.isMesh ) child.material.map=texture;
        } );
    }
    scene.add( model );
  }

  function onWindowResize()
  {
    cwidth=container3D.clientWidth;
    cheight=container3D.clientHeight;
    camera.aspect=cwidth/cheight;
    camera.updateProjectionMatrix();
    renderer.setSize(cwidth,cheight);
    controls.handleResize();
  }

  function animate()
  {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
  }

  function onControlChange()
  {
  }

  function contDblClick(event)
  {
    if (fullScreen3D)
    {
      // полноэкранный режим - переход в оконный режим
      if (containerFS)
      {
        document.body.removeChild(containerFS);
        containerFS=null;
      }
      container3D=containerM;
    }
    else
    {
      // оконный режим - переход в полноэкранный режим
      containerFS=document.createElement('div');
      if (containerFS)
      {
        containerFS.style="position:fixed;left:10px;top:10px;right:10px;bottom:10px;z-index:100000;background-color:#cccccc;visibility:visible;";
        // контейнер, в котором показывается модель
        var contView=document.createElement('div');
        contView.style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000;visibility:visible;";
        contView.ondblclick=contDblClick;
        containerFS.appendChild(contView);
        // кнопка закрытия
        var btn=document.createElement('span');
        btn.className="modal_close modal_close_1";
        btn.onclick=contDblClick;
        containerFS.appendChild(btn);
        // переход в полноэкранный режим
        document.body.appendChild(containerFS);
        container3D=contView;
      }
    }
    deleteChildren(container3D);
    container3D.appendChild(renderer.domElement);
    onWindowResize();
    fullScreen3D=!fullScreen3D;
  }
}
//////////////////////////////////////////////////////////////////////
// ПРОСМОТР TIFF
//////////////////////////////////////////////////////////////////////
function showTiffId(containerId,fileName="",fileBase64="")
{
  if (containerId=="" || (fileName=="" && fileBase64=="")) return;
  var container=document.getElementById(containerId);
  if (container) showTiff(container,fileName,fileBase64);
}

function showTiff(container,fileName,fileBase64)
{
  if (!container || (fileName=="" && fileBase64=="")) return;
  if (fileName!="")
  {
    var req = new XMLHttpRequest();
    req.open('GET',fileName,true);
    req.responseType='arraybuffer';
    req.onload = function (event)
      {
        var buffer=req.response;
        if (!buffer) return;
        var tiff=new Tiff({buffer: buffer});
        var canvas=tiff.toCanvas();
        if (canvas) container.append(canvas);
      };
    req.send();
  }
  else if (fileBase64!="")
  {
    var b64=fileBase64.replace(/%0A/g,'');
    var buffer=base64ToArrayBuffer(b64);
    var tiff=new Tiff({buffer: buffer});
    var canvas=tiff.toCanvas();
    if (canvas) container.append(canvas);
  }
}

function base64ToArrayBuffer(base64)
{
  var binary_string=window.atob(base64);
  var len=binary_string.length;
  var bytes=new Uint8Array(len);
  for (var i=0;i<len;i++)
    bytes[i]=binary_string.charCodeAt(i);
  return bytes.buffer;
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР PDF
//////////////////////////////////////////////////////////////////////
var pdfStates=[];

function showPDFId(containerId,fileName)
{
  if (containerId=="" || fileName=="") return;
  var container=document.getElementById(containerId);
  if (container) showPDF(container,fileName);
}

function showPdf(container,fileName)
{
  if (!container || fileName=="") return;
  var pdfState=
  {
    pdf:null,
    currentPage:1,
    zoom:1,
    container:container,
  }
  // создать элементы управления
  pdfState.container.innerHTML=
    '<div class="pdf_viewer">'+
    '  <div class="pdf_container">'+
    '    <canvas class="pdf_renderer"></canvas>'+
    '  </div>'+
    '  <div class="pdf_navigation"><nobr>'+
    '    <button class="go_first" onclick="onPdfFirstPage()"><<</button>'+
    '    <button class="go_previous" onclick="onPdfPrevPage()"><</button>'+
    '    <input class="current_page" value="1" type="number" style="width:4em;" onchange="onPdfPageChange()">'+
    '    <button class="go_next" onclick="onPdfNextPage()">></button>'+
    '    <button class="go_last" onclick="onPdfLastPage()">>></button>'+
    '    <button class="zoom_in" onclick="onPdfZoomIn()">+</button>'+
    '    <button class="zoom_out" onclick="onPdfZoomOut()">-</button>'+
    '  </nobr></div>'+
    '</div>';
  // открыть файл
  pdfjsLib.getDocument(fileName).then((pdf) =>
    {
      pdfState.pdf=pdf;
      renderPdf(pdfState.container);
    });
  // добавить в массив открытых файлов
  if (container.id=="") container.id=generateId("pdf");
  pdfStates[container.id]=pdfState;
}

function renderPdf(container)
{
  var pdfState=pdfStates[container.id];
  container.querySelector(".current_page").value=pdfState.currentPage;
  pdfState.pdf.getPage(pdfState.currentPage).then((page) =>
  {
    var canvas=container.querySelector(".pdf_renderer");
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var viewport = page.getViewport(pdfState.zoom);
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    page.render({canvasContext: ctx, viewport: viewport});
  });
}

function doPdfAction(event,action)
// event - событие
// action - код действия
//  0 - на первую страницу
//  1 - на предыдущую страницу
//  2 - на указанную страницу
//  3 - на следующую страницу
//  4 - на последнюю страницу
//  5 - увеличить масштаб
//  6 - уменьшить масштаб
{
  // определение контейнера и документа
  if (!event) return;
  var container=event.target; // кнопка
  while (container && !container.classList.contains("pdf_viewer"))
    container=container.parentElement;
  if (!container) return;
  container=container.parentElement; // исходный контейнер
  if (!container || container.id=="") return;
  var pdfState=pdfStates[container.id];
  if (!pdfState.pdf) return;
  // выполнение действия
  switch (action)
  {
    case 0:
      pdfState.currentPage=1;
      break;
    case 1:
      if(pdfState.currentPage>1) pdfState.currentPage--;
      break;
    case 2:
      var pagenum=container.querySelector(".current_page").valueAsNumber;
      if (pagenum<1)
        pagenum=1;
      else if (pagenum>pdfState.pdf._pdfInfo.numPages)
        pagenum=pdfState.pdf._pdfInfo.numPages;
      pdfState.currentPage=pagenum;
      break;
    case 3:
      if (pdfState.currentPage<pdfState.pdf._pdfInfo.numPages) pdfState.currentPage++;
      break;
    case 4:
      pdfState.currentPage=pdfState.pdf._pdfInfo.numPages;
      break;
    case 5:
      pdfState.zoom+=0.1;
      break;
    case 6:
      pdfState.zoom-=0.1;
      break;
    default: // действие не опознано
      return;
  }
  pdfStates[container.id]=pdfState;
  renderPdf(container);
}

function onPdfFirstPage()
{
  doPdfAction(event,0);
}

function onPdfPrevPage()
{
  doPdfAction(event,1);
}

function onPdfPageChange()
{
  doPdfAction(event,2);
}

function onPdfNextPage()
{
  doPdfAction(event,3);
}

function onPdfLastPage()
{
  doPdfAction(event,4);
}

function onPdfZoomIn()
{
  doPdfAction(event,5);
}

function onPdfZoomOut()
{
  doPdfAction(event,6);
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР DJVU
//////////////////////////////////////////////////////////////////////
function showDjvuId(containerId,fileName)
{
  if (containerId=="" || fileName=="") return;
  var container=document.getElementById(containerId);
  if (container) showDjvu(container,fileName);
}

function showDjvu(container,fileName)
{
  if (!container || fileName=="") return;
  var viewer=new DjVu.Viewer();
  viewer.render(container);
  viewer.loadDocumentByUrl(fileName);
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР SWF
//////////////////////////////////////////////////////////////////////
function showSwfId(containerId,fileName)
{
  if (containerId=="" || fileName=="") return;
  var elem=document.getElementById(containerId);
  if (!elem) return;
  var elemF=elem.firstChild; // элемент, где отображается флеш.
                             // нужен, чтобы остался control, т.к. плеер затирает контейнер
  if (!elemF)
  {
    elemF=document.createElement("flash");
    elem.appendChild(elemF);
  }
  if (elemF.id=="") elemF.id=generateId("swf");
  shuobject.embedSWF(fileName,elemF.id,elem.clientWidth,elem.clientHeight,'9,0,10');
  let el = document.getElementById(elemF.id);
  if (el) {
    let h = el.height;
    el.setAttribute("height", h - 100);
    setTimeout(() => {
      el.setAttribute("height", h);
    }, 500);
  }    
}

function showSwf(container,fileName)
{
  if (!container || fileName=="") return;
  var id=container.id;
  if (id=="") container.id=generateId("swf");
  showSwfId(container.id,fileName);
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР ПАНОРАМ
//////////////////////////////////////////////////////////////////////
function showPanorama(container)
{
  if (!container) return;
  if (container.photoSphereViewer) return;
  var src=container.attributes["src"].value;
  if (src=="") return;
  var caption=container.attributes["caption"].value;
  var viewer = new PhotoSphereViewer.Viewer({container:container,panorama:src,caption:caption});
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР ВИДЕО 360
//////////////////////////////////////////////////////////////////////
function showVideo360(container, autoplay, muted)
{
  if (!container) { 
    return;
  }
  let src = container.attributes["src"].value;
  if (src == "") { 
    return;
  }
  let caption = container.attributes["caption"].value;
  let viewer = new PhotoSphereViewer.Viewer({container: container, 
    adapter: [PhotoSphereViewer.EquirectangularVideoAdapter, {autoplay: autoplay, muted: muted}], 
    panorama: {source: src}, plugins: [[PhotoSphereViewer.VideoPlugin, {}]]});
}

//////////////////////////////////////////////////////////////////////
// ПРОСМОТР ДОКУМЕНТОВ В ПОЛНОЭКРАННОМ РЕЖИМЕ
//////////////////////////////////////////////////////////////////////
var containerFSDocument=null;

function showDocumentFullScreen(fileName)
{
  if (containerFSDocument) return;
  containerFSDocument=document.createElement('div');
  if (containerFSDocument)
  {
    containerFSDocument.style="position:fixed;left:10px;top:10px;right:10px;bottom:10px;z-index:100000;background-color:#cccccc;visibility:visible;";
    // контейнер, в котором показывается документ
    var contView=document.createElement('div');
    containerFSDocument.appendChild(contView);
    contView.style="position:absolute;left:10px;top:10px;right:10px;bottom:10px;z-index:1000;visibility:visible;";
    contView.id=generateId("");
    // кнопка закрытия
    var btn=document.createElement('span');
    btn.className="modal_close modal_close_1";
    btn.onclick=closeDocumentFullScreen;
    containerFSDocument.appendChild(btn);
    // переход в полноэкранный режим
    let ext=getFileExt(fileName).toUpperCase();
    switch(ext)
    {
      case 'PDF':
        showPdf(contView,fileName);
        break;
      case 'DJVU':
        showDjvu(contView,fileName);
        break;
    }
    document.body.appendChild(containerFSDocument);
  }
}

function closeDocumentFullScreen()
{
  if (containerFSDocument)
  {
    document.body.removeChild(containerFSDocument);
    containerFSDocument=null;
  }
}

//////////////////////////////////////////////////////////////////////
// ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ
//////////////////////////////////////////////////////////////////////
function onImageClick(event)
{
  return jsiBoxOpen(event.currentTarget);
}

//////////////////////////////////////////////////////////////////////
// УРОВЕНЬ СЛОЖНОСТИ
//////////////////////////////////////////////////////////////////////
function onDifficultyChange(diff)
{
  changeDifficulty(diff);
  globalSearch($('#search_box').val());
}

function changeDifficulty(diff)
{
  book.curDifficulty=Number(diff); // выбранный уровень сложности
  if (book.curDifficulty<3 || book.curDifficulty>5) book.curDifficulty=3;
  setDifficulty();
  saveCoursesParams();
  var elem=document.getElementById("difficulty_menu_id");
  if (elem) {
    elem.innerHTML = "Сложность: " + diffNameByLevel(diff);
  }
}

function setDifficulty()
// скрыть элементы дерева, не соответствующие выбранному уровню
{
  if (!$("*").is("#jstree")) return;
  var chapter,node,pid,pnode;
  var tree=$("#jstree").jstree();
  for (var chapterId in book.chapters)
  {
    chapter=book.chapters[chapterId];
    node=tree.get_node(chapterId);
    if (chapter.difficulty <= book.curDifficulty)
    {
      // показать узел
      tree.show_node(node);
      // показать всех его родителей
      pid=tree.get_parent(node);
      while (pid!="")
      {
        pnode=tree.get_node(pid);
        tree.show_node(pnode);
        pid=tree.get_parent(pnode);
      }
    }
    else
    {
      // скрыть узел
      tree.hide_node(node);
    }
  }
}

//////////////////////////////////////////////////////////////////////
// СЛУЖЕБНЫЕ ФУНКЦИИ
//////////////////////////////////////////////////////////////////////
async function loadModule(condition, modulename) {
  // Загрузка модулей по условию
  if (condition) {
    await import(modulename);
  }
}

function bookIdent()
{
  var s=window.location.pathname.replace(/[^\/]+$/g,'');
  // все символы, кроме букв и цифр, меняются на подчеркивание
  s=s.substr(1,s.length-2);
  // Отбрасывание вложенного каталога html
  const HTML_STR = '/html';
  if (s.endsWith(HTML_STR)) {
    s = s.substr(0, s.length - HTML_STR.length);
  }
  s=s.replace(/[^a-zA-Z0-9_]/gi,'_');
  return s;
}

function locationPath()
// путь без имени файла из location.pathname
{
  let s=window.location.pathname;
  if (s.charAt(0)=="/") s=s.substr(1);
  let p=s.lastIndexOf("/");
  if (p>=0) s=s.substring(0,p);
  return s;
}

function isMobileDevice()
{
  return true; // для мобильных устройств
}

function deleteChildren(elem)
{
  while (elem.firstChild)
    elem.removeChild(elem.firstChild);
}

function getFileExt(fileName)
// возвращает расширение файла
{
  return fileName.slice((Math.max(0,fileName.lastIndexOf(".")) || Infinity)+1);
}

function isCardBodyChild(selnode)
{
  var parent=selnode.parentNode;
  while (parent && parent!=elemCardBody)
    parent=parent.parentNode;
  if (parent)
    return true;
  else
    return false;
}

function getSelectionParams()
// возвращает начало и длину выделенного текста внутри контейнера с текстом главы
{
  var selStart=0,selLength=0;
  var sel=window.getSelection();
  if (sel.rangeCount>0)
  {
    //выделение внутри главы или вне?
    if (!isCardBodyChild(sel.anchorNode) || !isCardBodyChild(sel.focusNode)) return {selStart:-1,selLength:0};
    var start=elemCardBody.firstChild;
    var end=null,fromOffset=0;
    // есть выделенный текст
    selLength=String(sel).length;
    if (sel.anchorNode==sel.focusNode)
    {
      // выделение в пределах одного элемента
      end=sel.anchorNode;
      fromOffset=Math.min(sel.anchorOffset,sel.focusOffset);
    }
    else
    {
      // выделение в пределах разных элементов
      var ofsAnchor=getNodeOffset(sel.anchorNode);
      var ofsFocus=getNodeOffset(sel.focusNode);
      if (ofsAnchor<=ofsFocus)
      {
        // выделение слева направо
        var end=sel.anchorNode;
        var fromOffset=sel.anchorOffset;
      }
      else
      {
        // выделение справа налево
        var end=sel.focusNode;
        var fromOffset=sel.focusOffset;
      }
    }
    // Создаём Range
    var rng = document.createRange();
    // Задаём верхнюю граничную точку, передав контейнер и смещение
    rng.setStart(start, 0);
    // Аналогично для нижней границы
    rng.setEnd(end, 0);
    var fromBeg = rng.toString().length;
    var deltaLen = 0;
    var elems = elemCardBody.querySelectorAll("script, style, title, head, html");
    if (elems)
    {
      for (var i=0;i<elems.length;i++)
      {
        var rngS = document.createRange();
        rngS.setStart(start, 0);
        rngS.setEnd(elems[i], 0);
        var fromBegS = rngS.toString().length;
        if (fromBegS < fromBeg) deltaLen = deltaLen + elems[i].innerHTML.length;
      }
    }
    selStart = fromBeg+fromOffset - deltaLen;
  }
  return {selStart:selStart,selLength:selLength};
}

function nodeIdFromURL(url)
// получить ид. раздела из адреса
{
  var res=url.substring(url.lastIndexOf("/")+1);
  res=res.substring(0,res.lastIndexOf("."));
  return res;
}

function getPrevChapterId(chapterId)
// получить ид. раздела, предыдущего перед указанным
// (с учетом установленного фильтра по уровню сложности)
// если раздела нет, возвращается пустая строка
{
  var cid="";
  var chapterIds=Object.keys(book.chapters);
  var curIndex=chapterIds.indexOf(chapterId);
  if (curIndex<0) return "";  // глава не найдена
  if (curIndex==0) return ""; // это первая глава
  // фильтр по уровню сложности
  for (var i=curIndex-1;i>=0;i--) {
    if (book.chapters[chapterIds[i]].difficulty<=book.curDifficulty)
    {
      cid=chapterIds[i];
      break;
    }
  }
  return cid;
}

function getFirstChapterId()
// получить ид. первой главы
{
  if (!book.chapters) return "";
  var chapterIds=Object.keys(book.chapters);
  if (chapterIds.length==0) return "";
  return chapterIds[0];
}

function getNextChapterId(chapterId)
// получить ид. раздела, следующего за указанным
// (с учетом установленного фильтра по уровню сложности)
// если раздела нет, возвращается пустая строка
{
  var cid="";
  var chapterIds=Object.keys(book.chapters);
  var curIndex=chapterIds.indexOf(chapterId);
  if (curIndex<0) return ""; // глава не найдена
  if (curIndex==chapterIds.length-1) return ""; // это последняя глава
  // фильтр по уровню сложности
  for (var i=curIndex+1;i<chapterIds.length;i++) {
    if (book.chapters[chapterIds[i]].difficulty<=book.curDifficulty)
    {
      cid=chapterIds[i];
      break;
    }
  }
  return cid;
}

function getChapterName(chapterId)
{
  if (chapterId in book.chapters)
    return book.chapters[chapterId].text;
  else
    return "";
}

function getChapterData(chapterId)
{
  if (chapterId in book.chapters)
    return book.chapters[chapterId];
  else
    return null;
}

function addChapter(chapterData)
{
  if (chapterData.id in book.chapters) return;
  var pd=
  {
    // данные из настройки книги
    parent:      chapterData.parent,
    text:        chapterData.text,
    href:        chapterData.a_attr.href,
    difficulty:  chapterData.a_attr.difficulty,
    chapterType: chapterData.a_attr.chapterType,
    // данные изучения главы
    visited:     false, // признак посещенности главы
    pagenum:     0,     // номер страницы
    time:        0,     // время, затраченное на просмотр главы
  };
  pd.visited=(pd.chapterType==CHAPTER_TYPE_SCREEN ||
              pd.chapterType==CHAPTER_TYPE_MAIN ||
              pd.chapterType==CHAPTER_TYPE_DOP1 ||
              pd.chapterType==CHAPTER_TYPE_DOP2 ||
              pd.chapterType==CHAPTER_TYPE_DOP3 ||
              pd.chapterType==CHAPTER_TYPE_STICKER);
  book.chapters[chapterData.id]=pd;
}


function isImportantChapter(chapter)
// возвращает, является ли глава значимой
// значимость определяется по типу главы
{
  return (chapter.chapterType==CHAPTER_TYPE_CHAPTER) ||
         (chapter.chapterType==CHAPTER_TYPE_AUTOCHAPTER);
}

function allowTrans(targetId)
// проверка разрешения перехода на другую страницу
// targetId - идентификатор страницы, куда осуществляется переход
{
  if (window.location.href.indexOf(targetId)>=0) return true; // переход сам на себя разрешен всегда
  var pd;
  // проверка соответствия уровня сложности
  var cd=getChapterData(targetId);
  if (cd && cd.difficulty>book.curDifficulty)
  {
    showMessage("Уровень сложности выбранной главы не соответствует установленному",mtWarning,3);
    return false;
  }
  // если глава была изучена ранее, переход разрешен
  pd=getPageData(targetId);
  if (pd.visited) return true;

  // проверка истечения времени изучения текущей главы
  // распространяется только на значимые главы
  if (book.settings.minTime != 0) {
    pd = getCurPageData();
    if (isImportantChapter(pd) && pd.time < book.settings.minTime) {
      var n = (book.settings.minTime - pd.time) / 1000;
      showMessage("Не вышло время изучения главы. Осталось " + Math.floor(n / 60) + " минут " + Math.floor(n % 60) + " секунд", mtWarning, 3);
      return false;
    }
  }

  // если включен последовательный переход, то
  // должны быть изучены все значимые главы до целевой главы
  if (bookSettings.allowChapters.length>0)
  {
    let cid=getPrevChapterId(targetId);
    while (cid!="")
    {
      pd=getPageData(cid);
      if (isImportantChapter(pd) && (!pd.visited))
      {
        showMessage("Переход на выбранную главу не разрешен",mtWarning,3);
        return false;
      }
      cid=getPrevChapterId(cid);
    }
  }
  // переход разрешен
  return true;
}

function setBookmarksNotesMarker(chapterId)
// установить признак наличия заметок и закладок в указанной главе
{
  if (!book || chapterId=="") return;
  let node =$("#jstree").jstree().get_node(chapterId);  
  let cname=getChapterName(chapterId);
  let text="";
  if (book.bookMarks[chapterId]) {
    text = text + '<img style="display: inline;" src="' + DIR_OFFSET + '../img/bookmark.png" height=20 title="Есть закладки к главе">';
  }
  if (book.notes[chapterId]) {
    text = text + '<img style="display: inline;" src="' + DIR_OFFSET + '../img/note.png" height=20 title="Есть заметки к главе">';
  }
  if (text != "") {
    cname = cname + '<span style = "white-space: nowrap;">&nbsp;' + text + '</span>';
  }
  $("#jstree").jstree('set_text',node,cname);
}

function getURLParams()
{
  var params={};
  var arrParams=window.location.search.substr(1).split('&');
  var arr,i;
  for (i=0;i<arrParams.length;i++)
  {
    if (arrParams[i]=="") continue;
    arr=arrParams[i].split('=');
    if (arr.length>0)
    {
      if (arr.length>1)
        params[arr[0]]=arr[1];
      else
        params[arr[0]]="";
    }
  }
  return params;
}

function generateId(prefix)
{
  return prefix+String(Math.floor(Math.random()*1000000));
}

function processTreeNode(node)
{
  if (node)
  {
    // загрузить контекст главы для поиска
    loadChapterText(node.id);
    // поставить отметку о закладках и заметках
    setBookmarksNotesMarker(node.id);
  }
}

function getNodeOffset(node,fromNode)
{
  var rng=new Range();
  if (fromNode)
    rng.setStart(fromNode,0);
  else
    rng.setStart(elemCardBody.firstChild,0);
  rng.setEnd(node,0);
  return rng.toString().length;
}

function inRect(x,y,x1,y1,x2,y2)
{
  if (x>=x1 && x<=x2 && y>=y1 && y<=y2)
    return true;
  else
    return false;
}

function getLeftTop(element)
{
  var elem=element;
  var l=0,t=0;
  while (elem)
  {
    l=l+elem.offsetLeft;
    t=t+elem.offsetTop;
    elem=elem.offsetParent;
  }
  return {left:l,top:t};
}

function getPageNumWithText(text)
// возвращает номер страницы, на которой находится первое вхождение указанного текста
// 0 - текст не найден
{
  if (cardBodyContext=="") return 0;
  var context=cardBodyContext.toLowerCase();
  var pText=context.indexOf(text.toLowerCase());
  if (pText<0) return 0;
  var pageB=context.lastIndexOf("pagenum",pText);
  if (pageB<0) return 0;
  var pageE=context.indexOf('"',pageB);
  if (pageE<0) return 0;
  var id=context.substring(pageB,pageE);
  return Number(id.substr(7));
}

function isEmptyObject(obj)
{
  return Object.keys(obj).length===0;
}

//////////////////////////////////////////////////////////////////////
// ПОИСК
//////////////////////////////////////////////////////////////////////
function loadChapterText(chapterID)
{
  fetch(chapterID+".html")
  .then(function (response) {return response.text();})
  .then(function (response) {var dom_parser = new DOMParser();
    var doc = dom_parser.parseFromString(response, "text/html");
    mapBodyCard.set(chapterID, doc.getElementById('cardBody').innerText);
  });
}

function checkStringValue(text,value)
{
  found=false;
  if (text.toLowerCase().indexOf(value.toLowerCase())!=-1) found=true;
  return found;
}

function searchTextInContentMap(text)
{
  var result = [];
  mapBodyCard.forEach(function(value, key)
  {
    if (checkStringValue(`${value}`, text)) result.push(`${key}`);
  });
  return result;
}

function markTextInContentBody(element,text)
{
  if (!element) return;
  var instance = new Mark(element);
  if (text)
  {
    var options=
    {
      element:"span",
      className:"found_text",
      separateWordSearch:false,
    };
    instance.mark(text,options);
  }
  else
    instance.unmark();
}

function searchTextAndMarkInContentBody(element,text)
{
  markTextInContentBody(element,text);
  localStorage_setItem(lastSearchString, text);
}

function globalSearch(v)
{
  clearSearchTree();
  $('#jstree').jstree(true).search(v);
  searchTextAndMarkInContentBody(elemCardBody);
  if (v) {
    var nodeArray = searchTextInContentMap(v);
    if (nodeArray.length > 0) {
      nodeArray.forEach(function(item, i, arr)
      {
        showChapterInTree(item);
        let n = $('#jstree').jstree(true).get_node(item, true);
        if (n)
        {
          if (userGeneral.isNight)
            n.children(".jstree-anchor").addClass("night_jstree-search");
          else
            n.children(".jstree-anchor").addClass("jstree-search");
          markParentsNodeForSearch(item);
        }
      });
    };
    let pd=getCurPageData();
    let n=getPageNumWithText(v);
    if (n>0 && n!=pd.pagenum)
    {
      pd.pagenum=n;
      getCurPageData(pd);
      goPage();
    }
    searchTextAndMarkInContentBody(elemCardBody,v);
  };
  storeTreeState();
}

// Раскрывает ветку и показывает в дереве содержания главу (узел), в которой (главе) найден искомый текст
function showChapterInTree(chapterId) {
  let id_array = $('#jstree').jstree(true).get_path(chapterId, '', true);
  for (let i = 0; i < id_array.length - 1; i++) {
    $('#jstree').jstree(true).open_node(id_array[i], false, false);
  }
}

function markParentsNodeForSearch(id)
{
  let tree = $('#jstree').jstree(true);
  let pid = tree.get_parent(id);
  if (!pid || pid == '#') return;
  let parentNode = tree.get_node(pid, true);
  if (parentNode)
  {
    if (userGeneral.isNight)
      parentNode.children(".jstree-anchor").addClass("night_jstree-search");
    else
      parentNode.children(".jstree-anchor").addClass("jstree-search");
    markParentsNodeForSearch(pid);
  }
}

function searhOnEnter(v)
{
  if (v)
  {
    var nodeArray=searchTextInContentMap(v);
    if (nodeArray.length==0) showMessage("Ничего не найдено!",mtInformation,3);
  };
}

function storeTreeState()
{
  var selectedItems = [];
  $('#jstree').jstree(true).settings.core.data.forEach(function(item, i, arr)
  {
    if ($('#jstree').jstree(true).get_node(item.id, true).children(".jstree-anchor").hasClass("jstree-search") ||
        $('#jstree').jstree(true).get_node(item.id, true).children(".jstree-anchor").hasClass("night_jstree-search"))
      selectedItems.push(item.id);
  });
  localStorage_setItem("lastTreeHight", JSON.stringify(selectedItems));
}

function clearSearchTree()
{
  $('#jstree').jstree(true).settings.core.data.forEach(function(item, i, arr)
  {
    $('#jstree').jstree(true).get_node(item.id, true).children(".jstree-anchor").removeClass("jstree-search");
    $('#jstree').jstree(true).get_node(item.id, true).children(".jstree-anchor").removeClass("night_jstree-search");
  });
}

function restoreTreeState()
{
  var selectedItems = JSON.parse(localStorage_getItem("lastTreeHight"));
  if (selectedItems != null)
  {
    selectedItems.forEach(function(item, i, arr)
    {
      $('#jstree').jstree(true).get_node(item, true).children(".jstree-anchor").addClass("jstree-search");
      if (userGeneral.isNight)
        $('#jstree').jstree(true).get_node(item, true).children(".jstree-anchor").addClass("night_jstree-search");
      else
        $('#jstree').jstree(true).get_node(item, true).children(".jstree-anchor").addClass("jstree-search");
    })
  }
}

//////////////////////////////////////////////////////////////////////
// ОЗВУЧИВАНИЕ ТЕКСТА
//////////////////////////////////////////////////////////////////////
function speakSelectionText()
{
  if (!window.speechSynthesis) return; // говорилка не поддерживается
  var text=String(window.getSelection());
  if (text=="")
  {
    showMessage("Выделите текст внутри главы",mtInformation,3);
    return;
  }
  var msg=new SpeechSynthesisUtterance();
  msg.lang='ru-RU';
  msg.text=text;
  window.speechSynthesis.cancel(); // прервать предыдущее воспроизведение
  window.speechSynthesis.speak(msg);
}

function speakStop()
{
  // прервать предыдущее воспроизведение
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

//////////////////////////////////////////////////////////////////////
// ОТОБРАЖЕНИЕ СПРАВКИ
//////////////////////////////////////////////////////////////////////
function showHelp()
{
  window.open(fileHelp);
}

/////////////////////////////////////////////////////////////////////
// ЗАПИСЬ НА КОНСУЛЬТАЦИЮ
/////////////////////////////////////////////////////////////////////
function showPPS(ppsURL)
{
  if (ppsURL!="")
    window.open(ppsURL,'_blank');
  else
    showMessage("Запись на консультацию невозможна");
}

//////////////////////////////////////////////////////////////////////
// ГЛОССАРИЙ
//////////////////////////////////////////////////////////////////////
function showGlossary(itemId)
{
  let url="CIDG.html";
  if (itemId!="") url=url+"#"+itemId; // позиционирование на указанный термин
  window.open(url,"_blank");
}

//////////////////////////////////////////////////////////////////////
// ТЕСТИРОВАНИЕ
//////////////////////////////////////////////////////////////////////
function initTestList(lst) {
  for (let testId in lst) {
    if (!lst[testId].all_questions) {
      lst[testId].all_questions = [];
      for (let i = 0; i < lst[testId].questions.length; i++)
        lst[testId].all_questions.push(lst[testId].questions[i]);
    }
  }
  localStorage_setItem(testListProp, JSON.stringify(lst));
}

// Возвращает список тестов
function getTests() {
  var tests = JSON.parse(localStorage_getItem(testListProp));
  return tests;
}

// Возвращает объекта теста
function getTest(testId) {
  var tests = getTests();
  if (!tests) {
    return null;
  }
  var test = tests[testId];
  // Преобразование строковых значений в целочисленные
  test.tryLimit = typeof(test.tryLimit) == "undefined" ? 0 : Number(test.tryLimit);
  return test;
}

function getQuestionID(parent, order, selfid, direct)
{
  var id;
  var minOrder;
  var cnt=0;
  var b = localStorage_getItem(currentTestingLevel);
  var diff = b != null ? b : 5;
  var test = getTest(parent);
  if (!test) return "";
  var qArr = test.questions;
  qArr.forEach(function(item, i, arr)
  {
    if (item.id != selfid)
    {
      if (item.level <= diff)
      {
        if ((direct=='next' && order<item.order) || (direct=='prev' && order>item.order))
        {
          if (cnt==0)
          {
            minOrder = item.order;
            id = item.id;
          }
          if ((direct=='next' && item.order<minOrder) || (direct=='prev' && order>item.order))
          {
            minOrder = item.order;
            id = item.id;
          }
          cnt++;
        }
      }
    }
  });
  if (typeof id=="undefined") id="";
  return id;
}

// Возвращает порядковый номера вопроса
function getQuestionOrder(testId, selfId) {
  var order = null;
  var test = getTest(testId);
  if (!test) {
    return null;
  }
  var qArr = test.questions;
  qArr.forEach(function(item, i, arr) {
    if (item.id == selfId) {
      order = item.order;
    }
  });
  return order;
}

// Возвращает идентификатор первого вопроса.
// curDifficulty - выбранный учащимся уровень сложности.
function getFirstQuestionId(testId, curDifficulty) {
  var minOrder;
  var id = "";
  var cnt=0;
  var test = getTest(testId);
  if (!test) {
    return "";
  }
  var qArr = test.questions;
  qArr.forEach(function(item, i, arr)
  {
    if (item.level <= curDifficulty) {
      if (cnt == 0) {
        minOrder = item.order;
        id = item.id;
      }
      if (minOrder > item.order) {
        minOrder = item.order;
        id = item.id;
      }
      cnt++;
    }
  });
  return id;
}

// Переходит на страницу первого вопроса теста
function goToFirstQuestion(testId, level)
{
  var tests = getTests();
  if (!tests) {
    return null;
  }
  var test = tests[testId];
  if (!test) {
    return;
  }
  switch (test.phaze) {
    case TEST_TYPE_INCOMING:
    case TEST_TYPE_MOTIVATION:
      getQuestionsArrayWithLevel(test, level);
      localStorage_setItem(questionQuantityStr, test.questions.length);
      if (test.rand_questions == "true") {
        // перемешивание вопросов
        shuffleQuestions(test.questions);
      }
      initTestList(tests);
      break;
    case TEST_TYPE_BOUNDARY:
      // Инициализация рубежного теста
      initBoundaryTest(testId, level);
      break;
    case TEST_TYPE_FINAL:
      // Инцилизация итогового теста
      initFinalTest(testId, level);
    }
  var id = getFirstQuestionId(testId, level);
  if (id != "")
  {
    localStorage_setItem(currentTestingLevel, level);
    currTestMode=true;
    nextTestMode=true;
    if (test.destination !== TEST_DEST_EXERCISE && needSendRequestData()) {
      // Получение результатов последнего прохождения теста.
      // Вопросы, на которые неверно ответили, необходимо переместить в начало теста.
      let serverBaseUrl = getServerBaseUrl();
      let requestParams = {
        testId: testId,
        level: level
      };
      sendRequestData(METHODS.GET, serverBaseUrl, URLS.LASTTESTS + '?testid=' + fullTestId(testId), requestParams, onGetTestResultsResponseFunc);
    } else {
      runTest(testId, level);
    }
  }
}

function onGetTestResultsResponseFunc(requestParams, responseData) {
  if (typeof(responseData.length) != "undefined" &&
      responseData.length > 0 &&
      responseData[0].question &&
      typeof(responseData[0].question) != "undefined" &&
      typeof(responseData[0].question.length) != "undefined" &&
      responseData[0].question.length > 0) {
    // Есть информация о результатах последнего прохождения теста.
    // Перемещение в начало теста вопросов, на которые неверно ответили.
    var tests = getTests();
    if (!tests) {
      return;
    }
    var test = tests[requestParams.testId];
    if (!test) {
      return;
    }
    let questions = responseData[0].question;
    questions.forEach(function(question) {
      for (let id in question) {
        if (question[id].result != QUESTION_VAL_TRUE) {
          // Поиск вопроса в массиве
          let index = test.questions.findIndex(item => item.q_text == id);
          if (index >= 0) {
            // Перемещение вопроса в начало
            let item = test.questions.splice(index, 1)[0];
            test.questions.unshift(item);
          }
        }
      }
    });
    setOrder(test.questions);
    // Сохранение теста
    initTestList(tests);
  }
  runTest(requestParams.testId, requestParams.level);
}

// Запускает тест
function runTest(testId, level) {
  var id = getFirstQuestionId(testId, level);
  if (id != "") {
    // Запуск теста
    initTest(testId);
    document.location = id + '.html';
  }
}

// Перемешивает вопросы
function shuffleQuestions(questions) {
  shuffle(questions);
  setOrder(questions);
}

function setOrder(questions) {
  for (var i = 0; i < questions.length; i++) {
    questions[i].order = i;
  }
}

// Перемешивает массив
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    // перестановка
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
}

function gotoTheory() {
  var cid = userGeneral.lastChapterId;
  if (!cid) {
    cid = getFirstChapterId();
    if (!cid) {
      showMessage("Не найдена первая глава", mtError);
      return;
    }
  }
  if (cid)
    document.location = cid + '.html';
  else
    showMessage("Не установлен адрес для перехода",mtError);
}

// Инцилизация итогового теста
function initFinalTest(testId, level) {
  var test = getTest(testId);
  if (test.phaze != TEST_TYPE_FINAL) {
    return;
  }
  // Массив вопросов
  getQuestionsArrayWithLevel(test, level);
  localStorage_setItem(questionQuantityStr, test.questions.length);
  var qArr = test.questions;
  // Массив процентов вопросов на тему
  var fhArr = test.finThemeList;
  // Итоговый тест
  var fqArr = [];
  for (let i = 0; i < fhArr.length; i++) {
    // Фильтрация вопросов для определённой темы
    var tmpArr = qArr.filter(function(item) {
      if (item.themeId == fhArr[i].id) {
        return item;
      }
    });
    shuffle(tmpArr);
    tmpArr.length = fhArr[i].questions;
    tmpArr.forEach(function(item) {
      fqArr.push(item);
    });
  }
  // Сохранение теста
  var testList = getTests();
  // Перемешивание вопросов
  shuffleQuestions(fqArr);
  testList[testId].questions = fqArr;
  initTestList(testList);
  localStorage_setItem(questionQuantityStr, fqArr.length);
}

// Инициализация рубежного теста
function initBoundaryTest(testId, level) {
  var test = getTest(testId);
  if (test.phaze != TEST_TYPE_BOUNDARY) {
    return;
  }
  // Формирование массива вопросов для рубежного теста
  getQuestionsArrayWithLevel(test, level);
  localStorage_setItem(questionQuantityStr, test.questions.length);
  var dest = [];
  var source = test.questions;
  // Перемешивание вопросов
  shuffle(source);
  // test.questionQuantity - количество вопросов для рубежного теста
  var count = Number(typeof(test.questionQuantity) == "undefined" ? 0 : test.questionQuantity);
  count = isNaN(count) ? 0 : count;
  for (let i = 0; i < count; i++) {
    source[i].order = i;
    dest.push(source[i]);
  }
  // Сохранение теста
  var testList = getTests();
  test.questions = dest
  testList[testId] = test;
  initTestList(testList);
  localStorage_setItem(questionQuantityStr, dest.length);
}

var cbTestId="";
var cbQuestionQuantity=0;

function showTestingStartPage(testId, questionQuantity) {
  var test = getTest(testId)
  if (!test) return;
  if (test.passw != "") {
    cbTestId = testId;
    cbQuestionQuantity = questionQuantity;
    showInput("Введите пароль для прохождения тестирования", "", true, onInputPassword, mrCancel);
    return;
  }
  startTesting(testId, questionQuantity);
}

function showTestingStartPageRepeat(testId, questionQuantity) {
  var test = getTest(testId)
  if (!test) {
    return;
  }
  if (test.passw_repeat != "") {
    cbTestId = testId;
    cbQuestionQuantity = questionQuantity;
    showInput("Введите пароль для повторного прохождения тестирования", "", true, onInputPasswordRepeat, mrCancel);
    return;
  }
  startTesting(testId, questionQuantity);
}

function onInputPasswordRepeat() {
  var test = getTest(cbTestId)
  if (!test) {
    return;
  }
  let pswd = modalPrompt;
  if (pswd === null) return;
  if (pswd != test.passw_repeat) {
    showMessage("Неверный пароль. Уточните пароль у преподавателя", mtInformation, 0, onFailurePasswordRepeat);
    return;
  }
  startTesting(cbTestId, cbQuestionQuantity);
}

function onInputPassword() {
  var test = getTest(cbTestId)
  if (!test) return;
  let pswd = modalPrompt;
  if (pswd === null) return;
  if (pswd != test.passw) {
    showMessage("Неверный пароль. Уточните пароль у преподавателя",mtInformation,0,onFailurePassword);
    return;
  }
  startTesting(cbTestId, cbQuestionQuantity);
}

function onFailurePassword()
{
  showTestingStartPage(cbTestId, cbQuestionQuantity);
}

function onFailurePasswordRepeat() {
  showTestingStartPageRepeat(cbTestId, cbQuestionQuantity);
}

function startTesting(testId, questionQuantity) {
  localStorage_setItem(currentTestId, testId);
  localStorage_setItem(questionQuantityStr, questionQuantity);
  document.location = "testfirstpage.html";
}

function getQuestionsArrayWithLevel(test, level) {
  const arr = test.all_questions.filter(item => item.level <= level);
  test.questions.length = 0;
  for (var i = 0; i < arr.length; i++)
    test.questions.push(arr[i]);
  setOrder(test.questions);
}

// Возвращает название уровня сложности
function diffNameByLevel(diffLevel) {
  switch(diffLevel) {
    case 3:
      return 'Достаточная';
    case 4:
      return 'Повышенная';
    case 5:
      return 'Высокая';
  }
  return 'Неизвестный';
}

// Преобразовывает дату в строку формата dd.mm.yyyy
function dateToStr(date) {
  return ("0" + date.getDate()).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + ("0" + date.getFullYear()).slice(-4);
}

// Включение обработки перехода по ссылкам на последующие главы курса в случае,
// если установлена опция "Последовательный переход между главами" в свойствах книги.
function enableAllowTransUrls() {
  window.addEventListener("load", () => {
    let items = document.querySelectorAll(".chapter-link");
    items.forEach(function(item) {
      item.addEventListener("click", e => {

        // Возвращает элемент нажатой ссылки (тэг "a")
        function findLink(item) {
          for (let it = item; it; it = it.parentElement) {
            if (it.tagName.toUpperCase() == "A") {
              return it;
            }
          }
          return null;
        }

        // Поиск элемента ссылки;
        // В параметр обработчика (e.target) могут попадать дочерние элементы ссылки (span, b, u, и т.д.)
        let item = findLink(e.target);
        if (!item) {
          return;
        }
        let id = item.id;
        // Проверка доступности главы
        if (id != "" && !allowTrans(id)) {
          e.preventDefault();
        }
      });
    });
  });
}

// Включение контекстного меню для элементов содержания.
// В контекстном меню содержания ЭУ отображается пункт "Открыть в новом окне".
// Опция предусмотрена только для уже пройденных разделов ЭУ.
function enableContextMenu() {
  window.addEventListener("load", () => {
    // Идентификатор главы, на которой вызвано контекстное меню
    var ctxMenuClickChapterId = null;
    var ctxMenu = null;
    const ctxMenuInnerHTML = `
        <li class="menu-item">
          <button id="btnOpenInNewTabId" type="button" class="menu-btn">
            <span id="spanOpenInNewTabId" class="menu-text">Открыть в новой вкладке</span>
          </button>
        </li>
        <li class="menu-item">
          <button id="btnOpenInNewWinId" type="button" class="menu-btn">
            <span id="spanOpenInNewWinId" class="menu-text">Открыть в новом окне</span>
          </button>
        </li>`;
    // Инициализация
    initContextMenu();

    // Инициализирует контекстное меню
    function initContextMenu() {
      ctxMenu = document.createElement('div');
      ctxMenu.className = "menu";
      document.body.append(ctxMenu);
      document.addEventListener('contextmenu', onContextMenu, false);
    }

    // Отображает контекстное меню
    function showContextMenu(x, y, menuInnerHTML = null) {
      ctxMenu.innerHTML = menuInnerHTML ?? ctxMenuInnerHTML;
      ctxMenu.style.left = x + 'px';
      ctxMenu.style.top = y + 'px';
      ctxMenu.classList.add('show-menu');
    }

    // Скрывает контекстное меню
    function hideContextMenu() {
      ctxMenu.classList.remove('show-menu');
    }

    // Обработчик пункта контекстного меню "Открыть в новой вкладке"
    function openInNewTabHandler(item) {
      if (item) {
        window.open(item + '.html');
      }
    }

    // Обработчик пункта контекстного меню "Открыть в новом окне"
    function openInNewWindowHandler(item) {
      if (item) {
        window.open(item + '.html', '', 'target=_blank');
      }
    }

    // Обработчик нажатия мыши после открытия контекстного меню
    function onMouseDownMenu(e) {
      hideContextMenu();
      document.removeEventListener('mousedown', onMouseDownMenu);
      // Проверка нажатия левой клавиши мыши
      if (e.which == 1 && e.target) {
        // Идентификация выбранного пункта меню
        if (e.target.id == 'btnOpenInNewTabId' || e.target.id == 'spanOpenInNewTabId') {
          openInNewTabHandler(ctxMenuClickChapterId);
        } else if (e.target.id == 'btnOpenInNewWinId' || e.target.id == 'spanOpenInNewWinId') {
          openInNewWindowHandler(ctxMenuClickChapterId);
        }
      }
    }

    // Обработчик нажатия мыши после открытия контекстного меню для скачивания файла
    function onMouseDownMenuFileDownload(e) {
      hideContextMenu();      
      document.removeEventListener("mousedown", onMouseDownMenuFileDownload);
      if (e.target && (e.button === 0 || e.which == 1)) {
        e.target.click();
      }
    }

    // Возвращает идентификатор главы элемента из дерева содержания
    function getChapterIdByElemInTree(elem) {
      if (!elem) {
        return null;
      }
      if (elem.tagName.toUpperCase() == 'A' && elem.classList.contains('jstree-anchor')) {
        // нажатие на ссылке
        return elem.id.substr(0, elem.id.length - '_anchor'.length);
      } else if (elem.tagName.toUpperCase() == 'I' && elem.classList.contains('jstree-themeicon')) {
        // нажатие на иконке
        return elem.parentNode.id.substr(0, elem.parentNode.id.length - '_anchor'.length);
      }
      return null;
    }

    function onContextMenu(e) {
      e.preventDefault();
      // Проверка нажатия правой клавиши мыши
      if (e.which != 3) {
          return;
      }
      let id = getChapterIdByElemInTree(e.target);
      if (!id) {
        let sss = "";
        if (
          e.target &&
          e.target.attributes &&
          e.target.attributes.filesrc
        ) {
          sss = e.target.attributes.filesrc.value;
        }
        if (sss) {
          const innerHTML = `
          <li class="menu-item">
            <a type="button" class="menu-btn" href='${sss}' class="menu-text" target="_blank">Скачать</a>
          </li>`;
          showContextMenu(e.pageX, e.pageY, innerHTML);
          document.addEventListener(
            "mousedown",
            onMouseDownMenuFileDownload,
            false
          );
        }
        return;
      }
      // Контекстное меню открывается только для изученных ранее глав
      let pd = getPageData(id);
      if (!pd || !pd.visited) {
        return;
      }
      ctxMenuClickChapterId = id;
      showContextMenu(e.pageX, e.pageY);
      document.addEventListener('mousedown', onMouseDownMenu, false);
    };
  });
}

// Рассчитывает процент (прогресс) изучения курса для передачи на сервер
function calcCourseProgress() {
  let count = 0;
  let visited = 0;
  for (chapterId in book.chapters) {
    if (isImportantChapter(book.chapters[chapterId])) {
      count++;
      if (book.chapters[chapterId].visited) {
        visited++;
      }
    }
  }
  // Процент изучения курса
  let courseprogress = 0;
  if (count > 0) {
    courseprogress = Math.round(visited / count * 100);
  }
  return courseprogress;
}

// Подсчитывает количество посещенных глав
function calcVisitedChapterCount() {
  let visited = 0;
  for (chapterId in book.chapters) {
    if (isImportantChapter(book.chapters[chapterId])) {
      if (book.chapters[chapterId].visited) {
        visited++;
      }
    }
  }
  return visited;
}

// Отправляет данные (прогресс) изучения курса.
// Добавляет или изменяет на сервере данные (прогресс) изучения курса.
// Проверяет, есть ли на сервер данные (прогресс) изучения курса.
// Добавляет - если нет, изменяет - если есть (Вызываются методы POST - новая запись или PUT - изменение).
// params - Подготовленные параметры (requestParams) для отправки после прохождения итогового теста.
// Если params заполнен, то в нем должно быть свойство onResponseFunc.
function sendCourseProgressData(params = null) {
  if (!needSendRequestData()) {
    return;
  }
  // Проверка - есть ли уже результаты курса с данным идентификатором
  let serverBaseUrl = getServerBaseUrl();
  let requestParams = {
    "params": params
  };
  sendRequestData(METHODS.GET, serverBaseUrl, URLS.COURSE + '?idcourse=' + book.bookId, requestParams, onCheckCourseResRespFunc);
}

// Обработчик проверки наличия результатов курса на сервере
function onCheckCourseResRespFunc(requestParams, responseData) {
  let method = METHODS.POST;
  let id = null;
  if (typeof(responseData.length) != "undefined" &&
      responseData.length > 0 &&
      typeof(responseData[0].id) != "undefined" &&
      responseData[0].id) {
    // Данные по курсу уже есть - надо их изменить
    method = METHODS.PUT;
    id = responseData[0].id;
  }
  apiCourseProgressData(method, id, requestParams.params);
}

// Добавляет или изменяет данные (прогресс) изучения курса (Вызываются методы POST или PUT).
function apiCourseProgressData(method, id, params) {
  if (!needSendRequestData()) {
    return;
  }
  // отправка результатов на сервер
  let serverBaseUrl = getServerBaseUrl();
  let requestParams = {};
  let onResponseFunc = null;
  if (params != null) {
    // Если указаны параметры, то данные курса уже подготовлены
    requestParams = params;
    onResponseFunc = params.onResponseFunc;
  } else {
    // Подготовка результатов курса
    prepareKursResults();
    requestParams = {
      objType: JSONOBJTYPE.COURSERESULT,
      obj: testres.kurs,
      method: method
    };
    onResponseFunc = onSendCourseProgressResponseFunc;
  }
  let apiPath = URLS.COURSE;
  if (id != null) {
    apiPath += "/" + id.toFixed();
  }
  sendRequestData(method, serverBaseUrl, apiPath, requestParams, onResponseFunc);
}

// Обработчик отправки результатов курса
function onSendCourseProgressResponseFunc(requestParams, responseData) {
  console.log("Прогресс изучения курса отправлен. Метод: " + requestParams.method);
}

// Преобразует строку в число
function strToIntDef(s, defval = 0) {
  let val = Number(s);
  return isNaN(val) ? defval : val;
}

// Возвращает идентификатор теста, который отправляется на сервер
function fullTestId(testId) {
  return book.bookId + "_" + testId;
}