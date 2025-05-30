function Point(x,y) { // Точка с координатами (x, y)
    this.x = Number(x);
    this.y = Number(y);
}


var lightColors = [
    '#DC143C',
    '#FF0000',
    '#FA8072',
    '#ADFF2F',
    '#32CD32',
    '#90EE90',
    '#00FF7F',
    '#FF69B4',
    '#FF1493',
    '#FFA500',
    '#FFFF00',
    '#FFFFE0',
    '#00FFFF',
    '#4682B4',
    '#00BFFF',
    '#0000FF',
    '#8A2BE2',
    '#800080',
    '#D2691E',
    '#8B4513',
  ];

var arrayOfPoints = new Array();

var COUNT_POINTS = null;

var isWorking = false;

var DIFF = 1e-6;

const buttonRunAlgorithm = document.getElementById('run-algorithm');

buttonRunAlgorithm.addEventListener('click', main);

const options = document.querySelector('.options');

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

function getAVGPoint(points) {
    p = new Point(0,0);

    for(let item of points) {
        p.x += item.x;
        p.y += item.y;
    }
    if(points.length != 0) {
        p.x /= points.length;
        p.y /= points.length;
        return p;
    }
    else {
        return new Point(getRandomInt(0 + 10, fieldRect.width-10),  getRandomInt(0 + 10, fieldRect.height-10));
    }
    
}

function getFirstNElems(arr, n) {
    let ans = new Array(n);

    for(let i = 0; i < n; i++) {
        ans[i] = arr[i];
    }
    return ans;
}


function Claster(point) {
    this.mainPoint = point;
    this.arr = new Array();
}

fieldRect = mainField.getBoundingClientRect();

function getArrayOfPointsNearClaster(clasterPoints, index) {

    ans = new Array();

    for(let item of arrayOfPoints) {
        
        let minLen = 1000000;
        for(let point of clasterPoints) {
            minLen = Math.min(minLen, getLength(point, item));
        }

        if(getLength(clasterPoints[index], item) == minLen) {
            ans.push(item);
        }
    }
    return ans;
}

function getArrayOfColors(len) {
    let ans = new Array(len);

    let copyLightColors = new Array();

    for(let item of lightColors) {
        copyLightColors.push(item);
    }
    setRandomPermutation(copyLightColors, copyLightColors.length);

    for(let i = 0; i < len;i++) {
        ans[i] = copyLightColors[i];
    }
    return ans;
}

function setColorPoint(point, color) {

    const fieldPoint = document.querySelector(`[data-x="${point.x}"][data-y="${point.y}"]`);

    fieldPoint.style.backgroundColor = color;
}

var randomColors = new Array();

function main() {

    isWorking = true;

    COUNT_POINTS = arrayOfPoints.length;

    if(getPointsButton.classList.contains("tools__button-active")) {
        getPointsButton.classList.toggle("tools__button-active");
        mainField.removeEventListener("mousedown",getPoint);
        mainField.removeEventListener("mouseup", setAnimationPoint);
    }
    
    if(COUNT_CLASTERS_K == null || COUNT_POINTS == 0 || EPS == null || M == null || COUNT_CLASTERS_AGG == null) {
        alert("Проверьте данные или их ввод!");
        isWorking = false; 
        return;
    }

    randomColors = getArrayOfColors(lightColors.length);

    K_means();
    dbscan();
    agglomerative();

    options.style.display = "block";
    isWorking = false;  
}






