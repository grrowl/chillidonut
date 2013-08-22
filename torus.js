
var fancy = {
	canvas: undefined,
	width: 100,
	height: 100,
	frameCount: 0,
	verticals: 60,
	horizontals: 60,
	scale: 2,
	
	rot: [0, 0, 0],
	pos: [0, 0, 0],
	vel: [0, 0, 0],
	
	init: function () {
		var canvasElem = $('#torus');
		if (!canvasElem[0])
			throw "No canvas found";

		this.canvas = canvasElem[0].getContext('2d');
		console.log(canvasElem, this.canvas);
		
		var doc = $(window);
		canvasElem[0].width = this.width = doc.width();
		canvasElem[0].height = this.height = doc.height();
		
		this.canvas.strokeStyle = 'rgb(255,255,255)';
		this.canvas.fillStyle = 'white';
		
		fancy.frame();
	},
	frame: function () {
		this.frameCount++;
		window.webkitRequestAnimationFrame(function () {
			fancy.frame();
		});
		
		var c = this.canvas;
		// c.width = this.width; c.height = this.height;
		c.clearRect(0, 0, this.width, this.height);
				
		var R = 23,
			r = 12;
		var t = Math.abs((this.frameCount % 100) - 50);
		
		this.rot = [
			Math.cos((this.frameCount/40) % (2*Math.PI))*0.5,
			Math.sin((this.frameCount/40) % (2*Math.PI))*0.5,
			Math.sin((this.frameCount/30) % (2*Math.PI))*0.5
		];
		// velocity is determined by the donut wanting to be at 0,0,0
		this.vel = [
			this.vel[0] + (0 - this.pos[0]) * 0.05,
			this.vel[1] + (0 - this.pos[1]) * 0.05,
			this.vel[2] + (0 - this.pos[2]) * 0.05 
		];
		// change in position is determined by velocity
		this.pos = [
			this.pos[0] + this.vel[0],
			this.pos[1] + this.vel[1],
			this.pos[2] + this.vel[2],
		];
		// post-position velocity dampening
		this.vel[0] *= 0.99;
		this.vel[1] *= 0.99;
		this.vel[2] *= 0.99;
		
		for (var i=0; i < this.verticals; i++) {
			var baseline = (this.height / this.verticals) * i;
			
			c.beginPath();
			c.moveTo(0, baseline);
			for (var j=0; j < this.horizontals; j++) {

				var x = this.pos[0] + (i - this.horizontals/2)*this.scale,
					y = this.pos[1] + (j - this.verticals/2)*this.scale,
					z = this.pos[2] + 0;
					//z = this.easeInOutQuart(t, -100, 100, 50);
					//z = 1 + Math.sin((t/5) % (2*Math.PI));//this.easeInOutQuart(t, 0, 14, 50);
					
				//if (i == 0 & j == 0) console.log(z);
				
				var xO, yO, zO;
				
				// do x rotation
				xO = x;
				yO = y * Math.cos(this.rot[0]) - z * Math.sin(this.rot[0]);
				zO = y * Math.sin(this.rot[0]) + z * Math.cos(this.rot[0]);
				
				x = xO; y = yO; z = zO;
				
				// do y rotation
				xO = z * Math.sin(this.rot[1]) + x * Math.cos(this.rot[1]);
				yO = y;
				zO = z * Math.cos(this.rot[1]) - x * Math.sin(this.rot[1]);
				
				x = xO; y = yO; z = zO;
				
				// do z rotation
				xO = x * Math.cos(this.rot[2]) - y * Math.sin(this.rot[2]);
				yO = x * Math.sin(this.rot[2]) + y * Math.cos(this.rot[2]);
				zO = z;
				
				x = xO; y = yO; z = zO;
				
				//var xO = (i - this.horizontals/2) * Math.cos(this.rot[0]) - (j - this.verticals/2) * Math.sin(this.rot[0]),
				//    yO = (i - this.horizontals/2) * Math.sin(this.rot[0]) - (j - this.verticals/2) * Math.cos(this.rot[0]),
				//    zO = 0;
				
				//x *= scale; y *= scale; z *= scale;
				
				z += (
					  Math.sqrt(Math.pow(r,2) - Math.pow(R,2) 
						+ 2*R*Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
						- Math.pow(x,2) - Math.pow(y,2))
					 )*5;
				if (isNaN(z) || z < 0) z = 0;

				// c.lineTo( this.width / this.verticals * j, baseline - z);
				
				if (i==0 & j==0) {
					//console.log(this.frameCount, this.easeInOutQuart(t, 0, 3, 50));
					// console.log(this.frameCount, z);
				}
			}
			c.lineTo(this.width, baseline);
			c.stroke();
			c.closePath();
		}
		//console.log('frame', c, i, this.width, this.height);
	},

	// t: current time, b: begInnIng value, c: change In value, d: duration
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
}