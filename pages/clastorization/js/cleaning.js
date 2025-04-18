const buttonCleaning = document.getElementById('clear-field');


function clear() {
    
    if(isWorking) return;

    mainField.innerHTML = "";
    kMeansField.innerHTML = "";
    dbscanField.innerHTML = "";
    
    mainField.style.display = "block";
    kMeansField.style.display = "none";
    dbscanField.style.display = "none";
    options.style.display = "none";

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
    if(buttonCleaning.classList.contains("tools__button-active")) buttonCleaning.classList.toggle("tools__button-active");
}

buttonCleaning.addEventListener("mousedown", setClear);
document.addEventListener("mouseup", removeAnimation);