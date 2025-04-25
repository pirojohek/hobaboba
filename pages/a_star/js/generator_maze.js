
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
			await sleep(20);
			drawMazeGeneration([[x, y], [x - 1, y]]);
		}
		else if (direction === 'down' && x + 1 < data.matrixSize && map[x + 1][y] === 0) {
			map[x + 1][y] = 1;
			map[x][y] = 1;
			addWalls(x + 1, y);
			await sleep(20);
			drawMazeGeneration([[x, y], [x + 1, y]]);
		}
		else if (direction === 'left' && y - 1 >= 0 && map[x][y - 1] === 0) {
			map[x][y - 1] = 1;
			map[x][y] = 1;
			addWalls(x, y - 1);
			await sleep(20);
			drawMazeGeneration([[x, y], [x, y - 1]]);
		}
		else if (direction === 'right' && y + 1 < data.matrixSize && map[x][y + 1] === 0) {
			map[x][y + 1] = 1;
			map[x][y] = 1;
			addWalls(x, y + 1);
			await sleep(20);
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
