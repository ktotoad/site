function convertToNintegraJSON(objJSON, objType) {
  var testResult = {};
  switch (objType) {
    case JSONOBJTYPE.TESTRESULT:  // результаты теста
      testResult.testid = objJSON.fullTestId;
      testResult.title = objJSON.testTitle;
      testResult.course = objJSON.bookId; // идентификатор курса
      testResult.starttime = dateToISOString(new Date(objJSON.start));
      testResult.period = timePeriodToStr(Number(objJSON.duration)); // hh:mm:ss
      testResult.score = objJSON.score.toString();
      testResult.pca = objJSON.percent.toString();
      testResult.rating = convertScore(objJSON.assessment);
      testResult.testresult = objJSON.passed.toString();
      testResult.theme = objJSON.theme;
      testResult.questions = objJSON.send_questions;
      testResult.recommendations = objJSON.recommends;
      break;
    case JSONOBJTYPE.COURSERESULT: // результаты курса
      testResult.title = objJSON.courseTitle;
      testResult.idcourse = objJSON.bookId;
      testResult.courseprogress = objJSON.courseprogress;
      testResult.startdate = dateToISOString(new Date(objJSON.start));
      if (objJSON.enddate) {
        testResult.enddate = dateToISOString(new Date(objJSON.enddate));
      }
      testResult.duration = objJSON.duration;
      testResult.courseresult = objJSON.testsPercent;
      testResult.passedtests = objJSON.passedtests;
      testResult.recommendations = objJSON.recommends;
      testResult.finaltestscore = convertScore(objJSON.finaltestscore);
      testResult.status = objJSON.status; // 1 - новый; 2 - в ходе; 3 - завершен
      break;
  }
  testResult = JSON.stringify(testResult);
  return testResult;
}

// Преобразует оценку в строковое значение, в котором хранится число или null
function convertScore(score) {
  if (!score) {
    return null;
  }
  let val = strToIntDef(score, null);
  if (!val) {
    return null;
  }
  return val.toString();
}

// Преобразует дату в ISO строку (YYYY-MM-DDTHH:mm:ss.sssZ) с учетом смещения временной зоны
function dateToISOString(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

// Преобразует ISO строку (YYYY-MM-DDTHH:mm:ss.sssZ) в дату с учетом смещения временной зоны
function ISOStringToDate(dateStr) {
  let d = new Date(dateStr);
  return d;
}

function sendRequestData(myMethod, serverBaseUrl, apiPath, requestParams, onResponseFunc) {
  if (serverBaseUrl == "") return;
  var url = serverBaseUrl + apiPath;
  let fauth = localStorage.getItem(AUTHORIZE);
  if (!IsFileProtocol() || IsFileProtocol() && (fauth == ISAUTHORIZED)) {
    operationData(myMethod, url, requestParams, onResponseFunc);
  } else {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: METHODS.POST,
      headers: myHeaders,
      body: JSON.stringify({"username": "icl", "password": "icl123456"}),
      credentials: 'include',
      redirect: 'follow'
    };
    fetch(serverBaseUrl + URLS.LOGIN, requestOptions)
      .then(respStatus)
      .then(respText)
      .then(function(data){
          let res = JSON.parse(data);
          console.log(res);
          localStorage.setItem(AUTHORIZE, ISAUTHORIZED);
          operationData(myMethod, url, requestParams, onResponseFunc);
        })
      .catch(showError);
  }
}

function operationData(myMethod, url, requestParams, onResponseFunc) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: myMethod,
    headers: myHeaders,
    credentials: 'include',
    redirect: 'follow'
  };
  if (typeof(requestParams.obj) != "undefined") {
    requestOptions.body = requestParams.obj ? convertToNintegraJSON(requestParams.obj, requestParams.objType) : requestParams.obj;
  }
  fetch(url, requestOptions)
    .then(respStatus)
    .then(respJson)
    .then(function(data) {
      onResponseFunc(requestParams, data);
      })
    .catch(showError);
}

function showError(error){
  showMessage("Ошибка\r\n" + error);
  console.log('error', error);
}

function respStatus(response){
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)  
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function respText(response){
  return response.text();
}

function respJson(response){
  return response.json();
}

function getServerBaseUrl() {
  var port, host, protocol;
  if (IsFileProtocol()) {
    if (PPSLINK == "") {
      showMessage("Адрес сервера пуст");
      return "";
    }
    try {
      var newURL = new URL(PPSLINK);
    } catch (e) {
      showMessage("Путь к серверу не корректен\r\n" + e.message);
      return "";
    }
    protocol = newURL.protocol + "//";
    host = newURL.host;
    port = "";
  } else {
    protocol = window.location.protocol + "//";
    host = window.location.host;
    port = window.location.port == "" ? "" : ":" + window.location.port;
	if (port && host.includes(port)) {
      port = "";
    }
  }
  return protocol + host + port;
}

function IsFileProtocol() {
  return window.location.protocol == "file:";
}

// Возвращает true, если необходимо отправлять данные на сервер.
// Данные не отправляются на сервер в случае локального прохождения теста и
// в случае предварительного просмотра теста.
function needSendRequestData() {
  return !IsFileProtocol() &&
    (typeof(isPreview) == "undefined" || typeof(isPreview) != "undefined" && !isPreview);
}