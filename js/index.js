// I made this based on this cool tutorial, check it out!
// https://www.youtube.com/watch?v=3b7FyIxWW94

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let initialized = false;
let social_network = "twitter";

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

toggleSocial = (network) => {	
	let currentValue = document.getElementById("user_input").value;

	if(network === "twitter") {
		document.getElementById(`social_${network}`).classList.add("active");
		document.getElementById(`social_codepen`).classList.remove("active");

		if(currentValue[0] !== "@") {
			currentValue = currentValue === MY_CODEPEN_USER ? MY_TWITTER_USER : currentValue;
			document.getElementById("user_input").value = "@" + currentValue;
		}
	} else {
		document.getElementById(`social_${network}`).classList.add("active");
		document.getElementById(`social_twitter`).classList.remove("active");
		if(network === "codepen" && currentValue[0] === "@") {
			currentValue = currentValue === `@${MY_TWITTER_USER}` ? MY_TWITTER_USER : currentValue;
			document.getElementById("user_input").value = currentValue.replace("@", "");
		}
	}
}

toggleElement = (element) => {
	document.getElementById(element).classList.toggle("active");
}

removeUserError = () => {
	document.getElementById("error_message").classList.remove("active");
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
	let currentValue = document.getElementById("user_input").value;

	if(currentValue.length < 2)
		document.getElementById("user_input").value = social_network === "twitter" ? `@${MY_TWITTER_USER}` : MY_CODEPEN_USER;

	if(social_network === "codepen")
		getCodepenFollowers();
	else
		getTwitterFollowers();
}

document.getElementById("hide_alert").addEventListener("click", () => {toggleElement("alert_container")});
document.getElementById("search_button").addEventListener("click", obtainData);
document.getElementById("user_input").addEventListener("keyup", e => {
	let currentValue = document.getElementById("user_input").value;
	if(social_network === "twitter") {
		document.getElementById("user_input").value = currentValue[0] !== "@" ? `@${currentValue}` : currentValue;
	}
    if (e.keyCode === 13) {
		obtainData();
	}
});

document.getElementById("user_input").addEventListener("focus", () => {
	if(document.getElementById("user_input").value === `@${MY_TWITTER_USER}` || document.getElementById("user_input").value === MY_CODEPEN_USER)
		document.getElementById("user_input").value = ""
});

document.getElementById("social_twitter").addEventListener("click", () => {social_network = "twitter"; toggleSocial("twitter")});
document.getElementById("social_codepen").addEventListener("click", () => {social_network = "codepen"; toggleSocial("codepen")});

checkMaxFollowers = (value) => {
	if(value > MAX_FOLLOWERS) {
		followersCount = MAX_FOLLOWERS;
		document.getElementById("followers_count").innerText = value;
		toggleElement("alert_container");
	}
}

getCodepenFollowers = () => {
	let username = document.getElementById("user_input").value;
	username = username[0] === "@" ? username.replace("@", "") : username;

	fetch(`${CODEPEN_BASE_URL}${username}`)
	.then(data => data.json())
	.then(res => {
		followersCount = Number(res.data.followers.replace(",",""));
		checkMaxFollowers(followersCount);
		init();
	}).catch(err => {
		toggleElement("error_message");
	});
}

getTwitterFollowers = () => {
	let username = document.getElementById("user_input").value;
	username = username[0] === "@" ? username.replace("@", "") : username;

	fetch(`${TWITTER_BASE_URL}${username}`)
	.then(data => data.json())
	.then(res => {
		followersCount = Number(res[0].followers_count);
		checkMaxFollowers(followersCount);

		init();
	}).catch(err => {
		toggleElement("error_message");
	});
}


var followersArray = [];

init = () => {
	removeUserError();
	followersArray = [];
	
	for (let i = 0; i < followersCount; i++) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3);
		var dy = randomIntFromRange(-2, 2);
		var radius = randomIntFromRange(10, 20);

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