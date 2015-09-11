mainloop = require("tsald:mainloop.js");

console.log("mainloop:", mainloop);

window.ts.size = {x:96, y:64, mode:"multiple"};

window.ts.scene = {
	draw:function draw() {
		var ctx = window.ts.ctx;
		ctx.setTransform(1,0, 0,1, 0,0);
		ctx.fillStyle = '#f00';
		ctx.fillRect(0,0,ctx.width,ctx.height);
		for (var y = 0; y < 64; ++y) {
			ctx.fillStyle = 'rgb(100%,0%,' + (y / 64.0 * 100.0) + '%)';
			ctx.fillRect(0, ctx.factor * y, ctx.width, ctx.factor);
		}
	}
};

window.example = function() {
	mainloop.start(document.getElementById("viewport"));
};
