const buttonCleaning = document.getElementById('clear-field');

function clear() {
    
    if(isWorking) return;

    screen.innerHTML = "";
    field.innerHTML = '<svg id="screen"></svg>';
    screen = document.getElementById('screen');

    while(arrayOfPoints.length != 0) {
        arrayOfPoints.pop();
    }

    iterator.innerHTML = 0;
    textIterator.style.visibility = 'hidden';

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
buttonCleaning.addEventListener("mouseup", setClear);