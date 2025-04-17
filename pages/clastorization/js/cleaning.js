const buttonCleaning = document.getElementById('clear-field');


function clear() {
    
    if(isWorking) return;

    field.innerHTML = "";
    
    while(arrayOfPoints.length != 0) {
        arrayOfPoints.pop();
    }

    COUNT_POINTS = null;
}

function setClear() {
    buttonCleaning.classList.toggle("tools__button-active");
    clear();
}
function removeAnimation() {
    buttonCleaning.classList.toggle("tools__button-active");
}

buttonCleaning.addEventListener("mousedown", setClear);
buttonCleaning.addEventListener("mouseup", removeAnimation);