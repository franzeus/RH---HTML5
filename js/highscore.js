var Highscore = {
  score: 0,
  domObj: $("#highscore"),
  scoreDom: $("#highscore").find('#score'),
  markers: new Array(),

  init : function() {
    $('#saveScoreButton').click($.proxy(this.showForm, this));
    $('#saveButton').click($.proxy(this.pushScoreOnline, this));
  },

  reset : function() {
    Highscore.score = 0;
    Highscore.showScore();
    // Reset markers
    for (var i = 0; i < Highscore.markers.length; i++) {
      Highscore.markers[i].reset();
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
    // Only save highest score
    if(Highscore.markers.length > 0) {
      var hs = Highscore.markers[0];
      if(hs.score < Highscore.score) {
        Highscore.markers = [];
        Highscore.markers.push(new Marker(Highscore.score, Math.abs(Game.markerPoint)));
      }
    } else {
      Highscore.markers.push(new Marker(Highscore.score, Math.abs(Game.markerPoint)));
    }
  },

  pushScoreOnline : function() {
    var nameInput = $('#name');
    var name = nameInput.val();
    if(!name) return false;
    Highscore.hideForm();
  },

  drawMarkers : function() {
    Highscore.markers.forEach(function(marker) {
      if(marker.shape.x > 0) {
        if(marker.shape.x < Game.WIDTH)
          marker.draw();      
        marker.update();
      }
    });
  },

  showForm : function() {
    $('#scoreForm').show(600);
  },

  hideForm : function() {
    $('#scoreForm').hide();
  },

  blink : function() {
    Highscore.domObj.fadeOut().fadeIn();
  },

  hasLocalStorage : function() {
    if (!window.localStorage)
      return false
    return true;
  },
};


// ---------------------------------
// Marker Class
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

  this.box = new Rectangle({
    context: Game.buffer_context,
    x: this.offset,
    y: 0,
    color: "#004400",
    width: 80,
    height: 40
  });
};
//
Marker.prototype.draw = function() {
  this.shape.draw();
  this.box.draw();
  Game.buffer_context.font = "10pt Arial";
  Game.buffer_context.fillStyle = "#FFFFFF";
  Game.buffer_context.fillText("Highscore", this.shape.x + 5, 30); 
};
//
Marker.prototype.update = function() {
  this.shape.x -= Game.speed;
  this.shape.endX = this.shape.x;
  this.box.x = this.shape.x;
};
//
Marker.prototype.reset = function() {
  this.shape.x = this.offset;
  this.shape.endX = this.offset;
  this.box.x = this.offset;
};