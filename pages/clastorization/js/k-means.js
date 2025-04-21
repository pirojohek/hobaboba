
var COUNT_CLASTERS = null;

function AddPointKMeans(point, color) {


    const currentPoint = document.createElement("div");
    currentPoint.classList.add("field__point");

    currentPoint.classList.add("point-standart");


    currentPoint.setAttribute("style", `
            left: ${point.x-10}px;
            top: ${point.y-10}px;
            background-color: ${color};
        `);
    
    kMeansField.appendChild(currentPoint);
}

function K_means() {

    let oldExtraPoints = document.querySelectorAll(".point-extra"); 

    for(let item of oldExtraPoints) {
        item.outerHTML = "";
    }

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

        if(maxDiff <= DIFF){
            flag = false;
        }
        else {
            for(let i = 0; i < clasters.length; i++) {
                clasters[i] = newClasters[i];
            }
        }
        
    }

    let colors = getFirstNElems(randomColors, clasters.length);

    for(let i = 0; i < clasters.length; i++) {
        for(let point of clasters[i].arr) {

            AddPointKMeans(point, colors[i]);

        }
    }

    for(let i = 0; i < clasters.length; i++) {
        const currentPoint = document.createElement("div");
        currentPoint.classList.add("field__point");
        currentPoint.classList.add("point-extra");

        currentPoint.setAttribute("style", `
            left: ${clasters[i].mainPoint.x-10}px;
            top: ${clasters[i].mainPoint.y-10}px;
        `);

        kMeansField.appendChild(currentPoint);
    }
}