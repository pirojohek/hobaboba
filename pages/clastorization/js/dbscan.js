var EPS = null;

var M = null;

let pointsWithoutFlags = new Set();

let pointsSet = new Set();

let clasters = new Array();


function getLengthDBSCAN(point1, point2) {
    return Math.max(Math.sqrt((point1.x-point2.x)**2  + (point1.y-point2.y)**2) - 20, 0);
}

function firstFilling() {
    clasters = new Array();

    pointsWithoutFlags.clear();
    pointsSet.clear();

    for(let item of arrayOfPoints) {
        pointsWithoutFlags.add(item);
        pointsSet.add(item);
    }
}

function getSetOfPoints(rootPoint, withOut = new Set()) {
    let ans = new Set();

    for(let item of pointsSet) {
        if(rootPoint != item && getLengthDBSCAN(rootPoint, item) < EPS && !withOut.has(item)) {
            ans.add(item);
        }
    }
    // for(let item of ans) {
    //     if(pointsWithoutFlags.has(item)) {
    //         pointsWithoutFlags.delete(item);
    //     }
    //     if(perhabsNoise.has(item)) {
    //         perhabsNoise.delete(item);
    //     }
    // }
    return ans;
}

function drawPoints() {

    let clasterColors = getFirstNElems(randomColors, clasters.length);

    for(let i = 0; i < clasters.length; i++) {
        for(let j = 0; j < clasters[i].length; j++) {

            const currentPoint = clasters[i][j];

            const pointTag = document.createElement("div");
            pointTag.classList.add("field__point");

            pointTag.classList.add("point-standart");

            pointTag.setAttribute("style", `
                left: ${currentPoint.x-10}px;
                top: ${currentPoint.y-10}px;
            `);

            pointTag.style.backgroundColor = clasterColors[i];

            dbscanField.appendChild(pointTag);

        }
    }
}

function drawNoise() {
    let extraSet = new Set();

    for(let i of clasters) {
        for(let j of i) {
            extraSet.add(j);
        }
    }

    let noises = new Set();

    for(let item of pointsSet) {
        if(!extraSet.has(item)) {
            noises.add(item);
        }
    }
    
    for(let item of noises) {
        const currentPoint = item;

        const pointTag = document.createElement("div");
        pointTag.classList.add("field__point");

        pointTag.classList.add("point-extra");

        pointTag.setAttribute("style", `
            left: ${currentPoint.x-10}px;
            top: ${currentPoint.y-10}px;
        `);

        dbscanField.appendChild(pointTag);
    }

}

function dbscan() {

    dbscanField.innerHTML = "";
    firstFilling();
        
    let done = new Set();

        for(let item of pointsWithoutFlags) {

            if(done.has(item)) continue;

            setOfNearPoints = getSetOfPoints(item);

            if(setOfNearPoints.size < M) {  
                done.add(item);
            }
            else {
                // Есть новый кластер

                clasters.push(new Array());


                let queue = new Array();
                queue.push(item);

                let usedPoints = new Set();

                // Типа BFS
                while(queue.length != 0) {

                    let currentPoint = queue.shift();

                    if(!usedPoints.has(currentPoint)) {
                        clasters[clasters.length-1].push(currentPoint);

                        done.add(currentPoint);
                        usedPoints.add(currentPoint);

                        let activePoints = getSetOfPoints(currentPoint, usedPoints);

                        let allPoints = getSetOfPoints(currentPoint);

                        if(allPoints.size >= M) {
                            for(let c of activePoints) queue.push(c);
                        }
                    }
                }
            }
        }

    drawPoints();
    drawNoise();
}
