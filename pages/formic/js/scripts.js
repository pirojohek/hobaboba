let data = {
	dotCords: [],
	alpha: 1.0,
	beta: 2.0,
	q: 40,
	matrix: null,
	d: 100,
	p: 0.2,
	stopProgram: false,

	countSelectedDots: 0,
	pathPlayer: [],
	playerLengthWay: 0,

	isGame: false,
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stopProgram(){
	const btn = document.getElementById("stop-program");
	btn.addEventListener("click", (e) => {
		data.stopProgram = true;
	});
}

function drawLine(dot1, dot2, isPlayer){

	const [x1, y1] = [data.dotCords[dot1][0] + 7, 
			data.dotCords[dot1][1] + 7];
	const [x2, y2] = [data.dotCords[dot2][0] + 7, 
			data.dotCords[dot2][1] + 7];

	const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

	const line = document.createElement("div");
	line.classList.add("game__line");
	if (isPlayer){
		line.classList.add("game__line-player");
	}
	line.style.width = `${distance}px`;
	line.style.left = `${x1}px`;
	line.style.top = `${y1}px`;
	line.style.transform = `rotate(${angle}deg)`;
	const game = document.getElementById("game-map");
	game.appendChild(line);
}

function removeLines(){
	const game = document.querySelectorAll(".game__line");

	for (const line of game) {
		line.remove();
	}
	
}

function eventRemoveLines(){
	const btn = document.getElementById("clear-path");
	btn.addEventListener("click", removeLines);
}

async function drawPath(path){
	removeLines();

	for (let i = 1; i < path.length; i++){
		drawLine(path[i - 1], path[i], false);
		await sleep(50);
	}
	drawLine(path[path.length - 1], path[0], false);
	return false;
}

function addDot(e){
	const rect = e.target.getBoundingClientRect();
	
	const cordX = e.clientX - rect.left;
	const cordY = e.clientY - rect.top;
	
	const dot = document.createElement("div");
	dot.classList.add("game__dot");

	dot.style.left = `${cordX - 7}px`;
	dot.style.top = `${cordY - 7}px`;
	data.dotCords.push([cordX - 7, cordY - 7]);
	dot.dataset.idDot = data.dotCords.length;
	
	e.target.appendChild(dot);

}

function getMatrix(){
	let matrix = [];
	for (let i = 0; i < data.dotCords.length; i++){
		matrix[i] = [];
		for (let j = 0; j < data.dotCords.length; j++){
			const x1 = data.dotCords[i][0];
			const y1 = data.dotCords[i][1];
			const x2 = data.dotCords[j][0];
			const y2 = data.dotCords[j][1];


			const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

			matrix[i][j] = [0.2, data.d / distance, distance];
		}
	}
	return matrix;
}


function getTransitionProbability(visited, matrix, currentVertex){
	let all = 0;
	for (let i = 0; i < data.dotCords.length; i++) {
		if (visited[i] == 0) {
			all += Math.pow(matrix[currentVertex][i][0], data.alpha) *
			Math.pow(matrix[currentVertex][i][1], data.beta);
		}
	}
	
	let variants = Array(data.dotCords.length).fill(0);
	for (let i = 0; i < data.dotCords.length; i++){
		if (visited[i] == 0){
			variants[i] = (Math.pow(matrix[currentVertex][i][0], data.alpha) *
			Math.pow(matrix[currentVertex][i][1], data.beta)) / all;
		}
	}
	return variants;
	
}

function getNexDot(transitionProbability){
	let randomNum = Math.random();
	let currentVertex = 0;
	let probability = 0;

	for (let i = 0; i < transitionProbability.length; i++){
		probability += transitionProbability[i];
		if (randomNum <= probability){
			currentVertex = i;
			break;
		}
	}
	return currentVertex;
}


function updatePheramone(matrix, ants){
	for (let ant of ants){
		let path = ant[0];
		let distance = ant[1];
		for (let i = 0; i < path.length - 1; i++) {
			const currentVertex = path[i];
			const nextVertex = path[i + 1];
			matrix[currentVertex][nextVertex][0] =
				(1 - data.p) * matrix[currentVertex][nextVertex][0] +
				data.q / distance;
		}
	}
	return matrix
}

async function formic(withPlayer = false){
	let matrix = getMatrix();
	let ants = [];
	let bestResult = 1e9;
	let lastBestResult = 1e9;
	let bestPath = [];

	for(let k = 0; k < 1000; k++){
		if (data.stopProgram){
			data.stopProgram = false;
			break;
		}
		for (let i = 0; i < data.dotCords.length; i++){

			let visited = Array(data.dotCords.length).fill(0);
			visited[i] = 1; // посещенные вершины
	
			let path = []; // создаю путь
			path.push(i);
	
			let countVisited = 1;
			let totalDistance = 0;
	
			while (countVisited < data.dotCords.length) {
				let transitionProbability = getTransitionProbability(visited, matrix, path[path.length - 1]);
				let nextDot = getNexDot(transitionProbability);
				totalDistance += matrix[path[path.length - 1]][nextDot][2];
				path.push(nextDot);
				visited[nextDot] = 1;
				countVisited += 1;
			}


			totalDistance += matrix[path[0]][path[path.length - 1]][2];
			if (bestResult > totalDistance){
				bestResult = totalDistance;
				bestPath = path;
			}
			
			ants[i] = [path, totalDistance];
		}

		const iteration = document.getElementById("current-iteration");
		iteration.innerHTML = `${k}`;
		await sleep(30);
		matrix = updatePheramone(matrix, ants);


		if (bestResult < lastBestResult){
			if(withPlayer){
				let persent = (data.playerLengthWay - bestResult) / data.playerLengthWay * 100;
				const block = document.getElementById("machine-better");
				block.innerHTML = persent + "%";
			}
			lastBestResult = bestResult;
			const minpath = document.getElementById("min-path");
			minpath.innerHTML = `${lastBestResult}`;
			const lastiteration = document.getElementById("last-iteration");
			lastiteration.innerHTML = `${k}`;
			await drawPath(bestPath);
		}
	}

	
}


function btnAddDots(e){
	const btn = e.target;
	const game_map = document.querySelector(".game__inner");
	if (btn.classList.contains("tools__button-active")) {
		btn.classList.remove("tools__button-active");
		game_map.removeEventListener("click", addDot);
	} else {
		btn.classList.add("tools__button-active");
		game_map.addEventListener("click", addDot);
	}
}

function onclickBtnAddDots(){
	const btn = document.getElementById("add-dots");
	btn.addEventListener("click", btnAddDots);
}

function btnStartProgram(e){
	const btn = e.target;
	formic();
}

function onclickStart(){
	const btn = document.getElementById("start-program");
	btn.addEventListener("click", btnStartProgram);
}

function inputAlhpa(){
	const input = document.getElementById("input-alpha");
	input.value = data.alpha;

	const inputValue = document.getElementById("input-alpha-value");
	inputValue.innerHTML = `${data.alpha}`;

	input.addEventListener("input", (e) =>{
		inputValue.innerHTML = input.value;
		data.alpha = input.value;
	});

}

function inputBeta(){
	const input = document.getElementById("input-beta");
	input.value = data.beta;

	const inputValue = document.getElementById("input-beta-value");
	inputValue.innerHTML = `${data.beta}`;

	input.addEventListener("input", (e) =>{
		inputValue.innerHTML = input.value;
		data.beta = input.value;
	});
}

function deleteDots(){
	const btn = document.getElementById("delete-dots");
	const currentIteration = document.getElementById("current-iteration");
	const lastIteration = document.getElementById("last-iteration");
			const minPath = document.getElementById("min-path");


	btn.addEventListener("click", (e) => {
		const gameMap = document.getElementById("game-map");
		
		while (gameMap.children.length != 0){
			const dot = gameMap.children[0];
			dot.removeEventListener("click", selectedDots);
			dot.remove();
		}
		minPath.innerHTML = "";

		lastIteration.innerHTML = "";
		data.dotCords = [];
		currentIteration.innerHTML = "";

	});
}


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

	e.target.classList.remove("tools__sparing-on");
	e.target.classList.add("tools__sparing-off");

	const spar = document.querySelector(".sparing");
	spar.classList.remove("sparing-visited");
	
	clearPathPlayer();

	const btnDrawPlayerPath = document.getElementById("drawPath");
	btnDrawPlayerPath.removeEventListener("click", drawPathPlayer);
	
	
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


window.addEventListener("load", () =>{
	play();
	stopProgram();
	deleteDots();
	inputAlhpa();
	inputBeta();
	onclickBtnAddDots();
	onclickStart();
	eventRemoveLines();
});
