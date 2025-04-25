function Point(x,y) { // Точка с координатами (x, y)
    this.x = x;
    this.y = y;
}






var arrayOfPoints = new Array();

var COUNT_POINTS = null;

var POPULATION_COUNT = null;

var ITERATION_COUNT = null;

const PROBABILITY_OF_CROSSINGOVER = 0.9;

const PROBABILITY_OF_MUTATION = 0.1;

const PROBABILITY_OF_MUTATION_ONE = 0.01;

const buttonRunAlgorithm = document.getElementById("run-algorithm");

const textIterator = document.querySelector('.input-block__text')

const iterator = document.getElementById('iterator');

const len = document.getElementById('length');

buttonRunAlgorithm.addEventListener("click", genetic);


var isWorking = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomFloat(min, max) { // Рандомное число в диапазоне (float min, float max)
    return Math.random() * (max - min) + min;
}
  
function getRandomInt(min, max) { // Рандомное число в диапазоне [int min, int max)

    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}


function setRandomPermutation(arr, size) { // Получаем рандомную перестановку массива. Сложность O(n)
    for(let i = size - 1; i >= 0;i--) {

        let randomIndex = getRandomInt(0, i + 1);
        
        let tmp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = tmp;
    }
} //https://ru.wikipedia.org/wiki/%D0%A2%D0%B0%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5_%D0%A4%D0%B8%D1%88%D0%B5%D1%80%D0%B0_%E2%80%94_%D0%99%D0%B5%D1%82%D1%81%D0%B0#.D0.A1.D0.BE.D0.B2.D1.80.D0.B5.D0.BC.D0.B5.D0.BD.D0.BD.D1.8B.D0.B9_.D0.B0.D0.BB.D0.B3.D0.BE.D1.80.D0.B8.D1.82.D0.BC



function getLength(point1, point2) {
    return Math.sqrt((point1.x-point2.x)**2  + (point1.y-point2.y)**2);
}

function getFitness(individ, data, size) { // Определить качество пути - его длину

    let sumLength = getLength(
        {x: data[individ[0]].x, y: data[individ[0]].y},
        {x: data.at(-1).x, y: data.at(-1).y},
    );

    for(let i = 0; i < size-1; i++) {

        point1 = {x: data[individ[i]].x, y: data[individ[i]].y};
        point2 = {x: data[individ[i+1]].x, y: data[individ[i+1]].y};

        sumLength += getLength(point1, point2);
    }

    return sumLength;

}


function setSelection(population, tempArray, data) { // Рандомизированный выбор лучших представителей

    for(let i = 0;i < POPULATION_COUNT;i++) {
        
        let randomIndex1 = getRandomInt(0, POPULATION_COUNT);
        let randomIndex2 = getRandomInt(0, POPULATION_COUNT);
        let randomIndex3 = getRandomInt(0, POPULATION_COUNT);

        let fitness1 = getFitness(population[randomIndex1], data, COUNT_POINTS);
        let fitness2 = getFitness(population[randomIndex2], data, COUNT_POINTS);
        let fitness3 = getFitness(population[randomIndex3], data, COUNT_POINTS);

        let minFitness = Math.min(
            fitness1,
            fitness2,
            fitness3,
        )

        if(minFitness === fitness1){
            tempArray[i] = population[randomIndex1];
        }
        else if(minFitness === fitness2){
            tempArray[i] = population[randomIndex2];
        }
        else if(minFitness === fitness3){
            tempArray[i] = population[randomIndex3];
        }
    }
    
    for(let i = 0; i < POPULATION_COUNT;i++) {
        population[i] = tempArray[i];
    }
}

function setRandomMutation(individ, size, probability) { // Попытка мутация особи (зависит от вероятности)
    for(let i = 0;i <size;i++) {
        
        if(Math.random() < probability) {
            let randomIndex = getRandomInt(0,size);

            let tmp = individ[i];
            individ[i] = individ[randomIndex];
            individ[randomIndex] = tmp;
        }
    }
}

function transformArray(mainArray, otherArray, outArray, leftIndex, rightIndex) { // Нужно для вызова в setCrossingover

    let between = new Set();
        
    for(let i = leftIndex; i <= rightIndex;i++) {

        outArray[i] = mainArray[i];

        between.add(mainArray[i]);
    }

    let arrayWithoutBetween = new Array();

    for(let i = 0; i < COUNT_POINTS;i++) {
        if(!between.has(otherArray[i])) {
            arrayWithoutBetween.push(otherArray[i]);
        }
    }

    let iterIndex = 0;

    for(let i = 0; i < COUNT_POINTS;i++) {
        if(!outArray[i]) {
            outArray[i] = (arrayWithoutBetween[iterIndex] === undefined ? 0 : arrayWithoutBetween[iterIndex]);
            iterIndex++;
        }
    }
}

function setCrossingover(population, tempArray, probability) { // Проход по популяции и рандомизированное скерещивание

    for(let i = 0;i < POPULATION_COUNT;i++) {
        
        if(Math.random() < probability) {
            let randomIndex = getRandomInt(0, POPULATION_COUNT);
        
            // Скрещивание i-ого и randomIndex-ого
    
            let leftIndex = getRandomInt(0, COUNT_POINTS);
            let rightIndex = getRandomInt(0, COUNT_POINTS);
    
            if(leftIndex > rightIndex) {
                let tmp = leftIndex;
                leftIndex = rightIndex;
                rightIndex = tmp;
            }
    
            let newArr = new Array(COUNT_POINTS);
    
            transformArray(population[i], population[randomIndex], newArr, leftIndex, rightIndex);
    
            tempArray[i] = newArr;
        }
        else {
            tempArray[i] = population[i];
        }
        let fff = 0;
    }
    
    for(let i = 0; i < POPULATION_COUNT;i++) {
        population[i] = tempArray[i];
    }

}

var cancelDrawing = false;

async function drawGraph(path) {
    cancelDrawing = true;
    await sleep(101);
    screen.innerHTML = "";
    cancelDrawing = false;

    for(let i = 0; i < path.length - 1; i++) {

        if(cancelDrawing) return;

        let begin = arrayOfPoints[path[i]];
        let end = arrayOfPoints[path[i+1]];

        screen.insertAdjacentHTML(
            "beforeend",
            `<line x1 = '${begin.x}' y1 = '${begin.y}' x2 = '${end.x}' y2 = '${end.y}' stroke = "blue" stroke-width = "2">`
        );
        await sleep(100);
    }
    let begin = arrayOfPoints[path[path.length - 1]];
    let end = arrayOfPoints[path[0]];

    screen.insertAdjacentHTML(
        "beforeend",
        `<line x1 = '${begin.x}' y1 = '${begin.y}' x2 = '${end.x}' y2 = '${end.y}' stroke = "blue" stroke-width = "2">`
    );
    await sleep(100);
}

var cnt = 0;
async function genetic() {

    if(getPointsButton.classList.contains("tools__button-active")) {
        getPointsButton.classList.toggle("tools__button-active");
        field.removeEventListener("mousedown",getPoint);
        field.removeEventListener("mouseup", setAnimationPoint);
    }

    COUNT_POINTS = arrayOfPoints.length;

    console.log(POPULATION_COUNT, ITERATION_COUNT);

    if(POPULATION_COUNT === null || ITERATION_COUNT === null || COUNT_POINTS == 0) {
        alert("Проверьте данные или их ввод!");
        return;
    }
    
    textIterator.style.visibility = 'visible';


    isWorking = true;

    data = arrayOfPoints;
    
    
    population = new Array(POPULATION_COUNT);
    
    for( let i = 0; i < POPULATION_COUNT;i++) {
    
        population[i] = new Array(COUNT_POINTS);
    
        for(let j = 0; j < COUNT_POINTS;j++) {
            population[i][j] = j;
        }
        setRandomPermutation(population[i], COUNT_POINTS);
    }
    
    
    
    tempArray = new Array(POPULATION_COUNT);
    
    let mn = 10000000;

    for(let iter = 0; iter < ITERATION_COUNT;iter++) {
    
        iterator.innerHTML = iter + 1;
        

        setSelection(population, tempArray, data);
    
        setCrossingover(population, tempArray, PROBABILITY_OF_CROSSINGOVER);
        
        for(let i = 0; i<POPULATION_COUNT;i++) {
            if(Math.random() < PROBABILITY_OF_MUTATION) {
                setRandomMutation(population[i], COUNT_POINTS, PROBABILITY_OF_MUTATION_ONE);
            }
        }
    
        let currentMn = 10000000;
    
        for(let item of population) {
            currentMn = Math.min(currentMn, getFitness(item,   data, COUNT_POINTS));
        }
        
        

        if(currentMn != mn) {
            len.innerHTML = currentMn;
            
            let path = population[0];
            
            for(let i = 1;i < population.length;i++) {
                if(currentMn == getFitness(population[i],   data, COUNT_POINTS)) {
                    path = population[i];
                    break;
                }
            }
            // Рисуем граф новый
            
            drawGraph(path);
            await sleep(100 * path.length + 101);
            cnt++;
            mn = currentMn;
        }
        console.log(mn);
        await sleep(10);
    }
    
    isWorking = false;

}






