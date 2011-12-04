var Player = {
  
  x: 100,
  y: 0,
  width: 64,
  height: 64,
  shape: null,
  isVisible: true,
  isJumping: false,
  isFalling: true,
  lastY: 0,
  groundY:0,
  maxJumpHeight: 120,
  jumpSpeed: 10,
  fallSpeed: 8,

  init : function() {
    Player.lastY = this.y;
    Player.y = Game.HEIGHT - Player.height - 60;
    Player.groundY = Game.HEIGHT;

    Player.shape = new ImageSprite({
      x: Player.x, y: Player.y,
      width: Player.width, height: Player.height,
      context: Game.context,
      src: 'assets/dinoSprite.png',
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
  },

  checkJump : function() {
    if(Player.shape.y <= Player.lastY - Player.maxJumpHeight) {
      Player.isJumping = false;
      Player.isFalling = true;
      return false
    }
    Player.shape.y -= Player.jumpSpeed;
  },

  checkFall : function() {
    if(Player.shape.y + Player.shape.width < Player.groundY) {
       Player.shape.y += Player.fallSpeed;
    } else {
      Player.isFalling = false;
    }
  },
};