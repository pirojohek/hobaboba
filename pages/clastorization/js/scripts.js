function Point(x,y) { // Точка с координатами (x, y)
    this.x = Number(x);
    this.y = Number(y);
}


var lightColors = [
    "#FFDDD1", "#E1F5FE", "#FFF9C4", "#DCEDC8", "#F8BBD0",
    "#B3E5FC", "#FFECB3", "#C8E6C9", "#F5D1E0", "#B2EBF2",
    "#FFE0B2", "#DCE775", "#E1BEE7", "#B2DFDB", "#FFCCBC",
    "#D7CCC8", "#CFD8DC", "#FFE57F", "#AED581", "#D1C4E9",
    "#80DEEA", "#FFAB91", "#F0F4C3", "#FFCDD2", "#A5D6A7",
    "#9FA8DA", "#81D4FA", "#FFB74D", "#FFF59D", "#90CAF9",
    "#CE93D8", "#80CBC4", "#FFCC80", "#E6EE9C", "#F48FB1",
    "#81C784", "#7986CB", "#4DD0E1", "#FFA726", "#FFEE58",
    "#4FC3F7", "#BA68C8", "#4DB6AC", "#FF8A65", "#D4E157",
    "#F06292", "#66BB6A", "#5C6BC0", "#26C6DA", "#FF7043"
  ];

var arrayOfPoints = new Array();

var COUNT_CLASTERS = 3;

var COUNT_POINTS = null;

var isWorking = false;

var EPS = 1e-6;

const buttonRunAlgorithm = document.getElementById('run-algorithm');

buttonRunAlgorithm.addEventListener('click', main);

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


function Claster(point) {
    this.mainPoint = point;
    this.arr = new Array();
}

fieldRect = field.getBoundingClientRect();

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

function K_means() {

    let clasterPoints = new Array();
    for(let i = 0; i < COUNT_CLASTERS;i++) {
        clasterPoints.push(new Point(getRandomInt(0 + 10, fieldRect.width-10),  getRandomInt(0 + 10, fieldRect.height-10)));
    }

    let clasters = new Array();

    for(let i = 0; i < COUNT_CLASTERS; i++){
        clasters.push(new Claster(clasterPoints[i]));
    }

    let flag = true;

    

    while(flag) {

        pointsClastersOld = new Array();

        for(let item of clasters) {
            pointsClastersOld.push(item.mainPoint);
        }

        newClasters = new Array();

        for(let i = 0; i < clasters.length; i++) {
            newClasters[i] = new Claster(clasters[i].mainPoint);

            newClasters[i].arr = getArrayOfPointsNearClaster(clasterPoints, i);
            newClasters[i].mainPoint = getAVGPoint(newClasters[i].arr);
            clasterPoints[i] = newClasters[i].mainPoint;
        }

        let maxDiff = 0.0;

        for(let i = 0; i < clasters.length; i++) {
            maxDiff = Math.max(maxDiff, getLength(clasters[i].mainPoint, newClasters[i].mainPoint));
        }

        if(maxDiff <= EPS){
            flag = false;
        }
        else {
            for(let i = 0; i < clasters.length; i++) {
                clasters[i] = newClasters[i];
            }
        }
        
    }

    let colors = getArrayOfColors(clasters.length);

    for(let i = 0; i < clasters.length; i++) {
        for(let point of clasters[i].arr) {

            setColorPoint(point, colors[i]);

        }
    }

    for(let i = 0; i < clasters.length; i++) {
        const currentPoint = document.createElement("div");
        currentPoint.classList.add("field__point");
        currentPoint.classList.add('point-standart');

        currentPoint.setAttribute("style", `
            left: ${clasters[i].mainPoint.x-10}px;
            top: ${clasters[i].mainPoint.y-10}px;
        `);

        field.appendChild(currentPoint);
    }
}


function main() {

    isWorking = true;

    COUNT_POINTS = arrayOfPoints.length;

    if(getPointsButton.classList.contains("tools__button-active")) {
        getPointsButton.classList.toggle("tools__button-active");
        field.removeEventListener("mousedown",getPoint);
        field.removeEventListener("mouseup", setAnimationPoint);
    }
    
    if(COUNT_POINTS == 0) {
        alert("Проверьте данные!");
        return;
    }

    K_means();
    
    isWorking = false;
}






