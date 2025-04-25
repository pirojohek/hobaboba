
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

	for(let k = 0; k < 3000; k++){
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