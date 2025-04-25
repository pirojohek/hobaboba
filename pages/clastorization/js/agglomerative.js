function Pair(f, s) {
    this.first = f;
    this.second = s;
}

function EqualsArray(a, b) {
    if(a.length != b.length) return false;

    for(let i = 0; i < a.length;i++) {
        if(a[i] != b[i]) return false;
    }
    return true;
}

function LansYuliams(u, v, s, Rus, Rvs, Ruv) {
    let alphaU = (s.length * 1.0 + u.length) / (s.length * 1.0 + u.length + v.length);
    let alphaV = (s.length * 1.0 + v.length) / (s.length * 1.0 + u.length + v.length);
    let beta = (-s.length) / (s.length * 1.0 + u.length + v.length);

    return alphaU * Rus + alphaV * Rvs + beta * Ruv;
}

var COUNT_CLASTERS_AGG = null;

function getMergedArray(arr1, arr2) {
    let ans = new Array(arr1.length + arr2.length);

    for(let i = 0; i < arr1.length; i++) {
        ans[i] = arr1[i];
    }
    for(let i = 0; i < arr2.length; i++) {
        ans[i + arr1.length] = arr2[i];
    }
    return ans;
}

function draw(clasters) {

    let clasterColors = getFirstNElems(randomColors, clasters.length);

    for(let i = 0; i < clasters.length; i++) {
        for(let j = 0; j < clasters[i].length; j++) {

            const currentIndex = clasters[i][j];

            const currentPoint = arrayOfPoints[currentIndex];

            const pointTag = document.createElement("div");
            pointTag.classList.add("field__point");

            pointTag.classList.add("point-standart");

            pointTag.setAttribute("style", `
                left: ${currentPoint.x-10}px;
                top: ${currentPoint.y-10}px;
            `);

            pointTag.style.backgroundColor = clasterColors[i];

            agglomerativeField.appendChild(pointTag);

        }
    }
}

function agglomerative() {

    let result = new Array();

    let edges = new Map();

    result.push(new Array());

    for(let i = 0; i < arrayOfPoints.length; i++) {

        let tmpArr = new Array();
        tmpArr.push(i);

        result[0].push(tmpArr);
    }

    for(let i = 0; i < arrayOfPoints.length; i++) {
        for(let j = 0; j < arrayOfPoints.length; j++) {

            if(i == j) continue;

            let firstArr = new Array();
            let secondArr = new Array();

            firstArr.push(i);
            secondArr.push(j);

            let sfirstArr =  JSON.stringify(firstArr);
            let ssecondArr =  JSON.stringify(secondArr);

            edges.set(sfirstArr + " " + ssecondArr, getLength(arrayOfPoints[i], arrayOfPoints[j]));
        }
    }

    for(let i = 1; i < arrayOfPoints.length;i++) {

        if(result[i - 1].length == COUNT_CLASTERS_AGG) break;

        for(let [key, value] of edges) {
            console.log(key, value);
        }

        let mnEdge = 1000000;

        for(let [key, value] of edges) {
            
            mnEdge = Math.min(mnEdge, value);
            
        }
        let currentKey = null;
        let currentValue = null;

        for(let [key, value] of edges) {
            if(value == mnEdge) {
                console.log(key, value);
                currentKey = key;
                currentValue = value;
                break;
            }
        }

        console.log(currentKey);

        let newEdges = new Map();

        let currentResult = new Array();

        currentKeyArray = currentKey.split(" ");

        for(let j = 0; j < result[i - 1].length; j++) {
            if(( !EqualsArray(result[i - 1][j], JSON.parse(currentKeyArray[0])) ) && ( !EqualsArray(result[i - 1][j], JSON.parse(currentKeyArray[1])) )) {
                currentResult.push(result[i-1][j]);
                console.log(result[i-1][j]);
            }
        }

        let w = getMergedArray(JSON.parse(currentKeyArray[0]), JSON.parse(currentKeyArray[1]));

        currentResult.push(w);

        
        for(let j = 0; j < currentResult.length; j++) {
            for(let k = 0; k < currentResult.length; k++) {

                if(j == k) continue;

                let a = currentResult[j];
                let b = currentResult[k];

                let sa = JSON.stringify(a);
                let sb = JSON.stringify(b);

                if(( !EqualsArray(a, w) ) && ( !EqualsArray(b, w) )) {
                    newEdges.set(sa + " " + sb, edges.get(sa + " " + sb));
                }
            }
        }

        for(let j = 0; j < currentResult.length; j++) {
            if(!EqualsArray(currentResult[j], w)) {

                let s = currentResult[j];
                let u = currentKeyArray[0];
                let v = currentKeyArray[1];
                

                let ss = JSON.stringify(s);
                
                let sw = JSON.stringify(w);

                let r = LansYuliams(JSON.parse(u), JSON.parse(v), s, edges.get(u + " " + ss), edges.get(v + " " + ss), edges.get(u + " " + v));
                newEdges.set(sw + " " + ss, r);
                newEdges.set(ss + " " + sw, r);
            }
        }

        result.push(currentResult);
        edges.clear();

        for(let [key, value] of newEdges) {
            edges.set(key, value);
            
        }

        
        
        console.log(currentResult);
    }
    draw(result[result.length - 1]);

}