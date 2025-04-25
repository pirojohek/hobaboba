const inputPopulation = document.getElementById("inputPopulation");
const inputIteration = document.getElementById("inputIteration");

const setButton = document.getElementById('set-values');
function isNumeric(value) { // Проверка на корректное число
    return !isNaN(parseInt(value)) && isFinite(value);
}

function setValues(e) {
    if(e.code === "Enter") {
        if(isNumeric(inputIteration.value) && inputIteration.value > 0) {
            ITERATION_COUNT = inputIteration.value;
        }
        else {
            ITERATION_COUNT = null;
        }

        if(isNumeric(inputPopulation.value) && inputPopulation.value > 0) {
            POPULATION_COUNT = inputPopulation.value;
        }
        else {
            POPULATION_COUNT = null;
        }
    }
}

function setValuesButton() {
    if(!setButton.classList.contains('parameters__button-active')) {
        setButton.classList.toggle('parameters__button-active');

        if(isNumeric(inputIteration.value) && inputIteration.value > 0) {
            ITERATION_COUNT = inputIteration.value;
        }
        else {
            ITERATION_COUNT = null;
        }

        if(isNumeric(inputPopulation.value) && inputPopulation.value > 0) {
            POPULATION_COUNT = inputPopulation.value;
        }
        else {
            POPULATION_COUNT = null;
        }
    }
    else {
        setButton.classList.toggle('parameters__button-active');
    }
}

document.addEventListener("keyup", setValues);

setButton.addEventListener("mousedown", setValuesButton);
setButton.addEventListener("mouseup", setValuesButton);