var Highscore = {
  score: 0,
  domObj: $("#highscore"),
  scoreDom: $("#highscore").find('#score'),
  markers: new Array(),

  init : function() {
    
  },

  reset : function() {
    Highscore.score = 0;
    Highscore.showScore();
    // Reset markers
    for (var i = 0; i < Highscore.markers.length; i++) {
      Highscore.markers[i].shape.x = Highscore.markers[i].offset;
      Highscore.markers[i].shape.endX = Highscore.markers[i].offset;
    };
  },

  addPoint : function(_value) {
    if(!_value) return false;
    Highscore.score += _value;
    Highscore.showScore();
  },

  showScore : function() {
    Highscore.scoreDom.html(Highscore.score);
  },

  saveScore : function() {
    Highscore.markers.push(new Marker(Highscore.score, Math.abs(Game.markerPoint)));
  },

  drawMarkers : function() {
    Highscore.markers.forEach(function(marker) {      
      if(marker.shape.x > 0) {
        if(marker.shape.x < Game.WIDTH) {
          marker.shape.draw();
        }
        marker.update();
      }
    });
  },

  blink : function() {
    Highscore.domObj.fadeOut().fadeIn();
  }
};

var Marker = function(_score, _offset) {
  this.score = _score;
  this.offset = _offset + 200;
  this.shape = new Line({
      context: Game.buffer_context,
      startX: this.offset,
      startY: 0,
      color: "#004400",
      endX: this.offset,
      endY: Game.HEIGHT,
      lineWidth: 4
  });
};
Marker.prototype.update = function() {
  this.shape.x -= Game.speed;
  this.shape.endX -= Game.speed;
};