function visualizeTree(node, data, depth = 0, prefix = '', index = 0) {
    if (typeof node !== 'object') {
        if(data.length <= index){
            data = Array(index + 1);
        }
        console.log(prefix + '└── Predict: ' + node);
        data[index] = node;
        return data;
    }

    console.log(prefix + '├── Feature_' + node.index + ' < ' + node.value.toFixed(2));
    
    if (node.right !== null) {
        const newPrefix = prefix + (depth > 0 ? '│   ' : '    ');
        data = visualizeTree(node.right, data, depth + 1, newPrefix, 2*index + 2);
    }

    if (node.left !== null) {
        const newPrefix = prefix + (depth > 0 ? '│   ' : '    ');
        data = visualizeTree(node.left, data, depth + 1, newPrefix, 2*index + 1);
    }
    data[index] = node;
    return data;
}

const svg = document.getElementById('svg');

class Point{
    constructor(x, y, value, id) {
        this.id = `id${id}`;
        this.x = x;
        this.y = y;
        this.point = document.createElement("div");
        this.point.className = "temp-div";
        this.point.id = this.id;
        this.point.textContent = value;
        this.point.style.background = "#a6a6a6";
        this.point.style.position = "absolute";
        this.point.style.width = `${this.point.textContent.length*8}px`;
        this.point.style.zIndex = 1;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getWidth(){
        return parseInt(this.point.style.width || getComputedStyle(this.point).width);
    }
    setActiveStyle(){
        this.point.style.background = "#5ae88a";
    }
    render(parent){
        this.point.style.left = `${this.x}px`;
        this.point.style.top = `${this.y}px`;
        parent.appendChild(this.point);
    }
}

class Tree {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.element.style.width = 0;
        this.element.style.height = 0;
        this.isClean = true;
        this.isBuilt = false;
        this.pathWasFound = true;
        this.childH = 22;
    }

    findPath(data){
        if(!this.pathWasFound || !this.isBuilt || this.isClean){
            return;
        }
        this.pathWasFound = false;

        const divs = document.querySelectorAll(".temp-div");
        divs.forEach(div => div.style.background = "#a6a6a6");
        
        let id = "idroot";
        for(let direct of data){
            let color = direct[1] ? "#5ae88a" : "#b32851";
            document.getElementById(id).style.background = color;
            id = id + direct[0];
        }
        document.getElementById(id).style.background = "#ff8800";

        this.pathWasFound = true;
    }

    visualizeTree(node, absD, depth = 0, pX = 0, pY = 0, direct = "root", prevD = "") {
        let newY;
        let newX;
        if(direct === "left"){
            newY = pY - this.childH * Math.pow(2, absD - depth);
            newX = pX + 200;
        }else if(direct === "right"){
            newY = pY + this.childH * Math.pow(2, absD - depth);
            newX = pX + 200;
        }else{
            newX = 10;
            newY = (parseInt(this.element.style.height) - this.childH) / 2;;
        }
        if(direct !== "root"){
            svg.insertAdjacentHTML(
                "beforeend",
                `<line x1 = '${pX}' y1 = '${pY}' x2 = '${newX}' y2 = '${newY}' stroke = "blue" stroke-width = "2" class="line">`
            );
        }

        if (typeof node !== 'object') {
            let point = new Point(newX, newY, `predicted: ${node}`, prevD+direct);
            if(parseInt(this.element.style.width) < newX){
                this.element.style.width = `${newX}px`;
            }
            point.render(this.element);
            return;
        }
    
        let point = new Point(newX, newY, `Feature_ ${node.index + 1} <= ${node.value}`, prevD+direct);
        point.render(this.element);
        
        if (node.left !== null) {
            this.visualizeTree(node.left, absD, depth + 1, newX, newY, "left", prevD+direct);
        }

        if (node.right !== null) {
            this.visualizeTree(node.right, absD, depth + 1, newX, newY, "right", prevD+direct);
        }
    }

    buildTree(tree, depth){
        if(!this.pathWasFound){
            return;
        }
        if(!this.isClean){
            this.deletePoints();
        }
        this.isBuilt = false;
        this.isClean = false;
        this.element.style.height = `${(2 * Math.pow(2, depth) - 1 + 2)*this.childH}px`;
        this.visualizeTree(tree, depth);
        this.isBuilt = true;
    }

    updateSize(child) {
        const childX = child.getX();
        const childY = child.getY();
        const childWidth = child.getWidth();
        const childHeight = this.childH;
        
        const parentWidth = parseInt(this.element.style.width || getComputedStyle(this.element).width);
        const parentHeight = parseInt(this.element.style.height || getComputedStyle(this.element).height);
        
        const newWidth = Math.max(parentWidth, childX + childWidth);
        const newHeight = Math.max(parentHeight, childY + childHeight);
        
        if (newWidth > parentWidth || newHeight > parentHeight) {
            this.element.style.width = `${newWidth}px`;
            this.element.style.height = `${newHeight}px`;
        }
    }

    deletePoints(){
        if(!this.isBuilt || !this.pathWasFound){
            return;
        }
        const divsToRemove = document.querySelectorAll(".temp-div");
        divsToRemove.forEach(div => div.remove());
        const linesToRemove = document.querySelectorAll(".line");
        linesToRemove.forEach(line => line.remove());
        this.isClean = true;
        this.element.style.width = 0;
        this.element.style.height = 0;
    }
  }

const progressbar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");

function updateProgress(e) {
    if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + "%";
            progress.textContent = percentLoaded + "%";
        }
    }
}

let dataset = [];
function handleFileSelected(event) { 
    progress.style.width = "0%";  
    progress.textContent = "0%";  
    const reader = new FileReader();
    if(event.target.files.length>0){
        reader.readAsText(event.target.files[0]);
    }
    reader.onprogress = updateProgress;  
    reader.onerror = (e) => console.error(e.target.error);  
    reader.onload = () => {    
        progress.style.width = "100%";    
        progress.textContent = "100%";
        const text = reader.result;
        const lines = text.trim().split('\n');
        dataset = lines.map(line => line.split(','));
    };
}

document.getElementById("files").addEventListener("change", handleFileSelected);
document.querySelector('.file-input')?.addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Файл не выбран';
    e.target.parentNode.setAttribute('data-file', fileName);
});
  
let viewTree = null;
let curTree = null;

let setD = document.getElementById("depth");

document.getElementById("btn_build").addEventListener("click", () => {
    if (dataset.length > 0 && dataset[0].length > 0) {
        for (let i = 0; i < dataset[0].length - 1; i++) {
            if(typeof dataset[0][i] === 'string'){
                strColumnToFloat(dataset, i);
            }
        }
    } else {
        console.error("Dataset is empty or invalid.");
        process.exit(1);
    }

    let DEPTH = 3;
    if(setD.value.length > 0){
        if(parseInt(setD.value) > 11){
            DEPTH = parseInt(11);
        }else{
            DEPTH = parseInt(setD.value);
        }
    }
    
    const tree = buildTree(dataset, maxDepth=DEPTH, minSize=8);
    curTree = tree;
    let data = [];
    data = visualizeTree(tree, data);
    if(viewTree === null){
        viewTree = new Tree("parent");
    }else{
        viewTree.deletePoints();
    }
    viewTree.buildTree(curTree, DEPTH);
});

document.getElementById("btn_del").addEventListener("click", () => {
    viewTree.deletePoints();
});
let serchDataInputText = document.getElementById('data');
document.getElementById("btn_find")?.addEventListener("click", () => {
    let serchDataText = serchDataInputText.value.split(',');
    serchDataText = serchDataText.map(Number);
    let path = [];
    predictSingle(curTree, serchDataText, path);
    viewTree.findPath(path);
});