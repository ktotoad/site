// Глобальный обьект. В нем хранятся настройки и закешированы ссылки на DOM узлы и переменные состояния
var jsiBox = {
	// НАСТРОЙКИ
	boxBorderColor : '#727272', // Цвет границы бокса
	boxBorderWidth : '1px',     // Толщина границы бокса
	boxBgColor     : '#888888', // Цвет фона бокса
	imgBgColor     : '#f0f0f0', // Цвет подложки изображения
	overlayColor   : '#f0f0f0', // Цвет затемнения страницы
	nextArrow      : '&rarr;',  // Следующее изображение
	prevArrow      : '&larr;',  // Предыдущее изображение
	closeSymbol    : '&times;', // Значок закрытия бокса
	statusString   : 'Изображение&nbsp;[num]&nbsp;из&nbsp;[total]' // Строка описания соcтояния
};

// Добавляет HTML-код бокса к текущему документу и кеширует ссылки на составные элементы
function jsiBoxInit()
{
	var boxHTML='<style type="text/css">#jsiMainBox * {margin: 0; padding: 0; border: 0; text-decoration: none; } #jsiMainBox a.jsiBtn {outline: none; float:right; color: #fff; font-size: 30px; width: 40px; vertical-align:middle;font-weight:normal; text-indent:0.0cm; }</style>'
		+'<div id="wrapJsiBox" class="no_night" style="position: fixed; top:0; left:0; width: 100%; height: 100%; display: none; z-index: 1000; background-color:'+jsiBox.overlayColor+'; opacity: 0.6; filter: alpha(opacity=\'60\');"></div>'
		+'<div class="no_night" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 2000;">'
		+' <div id="jsiMainBox" style="color: #fff;text-align:left;position: relative; display: none; margin: auto; z-index: 2; width: 400px; background:'+jsiBox.boxBgColor+'; border: '+jsiBox.boxBorderWidth+' solid '+jsiBox.boxBorderColor+'; padding-bottom: 4px;">'
		+'  <p style="text-align: right; font: bold 10px; padding-top: 0;width:100%;overflow:hidden;padding-bottom:0;">'
		+'   <img src="img/load.gif" alt="" id="jsiBoxLoading" style="float:left; display:inline; margin:7px 5px 0 8px;" />'
		+'   <a href="#" style="padding:0 8px 0 0;width:28px;line-height:32px;margin-top:-2px" onclick="return jsiBoxClose();" class="jsiBtn">'+jsiBox.closeSymbol+'</a>'
		+'   <span style="width: 100%; float: right; height: 37px;position:relative;">'
		+'    <a href="#" id="nextJsiBoxLink" onclick="return jsiBoxNext();" style="position:absolute;top: 0;right: 0;line-height:30px;" class="jsiBtn">'+jsiBox.nextArrow+'</a>'
		+'    <a href="#" id="prevJsiBoxLink" onclick="return jsiBoxPrev();" style="position:absolute;top: 0;left: 0;line-height:30px;" class="jsiBtn">'+jsiBox.prevArrow+'</a>'
		+'   </span>'
		+'  </p>'
		+'  <p id="jsiBoxNumberOfImage" style="margin-top:-7px; padding:0 12px 2px 0;text-align:right;"></p>'
		+'  <div id="jsiBoxMainImageWrap" style="background:'+jsiBox.imgBgColor+'; margin: 0 8px 4px 8px; overflow: hidden; position: relative;">'
		+'   <img src="img/1x1.gif" id="jsiBoxMainImage" alt="" style="display: block;" />'
		+'  </div>'
		+'  <span id="jsiBoxTitle" style="margin:0 8px; font: normal 10px;"></span>'
		+' </div>'
		+'</div>';
	jsiBox.wrapNode=document.getElementById('wrapJsiBox');
	if (!jsiBox.wrapNode) document.write(boxHTML);
	// Создание контейнера для предзагрузки изображений
	jsiBox.preloadImg=new Image();
	jsiBox.preloadImg.onload=jsiBoxDisplayMainImg;
	// Кеширование ссылок на DOM-узлы составных элементов бокса
	jsiBox.wrapNode     = document.getElementById('wrapJsiBox');
	jsiBox.boxNode      = document.getElementById('jsiMainBox');
	jsiBox.progressImg  = document.getElementById('jsiBoxLoading');
	jsiBox.prevLinkNode = document.getElementById('prevJsiBoxLink');
	jsiBox.nextLinkNode = document.getElementById('nextJsiBoxLink');
	jsiBox.infoNode     = document.getElementById('jsiBoxNumberOfImage');
	jsiBox.wrapImgNode  = document.getElementById('jsiBoxMainImageWrap');
	jsiBox.mainImg      = document.getElementById('jsiBoxMainImage');
	jsiBox.titleNode    = document.getElementById('jsiBoxTitle');

	jsiBox.currentImgIndex=0;           // Порядковый номер текущего изображения галереи
	jsiBox.linkNodesArray=new Array();  // Массив ссылок на изображения галереи
	jsiBox.titleNodesArray=new Array(); // Массив подписей изображений галереи
}

// Инициализация
function jsiBoxDisplayMainImg()
{
	// Порядковый номер в навигации
	if (jsiBox.linkNodesArray.length>1)
	{
		var info=jsiBox.statusString.replace('[num]',jsiBox.currentImgIndex+1);
		info=info.replace('[total]',jsiBox.linkNodesArray.length);
		jsiBox.infoNode.innerHTML=info;
	}
	// загрузка изображения
	var n;
	jsiBox.mainImg.style.display    = 'none';
	n=jsiBox.preloadImg.width;
	if (n<200) n=200;
	jsiBox.boxNode.style.width      = (n+20)+'px';
	jsiBox.mainImg.style.width      = n+'px';
	n=jsiBox.preloadImg.height;
	if (n<200) n=200;
	jsiBox.wrapImgNode.style.height = n+'px';
	jsiBox.mainImg.src              = jsiBox.preloadImg.src;
	jsiBox.mainImg.style.display    = 'block';
	// Заголовок изображения
	var imageTitle=(jsiBox.titleNodesArray[jsiBox.currentImgIndex]) ? jsiBox.titleNodesArray[jsiBox.currentImgIndex] : '';
	if (imageTitle!='')
	{
		jsiBox.titleNode.style.display='block';
		jsiBox.titleNode.innerHTML=imageTitle;
	}

	jsiBox.progressImg.style.display='none';
}

// Показ предыдущего изображения галереи
function jsiBoxNext()
{
	jsiBox.progressImg.style.display='block';
	jsiBox.currentImgIndex++;
	if (jsiBox.currentImgIndex>=jsiBox.linkNodesArray.length) jsiBox.currentImgIndex=0;
	jsiBox.preloadImg.src=jsiBox.linkNodesArray[jsiBox.currentImgIndex];
	return false;
}

// Показ следующего изображения галереи
function jsiBoxPrev()
{
	jsiBox.progressImg.style.display='block';
	jsiBox.currentImgIndex--;
	if (jsiBox.currentImgIndex<0) jsiBox.currentImgIndex=jsiBox.linkNodesArray.length-1;
	jsiBox.preloadImg.src=jsiBox.linkNodesArray[jsiBox.currentImgIndex];
	return false;
}

// Закрытие бокса
function jsiBoxClose()
{
	jsiBox.wrapNode.style.display='none';
	jsiBox.boxNode.style.display='none';
	return false;
}

// Добавляет данные изображения в массивы
function jsiAddNode(domNode)
{
	jsiBox.linkNodesArray.push(domNode.src);
	jsiBox.titleNodesArray.push(domNode.title);
}

// Отправляет изображение на просмотр в боксе
function jsiBoxOpen(domNode)
{
	var firstImg,lastImg,node;
	jsiBox.progressImg.style.display='block';
	jsiBox.linkNodesArray=new Array();
	jsiBox.titleNodesArray=new Array();
	// Найти первое изображение в галерее
	node=domNode;
	while (node && node.nodeName.toLowerCase()=="img")
	{
		firstImg=node;
		node=node.previousSibling;
	}
	// Найти последнее изображение в галерее
	node=domNode;
	while (node && node.nodeName.toLowerCase()=="img")
	{
		lastImg=node;
		node=node.nextSibling;
	}
	// добавить изображения в галерею
	node=firstImg;
	while (node!=lastImg.nextSibling)
	{
		jsiAddNode(node);
		if (node==domNode) jsiBox.currentImgIndex=jsiBox.linkNodesArray.length-1;
		node=node.nextSibling;
	}
	// Инициализация
	jsiBox.infoNode.innerHTML='&#160;';
	jsiBox.titleNode.innerHTML='';
	// Сделать общий темный фон
	jsiBox.wrapNode.style.display='block';
	// Отобразить бокс с учетом прокрутки
	var top=document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
	jsiBox.boxNode.style.top        = (top + 200) + 'px';
	jsiBox.mainImg.src              = 'img/1x1.gif';
	jsiBox.wrapImgNode.style.height = '30px';
	jsiBox.boxNode.style.width      = '200px';
	jsiBox.boxNode.style.display    = 'block';
	jsiBox.preloadImg.src           = jsiBox.linkNodesArray[jsiBox.currentImgIndex];
	return false;
}

// Инициализируем бокс
jsiBoxInit();
