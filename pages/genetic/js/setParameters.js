const inputPopulation = document.getElementById("inputPopulation");
const inputIteration = document.getElementById("inputIteration");


function isNumeric(value) { // Проверка на корректное число
    return !isNaN(parseInt(value)) && isFinite(value);
}

function setValues(e) {
    if(e.code === "Enter") {
        if(isNumeric(inputIteration.value)) ITERATION_COUNT = inputIteration.value;
        if(isNumeric(inputPopulation.value)) POPULATION_COUNT = inputPopulation.value;
    }
}

document.addEventListener("keyup", setValues);