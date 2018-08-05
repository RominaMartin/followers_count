// Learn to code this at:
// https://www.youtube.com/watch?v=3b7FyIxWW94

// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
let followersCount = 50;

addEventListener("resize", function() {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;
	init();
});

// Utility Functions
randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

randomColor = (colors) => colors[Math.floor(Math.random() * colors.length)];

// Objects
function Ball (x, y, dx, dy, radius, color) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;

	this.update = () => {
		if (this.y + this.radius + this.dy> canvas.height) {
			this.dy = -this.dy;
			this.dy = this.dy * FRICTION;
			this.dx = this.dx * FRICTION;
		} else {
			this.dy += GRAVITY;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * FRICTION;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	};
}


// Implementation

obtainData = () => {
	console.log("Hey time to get data");
}

document.getElementById("search_button").addEventListener("click", obtainData);


getCodepenFollowers = () => {
	let username = document.getElementById("user_input").value;

	fetch(`${CODEPEN_BASE_URL}${username}`)
	.then(data => {return data.json()})
	.then(res => {
		console.log(res.data.followers);
		followersCount = Number(res.data.followers.replace(",",""));
		console.log(followersCount);
		fillData();
	})
}


var followersArray = [];

getRadius = () => {
	return 5;
}

init = () => {
	followersArray = [];
	let radius = getRadius ();
	
	for (let i = 0; i < followersCount; i++) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3)
		var dy = randomIntFromRange(-2, 2)
	
		followersArray.push(new Ball(x, y, dx, dy, radius, randomColor(COLORS)));
	}
}

// Animation Loop
animate = () => {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	followersArray.forEach(follower => {
		follower.update();
	})
}

init();
animate();