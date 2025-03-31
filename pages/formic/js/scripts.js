let data = {
	dotCords: [],
	alpha: 1.0,
	beta: 1.0,

}

function addDot(e){
	const rect = e.target.getBoundingClientRect();
	console.log(rect);
	const cordX = e.clientX - rect.left;
	const cordY = e.clientY - rect.top;
	console.log(e.clientX, e.clientY)
	
	const dot = document.createElement("div");
	dot.classList.add("game__dot");

	dot.style.left = `${cordX - 5}px`;
	dot.style.top = `${cordY - 5}px`;
	data.dotCords.push([cordX - 5, cordY - 5]);

	e.target.appendChild(dot);
}

function draw

const game_map = document.querySelector(".game__inner");

game_map.addEventListener("click", addDot);