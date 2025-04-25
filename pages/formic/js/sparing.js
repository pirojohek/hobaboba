
function updatePlayerLength(dot1, dot2){
	const [x1, y1] = [data.dotCords[dot1][0] + 7, 
			data.dotCords[dot1][1] + 7];
	const [x2, y2] = [data.dotCords[dot2][0] + 7, 
			data.dotCords[dot2][1] + 7];

	const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	const playerLength = document.getElementById("sparing__current-length");

	data.playerLengthWay += distance;
	playerLength.innerHTML = data.playerLengthWay;
}



function selectedDots(e){
	data.pathPlayer.push(e.target.dataset.idDot - 1);
	data.countSelectedDots += 1;
	removeEventOnDots(e.target.dataset.idDot);
	e.target.classList.add("selected-dot")
	if (data.countSelectedDots > 1){
		drawLine(data.pathPlayer[data.countSelectedDots - 1], data.pathPlayer[data.countSelectedDots - 2], true);
		updatePlayerLength(data.pathPlayer[data.countSelectedDots - 1], data.pathPlayer[data.countSelectedDots - 2]);
	} 
	if (data.countSelectedDots == data.dotCords.length){
		drawLine(data.pathPlayer[0], data.pathPlayer[data.pathPlayer.length - 1], true);
		updatePlayerLength(data.pathPlayer[0], data.pathPlayer[data.pathPlayer.length - 1]);
	}
	
}

function addEventOnDots(){
	for (let i = 0; i < data.dotCords.length; i++){
		const dot = document.querySelector(`.game__dot[data-id-dot="${i + 1}"]`);
		dot.classList.add("game__dot-sparing");
		dot.addEventListener("click", selectedDots);
	}
}

function removeEventOnDots(dotId){
	const dot = document.querySelector(`.game__dot[data-id-dot="${dotId}"]`);
	dot.classList.remove("game__dot-sparing");
	dot.removeEventListener("click", selectedDots);
}

function addConfirm(e){
	if (data.countSelectedDots == data.dotCords.length){
		e.target.removeEventListener("click", addConfirm);
		
		for (let i = 1; i <= data.dotCords.length; i++){
			const dot = document.querySelector(`.game__dot[data-id-dot="${i}"]`);
			dot.classList.remove("selected-dot");
		}

		formic(true);
	} else {
		alert("Выберите все точки");
	}
}

function winMachine(){
	const sparingBlock = document.querySelector(".sparing");
	sparingBlock.classList.add("sparing-visited");

	addEventOnDots();

	const confirm = document.getElementById("is-confirm");
	confirm.addEventListener("click", addConfirm);

}

function clearPathPlayer(){
	const lines = document.querySelectorAll(".game__line-player");
	for (let line of lines){
		line.remove();
	}
	addEventOnDots();
	const path = document.getElementById("sparing__current-length");
	path.innerHTML = "";

	data.pathPlayer = [];
	data.playerLengthWay = 0;
	data.countSelectedDots = 0;
}

function drawPathPlayer(){
	const lines = document.querySelectorAll(".game__line-player");
	for (let line of lines){
		line.remove();
	}

	for (let i = 1; i < data.countSelectedDots; i++){
		drawLine(data.pathPlayer[i - 1], data.pathPlayer[i], true);
	}
	drawLine(data.pathPlayer[data.countSelectedDots - 1], data.pathPlayer[0], true);
}

function addBtnDrawPathPlayer(){
	const btn = document.getElementById("drawPath");
	btn.addEventListener("click", drawPathPlayer);
}


function offSparing(e){
	const btnSparing = document.getElementById("sparing");
	btnSparing.classList.remove("tools__button-active");

	const btnAdd = document.getElementById("add-dots");
	btnAdd.classList.remove("tools__button-active");

	e.target.removeEventListener("click", offSparing);

	e.target.classList.remove("tools__button-on");
	e.target.classList.add("tools__button-off");

	const spar = document.querySelector(".sparing");
	spar.classList.remove("sparing-visited");
	
	clearPathPlayer();

	const btnDrawPlayerPath = document.getElementById("drawPath");
	btnDrawPlayerPath.removeEventListener("click", drawPathPlayer);
	
	const addDots = document.getElementById("add-dots");
	addDots.addEventListener("click", btnAddDots);
	
}



function btnClearPlayerPath(){
	const btn = document.getElementById("clear-way");
	btn.addEventListener("click", clearPathPlayer);

}


function play(){
	const btn = document.getElementById("sparing");
	btn.addEventListener("click", (e) => {
		if (data.dotCords.length >= 3){
			btn.classList.add("tools__button-active");
			const btnAdd = document.getElementById("add-dots");

			btnAdd.classList.remove("tools__button-active");

			const btnGiveUp = document.getElementById("sparing-off");
			btnGiveUp.addEventListener("click", offSparing);

			btnClearPlayerPath();
			addBtnDrawPathPlayer();

			btnGiveUp.classList.remove("tools__button-off");
			btnGiveUp.classList.add("tools__button-on");

			btnAdd.removeEventListener("click", btnAddDots);
			const game = document.getElementById("game-map");
			game.removeEventListener("click", addDot)
			winMachine();
		} else {
			alert("Добавьте хотя бы 3 точки");
		}
	});
	
}
