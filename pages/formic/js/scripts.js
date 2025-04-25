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
