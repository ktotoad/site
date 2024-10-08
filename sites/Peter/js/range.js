//RANGE========================================================================================================================================
//Площадь
if (document.querySelector("#range-slider-square")) {
    var rangeBody = document.querySelector("#range-slider-square");
    var slider = rangeBody.querySelector("#slider-square");
    var inputMin = rangeBody.querySelector("#input-min-s");
    var inputMax = rangeBody.querySelector("#input-max-s");

    const inputs = [inputMin, inputMax]; 

    noUiSlider.create(slider, {
        start: [30, 80],
        connect: true,
        step: 1,
        range: {
            'min': 27,
            'max': 127
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        inputs[handle].value = parseInt(values[handle]);
    });

    inputMin.addEventListener('change', function () {
        slider.noUiSlider.set([this.value, null]);
    });

    inputMax.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });
}
//RANGE========================================================================================================================================
//Площадь
if (document.querySelector("#range-slider-square2")) {
    var rangeBody = document.querySelector("#range-slider-square2");
    var slider = rangeBody.querySelector("#slider-square2");
    var inputMin = rangeBody.querySelector("#input-min-s2");
    var inputMax = rangeBody.querySelector("#input-max-s2");

    const inputs = [inputMin, inputMax]; 

    noUiSlider.create(slider, {
        start: [13, 15],
        connect: true,
        step: 1,
        range: {
            'min': 10,
            'max': 20
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        inputs[handle].value = parseInt(values[handle]);
    });

    inputMin.addEventListener('change', function () {
        slider.noUiSlider.set([this.value, null]);
    });

    inputMax.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });
}
//RANGE========================================================================================================================================
//Этаж
if (document.querySelector("#range-slider-floor")) {
    var rangeBody = document.querySelector("#range-slider-floor");
    var slider = rangeBody.querySelector("#slider-floor");
    var inputMin = rangeBody.querySelector("#input-min-f");
    var inputMax = rangeBody.querySelector("#input-max-f");

    const inputs = [inputMin, inputMax]; 

    noUiSlider.create(slider, {
        start: [2, 4],
        connect: true,
        step: 1,
        range: {
            'min': 1,
            'max': 5
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        inputs[handle].value = parseInt(values[handle]);
    });

    inputMin.addEventListener('change', function () {
        slider.noUiSlider.set([this.value, null]);
    });

    inputMax.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });
}