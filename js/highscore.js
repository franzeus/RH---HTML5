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
    Highscore.hideForm();
    // Reset markers
    for (var i = 0; i < Highscore.markers.length; i++) {
      Highscore.markers[i].reset();
    };
    Highscore.pullScoreOnline();
  },

  addPoint : function(_value) {
    if(!_value || _value < 0) return false;
    Highscore.score += _value;
    Highscore.showScore();
  },

  showScore : function() {
    Highscore.scoreDom.html(Highscore.score);
  },

  // Save score in db
  pushScoreOnline : function() {
    var nameInput = $('#name');
    var name = nameInput.val();
    if(!name) return false;
    var browser = jQuery.uaMatch(navigator.userAgent).browser;
    //
    $.ajax({
      type: 'POST',
      url: 'post/savescore.php',
      data: { name: name, score: Highscore.score, browser: browser, offset: Game.markerPoint },
    });
    //
    Highscore.hideForm();
    Highscore.pullScoreOnline();
  },

  pullScoreOnline : function () {
    Highscore.markers = [];
    $('#hs-list').html('');
    //
    $.getJSON('post/get_score.php', function(data) {
      $.each(data, function(key, val) {
        Highscore.addScoreToList(val, key);
        // push top 3 to game
        if(key < 3)
          Highscore.addMarker(val.score, val.offset, val.name);
      });
    });
  },

  addScoreToList : function(score, place) {
    var fontClass = "";
    switch(place) {
      case(0) : fontClass = "first"; break;
      case(1) : fontClass = "second"; break;
      case(2) : fontClass = "third"; break;
    }

    var item = '<li class="'+fontClass+'">';
    item += '<span class="hsName">' + score.name + '</span>';
    item += '<span class="hsScore">' + score.score + '</span>';
    item += '</li>';
    
    $('#hs-list').append(item);
  },

  addMarker : function(score, offset, name) {
    Highscore.markers.push(new Marker(score, Math.abs(offset), name));
    console.log(Highscore.markers.length)
  },

  //
  drawMarkers : function() {
    Game.buffer_context.font = "10pt Arial";
    for (var i = Highscore.markers.length - 1; i >= 0; i--) {
      var marker = Highscore.markers[i];
      if(Highscore.score + Player.x > marker.score) {   
        if(marker.shape.x > 0) {
          if(marker.shape.x < Game.WIDTH)
            marker.draw();
          marker.update();
        }
      }
    };
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