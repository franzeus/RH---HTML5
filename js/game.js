/*
  @TODO:
    - Obstacles (spiderweb, fire)
    - Bonus Points    
  @Feature:
    - Highscore with localstorage
    - Improve performance
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
  isDrawing: true,
  reqAnimation: null,

  init : function() {
    Game.canvas = document.getElementById("canvas");
    Game.buffer = document.getElementById("buffer-canvas");
    Game.context = Game.canvas.getContext("2d");
    Game.buffer_context = Game.buffer.getContext("2d");

    Game.HEIGHT = Game.canvas.height;
    Game.WIDTH = Game.canvas.width;
    Game.buffer.width = Game.canvas.width;
    Game.buffer.height = Game.canvas.height;

    // Add backgrounds
    Game.backgrounds = [];
    Game.backgrounds.push(new Parallax(0, 0, 660, 330, "assets/game_background_layer_3.png", 0.01));
    Game.backgrounds.push(new Parallax(0, 0, 660, 330, "assets/game_background_layer_2.png", 0.1));
    Game.backgrounds.push(new Parallax(0, 0, 660, 330, "assets/game_background_layer_1.png", 0.15));
    // Prepare player
    Player.init();
    // Create Platforms
    PlatformManager.createPlatforms(5);

    // Events
    $(document).keydown($.proxy(Game.keyEvent, this));
    $('#canvas').click(function(){ Player.jump() });
    $('#restartButton').click(function(){ Game.reset() });
    Game.isDrawing = true;
  },

  start : function() {    
    Game.reqAnimation = requestAnimFrame( Game.start );
    Game.draw();
  },

  stop : function() {
    $('#restartButton').show();
    Game.isDrawing = false;
    Game.speed = 0;
    Player.isVisible = false;
    cancelRequestAnimFrame(Game.reqAnimation);
  },

  clear : function() {
    Game.buffer_context.clearRect(0, 0, Game.WIDTH, Game.HEIGHT );
    Game.canvas.width = Game.canvas.width;
  },

  draw : function() { 
    if(Game.isDrawing) {
      Game.clear();
      Highscore.addPoint(1);

      // ---------
      // Drawing Backgrounds     
      Game.backgrounds.forEach(function(background){
        background.draw();
      });

      // Drawing platforms
      PlatformManager.draw();

      // Player
      Game.checkPlayer();
      Player.draw();

      Game.speed += 0.002;
      // ---------
      Game.context.drawImage(Game.buffer, 0, 0);
    }
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
    PlatformManager.platforms.forEach(function(e, ind) {
      // Current shape after player
      if(e.shape.x < Player.x) {
        PlatformManager.currentPlatformIndex = ind;
        PlatformManager.nextPlattformIndex = (ind == PlatformManager.platforms.length - 1) ? 0 : ind+1;
      }

      var nextShape = PlatformManager.platforms[PlatformManager.nextPlattformIndex].shape;
      var currentShape = PlatformManager.platforms[PlatformManager.currentPlatformIndex].shape ;
      // Player in gap
      if(Player.shape.x > (currentShape.x + currentShape.width + 5) && (Player.shape.x + Player.shape.width) < (nextShape.x) )  {
        if(!Player.isJumping) {
          Player.isFalling = true;
          Player.groundY = Game.canvas.height;
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
    });
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
    Game.speed = 2;
    // Reset objects
    Player.reset();
    PlatformManager.reset();
    Highscore.reset();
    // Clear interface
    $('#restartButton').hide();    
    // Start
    Game.start();
  },
  
  keyEvent : function(e) {
    //console.log(e.keyCode);
    // Space = 32
    // ArrowUp = 38
    // R = 82
    switch(e.keyCode) {
      case(38): Player.jump(); break;
      case(32): Player.jump(); break;
      case(82): Game.reset(); break;
    }      
  }
};

Game.init();
Game.start();