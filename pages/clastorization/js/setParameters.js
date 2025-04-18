const inputClasters = document.getElementById("count-clasters");
const inputEps = document.getElementById("eps");
const inputM = document.getElementById("count-m");

const setButton = document.getElementById('set-values');

function isNumeric(value) { // Проверка на корректное число
    return !isNaN(parseInt(value)) && isFinite(value);
}

function setValues(e) {
    if(e.code === "Enter") {
        if(isNumeric(inputClasters.value) && inputClasters.value > 0) {
            COUNT_CLASTERS = inputClasters.value;
        }
        else {
            COUNT_CLASTERS = null;
        }

        if(isNumeric(inputEps.value) && inputEps.value > 0) {
            EPS = inputEps.value;


            const miniField = document.querySelector(".mini-field");

            miniField.innerHTML = '';

            let newPoint = document.createElement('div');

            newPoint.classList.add("mini-field__point");
            newPoint.classList.add("point-extra");

            newPoint.setAttribute('style',
                `width: ${2*EPS}px; height: ${2*EPS}px;`
            );
            
            miniField.appendChild(newPoint);

        }
        else {
            EPS = null;

            const miniField = document.querySelector(".mini-field");

            miniField.innerHTML = '';
            
        }

        if(isNumeric(inputM.value) && inputM.value > 0) {
            M = inputEps.value;
        }
        else {
            M = null;
        }
    }
}


function setValuesButton() {
    setButton.classList.toggle('parameters__button-active');
        if(isNumeric(inputClasters.value) && inputClasters.value > 0) {
            COUNT_CLASTERS = inputClasters.value;
        }
        else {
            COUNT_CLASTERS = null;
        }

        if(isNumeric(inputEps.value) && inputEps.value > 0) {
            EPS = inputEps.value;

            const miniField = document.querySelector(".mini-field");

            miniField.innerHTML = '';

            let newPoint = document.createElement('div');

            newPoint.classList.add("mini-field__point");
            newPoint.classList.add("point-extra");

            newPoint.setAttribute('style',
                `width: ${2*EPS}px; height: ${2*EPS}px;`
            );

            

            miniField.appendChild(newPoint);
        }
        else {
            EPS = null;

            const miniField = document.querySelector(".mini-field");


            miniField.innerHTML = '';
            
        }

        if(isNumeric(inputM.value) && inputM.value > 0) {
            M = inputEps.value;
        }
        else {
            M = null;
        }
}

function removeSetValues() {
    if(setButton.classList.contains("parameters__button-active")){
        setButton.classList.toggle('parameters__button-active');
    }
}
document.addEventListener("keyup", setValues);

setButton.addEventListener("mousedown", setValuesButton);
document.addEventListener("mouseup", removeSetValues);
