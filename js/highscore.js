var Highscore = {
  score: 0,

  reset : function() {
    Highscore.score = 0;
    Highscore.showScore();
  },

  addPoint : function(_value) {
    Highscore.score += _value;
    Highscore.showScore();
  },

  showScore : function() {
    $("#highscore").html(Highscore.score);
  },
};