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
			await sleep(10);
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
					await sleep(10);
					if (!el.classList.contains("end")){
						await sleep(10);
						el.classList.add("yellow");
					}
					
				}
			}

		}
	}
}