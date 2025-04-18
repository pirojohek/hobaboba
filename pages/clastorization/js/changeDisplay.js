const changeToKMeansButton = document.getElementById("k-means-button");

const changeToDBSCANButton = document.getElementById("dbscan-button");

// еще одну кнопку

function changeToKMeans() {

    changeToKMeansButton.classList.toggle("tools__button-active");
    mainField.style.display = "none";
    kMeansField.style.display = "block";
    dbscanField.style.display = "none";
}
function removeChangeToKMeans() {
    if(changeToKMeansButton.classList.contains("tools__button-active")) {
        changeToKMeansButton.classList.toggle("tools__button-active");
    }
}

function changeToDBSCAN() {

    if(!changeToDBSCANButton.classList.contains("tools__button-active")){
        mainField.style.display = "none";
        kMeansField.style.display = "none";
        dbscanField.style.display = "block";
    }
    changeToDBSCANButton.classList.toggle("tools__button-active");
}
function removeChangeToDBSCAN() {
    if(changeToDBSCANButton.classList.contains("tools__button-active")) {
        changeToDBSCANButton.classList.toggle("tools__button-active");
    }
}
changeToKMeansButton.addEventListener('mousedown', changeToKMeans);
document.addEventListener('mouseup', removeChangeToKMeans);
changeToDBSCANButton.addEventListener('mousedown', changeToDBSCAN);
document.addEventListener('mouseup', removeChangeToDBSCAN);