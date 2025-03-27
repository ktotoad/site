var myMap;
ymaps.ready(init);
function init () {
	var coord = $('#map').data('coord');
	myMap = new ymaps.Map("map", {
		center: coord,
		zoom: 16,
		controls: ['smallMapDefaultSet']
	}); 
	myMap.controls.add('zoomControl');
	myMap.controls.add('rulerControl', {
		scaleLine: false
	});
	var myPlacemark = new ymaps.Placemark(
		coord, {},
		{
			
			iconLayout: 'default#image',
			iconImageHref: 'https://lucianovitaclubsochi.ru/img/icons/for_map.png',
			iconImageSize: [60, 60],
			iconImageOffset: [-30, -30]
		}
	);
	myMap.geoObjects.add(myPlacemark);
}