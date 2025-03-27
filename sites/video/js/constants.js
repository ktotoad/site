//////////////////////////////////////////////////////////////////////
// ГЛОБАЛЬНЫЕ КОНСТАНТЫ
//////////////////////////////////////////////////////////////////////
const sectionGeneralParams="sunrav_general";       // имя раздела в хранилище для общих настроек
const sectionCoursesParams="sunrav_courses";       // имя раздела в хранилище для настроек книг и результатов обучения
const initTimeStamp="00000000000000";              // инициирующая временная метка
const testListProp = "testList";
const questionSourceList = 'questionSourceList';   // массив исходных вопросов
// Файлы справки должны генерироваться отдельной выгрузкой.
// Чтобы подключить файлы справки, их необходимо скопировать в каталог help.
const fileHelp = '../help/index.html';             // файл справки
const lastSearchString="lastSearchString";         // последняя строка, введенная в поле поиска
const currentTestId = "currentTestId";
const currentTestingLevel = "currentTestingLevel"; // выбранный уровень сложности для теста
const questionQuantityStr = "questionQuantity";
const CSLASTTREEHIGHT = "lastTreeHight";
const mapBodyCard = new Map();                     // содержимое всех глав для поиска
const CSPENDINGQUESTIONS = "PendingQuestions";     // имя раздела для отложенных вопросов
const LastCourseDataId = "LastCourseDataId";       // Имя раздела для хранения последних результатов курса

// вкладки
const TAB_BOOK="book-contents-tab"; // вкладка "Содержание"
const TAB_TERMINS="termins-tab";    // вкладка "Тематический указатель"
const TAB_AUTHORS="authors-tab";    // вкладка "Именной указатель"

// типы глав
CHAPTER_TYPE_CHAPTER="csChapter";
CHAPTER_TYPE_AUTOCHAPTER="csAutoChapter";
CHAPTER_TYPE_SCREEN="csScreen";
CHAPTER_TYPE_MAIN="csMain";
CHAPTER_TYPE_DOP1="csDop1";
CHAPTER_TYPE_DOP2="csDop2";
CHAPTER_TYPE_DOP3="csDop3";
CHAPTER_TYPE_STICKER="csSticker";

// типы тестов
const TEST_TYPE_INCOMING = "incoming";     // входной
const TEST_TYPE_MOTIVATION = "motivation"; // мотивационный
const TEST_TYPE_BOUNDARY = "boundary";     // рубежный
const TEST_TYPE_FINAL = "final";           // итоговый

// направление тестов
const TEST_DEST_EXERCISE = "tdExercise";      // упражнение
const TEST_DEST_ATTESTATION = "tdAttestaion"; // аттестация

// типы тестовых заданий
const QUESTION_TYPE_SINGLE = "single";   // одновариантный
const QUESTION_TYPE_MULTI = "multi";     // многовариантный
const QUESTION_TYPE_OPEN = "open";       // открытый
const QUESTION_TYPE_SKIP = "skip";       // заполнение пропусков
const QUESTION_TYPE_ORDERED = "ordered"; // установление последовательности
const QUESTION_TYPE_MATCHED = "matched"; // установление соответствия
const QUESTION_TYPE_PROGRAM = "program"; // навыки программирования

// признаки ответов на вопросы
const QUESTION_VAL_TRUE = "true";   // верный ответ
const QUESTION_VAL_FALSE = "false"; // неверный ответа
const QUESTION_VAL_SKIP = "skip";   // вопрос отложен
const QUESTION_VAL_EMPTY = "empty"; // вопрос пропущен (нет ответа)
const QUESTION_VAL_UNKNOWN = "unknown"; // вопрос не задан (по истечении времени на тест или по другой причине)

// иконки для типов файлов
const extIcons=
{
  pdf:  "pdf.png",
  djvu: "djvu.png",
  vsd:  "vsd.png",
  vsdx: "vsd.png",
  odt:  "odt.png",
  odp:  "odp.png",
  ods:  "ods.png",
  sxw:  "sxw.png",
  sxi:  "sxi.png",
  ppt:  "odp.png",
  pptx: "odp.png",
  xls:  "ods.png",
  xlsx: "ods.png",
  doc:  "odt.png",
  docx: "odt.png"  
};

const URLS = {
  TESTS : "/api/tests",
  COURSE : "/api/course",
  LOGIN : "/api/login",
  LASTTESTS : "/api/lasttests"
};
const METHODS = {
  POST : "POST", // метод добавляет записи
  PUT : "PUT", // метод изменяет записи
  GET : "GET"
};
const JSONOBJTYPE = {
  TESTRESULT : 1,
  COURSERESULT : 2
};
const AUTHORIZE = "authorize";
const ISAUTHORIZED = "1";

// Цвета для итоговой диаграммы курса.
const CHART_BACK_COLORS = ['rgba(0, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(3, 169, 244, 0.2)', 'rgba(255, 152, 0, 0.2)',
  'rgba(156, 39, 176, 0.2)', 'rgba(84, 110, 122, 0.2)', 'rgba(216, 27, 96, 0.2)', 'rgba(29, 233, 182, 0.2)', 'rgba(99, 132, 0, 0.2)'];
const CHART_BORDER_COLORS = ['rgba(0, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(3, 169, 244, 1)', 'rgba(255, 152, 0, 1)',
  'rgba(156, 39, 176, 1)', 'rgba(84, 110, 122, 1)', 'rgba(216, 27, 96, 1)', 'rgba(29, 233, 182, 1)', 'rgba(99, 132, 0, 1)'];
// Цвет для итогового теста.
const CHART_BACK_COLOR_FINAL = 'rgba(255, 99, 132, 0.2)';
const CHART_BORDER_COLOR_FINAL = 'rgba(255, 99, 132, 1)';

// префикс для переменных локального хранилища.
// значение меняется в шаблоне для справки.
var LOCAL_STORAGE_PREFIX = "";

// дополнительное смещение ресурсных файлов в структуре каталогов.
// значение меняется в шаблоне для справки.
var DIR_OFFSET = "";