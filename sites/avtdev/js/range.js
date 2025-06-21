//RANGE========================================================================================================================================
//Площадь
if (document.querySelector("#range-slider-square")) {
    var rangeBody = document.querySelector("#range-slider-square");
    var slider = rangeBody.querySelector("#slider-square");
    var inputMin = rangeBody.querySelector("#input-min-s");
    var inputMax = rangeBody.querySelector("#input-max-s");

    const inputs = [inputMin, inputMax]; 

    noUiSlider.create(slider, {
        start: [27, 83],
        connect: true,
        step: 1,
        range: {
            'min': 27,
            'max': 83
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
//RANGE========================================================================================================================================
//Цена
if (document.querySelector("#range-slider-price")) {
    var rangeBody = document.querySelector("#range-slider-price");
    var slider = rangeBody.querySelector("#slider-price");
    var inputMin = rangeBody.querySelector("#input-min-price");
    var inputMax = rangeBody.querySelector("#input-max-price");

    const inputs = [inputMin, inputMax]; 

    noUiSlider.create(slider, {
        start: [1000000, 25000000],
        connect: true,
        step: 100,
        range: {
            'min': 1000000,
            'max': 25000000
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        var price = parseInt(values[handle]);
        inputs[handle].value = Number(price).toLocaleString();
    });

    inputMin.addEventListener('change', function () {
        slider.noUiSlider.set([price, null]);
    });

    inputMax.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });
}