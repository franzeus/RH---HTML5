var Parallax = function(_x, _y, _w, _h, _src, _moveSpeed) {
	this.context = Game.buffer_context;
	this.width = _w;
	this.height = _h;
	this.src = _src;
	this.x = 0;
	this.y = 0;

	this.moveSpeed = _moveSpeed;

	// Create plains
	this.plains = [];
	var newX = this.x;
	var numOfShapes = Math.max( Math.round( (Game.WIDTH * 2) / this.width ), 2);
	for(var i=0; i < numOfShapes; i++) {		
		this.plains.push(new ImageShape({ x: newX, y: this.y, src: this.src, context: this.context, width: this.width, height:this.height }));
		newX +=  this.width; 
	}
	this.canvasWidth = Game.WIDTH;
};
//
Parallax.prototype.draw = function() {
	for(var i = 0; i < this.plains.length; i++) {
		if(this.plains[i].x <= this.canvasWidth)
			this.plains[i].draw();
		this.update(i);
	}
};
//
Parallax.prototype.update = function(i) {
	this.plains[i].x -= this.moveSpeed * Game.speed;

	if(this.plains[i].x + this.plains[i].width <= 0) {
		this.plains[i].x = i == 0 
			? this.plains[i].x = this.plains[this.plains.length-1].x + this.width 
			: this.plains[i].x = this.plains[i-1].x + this.width;
	}
};