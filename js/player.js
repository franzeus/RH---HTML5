var Player = {
  
  x: 100,
  y: 0,
  width: 48,
  height: 48,
  shape: null,
  isVisible: true,
  isJumping: false,
  isFalling: true,
  lastY: 0,
  groundY:0,

  maxJumpHeight: 100,
  jumpSpeed: 300,
  fallSpeed: 120,

  velocity: 0,
  reachedPeak: false,
  velocityDownfallSpeed: 18,
  velocityMax: 2,

  init : function() {
    Player.lastY = this.y;
    Player.y = Game.HEIGHT - Player.height - 60;
    Player.groundY = Game.HEIGHT;
    Player.jumpSinWaveSpeed = Player.halfPI / Player.jumpHangTime;
    Player.velocityMax = 4;

    Player.shape = new ImageSprite({
      x: Player.x, y: Player.y,
      width: Player.width, height: Player.height,
      context: Game._canvasContext,
      src: 'assets/dinoSprite_48.png',
      frames: 7
    });
  },

  draw : function() {
    if(Player.isVisible)
      Player.shape.draw();
  },

  setPosition : function(_x, _y) {
    Player.shape.x = _x;  
    Player.shape.y = _y;
  },

  reset : function() {
    Player.setPosition(100, Game.HEIGHT - Player.height - 60);
    Player.isVisible = true;
  },

  // ------------------------------------------------------
  jump : function() {
    if(Player.isJumping || Player.isFalling) return false;
    Player.isJumping = true;
    Player.lastY = Player.shape.y;
    Player.reachedPeak = false;
  },

  checkJump : function() {
  /*if(Player.shape.y <= Player.lastY - Player.maxJumpHeight) {
      Player.isJumping = false;
      Player.isFalling = true;
      return false;
    }
    // Fall
    Player.shape.y -= Player.jumpSpeed;

    */
    // Player jumps
    if(Player.isJumping && !Player.reachedPeak) {
     
      Player.velocity -= 2.5 * (Player.maxJumpHeight - (Player.shape.y - Player.lastY)) / 100;

      if(Player.shape.y <= Player.lastY - Player.maxJumpHeight) {
        Player.reachedPeak = true;
        Player.isJumping = false;
        Player.isFalling = true;
      }
    }
    // Player falls
    else {
      if(Player.shape.y + Player.shape.width < Player.groundY && Player.isFalling)
        Player.velocity += Player.velocityDownfallSpeed;
      else
        Player.isFalling = false;
    }

    if (Player.velocity < -Player.velocityMax) 
      Player.velocity = -Player.velocityMax;
    else if (Player.velocity > Player.velocityMax)
      Player.velocity = Player.velocityMax;

    if(Player.isFalling || Player.isJumping)
      Player.shape.y += Player.velocity;
  },
};