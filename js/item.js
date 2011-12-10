// Obstacle or Bonus Item
var Item = function(_x, _y, _oX, _oY, _w, _h) {
  this.context = Game.buffer_context;
  this.width = '16';
  this.height = '16';
  this.src = null;
  this.x = _x;
  this.y = _y;
  this.offsetX = _oX;
  this.offsetY = _oY;
  this.isVisible = true;

  this.platformX = 0;
  this.platformY = 0;

  this.radX = parseInt(this.width * 2);
  this.radY = parseInt(this.width * 2);
  this.angle = 0;
  this.orbitSpeed = this.width / 300;
  this.centerX = this.x;
  this.centerY = this.y;

  this.shape = new ImageShape({
    x: this.x, y: this.y,
    width: this.width, height: this.height,
    src: 'assets/goody.png',
    context: this.context
  });

  this.points = 200;
};
//
Item.prototype.draw = function() {
  if(this.isVisible) {
    this.shape.draw();
    this.update();
  }
}
//
Item.prototype.update = function() {
  this.shape.x = this.platformX + Math.cos(this.angle) * this.radX;
  this.shape.y = this.platformY - this.offsetY + Math.sin(this.angle) * this.radY;
  this.angle += this.orbitSpeed;
}
//
Item.prototype.collide = function() {
  this.isVisible = false;
}