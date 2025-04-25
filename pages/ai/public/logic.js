const firstLayer = 784;
const secondLayer = 1000;
const thirdLayer = 10;

const zero = document.getElementById("zero");
const one = document.getElementById("one");
const two = document.getElementById("two");
const thrie = document.getElementById("thrie");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const nine = document.getElementById("nine");

const canvas = document.getElementById("canvas");
const new_canvas = document.getElementById("new_canvas");
const btn = document.getElementById("button_define");
const btn_clear = document.getElementById("button_clear");
const context = canvas.getContext("2d");

context.lineWidth = 20;

const w = canvas.width;
const h=canvas.height;
 
const mouse = { x:0, y:0};
let draw = false;
let weights1 = w1.trim().split(/\s+/).map(Number);
let weights2 = w2.trim().split(/\s+/).map(Number);

function setResult(result){
    zero.textContent = result[0].toFixed(2)*100 + '%';
    one.textContent = result[1].toFixed(2)*100 + '%';
    two.textContent = result[2].toFixed(2)*100 + '%';
    thrie.textContent = result[3].toFixed(2)*100 + '%';
    four.textContent = result[4].toFixed(2)*100 + '%';
    five.textContent = result[5].toFixed(2)*100 + '%';
    six.textContent = result[6].toFixed(2)*100 + '%';
    seven.textContent = result[7].toFixed(2)*100 + '%';
    eight.textContent = result[8].toFixed(2)*100 + '%';
    nine.textContent = result[9].toFixed(2)*100 + '%';
}

function scaleCanvasTo28x28(sourceCanvas) {
    new_canvas.width = 28;
    new_canvas.height = 28;
    const ctx = new_canvas.getContext('2d');
    
    const scale = Math.min(28 / 500, 28 / 500);
    const scaledWidth = 500 * scale;
    const scaledHeight = 500 * scale;
    const offsetX = (28 - scaledWidth) / 2;
    const offsetY = (28 - scaledHeight) / 2;

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 28;
    tmpCanvas.height = 28;
    const tmpContex = tmpCanvas.getContext('2d');
    
    tmpContex.drawImage(sourceCanvas, offsetX, offsetY, scaledWidth, scaledHeight);
    let coords = findBox(tmpContex.getImageData(0, 0, 28, 28).data);

    let box_x = coords[2] - coords[0] + 1;
    let box_y = coords[3] - coords[1] + 1;

    let sx = (28 - box_x)/2;
    let sy = (28 - box_y)/2;

    ctx.drawImage(tmpCanvas, coords[0], coords[1], box_x, box_y, sx, sy, box_x, box_y);
    
    return ctx.getImageData(0, 0, 28, 28);
}

function findBox(img){
    img = convert4in2(img);
    let sx = 28;
    let sy = 28;
    let ex = 0;
    let ey = 0;
    for(let i = 0; i < 28; ++i){
        for(let j = 0; j < 28; ++j){
            if(img[j + 28*i] == 0){
                continue;
            }
            if(j < sx){
                sx = j;
            }
            if(j > ex){
                ex = j;
            }
            if(i < sy){
                sy = i;
            }
            if(i > ey){
                ey = i;
            }
        }
    }

    if(sx - 2 >= 0 && ex + 2 < 28){
        sx -= 2;
        ex += 2;
    }else if(sx - 1 >= 0 && ex + 1 < 28){
        sx -= 1;
        ex += 1;
    }
    if(sy - 2 >= 0 && ey + 2 < 28){
        sy -= 2;
        ey += 2;
    }else if(sy - 1 >= 0 && ey + 1 < 28){
        sy -= 1;
        ey += 1;
    }
    let coords = [];
    coords.push(sx);
    coords.push(sy);
    coords.push(ex);
    coords.push(ey);
    return coords;
}

function convert4in2(a){
    let copy = [];
    for(let i = 0; i < a.length; ++i){
        copy.push(a[i]*1);
    }
    let newA = [];
    for(let i = 3; i < copy.length; i += 4){
        newA.push(copy[i]);
    }
    return newA;
}

function convert2in4(a){
    let newA = [];
    for(let i = 0; i < a.length; ++i){
        newA.push(0);
        newA.push(0);
        newA.push(0);
        newA.push(a[i]);
    }
    return newA;
}

function sigm(n){
    return 1/(1 + Math.E ** (-n));
}

function l_relu(x) {
    return (x > 0) ? x : 0.01 * x;
}

function softmax(x) {
    let max_val = x[0];
    for(let i = 0; i < thirdLayer; ++i){
        if(x[i] > max_val){
            max_val = x[i];
        }
    }
    let sum = 0.0;
    for(let i = 0; i < x.length; ++i){
        x[i] = Math.exp(x[i] - max_val);
        sum += x[i];
    }
    for(let i = 0; i < x.length; ++i){
        x[i] /= sum;
    }
    return x;
}

function firstLevel(n){
    let mean = 0.1307;
    let std = 0.3081;
    return (n / 255.0 - mean) / std;
}

function matrixMultiply(w, ar2, size1, size2){
    let result = [];
    for(let j = 0; j < size2; ++j){
        let s = 0;
        for(let i = 0; i < size1; ++i){
            s += w[i][j] * ar2[i];
        }
        result.push(s);
    }
    return result;
}

canvas.addEventListener("mousedown", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
});

canvas.addEventListener("mousemove", function(e){
      
    if(draw==true){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x-2, mouse.y-2);
        context.lineTo(mouse.x-1, mouse.y-1);
        context.lineTo(mouse.x, mouse.y);
        context.lineTo(mouse.x+1, mouse.y+1);
        context.lineTo(mouse.x+2, mouse.y+2);
        context.stroke();
    }
});

canvas.addEventListener("mouseout", function(e){
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    context.closePath();
    draw = false;
});
 
canvas.addEventListener("mouseup", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    //context.lineTo(mouse.x, mouse.y);
    //context.stroke();
    context.closePath();
    draw = false;
});

let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup');
let answer = document.getElementById("res");

function define(){
    var myImageData = scaleCanvasTo28x28(canvas);
    let data = convert4in2(myImageData.data);
    console.log(data);
    for(let i = 0; i < firstLayer; ++i){
        data[i] = firstLevel(data[i]);
    };

    data = matrixMultiply(weights1, data, firstLayer, secondLayer);
    for(let i = 0; i < secondLayer; ++i){
        data[i] = l_relu(data[i]);
    }

    data = matrixMultiply(weights2, data, secondLayer, thirdLayer)
    data = softmax(data);
    let vals3 = data;
    setResult(vals3);
    let res = 0;
    for(let i = 0; i < 10; ++i){
        if(vals3[i] > vals3[res]){
            res = i;
        }
    }
    answer.textContent = res;
    popupBg.classList.add('active');
    popup.classList.add('active');
}

function clear(){
    context.clearRect(0, 0, w, h);
    new_canvas.getContext('2d').clearRect(0, 0, w, h);
}

btn.addEventListener('click', define);
btn_clear.addEventListener('click', clear);

async function loadW1() {
    try {
        let weight = [];
        for (let i = 0; i < firstLayer; ++i){
            let w = [];
            for (let j = 0; j < secondLayer; ++j){
                w.push(weights1[i*secondLayer + j]);
            }
            weight.push(w);
        }
        weights1 = weight;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

async function loadW2() {
    try {
        let weight = [];
        for (let i = 0; i < secondLayer; ++i){
            let w = [];
            for (let j = 0; j < thirdLayer; ++j){
                w.push(weights2[i*thirdLayer + j]);
            }
            weight.push(w);
        }
        weights2 = weight;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadW1();
    loadW2();
});

document.addEventListener('click', (e) => {
    if(e.target === popupBg) {
        popupBg.classList.remove('active');
        popup.classList.remove('active');
    }
});