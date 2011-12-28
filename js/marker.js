// ---------------------------------
// Marker Class
var Marker = function(_score, _offset, _label) {
  this.score = _score;
  this.offset = Game.WIDTH;
  this.label = _label || "Highscore";
  this.color = '#004400';

  this.shape = new Line({
      context: Game.buffer_context,
      startX: this.offset,
      startY: 0,
      color: this.color,
      endX: this.offset,
      endY: Game.HEIGHT,
      lineWidth: 4
  });

  this.box = new Rectangle({
    context: Game.buffer_context,
    x: this.offset,
    y: 0,
    color: this.color,
    width: 80,
    height: 40
  });
};
//
Marker.prototype.draw = function() {
  this.shape.draw();
  this.box.draw();
  Game.buffer_context.fillStyle = "#FFFFFF";
  Game.buffer_context.fillText(this.label, this.shape.x + 5, 30); 
};
//
Marker.prototype.update = function() {
  this.shape.x -= Game.acc;
  this.shape.endX = this.shape.x;
  this.box.x = this.shape.x;
};
//
Marker.prototype.reset = function() {
  this.shape.x = this.offset;
  this.shape.endX = this.offset;
  this.box.x = this.offset;
};