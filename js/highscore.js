var Highscore = {
  score: 0,
  domObj: $("#highscore"),
  scoreDom: $("#highscore").find('#score'),

  init : function() {
    

  },

  reset : function() {
    Highscore.score = 0;
    Highscore.showScore();
  },

  addPoint : function(_value) {
    if(!_value) return false;
    Highscore.score += _value;
    Highscore.showScore();
  },

  showScore : function() {
    Highscore.scoreDom.html(Highscore.score);
  },

  blink : function() {
    Highscore.domObj.fadeOut().fadeIn();
  }
};