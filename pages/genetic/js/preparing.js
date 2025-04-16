const getPointsButton = document.getElementById('get-points');
var screen = document.getElementById('screen');
const field = document.querySelector(".field");

var countPoints = 0;

var previousPoint = null;

var previousPointObject = null;

function getPoint(e) {

    const rect = field.getBoundingClientRect();

    const x = e.x - rect.left;
    const y = e.y-rect.top;

    let point = new Point(x, y);

    arrayOfPoints.push(point);
    countPoints++;

    const currentPoint = document.createElement("div");
    currentPoint.classList.add("field__point");

    currentPoint.classList.add("point-new");

    currentPoint.setAttribute("data-x", x);
    currentPoint.setAttribute("data-y", y);


    currentPoint.setAttribute("style", `
            left: ${x-10}px;
            top: ${y-10}px;
        `);
    field.appendChild(currentPoint);
    

    // Черчение линий в процессе проставления точек
    // if(previousPoint != null) {
        
    //     screen.insertAdjacentHTML(
    //         "beforeend",
    //         `<line x1 = '${previousPoint.x}' y1 = '${previousPoint.y}' x2 = '${x}' y2 = '${y}' stroke = "blue" stroke-width = "2">`
    //     );
    // }
    previousPoint = point;
    previousPointObject = currentPoint;
}
function setAnimationPoint() {
    previousPointObject.classList.remove("point-new");
    previousPointObject.classList.add("point-standart");
}

function runProcessOfPreparing() {

    if(getPointsButton.classList.contains("tools__button-active")) {
        getPointsButton.classList.toggle("tools__button-active");
        field.removeEventListener("mousedown",getPoint);
        field.removeEventListener("mouseup", setAnimationPoint);
    }
    else {
        getPointsButton.classList.toggle("tools__button-active");
        field.addEventListener("mousedown", getPoint);
        field.addEventListener("mouseup", setAnimationPoint);
    }
   
}

getPointsButton.addEventListener("click", runProcessOfPreparing);