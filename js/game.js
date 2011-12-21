/*
  @TODO:
    - Make item as superclass for obstacles
    - Balancing
  @Feature:
    - Highscore with localstorage
    - Improve performance
      - Save every possible platform size as image
*/
//
window.requestAnimFrame = (function(){
  return  (window.requestAnimationFrame      || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          });
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame||
        window.mozCancelRequestAnimationFrame   ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame    ||
        clearTimeout
} )();

var Game = {
  drawInterval: null,
  blocks: [],
  player: [],
  canvas: null,
  buffer: null,
  context: null,
  _canvasContext: null,
  speed: 2,
  initSpeed : 2,
  initMarkerPoint : 200,
  isDrawing: true,
  reqAnimation: null,
  acceleration: 0,
  MAX_SPEED: 7,

  init : function() {
    Game.canvas = document.getElementById("canvas");
    Game.buffer = document.getElementById("buffer-canvas");
    Game.context = Game.canvas.getContext("2d");
    Game.buffer_context = Game.buffer.getContext("2d");

    Game.HEIGHT = Game.canvas.height;
    Game.WIDTH = Game.canvas.width;
    Game.buffer.width = Game.canvas.width;
    Game.buffer.height = Game.canvas.height;

    // Preload
    var iBar = new Image(); 
    iBar.src = 'assets/bars_80.png';
    iBar.src = 'assets/game_background_layer_2.png';
    iBar.src = 'assets/game_background_layer_1.png';

    // Add backgrounds
    Game.backgrounds = [];
    Game.backgrounds.push(new Parallax(0, 0, 480, 240, "assets/game_background_layer_2.png", 0.1));
    Game.backgrounds.push(new Parallax(0, 0, 480, 240, "assets/game_background_layer_1.png", 0.3));
    // Prepare player
    Player.init();
    // Create Platforms
    PlatformManager.createPlatforms(4);
    //
    Game.angle = 3;
    Game.velocity_x = 0;
    Game.scale_x = Math.cos(Game.angle);
    Game.acceleration = 0.002;

    Game.speed = Game.initSpeed;
    //
    Highscore.init();
    Game.markerPoint = Game.initMarkerPoint;
    
    Highscore.pullScoreOnline();

    // Events
    $(document).keydown($.proxy(Game.keyEvent, this));
    $('#canvas').click(function(){ Player.jump() });
    $('#restartButton').click(function(){ Game.reset() });
    Game.isDrawing = true;
  },


  start : function() {    

    Game.draw();
  },

  stop : function() {

    $('#restartButton').show();
    $('#saveScoreButton').show();
    Game.isDrawing = false;
    Game.speed = 0;
    Player.isVisible = false;
    cancelRequestAnimFrame(Game.reqAnimation);
    Highscore.saveScore();
  },

  clear : function() {
    Game.buffer.width = Game.buffer.width;
    Game.canvas.width = Game.canvas.width;
  },

  draw : function() {
   
    if(Game.isDrawing) {
      Game.clear();
      Game.update();
    
      // ---------
      // Drawing Backgrounds      
      Game.backgrounds.forEach(function(background){
        background.draw();
      });

      // Markers
      Highscore.drawMarkers();

      // Drawing platforms
      PlatformManager.draw();

      // Player      
      Player.draw();

      // ---------
      Game.context.drawImage(Game.buffer, 0, 0);
      Game.reqAnimation = requestAnimFrame( Game.draw );
    } else {
      Game.canvasToBW();
    }
  },

  update : function() {
      Highscore.addPoint(1);
      Game.markerPoint -= Game.speed;

      if(Game.speed < Game.MAX_SPEED)
        Game.speed += Game.acceleration;      
      Game.velocity_x = Game.speed * Game.scale_x;
      Game.acc = -Game.velocity_x;
      
      Game.checkPlayer();   
  },

  checkPlayer : function() {
    // Player fell in gap
    if(Player.shape.y + Player.shape.height >= Game.HEIGHT) {
      Game.stop();
      return false;
    }

    // Check Jump
    if(Player.isJumping || Player.isFalling)
      Player.checkJump();

    // Check collision with platforms
    for (var i = PlatformManager.platforms.length - 1; i >= 0; i--) {
      var e = PlatformManager.platforms[i];
      var ind = i;
    
      // Current shape after player
      if(e.shape.x < Player.x) {
        PlatformManager.currentPlatformIndex = ind;
        PlatformManager.nextPlattformIndex = (ind == PlatformManager.platforms.length - 1) ? 0 : ind+1;
      }
    
      // Collision with platform item
      e.items.forEach(function(item) {
        if(!item.isVisible) return false;
        if(Game.isColliding(item.shape, Player.shape) ) {
          item.collide();
        }
      });

      var nextShape = PlatformManager.platforms[PlatformManager.nextPlattformIndex].shape;
      var currentShape = PlatformManager.platforms[PlatformManager.currentPlatformIndex].shape;
      // Player in gap
      if(Player.shape.x > (currentShape.x + currentShape.width + 5) && (Player.shape.x + Player.shape.width) < (nextShape.x) )  {
        if(!Player.isJumping) {
          Player.isFalling = true;
          Player.groundY = Game.canvas.height;
        }

        // Fall if jumps against wall
        if(Player.shape.y + Player.shape.height > nextShape.y && Player.shape.x + Player.shape.width > nextShape.x) {
          Player.isFalling = true;
          Player.shape.x -= Game.Speed; //nextShape.x - Player.shape.width;
        }
      // Player on platform
      } else {
        var platformToCheck;
        // Player on currentPlatform
        if(Player.shape.x >= currentShape.x && Player.shape.x + Player.shape.width <= currentShape.x + currentShape.width)
          platformToCheck = currentShape;
        else
          platformToCheck = nextShape;

        if(Player.shape.y + Player.shape.height <= platformToCheck.y )
          Player.groundY = platformToCheck.y

      }
    }
  },

  isColliding : function(obj1, obj2) {
  if( obj1.x > obj2.x &&
      obj1.x < (obj2.x + obj2.width) &&
      obj1.y > obj2.y &&
      obj1.y < ( obj2.y +  obj2.height) ) {
        return true;
      }
    return false;
  },

  reset : function() {
    // Reset game object
    Game.clear();
    Game.isDrawing = true;
    Game.speed = Game.initSpeed;
    // Reset objects
    Player.reset();
    PlatformManager.reset();
    Highscore.reset();
    // Clear interface
    $('#restartButton').hide(); 
    $('#saveScoreButton').hide();  
    Highscore.hideForm();
    //
    Game.markerPoint = Game.initMarkerPoint;
    Highscore.pullScoreOnline();
    // Start
    Game.start();
  },

  canvasToBW : function () {

    var imgd = Game.buffer_context.getImageData(0, 0, Game.WIDTH, Game.HEIGHT);
    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
      var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
      pix[i  ] = grayscale;   // red
      pix[i+1] = grayscale;   // green
      pix[i+2] = grayscale;   // blue
      // alpha
    }

    // Draw Background Rect
    Game.buffer_context.fillStyle = 'rgb(0,0,0)';
    Game.buffer_context.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
    Game.context.drawImage(Game.buffer, 0, 0);
    
    Game.buffer_context.putImageData(imgd, 0, 0);
    Game.context.drawImage(Game.buffer, 0, 0);
  },
  
  //
  keyEvent : function(e) {
    //console.log(e.keyCode);
    // Space = 32
    // ArrowUp = 38
    // R = 82
    switch(e.keyCode) {
      case(38): !Game.isDrawing ? Game.reset() : Player.jump(); break;
      case(32): Player.jump(); break;
      case(82): if(!Game.isDrawing && !$('input').is(":focus")) Game.reset(); break;
      case(83): if(!Game.isDrawing && !$('input').is(":focus")) Highscore.showForm(); break;
    }      
  }
};

Game.init();
Game.start();