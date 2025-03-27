const UPDATE_QUESTION_TIME = 1000;

// Идентификатор текущего теста
var curTestId = null;
// Данные текущего вопроса
var curQuestion = null;
// загрузка отложенных вопросов
var listPendingQuestions = [];
loadPendingQuestions();

function initTestRes(testId) {
  if (!testId) return;
  if (!testres.tests) testres.tests = {};
  var tres =
  {
    tryCount: 0,        // Количество попыток тестирования
    totalCount: 0,      // количество вопросов в тесте всего
    testId: testId,     // Идентификатор теста
    testResultFile: "", // Файл с результатами теста (короткое имя)
    timeLimit: 0,       // Ограничение времени теста в мс (0 - неограничено)
    testPhaze: "",      // Этап обучения
    testTitle: "",      // Имя теста
    // Инициализация результатов теста:
    questions: {},      // Результаты тестирования по вопросам (ключ - id вопроса)
    duration: 0,        // Длительность теста, в миллисекундах
    scores: {},         // Сумма баллов за ответы на все вопросы по темам (ключ - id темы)
    score: 0,           // Сумма баллов за ответы на все вопросы
    assessment: "",     // Оценка
    recommends: [],     // Рекомендации: содержимое полей "Комментарий" неправильно решенных вопросов  (массив: вопрос, комментарий)
    recommendsHtml: "", // Рекомендации: html-таблица - вопрос, комментарий
    isPendingQuestions: false, // Режим отображения отложенных вопросов
    isEnded: false,     // Признак того, что тест дошел до финальных результатов (пройден)
    passed: false,      // Признак того, что тест пройден по условию сдачи теста - баллам/процентам
    start: 0,           // Время первоначального нажатия ссылки на тест
                        // в миллисекундах после 01.01.1970 GMT+0  
  };
  // добавление в массив результатов тестов
  testres.tests[testId] = tres;
}

function getTestRes(testId) {
  if (!testId) return null;
  if (!testres.tests || !(testId in testres.tests)) initTestRes(testId);
  return testres.tests[testId];
}

// получить потраченное время для ответа на вопрос
function getQuestAnswerTime(question) {
  var tres = getTestRes(question.testId);
  if (!tres.questions[question.id].answerTime) tres.questions[question.id].answerTime = 0;
  return tres.questions[question.id].answerTime;
}

// установить потраченное время для ответа на вопрос
function setQuestAnswerTime(question, time) {
  var tres = getTestRes(question.testId);
  tres.questions[question.id].answerTime = time;
}

// Заполняет данные теста из данных вопроса
function FillTestResData(question) {
  var tres = getTestRes(question.testId);
  tres.totalCount = question.testQuestionCount; // количество вопросов в тесте всего
  tres.testResultFile = question.testResultFile; // Файл с результатами теста (короткое имя)
  tres.timeLimit = question.testTimeLimit; // Ограничение времени теста в мс (0 - неограничено)
  tres.testPhaze = question.testPhaze; // Этап обучения
  tres.testTitle = question.testTitle; // Имя теста
}

// Добавляет результат ответа на вопрос к результатам
function AddQuestionToRes(question, val, score, answertext) {
  var tres = getTestRes(question.testId);
  // признак ответа/пропуска
  tres.questions[question.id].result = val;
  // баллы за ответ
  tres.questions[question.id].score = score;
  // текст выбранного варианта ответа
  tres.questions[question.id].answertext = answertext;
  // сохранение результатов теста
  saveTestRes();
}

// Возвращает количество успешных ответов
function GetOkQuestionsCount(testId) {
  let tres = getTestRes(testId);
  let cnt = 0;
  for (let id in tres.questions)
    if (tres.questions[id].result == QUESTION_VAL_TRUE) cnt++;
  return cnt;
}

// Возвращает признак того, что на все вопросы есть ответы
function isAllAnswered(testId) {
  let tres = getTestRes(testId);
  for (let id in tres.questions)
    if (tres.questions[id].result != QUESTION_VAL_TRUE && tres.questions[id].result != QUESTION_VAL_FALSE) {
      return false;
    }
  return true;
}

//Подсчет вопросов в тесте с данным уровнем сложности
function questionDifficultyCount(testId) {
  var test = getTest(testId);
  if (!test) {
    return 0;
  }
  var difficulty = localStorage.getItem(currentTestingLevel);
  if (!difficulty) difficulty = '3';
  var counter = 0;
  for (var key in test.questions) {
    if (test.questions[key].level <= difficulty) {
      counter++;
    }
  }
  return counter;
}

// Возвращает cумму баллов за ответы на все вопросы
function getTestScore(testId) {
  var tres = getTestRes(testId);
  if (!tres) {
    return 0;
  }
  let Score = 0;
  for (let key in tres.questions) {
    Score += ToInt(tres.questions[key].score); 
  }
  return Score;
}

// Возвращает максимально возможное количество баллов для данного уровня сложности
function getTestMaxScoreByLevel(testId) {
  var test = getTest(testId);
  if (!test) {
    return 0;
  }
  var maxScore = 0;
  test.questions.forEach((question) => {
    maxScore += ToInt(question.maxscore);			
  });	
  return maxScore;
}

// Обновляет информацию для текущего вопроса на странице
function updateCurQuestionInfo(question) {

  function btnPendDisable () {  
    // Настройка кнопки "Отложить вопрос"
    item = document.getElementById("btnPend");
    if (item) {
      item.setAttribute("disabled", "disabled");
    }
  } 

  function ScoreToStr(score) {
    // Преобразует значение баллов в строку
	score = Math.abs(score) % 100; 
	var num = score % 10;
	if(score > 10 && score < 20) return score + ' баллов'; 
	if(num > 1 && num < 5) return score + ' балла';
	if(num == 1) return score + ' балл'; 
	return score + ' баллов';
  }

  var cnt_ok = GetOkQuestionsCount(question.testId);
  var item = document.getElementById("OkAnswersCountId");
  if (item) {
    item.innerHTML = cnt_ok;
  }
  item = document.getElementById("OkAnswersScoreId");
  if (item) {
    let score = getTestScore(question.testId);
    item.innerHTML = ScoreToStr(score);
  }

  let qu = localStorage.getItem(questionQuantityStr);
  if (isPreview) {
    let test = getTest(question.testId);
    if (test) {
      qu = test.questions.length;
    }
  }
  let num = parseInt(question.order) + 1;
  item = document.getElementById("QuestionTitleOrder");
  if (item) {
    item.innerText = "Вопрос №" + num + " из " + qu;
  }
  // Настройка доступности кнопки "Подсказка"
  item = document.getElementById("btnPrompt");
  if (item && (question.prompt == "")) {
    item.setAttribute("disabled", "disabled");
  }
  // Настройка кнопки "Следующий вопрос"
  item = document.getElementById("btnNext");
  if (item) {
    if (question.nextId == "") {
      item.innerText = "Перейти к результатам";
    } else {
      item.innerText = "Следующий вопрос";
    }
  }
  let tres = getTestRes(question.testId);
  if (tres.isPendingQuestions || listPendingQuestions.indexOf(question.id) != -1) {
    // Запрет на повторное откладывание
    btnPendDisable();
  }	
  if (checkQuestionWithAnswer(question)) {
    // Блокировка выбора ответа для вопросов, на которые был дан ответ
    switch (question.type) {
    case QUESTION_TYPE_ORDERED:
      item = document.getElementById("orderedList");
      item.setAttribute("sort", false);
      btnPendDisable();
      break;
    case QUESTION_TYPE_MATCHED:
      item = document.getElementById("matchedList1");
      item.setAttribute("sort", false);
      item = document.getElementById("matchedList2");
      item.setAttribute("sort", false);
      btnPendDisable();
      break;
    default:
      $("#answersId *").prop('disabled', true);
      btnPendDisable();
    }  
  }	
}

// Преобразовывает период времени (в миллисекундах) в зависимости от формата format 'hh:mm:ss' или 'dd дн hh ч mm мин'
// По умолчанию формат hh:mm:ss
function timePeriodToStr(period, format = "") {

  // Добавляет текст через пробел
  function addStr(str, add) {
    let s = str;
    if (s != "") {
      s += " ";
    }
    return s + add;
  }

  var sec = Math.floor(parseInt(period) / 1000);

  let days = Math.floor(sec / 86400);
  var remain = sec > 0 ? (sec % 86400) : 0;
  var hours  = Math.floor(remain / 3600);
  remain = (remain % 3600);
  var minutes = Math.floor(remain / 60);
  remain = (remain % 60);
  var seconds = Math.floor(remain);

  if (format == "" || format == "hh:mm:ss") {
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  let s = "";
  if (days > 0) {
    s = addStr(s, ("0" + days).slice(-2) + " дн");
  }
  if (hours > 0) {
    s = addStr(s, ("0" + hours).slice(-2) + " ч");
  }
  if (minutes > 0 || s == "") {
    s = addStr(s, ("0" + minutes).slice(-2) + " мин");
  }
  return s;
}

function showRemainTime(elemId, remainTime) {
  if (elemId == "") return;
  let elem = document.getElementById(elemId);
  if (!elem) return;
  let str = timePeriodToStr(remainTime);
  if (remainTime < 15000)
    str = "<font color=red><b>" + str + "</b></font>";
  else if (remainTime < 30000)
    str = "<font color=#FF9900><b>" + str + "</b></font>";
  elem.innerHTML = str;
}

// Обновляет таймеры: "Время до завершения теста" и "Время до завершения ответа на вопрос"
function updateQuestionTime() {
  // остаток времени на тест
  var timeLimit = Number(testres.tests[curTestId].timeLimit);
  if (timeLimit > 0) {
    var duration = calcDuration(Number(testres.tests[curTestId].start)); // длительность теста в мс
    var remaining = timeLimit - duration;
    showRemainTime("remainTestId", remaining);
    if (remaining <= 0) {
      // Обработать ответ вопроса, на котором был завершен тест по таймауту
      finishTimeOutQuestion(curQuestion);
      // время вышло, завершить тест
      finishTestAndGoResult(curQuestion);
     return;
    }
  }
  // подсчет времени ответа на вопрос
  // проверка остатка времени на вопрос
  curQuestion.answerTime = curQuestion.answerTime + UPDATE_QUESTION_TIME;
  setQuestAnswerTime(curQuestion, curQuestion.answerTime);
  if (curQuestion.timeLimit > 0) {
    var remaining = curQuestion.timeLimit - curQuestion.answerTime;
    showRemainTime("remainQuestId", remaining);
    if (remaining <= 0) {
      // время вышло, перейти к следующему вопросу
      nextQuestion(curQuestion);
      return;
    }
  }
  // запуск следующего обновления
  setTimeout(updateQuestionTime, UPDATE_QUESTION_TIME);
}

// Запускает тест.
// Выполняется при загрузке страницы с первым вопросом.
// Обновляет значения параметров.
function initTest(testId) {
  setNextTestMode(false);
  var test = getTest(testId);
  var tres = getTestRes(testId);
  // Инициализация результатов теста:
  tres.duration = 0;               // Длительность теста, в миллисекундах
  tres.scores = {};                // Сумма баллов за ответы на все вопросы по темам (ключ - id темы)
  tres.score = 0;                  // Сумма баллов за ответы на все вопросы
  tres.assessment = "";            // Оценка
  tres.recommends = [];            // Рекомендации: содержимое полей "Комментарий" неправильно решенных вопросов 
  tres.recommendsHtml = "";
  tres.isPendingQuestions = false; // Режим отображения отложенных вопросов
  tres.isEnded = false;            // Признак того, что тест дошел до финальных результатов (пройден)
  // инициализация вопросов
  tres.questions = {};
  if (test) {
    for (let i = 0; i < test.questions.length; i++) {
      let themeId = test.questions[i].themeId;
      tres.questions[test.questions[i].id] =
      {
        result: "",       // признак правильности ответа
                          // ответили верно:   "true"
                          // ответили неверно: "false"
                          // пропустили:       "skip"
        score: 0,         // баллы за варианты ответов
        themeId: themeId, // ид. темы вопроса
        answer: "",       // ответ на вопрос (значение зависит от типа вопроса)
        answerTime: 0,    // затраченное время для ответа на вопрос в мс
      };
      tres.scores[themeId] = 0; // сумма баллов по теме
    }
  }
  // Время начала теста, в миллисекундах после 01.01.1970 GMT+0  
  tres.start = (new Date()).getTime(); // Время первоначального нажатия ссылки на тест
  // Новая попытка
  tres.tryCount++; // Количество попыток тестирования
  // сохранение результатов теста
  saveTestRes();
  // очистка отложенных вопросов
  localStorage.setItem(CSPENDINGQUESTIONS, "");
  listPendingQuestions = [];
  // очистка результатов последнего прохождения курса в кэше
  localStorage_removeItem(LastCourseDataId);
}

// Инициализирует вопрос.
// Выполняется при загрузке страницы с вопросом.
function initQuestion(question) {
  setNextTestMode(false);
  FillTestResData(question);
  shuffleAnswers(question);
  restoreUserAnswer(question);
  setFocus(question);
  curTestId = question.testId;
  curQuestion = question;
  // восстановление оставшегося времени ответа на вопрос
  curQuestion.answerTime = getQuestAnswerTime(curQuestion);
  // Запуск таймера обновления оставшегося времени
  setTimeout(updateQuestionTime, UPDATE_QUESTION_TIME);
}

// Перемешивает ответы.
function shuffleAnswers(question) {
  if (!question.testRandomizeAnswers) {
    return;
  }
  switch (question.type) {
    case QUESTION_TYPE_SINGLE:
    case QUESTION_TYPE_MULTI:
      shuffleChildren("answersId", false);
      break;
    case QUESTION_TYPE_ORDERED:
      shuffleChildren("orderedList");
      break;
    case QUESTION_TYPE_MATCHED:
      shuffleChildren("matchedList1");
      shuffleChildren("matchedList2");
      break;
  }
}

// Перемешивает непосредственные потомки элемента с идентификатором parentId.
// Если isFullShuffle = true, то гарантируется, что после перемешивания не будет совпадения с исходным порядком.
function shuffleChildren(parentId, isFullShuffle = true) {
  var parent = document.getElementById(parentId);
  if (!parent) {
    return;
  }
  var children = parent.children;
  let items = Array.prototype.slice.call(children);
  // Сохранение первого элемента
  let firstItem = null;
  if (isFullShuffle && items.length > 2) {
    firstItem = items[0];
  }
  // Перемешивание
  while (items.length) {
    parent.append(items.splice(Math.floor(Math.random() * items.length), 1)[0]);
  }
  // Если первый элемент не перемешался, то перемещение его в конец
  if (firstItem && children.length > 0 && children[0] == firstItem) {
    parent.append(firstItem);
  }
}

function ToFloat(value) {
  var val = value;
  if (typeof(val) == "string") {
    val = val.replace(",", ".");
  }
  return parseFloat(val);
}

function ToInt(value) {
  var val = value;
  val = parseInt(val);
  val = isNaN(val) ? 0 : val;
  return val
}

// Возвращает длительность в миллисекундах.
// startMsec - начало в миллисекундах.
function calcDuration(startMsec) {
  var start_date = new Date(startMsec);
  return (new Date(new Date() - start_date)).getTime();
}

// Завершает тест.
// Выполняется перед переходом к странице с результатами.
// Подготовка результатов теста.
// question - данные последнего вопроса.
function finishTest(question) {

  // Тест пройден - true
  function IsTestPassed(test) {
    if (test.testPassType == "score") {
      // условие сдачи теста - в баллах
      return test.testPassValue <= tres.score;
    }
    // условие сдачи теста - в процентах
    return test.testPassValue <= tres.percentnum;
  }
  
  // Расчет оценки
  function CalcAssessment(test) {
    var value = (test.assessmentType == "score") ? tres.score : tres.percentnum;
    let minIndex = null; // Индекс минимального диапазона баллов
    let maxIndex = null; // Индекс максимального диапазона баллов
    for (var i = 0; i < test.assessmentsArray.length; i++) {
      if (test.assessmentsArray[i].low <= value && value <= test.assessmentsArray[i].hi) {
        return test.assessmentsArray[i].value;
      }
      if (test.assessmentsArray[i].low <= test.assessmentsArray[i].hi) { // Проверка правильности интервала
        if (minIndex != null && test.assessmentsArray[minIndex].low > test.assessmentsArray[i].low || minIndex == null) {
          minIndex = i;
        }
        if (maxIndex != null && test.assessmentsArray[maxIndex].hi < test.assessmentsArray[i].hi || maxIndex == null) {
          maxIndex = i;
        }
      }
    }
    // Не найден диапазон, в который попали бы набранные баллы
    if (minIndex != null && value < test.assessmentsArray[minIndex].low) {
      // Меньше левой границы минимального диапазона - минимальная оценка
      return test.assessmentsArray[minIndex].value;
    }
    if (maxIndex != null && value > test.assessmentsArray[minIndex].hi) {
      // Больше правой границы максимального диапазона - максимальная оценка
      return test.assessmentsArray[maxIndex].value;
    }
    return "";
  }

  var tres = getTestRes(question.testId);
  if (question) {
    FillTestResData(question);
  }

  // Сброс режима отображения отложенных вопросов
  tres.isPendingQuestions = false;

  // Длительность теста
  tres.duration = calcDuration(Number(tres.start));

  // Сумма баллов за ответы на все вопросы
  // и Рекомендации: содержимое полей "Комментарий" неправильно решенных вопросов
  tres.scores = {}; // очистка баллов
  tres.score = getTestScore(question.testId);
  tres.recommends = [];
  tres.recommendsHtml = "";
  // Подсчет баллов по темам
  let test = getTest(question.testId);
  if (test) {
    test.questions.forEach((item) => {
      var questionVal = tres.questions[item.id].result;
      if (typeof(questionVal) != "undefined") {
        if (questionVal == QUESTION_VAL_TRUE) {
          let score = tres.scores[item.themeId] == undefined ? 0 : tres.scores[item.themeId];
          tres.scores[item.themeId] = score + ToInt(tres.questions[item.id].score);
        }
        if (questionVal == QUESTION_VAL_FALSE && item.comment) {
          tres.recommends.push({
            question: item.q_text,
            comment: item.comment
          });
          tres.recommendsHtml += `<tr><td>${item.q_text}</td><td>${item.comment}</td></tr>`;
        }
      }
    });    
  }
  if (tres.recommendsHtml != "") {
    tres.recommendsHtml = '<table class="table table-bordered disable_no_night"><thead><tr><th scope="col">Вопрос</th><th scope="col">Комментарий</th></tr></thead><tbody>' +
    tres.recommendsHtml + '</tbody></table>';
  }

  // Процент правильных ответов
  tres.percentnum = 0;
  let maxScore = getTestMaxScoreByLevel(question.testId);
  if (maxScore > 0) {
    tres.percentnum = tres.score / maxScore * 100;
  }
  tres.percent = (tres.percentnum).toFixed();

  // вычисление оценки
  tres.assessment = CalcAssessment(question);

  // Пройден ли тест
  if (IsTestPassed(question)) {
    tres.passed = true;
  } else {
    tres.passed = false;
  }

  // Признак того, что тест дошел до финальных результатов (пройден)
  tres.isEnded = true;

  if (question.testPhaze == TEST_TYPE_FINAL) {
    prepareKursResults();
  }

  // сохранение результатов теста
  saveTestRes();
  setNextTestMode(false);
}

// Подготовка результатов курса
function prepareKursResults() {

  // количество пройденных тестов
  function getEndedCount() {
    var count = 0;
    for (var key in testres.tests) {
      var tres = testres.tests[key];
      if (tres.isEnded || tres.isEnded == "true") {
        count++;
      }
    }
    return count;
  }

  // Формирует рекомендации по итогам изучения курса
  function makeRecommends(tests) {
    testres.kurs.recommends = [];
    testres.kurs.recommendsHtml = "";
    for (var tkey in tests) {
      var test = tests[tkey];
      var tres = testres.tests[tkey];
      if (!tres || typeof(tres) == "undefined") {
        continue;
      }
      test.questions.forEach(function(item, i, arr)
      {
        if (item.id in tres.questions) {
          var questionVal = tres.questions[item.id].result;
          if (typeof(questionVal) != "undefined" && questionVal == QUESTION_VAL_FALSE && item.comment) {
            testres.kurs.recommends.push({
              question: item.q_text,
              comment: item.comment
            });
            testres.kurs.recommendsHtml += `<tr><td>${item.q_text}</td><td>${item.comment}</td></tr>`;
          }
        }
      });    
    }
    if (testres.kurs.recommendsHtml != "") {
      testres.kurs.recommendsHtml = '<table class="table table-bordered disable_no_night"><thead><tr><th scope="col">Вопрос</th><th scope="col">Комментарий</th></tr></thead><tbody>' +
        testres.kurs.recommendsHtml + '</tbody></table>';
    }
  }

  // Оценка за итоговый тест
  function getAssessmentByPhaze(phaze) {
    for (var key in testres.tests) {
      var tres = testres.tests[key];
      if (tres.testPhaze == phaze) {
        if (typeof tres.assessment == "undefined" || !tres.assessment) {
          tres.assessment = "";
        }
        return tres.assessment;
      }
    }
    return "";
  }

  testres.kurs = {};
  testres.kurs.courseTitle = book.title;
  testres.kurs.bookId = book.bookId;

  // Пройденные тесты
  testres.kurs.passedtests = [];
  testres.kurs.passedtestsHtml = "";
  for (let key in testres.tests) {
    let tres = testres.tests[key];
    if (tres.isEnded || tres.isEnded == "true") {
      if (typeof tres.assessment == "undefined" || !tres.assessment) {
        tres.assessment = "";
      }
      testres.kurs.passedtestsHtml += `<tr><th scope="row">${tres.testTitle}</th><td>${tres.assessment}</td></tr>`;
      let pass_test = {};
      pass_test.testname = tres.testTitle;
      pass_test.score = tres.assessment;
      testres.kurs.passedtests.push(pass_test);
    }
  }
  // Оценка за итоговый тест
  testres.kurs.finaltestscore = getAssessmentByPhaze(TEST_TYPE_FINAL);

  // Процент изучения курса
  testres.kurs.courseprogress = calcCourseProgress();
  // Начало изучения курса, в миллисекундах после 01.01.1970 GMT+0
  // Использование информации о последнем прохождении курса с сервера, если есть данные
  testres.kurs.start = (LastCourseData && LastCourseData.enterDate) ? LastCourseData.enterDate.getTime() : book.enterDate.getTime();
  // Если пройден итоговый тест или пройдены все разделы курса
  if (testres.kurs.finaltestscore != "" || testres.kurs.courseprogress == 100) {
    // Дата завершения изучения курса, в миллисекундах после 01.01.1970 GMT+0
    testres.kurs.enddate = new Date().getTime();
    testres.kurs.status = 3; // Курс завершен
  } else {
    testres.kurs.enddate = null;
    // Количество посещенных разделов (глав)
    let visited_count = calcVisitedChapterCount();
    if (visited_count == 1) {
      testres.kurs.status = 1; // Курс в начале изучения
    } else if (visited_count > 1) {
      testres.kurs.status = 2; // Курс в процессе изучения (больше одной главы изучено)
    }
  }
  // Время изучения курса
  testres.kurs.duration = timePeriodToStr(testres.kurs.enddate - testres.kurs.start, 'dd дн hh ч mm мин');
  // Результат изучения курса (отношение числа пройденных тестов к общему числу тестов в курсе) * 100%
  testres.kurs.testsPercent = 0;
  testres.kurs.recommends = [];
  testres.kurs.recommendsHtml = "";
  var tests = getTests();
  if (tests) {
    if (Object.keys(tests).length > 0) {
      testres.kurs.testsPercent = Math.round(getEndedCount() / Object.keys(tests).length * 100);
    }
    // Рекомендации по итогам изучения курса
    makeRecommends(tests);
  }
}

// Подготавливает данные теста для отправки на сервер (тема, список вопросов)
function prepareTestDataToSend(testId) {
  let test = getTest(testId);
  let tres = getTestRes(testId);
  // Идентификатор курса
  tres.bookId = book.bookId;
  // Идентификатор теста
  tres.fullTestId = fullTestId(testId);
  // тема
  tres.theme = test.theme;
  // вопросы
  tres.send_questions = [];
  for (let id in tres.questions) {
    // Поиск вопроса в массиве
    let index = test.questions.findIndex(item => item.id == id);
    // Текст вопроса
    let q_text = (index >= 0) ? test.questions[index].q_text : "";
    // Текст темы вопроса
    let q_theme = (index >= 0) ? test.questions[index].theme : "";
    // Комментарий к вопросу (рекомендация)
    let q_comment = (index >= 0) ? test.questions[index].comment : "";
    let item = {
      question: q_text,
      result: tres.questions[id].result,
      answertext: tres.questions[id].answertext,
      theme: q_theme,
      comment: q_comment
    };
    if (!item.result) {
      item.result = QUESTION_VAL_UNKNOWN;
    }
    tres.send_questions.push(item);
  }
}

// Заполняет результаты теста на странице
function showTestResults(test) {
  setNextTestMode(false);
  var tres = getTestRes(test.testId);

  // Процент правильных ответов
  var item = document.getElementById("OkAnswersPercentId");
  if (item) {
    item.innerHTML = tres.percent + "%";
  }
  // Время первоначального нажатия ссылки на тест
  var item = document.getElementById("StartTimeId");
  if (item) {
    var start_date = new Date(Number(tres.start));
    var startDateStr = start_date.toLocaleString("en-GB", {
      month : "2-digit",
      day : "2-digit",
      hour : "2-digit",
      minute : "2-digit"
    });
    startDateStr = startDateStr.replace("/", ".");
    startDateStr = startDateStr.replace(",", "");
    item.innerHTML = startDateStr;
  }
  // Длительность теста
  var item = document.getElementById("DurationId");
  if (item) {
    item.innerHTML = timePeriodToStr(Number(tres.duration)); // hh:mm:ss
  }
  // Баллы по темам
  for (var themeId in tres.scores) {
    var item = document.getElementById(themeId);
    if (item) {
      item.innerHTML = tres.scores[themeId];
    }
  }
  // Сумма баллов за ответы на все вопросы
  var item = document.getElementById("ScoreId");
  if (item) {
    item.innerHTML = tres.score;
  }
  // Оценка
  var item = document.getElementById("AssessmentId");
  if (item) {
    item.innerHTML = tres.assessment;
  }
  // Пройден, не пройден
  var item = document.getElementById("PassId");
  var passedStr;
  if (item) {
    if (tres.passed == true || tres.passed == "true") {
      passedStr = "Пройден";
    } else {
      passedStr = "Не пройден";
    }
    item.innerHTML = passedStr;
  }
  // Рекомендации: содержимое полей "Комментарий" неправильно решенных вопросов
  var item = document.getElementById("RecommendsId");
  if (item) {
    item.innerHTML = tres.recommendsHtml;
  }

  if (tres.testPhaze == TEST_TYPE_FINAL) {
    showKursResults(test);
  }

  // сохранение результатов теста
  saveTestRes();

  // отправка результатов на сервер, если не упражнение
  if (test.destination !== TEST_DEST_EXERCISE && needSendRequestData()) {
    let serverBaseUrl = getServerBaseUrl();
    prepareTestDataToSend(test.testId);
    let requestParams = {
      objType: JSONOBJTYPE.TESTRESULT,
      obj: tres
    };
    sendRequestData(METHODS.POST, serverBaseUrl, URLS.TESTS, requestParams, onSendResultsResponseFunc);
  }
}

function onSendResultsResponseFunc(requestParams, responseData) {
  if (requestParams.obj.passedtests) {
    // сохранение результатов курса
    showMessage("Результаты итогового теста сохранены. Прохождение курса завершено.");
  } else if (requestParams.obj.testPhaze) {
    // сохранение результатов теста
    showMessage("Результаты теста сохранены.");
  } else {
    showMessage("Успешно сохранено.");
  }
}

// Заполняет результаты курса на странице.
// test - данные итогового теста (из шаблона testres)
function showKursResults(test) {

  // Процент правильных ответов за тест
  function getTestPercent(testId) {
    var tres = testres.tests[testId];
    if (typeof tres.percent == "undefined" || !tres.percent || tres.percent == "") {
      tres.percent = 0;
    }
    var val = Number(tres.percent);
    return isNaN(val) ? 0 : val;
  }

  function getBackColorForChart(index, tres) {
    if (tres.testPhaze == TEST_TYPE_FINAL) {
      return CHART_BACK_COLOR_FINAL;
    }
    let colorIndex = index % CHART_BACK_COLORS.length;
    return CHART_BACK_COLORS[colorIndex];
  }

  function getBorderColorForChart(index, tres) {
    if (tres.testPhaze == TEST_TYPE_FINAL) {
      return CHART_BORDER_COLOR_FINAL;
    }
    let colorIndex = index % CHART_BORDER_COLORS.length;
    return CHART_BORDER_COLORS[colorIndex];
  }

  // Результат изучения курса
  var item = document.getElementById("KursResultId");
  if (item) {
    item.innerHTML = testres.kurs.testsPercent + "%";
  }
  
 //время изучения курса
  var item = document.getElementById("KursDurationId");
  if (item) {
    item.innerHTML = testres.kurs.duration;
  }

  // Рекомендации по итогам изучения курса
  var item = document.getElementById("KursRecommendsId");
  if (item) {
    item.innerHTML = testres.kurs.recommendsHtml;
  }

  // Процент изучения курса
  var item = document.getElementById("KursPercentId");
  if (item) {
    item.innerHTML = testres.kurs.courseprogress + "%";
  }

  // Пройденные тесты
  var item = document.getElementById("PassedTestsRowId");
  if (item && testres.kurs.passedtestsHtml != "") {
    item.insertAdjacentHTML('afterend', testres.kurs.passedtestsHtml);
  }

  // Прогресс по результатам изучения курса
  var ctx = document.getElementById('KursProgressId').getContext('2d');

  let data = []; // Данные диаграммы
  let labels = []; // Подписи столбцов диаграммы
  let backgroundColor = []; // Цвета столбцов
  let borderColor = []; // Цвета рамок столбцов
  let finalDataSetIndex = -1; // Порядковый номер итогового теста
  for (var key in testres.tests) {
    var tres = testres.tests[key];
    if (tres.isEnded || tres.isEnded == "true") {
      let value = getTestPercent(key);
      if (tres.testPhaze == TEST_TYPE_FINAL) {
        finalDataSetIndex = data.length;
      }
      let testDateStr = dateToStr(new Date(tres.start));
      backgroundColor.push(getBackColorForChart(data.length, tres));
      borderColor.push(getBorderColorForChart(data.length, tres));
      labels.push(`${tres.testTitle} (${testDateStr})`);
      data.push(value);
    }
  }
  if (finalDataSetIndex >= 0) {
    // Перемещение итогового теста в конец списка
    data.push(data.splice(finalDataSetIndex, 1)[0]);
    labels.push(labels.splice(finalDataSetIndex, 1)[0]);
    backgroundColor.push(backgroundColor.splice(finalDataSetIndex, 1)[0]);
    borderColor.push(borderColor.splice(finalDataSetIndex, 1)[0]);
  }

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Процент правильных ответов (%)',
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Процент правильных ответов в тестах',
        position: 'top'
      },
      tooltips: {
        enabled: true
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  
  if (needSendRequestData()) {
    // отправка результатов на сервер
    let requestParams = {
      objType: JSONOBJTYPE.COURSERESULT,
      obj: testres.kurs,
      onResponseFunc: onSendResultsResponseFunc
    };
    LastCourseData = JSON.parse(localStorage_getItem(LastCourseDataId));
    if (LastCourseData &&
        typeof(LastCourseData.responseData) != "undefined" &&
        LastCourseData.responseData) {
      if (typeof(LastCourseData.enterDate) == "string") {
        LastCourseData.enterDate = ISOStringToDate(LastCourseData.enterDate);
      }
      // Данные курса уже есть, достаточно выполнить PUT
      onCheckCourseResRespFunc({ "params": requestParams }, LastCourseData.responseData);
    } else {
      // По каким-то причинам LastCourseData оказался незаполненным, поэтому надо выполнить сначала GET, потом POST или PUT
      sendCourseProgressData(requestParams);
    }
  }
}

// Завершает тест и переходит на страницу с результатами.
// В случае итогового теста предварительно запрашивает данные последнего прохождения курса с сервера.
function finishTestAndGoResult(question) {
  if (question.testPhaze == TEST_TYPE_FINAL && needSendRequestData()) {
    // Получение результатов последнего прохождения курса.
    let serverBaseUrl = getServerBaseUrl();
    let requestParams = {
      question: question
    };
    sendRequestData(METHODS.GET, serverBaseUrl, URLS.COURSE + '?idcourse=' + book.bookId, requestParams, onGetCourseResultsResponseFunc);
    return;
  }
  finishTestAndGoResultProc(question);
}

// Завершает тест и переходит на страницу с результатами
function finishTestAndGoResultProc(question) {
  // результаты
  finishTest(question);
  setNextTestMode(true);
  document.location = question.testResultFile + '.html';
}

// Данные последнего прохождения курса
var LastCourseData = null;

function onGetCourseResultsResponseFunc(requestParams, responseData) {
  LastCourseData = {
    "responseData": [{id: null}]
  };
  if (typeof(responseData.length) != "undefined" &&
      responseData.length > 0 &&
      typeof(responseData[0].startdate) != "undefined") {
    LastCourseData.enterDate = ISOStringToDate(responseData[0].startdate);
    LastCourseData.responseData[0].id = responseData[0].id;
    localStorage_setItem(LastCourseDataId, JSON.stringify(LastCourseData));
  }
  finishTestAndGoResultProc(requestParams.question);
}

var aCurQuest=null; // для процедуры обработки события модального окна

// Обрабатывает ответ вопроса, на котором был завершен тест по таймауту
function finishTimeOutQuestion(question) {
  // сохранение ответа на текущий вопрос
  saveUserAnswer(question);
  FillTestResData(question);
  checkres = checkAnswer(question);
  if (checkres.ok == true) {
    // добавление успешного ответа в результаты
    AddQuestionToRes(question, QUESTION_VAL_TRUE, checkres.score, checkres.answertext);
  } else {
    let val = checkIsEmptyAnswer(question) ? QUESTION_VAL_EMPTY : QUESTION_VAL_FALSE;
    // добавление неверного ответа в результаты
    AddQuestionToRes(question, val, checkres.score, checkres.answertext);
  }
}

// Проверяет, можно ли запускать тест (не закончились ли попытки тестирования).
// Отображает сообщение, если попытки закончились, и возвращает false.
function canStartTest(testId) {
  let test = getTest(testId);
  let tres = getTestRes(testId);
  let testIsOver = ((test.tryLimit > 0) && (tres.tryCount >= test.tryLimit));
  if (testIsOver) {
    showMessage(`Попытки сдачи теста закончились: ${test.tryLimit}`);
  }
  return !testIsOver;
}

// Обрабатывает ответ текущего вопроса (перед переходом к следующему вопросу или перед завершением теста).
// isNextMessage = true, отображает сообщения перед переходом к следующему вопросу.
// возвращает can_next:false, если переход к следующему вопросу невозможен.
function saveAnswer(question, isNextMessage) {
  // Результат функции
  ret = {
    'can_next': false, // возможность перехода к следующему вопросу
    'answer_ok': false // результат ответа: верный/неверный
  };
  // сохранение ответа на текущий вопрос
  saveUserAnswer(question);
  FillTestResData(question);
  checkres = checkAnswer(question);
  ret.answer_ok = checkres.ok;
  if (checkres.ok == true) {
    // добавление успешного ответа в результаты
    AddQuestionToRes(question, QUESTION_VAL_TRUE, checkres.score, checkres.answertext);
  } else {
    let timeOut = (question.timeLimit > 0 && question.answerTime >= question.timeLimit);
    let isEmptyAnswer = checkIsEmptyAnswer(question);
    if (!timeOut && isEmptyAnswer) {
      // время не вышло, но ответ не выбран
      aCurQuest = question;
      let msg = (question.nextId == "") ? "Ответ на последний вопрос не выбран. Перейти к результатам теста?" :
        "Ответ не выбран. Перейти к следующему вопросу?";
      showConfirmation(msg, onGoNextQuestion);
      return ret;
    } else {
      let val = isEmptyAnswer ? QUESTION_VAL_EMPTY : QUESTION_VAL_FALSE;
      // добавление неверного ответа в результаты
      AddQuestionToRes(question, val, checkres.score, checkres.answertext);
    }
  }
  ret.can_next = true;
  return ret;
}

// Переходит к следующему вопросу
function nextQuestion(question) {
  let answer = saveAnswer(question, true);
  if (!answer.can_next) {
    return;
  }
  // Если дали ответ на отложенный вопрос, то удаляем его из списка отложенных вопросов
  var idx = listPendingQuestions.indexOf(question.id)
  if (idx != -1) {
    listPendingQuestions.splice(idx);
    localStorage.setItem(CSPENDINGQUESTIONS, JSON.stringify(listPendingQuestions));	
  }  
  showAnswerResultAndGoNext(question, answer.answer_ok);
}

// Отображает сообщение с результатом ответа на вопрос.
// После закрытия сообщения переходит к следующей странице.
function showAnswerResultAndGoNext(question, answerRes) {
  aCurQuest = question;
  if (!question.testStatusDisplayResultAnswer) {
    toNextQuestionProc();
    return;
  }
  // блокировка ответов
  switch (question.type) {
  case QUESTION_TYPE_ORDERED:
    item = document.getElementById("orderedList");
    item.setAttribute("sort", false);
    break;
  case QUESTION_TYPE_MATCHED:
    item = document.getElementById("matchedList1");
    item.setAttribute("sort", false);
    item = document.getElementById("matchedList2");
    item.setAttribute("sort", false);
    break;
  default:
    $("#answersId *").prop('disabled', true);
  }
  showConfirmation(answerRes ? 'Ответ верный.' : 'Ответ неверный.', toNextQuestionProc, ["OK"]);
}

// Переходит к следующему вопросу из сообщения
function onGoNextQuestion() {
  if (modalResult == mrYes && aCurQuest) {
    toNextQuestionProc();;
  }
}

// Переходит к следующей странице. Должна быть проинициализирована переменная aCurQuest (текущий вопрос).
function toNextQuestionProc() {
  if (aCurQuest) {
    // проставить признак перехода на другой вопрос того же теста
    setNextTestMode(true);
    // переход к следующей странице
    toNextQuestion(aCurQuest);
  }
}

function toNextQuestion(question) {
  var tres = getTestRes(question.testId);
  if (question.nextId == "" || tres.isPendingQuestions) {
    // переход к отложенным вопросам
    if (listPendingQuestions.length > 0) {
      if (!tres.isPendingQuestions) {
        aCurQuest = question;
        showConfirmation("Выберите следующее действие", onConfirmPending, ["Перейти к отложенным вопросам", "Показать результаты тестирования"]);
      }
      else
        nextPendingQuestion();
    } else 
      finishTestAndGoResult(question);
    return;
  }
  // выполнить переход
  document.location = question.nextId + '.html';
}

// Обрабатывает нажатие кнопки "Завершить тест" (досрочное завершение теста)
function breakTest(question) {
  // Сохранение ответа текущего вопроса
  saveAnswer(question, false);
  let xIsAllAnswered = isAllAnswered(question.testId);
  // Если на все вопросы даны ответы и вопрос последний, то нет смысла задавать вопрос при нажатии на кнопку "Завершить тест".
  if (question.nextId == "" && xIsAllAnswered) {
    finishTestAndGoResult(question);
    return;
  }
  aCurQuest = question;
  showConfirmation("Подтвердите завершение теста.", onConfirmBreakTest);
}

// Обрабатывает подтверждение о досрочном завершении теста
function onConfirmBreakTest() {
  if (modalResult != mrYes) {
    return;
  }
  finishTestAndGoResult(aCurQuest);
}

// Отображает подсказку для вопроса
function ShowQuestionPrompt(question) {
  showMessage(question.prompt);
}

function onConfirmPending() {
  if (modalResult == mrYes) {
    var tres = getTestRes(aCurQuest.testId);
    if (!tres.isPendingQuestions) {
      tres.isPendingQuestions = true;
      saveTestRes();
    }
    nextPendingQuestion();
  } else {
    listPendingQuestions.length = 0; // очистить список отложенных вопросов
    finishTestAndGoResult(aCurQuest);
  }
}

// Отложить вопрос
function putQuestion(question) {
  // переход к следующей странице
  var id = question.nextId;
  if (id == "" && listPendingQuestions.length == 0) {
    showMessage("Это последний вопрос, его нельзя отложить");
    return;
  }
  // сохранение ответа на текущий вопрос
  AddQuestionToRes(question, QUESTION_VAL_SKIP, 0, "");
  saveUserAnswer(question);
  saveTestRes();
  // добавить вопрос в список
  if (listPendingQuestions.indexOf(question.id) == -1) {
    listPendingQuestions.push(question.id);
    localStorage.setItem(CSPENDINGQUESTIONS, JSON.stringify(listPendingQuestions));
  }
  // проставить признак перехода на другой вопрос того же теста
  setNextTestMode(true);
  // выполнить переход
  toNextQuestion(question);
}

// Переход к отложенным вопросам
function nextPendingQuestion() {
  if (listPendingQuestions.length > 0) {
    var id = String(listPendingQuestions[0]);
    listPendingQuestions.shift();
    localStorage.setItem(CSPENDINGQUESTIONS, JSON.stringify(listPendingQuestions));
    // проставить признак перехода на другой вопрос того же теста
    setNextTestMode(true);
    // выполнить переход
    document.location = id + '.html';
  }
}

// Проверяет правильность ответа на вопрос
function checkAnswer(question) {

  // Возвращает true, если хотя бы один элемент из массива top будет меньше или равен хотя бы одному элементу из массива bottom,
  // либо если top - пустой массив
  function checkPos(top, bottom) {
    if (top.length <= 0) {
      return true;
    }
    for (let i = 0; i < top.length; i++) {
      if (bottom.findIndex(item => item >= top[i]) >= 0) {
        return true;
      }
    }
    return false;
  }

  var ok = false;
  var score = 0;
  let answertext = "";
  switch (question.type) {
    case QUESTION_TYPE_SINGLE:
      // Одиночный выбор предполагает наличие единственного верного ответа.
      // Вопрос считается верно отвеченным, если пользователь выбрал этот единственный верный ответ.
      // Если же пользователь выбрал неверный ответ, вопрос считается отвеченным неверно, но за него начисляются баллы, указанные для этого неверного ответа.
      for (var i = 0; i < question.answers.length; i++) {
        if (document.getElementById(question.answers[i].id).checked) {
          if (question.answers[i].ok) {
            // Ответ верный
            ok = true;
			score = ToInt(question.answers[i].score);			
            answertext = question.answers[i].answertext;
          }
          // Выбранный ответ может быть только один. Невыбранные ответы не обрабатываются.
          break;
        }
      }
      break;
    case QUESTION_TYPE_MULTI:
      ok = true;
      // Вопрос с множественным выбором считается верно отвеченным только в том случае, если для него выбраны все верные варианты ответа.
      for (var i = 0; i < question.answers.length; i++) {
        let checked = document.getElementById(question.answers[i].id).checked;
        if (question.answers[i].ok != checked) {
          ok = false;
        }
        if (checked) {
          if (answertext != "") {
            answertext += "; ";
          }
          answertext += question.answers[i].answertext;
        }
      }
      break;
    case QUESTION_TYPE_OPEN:
      ok = document.getElementById(question.answers.id).value == question.answers.value;
      break;
    case QUESTION_TYPE_SKIP:
      ok = true;
      for (var i = 0; i < question.answers.length; i++) {
        let value = document.getElementById(question.answers[i].id).value;
        if (question.answers[i].value.toUpperCase() != value.toUpperCase()) {
          ok = false;
        } else {
          score += ToInt(question.answers[i].score);
        }
        if (value != "") {
          if (answertext != "") {
            answertext += "; ";
          }
          answertext += value;
        }
      }
      break;
    case QUESTION_TYPE_ORDERED:
      if (question.answers.length <= 0) {
        break;
      }
      var anyItem = document.getElementById(question.answers[0].id);
      var items = anyItem.parentNode.getElementsByClassName("list-group-item");
      let prevPos = []; // Позиция предыдущего элемента (массив допустимых позиций)
      ok = items.length > 0;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.hasAttribute("id")) {
          // нет идентификатора
          ok = false;
          break;
        }
        let id = item.getAttribute("id");
        // Поиск ответа в массиве
        let index = question.answers.findIndex(item => item.id == id);
        if (index < 0) {
          // Ответ не найден
          ok = false;
          break;
        }
        let pos = question.answers[index].pos;
        if (!checkPos(prevPos, pos)) {
          // неверный порядок
          ok = false;
          break;
        }
        prevPos = pos;
      }
      break;
    case QUESTION_TYPE_MATCHED:
      if (question.answers.length <= 0 || question.answers2.length <= 0) {
        break;
      }
      var anyItem = document.getElementById(question.answers[0].id);
      var items = anyItem.parentNode.getElementsByClassName("list-group-item");
      anyItem = document.getElementById(question.answers2[0].id);
      var items2 = anyItem.parentNode.getElementsByClassName("list-group-item");
      ok = (items.length > 0) && (items.length == items2.length);
      if (!ok) {
        break;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.hasAttribute("position")) {
          // нет позиции
          ok = false;
          break;
        }
        var pos = Number(item.getAttribute("position"));
        var item2 = items2[i];
        if (!item.hasAttribute("position")) {
          // нет позиции
          ok = false;
          break;
        }
        var pos2 = Number(item2.getAttribute("position"));
        if (pos != pos2) {
          // неверное соответствие
          ok = false;
          break;
        }
      }
      break;
    case QUESTION_TYPE_PROGRAM:
      if (question.answers.length <= 0) {
        break;
      }
      let value = $('#codeResultID').val().trim();
      ok = value == question.answers[0].value;
      answertext = value;
      break;
    default:
      showMessage("Обнаружен неверный тип вопроса.");
      break;
  }

  if (ok && score == 0) {
    score = ToInt(question.score);		  
  }
  ret = {
    "ok": ok,
    "score": score,
    "answertext": answertext
  };
  return ret;
}

// Сохраняет ответы пользователя
function saveUserAnswer(question) {

  function listToStr(parent) {
    var items = parent.querySelectorAll("div");
    var st = "";
    for (var i = 0; i < items.length; i++) {
      if (st != "") st = st + " ";
      st = st + items[i].id;
    }
    return st;
  }

  var tres = getTestRes(question.testId);
  var elem, ansId;
  switch (question.type) {
    case QUESTION_TYPE_SINGLE:
    case QUESTION_TYPE_MULTI:
      let answer = "";
      for (var i = 0; i < question.answers.length; i++) {
        ansId = question.answers[i].id;
        elem = document.getElementById(ansId);
        if (elem && elem.checked) {
          if (answer != "") answer = answer + " ";
          answer = answer + ansId;
        }
      }
      tres.questions[question.id].answer = answer;
      break;
    case QUESTION_TYPE_OPEN:
      elem = document.getElementById(question.answers.id);
      if (elem)
        tres.questions[question.id].answer = elem.value;
      else
        tres.questions[question.id].answer = "";
      break;
    case QUESTION_TYPE_SKIP:
      tres.questions[question.id].answer = {};
      for (var i = 0; i < question.answers.length; i++) {
        ansId = question.answers[i].id;
        elem = document.getElementById(ansId);
        if (elem) tres.questions[question.id].answer[ansId] = elem.value;
      }
      break;
    case QUESTION_TYPE_ORDERED:
      tres.questions[question.id].answer = listToStr(document.getElementById("orderedList"));
      break;
    case QUESTION_TYPE_MATCHED:
      tres.questions[question.id].answer = listToStr(document.getElementById("matchedList1")) + "|" +
                                           listToStr(document.getElementById("matchedList2"));
      break;
    case QUESTION_TYPE_PROGRAM:
      if (question.answers.length <= 0) break;
      if (pythonEditor)
        tres.questions[question.id].answer = pythonEditor.getValue();
      else
        tres.questions[question.id].answer = "";
      break;
  }
}

// Восстановление ранее введенных ответов
function restoreUserAnswer(question) {

  function setPositions(parent,list) {
    if (!parent || !list) return;
    let ids = list.split(" ");
    let children = parent.children;
    let items = [], item = null;
    for (let i = 0; i < ids.length; i++) {
      item = parent.querySelector("[id='" + ids[i] +"']");
      if (item) items.push(item.outerHTML);
    }
    if (items.length > 0) {
      deleteChildren(parent);
      for (let i = 0; i < items.length; i++)
        parent.innerHTML = parent.innerHTML + items[i];
    }
  }

  var tres = getTestRes(question.testId);
  var answer = tres.questions[question.id].answer;
  if (!answer) return; // на вопрос нет ранее введенного ответа
  var elem, ansId, ids;
  switch (question.type) {
    case QUESTION_TYPE_SINGLE:
    case QUESTION_TYPE_MULTI:
      ids = answer.split(" ");
      for (var i = 0; i < question.answers.length; i++) {
        ansId = question.answers[i].id;
        elem = document.getElementById(ansId);
        if (elem) {
          if (ids.indexOf(ansId) >= 0)
            elem.checked = true;
          else
            elem.checked = false;
        }
      }
      break;
    case QUESTION_TYPE_OPEN:
      elem = document.getElementById(question.answers.id);
      if (elem) elem.value = answer;
      break;
    case QUESTION_TYPE_SKIP:
      for (var i = 0; i < question.answers.length; i++) {
        ansId = question.answers[i].id;
        if (ansId in answer) {
          elem = document.getElementById(ansId);
          if (elem) elem.value = answer[ansId];
        }
      }
      break;
    case QUESTION_TYPE_ORDERED:
      setPositions(document.getElementById("orderedList"), answer);
      break;
    case QUESTION_TYPE_MATCHED:
      ids = answer.split("|");
      if (ids.length > 0) setPositions(document.getElementById("matchedList1"), ids[0]);
      if (ids.length > 1) setPositions(document.getElementById("matchedList2"), ids[1]);
      break;
    case QUESTION_TYPE_PROGRAM:
      if (pythonEditor) {
        pythonEditor.setValue(answer);
        pythonEditor.gotoLine(0);
      }
      break;
  }
}

// Проверка был ли ответ на вопрос в результатах(false - без ответа)
function checkQuestionWithAnswer(question) {
  var tres = getTestRes(question.testId);
  var res = tres.questions[question.id].result;
  return res == QUESTION_VAL_TRUE || res == QUESTION_VAL_FALSE;
}

// Проверка на пустой ответ (false - пусто)
function checkIsEmptyAnswer(question) {
  var empty = true;
  switch (question.type) {
    case QUESTION_TYPE_SINGLE:
    case QUESTION_TYPE_MULTI:
      for (let i = 0; i < question.answers.length; i++) {
        if (document.getElementById(question.answers[i].id).checked) {
          empty = false;
          break;
        }
      }
      break;
    case QUESTION_TYPE_OPEN:
      empty = document.getElementById(question.answers.id).value == "";
      break;
    case QUESTION_TYPE_SKIP:
      for (let i = 0; i < question.answers.length; i++) {
        if (document.getElementById(question.answers[i].id).value != "") {
          empty = false;
          break;
        }
      }
      break;
    case QUESTION_TYPE_ORDERED:
    case QUESTION_TYPE_MATCHED:
      // Для вопросов на упорядочивание списка и соответствия - невозможно узнать, пустой ответ или нет 
      empty = false;
      break;
    case QUESTION_TYPE_PROGRAM:
      empty = pythonEditor.getValue() == "";
      break;
  }
  return empty;
}

// Сохраняет данные теста (результаты)
function saveTestRes() {
  if (book && book.testres) {
    saveCoursesParams();
  }
}

// Загрузка отложенных вопросов
function loadPendingQuestions() {
  var str = localStorage.getItem(CSPENDINGQUESTIONS);
  if (!str || str == "") {
    listPendingQuestions = [];
  } else {
    listPendingQuestions = JSON.parse(str);
  }
}

// Установка фокуса на элемент ввода
function setFocus(question) {
  var elem;
  switch (question.type) {
    case QUESTION_TYPE_OPEN:
      elem = document.getElementById(question.answers.id);
      if (elem) elem.focus();
      break;
    case QUESTION_TYPE_SKIP:
      if (question.answers.length > 0) {
        elem = document.getElementById(question.answers[0].id);
        if (elem) elem.focus();
      }
      break;
    case QUESTION_TYPE_PROGRAM:
      if (pythonEditor) pythonEditor.gotoLine(0);
      elem = document.getElementById("codeEditorID");
      if (elem) {
        elem = elem.querySelector("textarea");
        if (elem) elem.focus();
      }
      break;
    case QUESTION_TYPE_MATCHED:
      if (question.answers.length > 0) {
        var ansCount = question.answers.length;
        for (var key in question.answers) {
          elem = document.getElementById(question.answers[key].id); 
          if (elem) elem.style.height = 100 / ansCount + "%";
        }
      }
      if (question.answers2.length > 0) {
        var ansCount = question.answers2.length;
        for (var key in question.answers2) {
          elem = document.getElementById(question.answers2[key].id); 
          if (elem) elem.style.height = 100 / ansCount + "%";
        }
      }
      elem = document.getElementById("matchedList1");
      if (elem) elem.style.height = "100%";
      elem = document.getElementById("matchedList2");
      if (elem) elem.style.height = "100%";
      break;
    case QUESTION_TYPE_ORDERED:
      if (question.answers.length > 0) {
        var ansCount = question.answers.length;
        for (var key in question.answers) {
          elem = document.getElementById(question.answers[key].id);
          if (elem) elem.style.height = 100 / ansCount + "%";
        }
      }
      elem = document.getElementById("orderedList");
      if (elem) elem.style.height = "100%";
      break;
  }
}
