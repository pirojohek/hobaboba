function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data = {
	idStart: {
		idX: 0,
		idY: 0,
	},
	idEnd: {
		idX: 9,
		idY: 9,
	},
	matrixSize: 10,
	clickedButtonId: "",

	endNode: "",
	startNode: "",
}


function editSize(){
	const tools_edit_size = document.getElementById("tools__send-size");

	tools_edit_size.addEventListener("click", function(event) {
		event.preventDefault();
	
		const sizeForm = document.forms.editForm;
		const displaySize = document.querySelector(".tools__current-size");
	
		try {
			let newSize = sizeForm.sizeMaze.value;
			sizeForm.sizeMaze.value = "";
			newSize = parseInt(newSize);
			generateMap(newSize);
			displaySize.innerHTML = `${newSize}x${newSize}`;
		} catch (err) {
			alert(err);
		}
	});
}


function mazeBorder(e){
	const btn = e.target;
	btn.classList.toggle("border");
}

function removeMazeEvent(){
	const buttons = document.getElementsByClassName("grid__item");
	for (const btn of buttons){
		if (!btn.classList.contains("start") && !btn.classList.contains("end")){
			btn.removeEventListener("click", mazeBorder);
		}
	}
}


function updateMazeEvent(){
	const buttons = document.getElementsByClassName("grid__item");

	for (const btn of buttons){
		
		if (!btn.classList.contains("start") && !btn.classList.contains("end")){
			
			btn.addEventListener("click", mazeBorder);
		}
	}
}



function generateMap(n){
	const gridInner = document.querySelector(".grid__inner");
	gridInner.innerHTML = "";

	for (let i = 0; i < n; i++){
		for (let j = 0; j < n; j++){
			const item = document.createElement("button");
			item.className = "grid__item";
			item.classList.add("border");
			item.dataset.x = i;
			item.dataset.y = j;
			gridInner.append(item);
		}
	}
	const startElement = document.querySelector('.grid__item[data-x="0"][data-y="0"]');
	startElement.classList.remove("border");
	
	startElement.classList.add("start");
	data.startNode = startElement;

	const endElement = document.querySelector(`.grid__item[data-x="${n - 1}"][data-y="${n-1}"]`);
	endElement.classList.remove("border");
	endElement.classList.add("end");
	data.endNode = endElement;
	
	data.idEnd.idX = n-1;
	data.idEnd.idY = n - 1;

	gridInner.style.gridTemplateColumns = `repeat(${n}, 30px)`;
	data.matrixSize = n;
}



function cleanActiveButtons(){
	switch (data.clickedButtonId){
		case "change-walls":
			const edit_btn = document.getElementById("change-walls");
			edit_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeMazeEvent();
		case "change-start":
			const start_btn = document.getElementById("change-start");
			start_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeStartEvent();
		case "change-end":
			const end_btn = document.getElementById("change-end");
			end_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeEndEvent();
	}
	
	
}

function editWalls(){
	const edit_btn = document.getElementById("change-walls");

	edit_btn.addEventListener("click", function(e) {
		
		if (edit_btn.classList.contains("tools__button-active")){
			edit_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeMazeEvent();
		} else {
			cleanActiveButtons();
			edit_btn.classList.add("tools__button-active");
			data.clickedButtonId = "change-walls";
			updateMazeEvent();
		}
	});
}

function startEvent(e){
	const btn = e.target;
	const btn_x = btn.dataset.x;
	const btn_y = btn.dataset.y;
	
	const prevStartItem = document.querySelector(`.grid__item[data-x="${data.idStart.idX}"][data-y="${data.idStart.idY}"]`);
	prevStartItem.classList.remove("start");
	prevStartItem.classList.add("border");

	btn.classList.remove("border");
	btn.classList.add("start");

	data.idStart.idX = btn_x;
	data.idStart.idY = btn_y;
}

function removeStartEvent(){
	const buttons = document.getElementsByClassName("grid__item");

	for (const btn of buttons){
		
		if (!btn.classList.contains("start") && !btn.classList.contains("end")){
			btn.removeEventListener("click", startEvent);
		}
	}
}

function updateStartEvent(){
	const buttons = document.getElementsByClassName("grid__item");

	for (const btn of buttons){
		
		if (!btn.classList.contains("end")){
			btn.addEventListener("click", startEvent);
		}
	}
}

function editStart(){
	const edit_btn = document.getElementById("change-start");

	edit_btn.addEventListener("click", function(e) {
		
		if (edit_btn.classList.contains("tools__button-active")){
			edit_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeStartEvent();
			
		} else {
			cleanActiveButtons();
			edit_btn.classList.add("tools__button-active");
			data.clickedButtonId = "change-start";
			updateStartEvent();
		}
	});
}


function endEvent(e){
	const btn = e.target;
	const btn_x = btn.dataset.x;
	const btn_y = btn.dataset.y;
	
	const prevStartItem = document.querySelector(`.grid__item[data-x="${data.idEnd.idX}"][data-y="${data.idEnd.idY}"]`);
	prevStartItem.classList.remove("end");
	prevStartItem.classList.add("border");

	btn.classList.remove("border");
	btn.classList.add("end");
	data.idEnd.idX = btn_x;
	data.idEnd.idY = btn_y;
}

function removeEndEvent(){
	const buttons = document.getElementsByClassName("grid__item");

	for (const btn of buttons){
		
		if (!btn.classList.contains("end")){
			btn.removeEventListener("click", endEvent);
		}
	}
}

function updateEndEvent(){
	const buttons = document.getElementsByClassName("grid__item");

	for (const btn of buttons){
		
		if (!btn.classList.contains("end")){
			btn.addEventListener("click", endEvent);
		}
	}
}

function editEnd(){
	const edit_btn = document.getElementById("change-end");

	edit_btn.addEventListener("click", function(e) {
		
		if (edit_btn.classList.contains("tools__button-active")){
			edit_btn.classList.remove("tools__button-active");
			data.clickedButtonId = "";
			removeEndEvent();
			
		} else {
			cleanActiveButtons();
			edit_btn.classList.add("tools__button-active");
			data.clickedButtonId = "change-end";
			updateEndEvent();
		}
	});
}



function create2DArray(rows, cols) {
	let array = [];
	for (let i = 0; i < rows; i++) {
		array[i] = [];
		for (let j = 0; j < cols; j++) {
			array[i][j] = 0; 
		}
	}
	return array;
}

function cleanMap(){
	for (let i = 0; i < data.matrixSize; i++){
		for (let j = 0; j < data.matrixSize; j++){
			const item = document.querySelector(`.grid__item[data-x="${i}"][data-y="${j}"]`);
			if (!item.classList.contains("start") && !item.classList.contains("end") && !item.classList.contains("border")) {
				item.classList.add("border");
				item.classList.remove("yellow");
				item.classList.remove("orange");
				item.classList.remove("red");
			}
		}
	}
}


async function generateMaze() {
	cleanMap();
	let map = create2DArray(data.matrixSize, data.matrixSize);
	


	let start = [data.idStart.idX, data.idStart.idY];
	map[start[0]][start[1]] = 1;  
	let walls = [];

	function addWalls(x, y) {
		if (x - 1 >= 0 && map[x - 1][y] === 0) {
			walls.push([x - 1, y, 'up']);
		}
		if (x + 1 < data.matrixSize && map[x + 1][y] === 0) {
			walls.push([x + 1, y, 'down']);
		}
		if (y - 1 >= 0 && map[x][y - 1] === 0) {
			walls.push([x, y - 1, 'left']);
		}
		if (y + 1 < data.matrixSize && map[x][y + 1] === 0) {
			walls.push([x, y + 1, 'right']);
		}
	}


	addWalls(start[0], start[1]);


	while (walls.length > 0) {

		const randomIndex = Math.floor(Math.random() * walls.length);
		const [x, y, direction] = walls[randomIndex];
		walls.splice(randomIndex, 1);

		if (direction === 'up' && x - 1 >= 0 && map[x - 1][y] === 0) {
			map[x - 1][y] = 1;
			map[x][y] = 1;
			addWalls(x - 1, y);  
			await sleep(50);
			drawMazeGeneration([[x, y], [x - 1, y]]);
		}
		else if (direction === 'down' && x + 1 < data.matrixSize && map[x + 1][y] === 0) {
			map[x + 1][y] = 1;
			map[x][y] = 1;
			addWalls(x + 1, y);
			await sleep(50);
			drawMazeGeneration([[x, y], [x + 1, y]]);
		}
		else if (direction === 'left' && y - 1 >= 0 && map[x][y - 1] === 0) {
			map[x][y - 1] = 1;
			map[x][y] = 1;
			addWalls(x, y - 1);
			await sleep(50);
			drawMazeGeneration([[x, y], [x, y - 1]]);
		}
		else if (direction === 'right' && y + 1 < data.matrixSize && map[x][y + 1] === 0) {
			map[x][y + 1] = 1;
			map[x][y] = 1;
			addWalls(x, y + 1);
			await sleep(50);
			drawMazeGeneration([[x, y], [x, y + 1]]);
		}	
	}


	if (map[data.idEnd.idX][data.idEnd.idY] != 1) {
		map[data.idEnd.idX][data.idEnd.idY] = 1;  
		await sleep(50);
		let newWay = [];

		if (data.idEnd.idX + 1 < data.matrixSize ){
			if (map[data.idEnd.idX + 1][data.idEnd.idY] == 1){
				return map;
			}else {
				newWay.push([data.idEnd.idX + 1, data.idEnd.idY]);
			}
		} 

		if (data.idEnd.idX - 1 >= 0 ) {
			if (map[data.idEnd.idX - 1][data.idEnd.idY] == 1){
				return map;
			}else {
				newWay.push([data.idEnd.idX - 1, data.idEnd.idY]);
			}
		} 

		if (data.idEnd.idY + 1 < data.matrixSize ) {
			if (map[data.idEnd.idX][data.idEnd.idY + 1] == 1){
				return map;
			}else {
				newWay.push([data.idEnd.idX, data.idEnd.idY + 1]);
			}	
		} 

		if (data.idEnd.idY - 1 >= 0 ) {
			if (map[data.idEnd.idX][data.idEnd.idY - 1] == 1){
				return map;
			}else {
				newWay.push([data.idEnd.idX, data.idEnd.idY - 1]);
			}
		} 

		const randomIndex = Math.floor(Math.random() * newWay.length);

		map[newWay[randomIndex][0]][newWay[randomIndex][1]] = 1;
		console.log(map);
		drawMazeGeneration([[newWay[randomIndex][0], newWay[randomIndex][1]]]);


	}

	return map;
}

function drawMazeGeneration(indexes) {
    for (let index of indexes) {
        const item = document.querySelector(`.grid__item[data-x="${index[0]}"][data-y="${index[1]}"]`);
        if (!item.classList.contains("start") && !item.classList.contains("end")) {
            item.classList.toggle("border");
        }
    }
}

function getMap(){
	let map = create2DArray(data.matrixSize, data.matrixSize);

	for (let i = 0; i < data.matrixSize; i++){
		for (let j = 0; j < data.matrixSize; j++){
			const el = document.querySelector(`.grid__item[data-x="${i}"][data-y="${j}"]`);
			if (!el.classList.contains("border")){
				map[i][j] = 1;
			}
		}
	}
	map[data.idStart.idX][data.idStart.idY] = 0;
	map[data.idEnd.idX][data.idEnd.idY] = 1;
	return map;
}


class Node{
	constructor(parent, position){
		this.parent = parent;
		this.position = position;

		this.g = 0; // обычное расстояние
		this.f = 0; // общее расстояние
		this.h = 0; // эвристическое расстояние
	}
	calculateh(node1, node2){
		return Math.abs(node1.position[0] - node2.position[0]) + Math.abs(node1.position[1] - node2.position[1]);
	}
}

function cleanPath(){
	for (let i = 0; i < data.matrixSize; i++){
		for (let j = 0; j < data.matrixSize; j++){
			const el = document.querySelector(`.grid__item[data-x="${i}"][data-y="${j}"]`);
			el.classList.remove("orange");
			el.classList.remove("red");
			el.classList.remove("yellow");
		}
	}
}
function cleanSupportColors(){
	for (let i = 0; i < data.matrixSize; i++){
		for (let j = 0; j < data.matrixSize; j++){
			const el = document.querySelector(`.grid__item[data-x="${i}"][data-y="${j}"]`);
			el.classList.remove("orange");
			el.classList.remove("yellow");
		}
	}
}

async function drawPath(path, lastNode){
	let node = lastNode.parent;

	while (node.parent != null){
		const el = document.querySelector(`.grid__item[data-x="${node.position[0]}"][data-y="${node.position[1]}"]`);
		await sleep(50);
		el.classList.remove("orange");
		el.classList.add("red");
		
		node = node.parent;
	}
	cleanSupportColors();
}

async function a_star(){
	cleanPath();
	let maze = getMap();
	
	let start = new Node(null, [data.idStart.idX, data.idStart.idY]);
	let end = new Node(null, [data.idEnd.idX, data.idEnd.idY]);

	let open_list = [];
	let close_list = [];
	let map = create2DArray(data.matrixSize, data.matrixSize);

	open_list.push(start);

	while (open_list.length > 0){
		let current_node = open_list[0];
		let current_index = 0;

		for (let i = 0; i < open_list.length; i++){
			if (open_list[i].f < current_node.f) {
				current_node = open_list[i];
				current_index = i;
			}
		}
		open_list.splice(current_index, 1);
		close_list.push(current_node);
		
		if (current_node.position[0] == end.position[0] && current_node.position[1] == end.position[1]){
	
			drawPath(map, current_node);
			break;
		}

		const node = document.querySelector(`.grid__item[data-x="${current_node.position[0]}"][data-y="${current_node.position[1]}"]`);
		if (!node.classList.contains("start") && !node.classList.contains("end")){
			await sleep(50);
			node.classList.remove("yellow");
			node.classList.add("orange");
		}
		
		let nextNodes = [];
		if (current_node.position[0] - 1 >= 0 && maze[current_node.position[0] - 1][current_node.position[1]] != 0) {
			nextNodes.push(new Node(current_node, [current_node.position[0] - 1, current_node.position[1]]));
		}

		if (current_node.position[0] + 1 < data.matrixSize && maze[current_node.position[0] + 1][current_node.position[1]] != 0){
			nextNodes.push(new Node(current_node, [current_node.position[0] + 1, current_node.position[1]]));
		}

		if (current_node.position[1] + 1 < data.matrixSize && maze[current_node.position[0]][current_node.position[1] + 1] != 0) {
			nextNodes.push(new Node(current_node, [current_node.position[0], current_node.position[1] + 1]));
		}

		if (current_node.position[1] - 1 >= 0 && maze[current_node.position[0]][current_node.position[1] - 1] != 0) {
			nextNodes.push(new Node(current_node, [current_node.position[0], current_node.position[1] - 1]));
		}

		for (let node of nextNodes){

			if (close_list.some(n => n.position[0] === node.position[0] && n.position[1] === node.position[1])) {
                continue;
            }

			node.g = current_node.g + 1;
			node.h = node.calculateh(end, node);
			node.f = node.h + node.g;
			
			

			let flag = true;
			for (let i = 0; i < open_list.length; i++){
				if (open_list[i].position[0] == node.position[0] && open_list[i].position[1] == node.position[1]) {
					if (open_list[i].f <= node.f){
						flag = false;
					} else {
						open_list.splice(i, 1);
						break;
					}
				}
			}

			if (flag){
				open_list.push(node);
				const el = document.querySelector(`.grid__item[data-x="${node.position[0]}"][data-y="${node.position[1]}"]`);
				
				if (!el.classList.contains("start")){
					await sleep(50);
					if (!el.classList.contains("end")){
						await sleep(50);
						el.classList.add("yellow");
					}
					
				}
			}

		}
	}
}


window.addEventListener('load', () => {
	generateMap(10);
	editSize();
	editWalls();
	editStart();
	editEnd();
	
	const btn = document.getElementById("generate-path");
	btn.addEventListener("click", (e) => {
		let map = generateMaze();
		
	});

	const btn_start = document.getElementById("button-start");
	btn_start.addEventListener("click", (e) => {
		a_star();
	})
});

