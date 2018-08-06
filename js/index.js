// Learn to code this at:
// https://www.youtube.com/watch?v=3b7FyIxWW94

// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let initialized = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
let followersCount = null;

addEventListener("resize", function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	if(followersCount !== null)
		init();
});

// Utility Functions
randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

randomColor = (colors) => colors[Math.floor(Math.random() * colors.length)];

toggleElement = (element) => {
	document.getElementById(element).classList.toggle("active");
}

resetVisualElements = () => {
	document.querySelectorAll(".active").forEach(e => e.classList.remove("active"));
}

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

obtainData = () => {
	getCodepenFollowers();
}


document.getElementById("hide_alert").addEventListener("click", () => {toggleElement("alert_container")});
document.getElementById("search_button").addEventListener("click", obtainData);

checkMaxFollowers = (value) => {
	if(value > MAX_FOLLOWERS) {
		followersCount = MAX_FOLLOWERS;
		document.getElementById("followers_count").innerText = value;
		toggleElement("alert_container");
	}
}

getCodepenFollowers = () => {
	let username = document.getElementById("user_input").value;

	fetch(`${CODEPEN_BASE_URL}${username}`)
	.then(data => data.json())
	.then(res => {
		followersCount = Number(res.data.followers.replace(",",""));
		checkMaxFollowers();

		init();
	}).catch(err => {
		toggleElement("error_message");
	});
}


var followersArray = [];

getRadius = () => {
	return 10;
}

init = () => {
	console.log("init");
	resetVisualElements();
	followersArray = [];

	let radius = getRadius ();
	
	for (let i = 0; i < followersCount; i++) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3)
		var dy = randomIntFromRange(-2, 2)
	
		followersArray.push(new Ball(x, y, dx, dy, radius, randomColor(COLORS)));
	}
	if(!initialized)
		animate();
}

// Animation Loop
animate = () => {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	followersArray.forEach(follower => {
		follower.update();
	})
}

// init();
// animate();