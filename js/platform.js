var PlatformManager = {

  platforms: [],
  randomWidth: [100, 150, 200, 250, 300],
  randomHeight: [20, 40, 60, 80, 100],
  GAP: 90,
  currentPlatformIndex: 0,
  nextPlattformIndex: 1,

  init : function() {
  },

  createPlatforms : function(_num) {
    var pm = PlatformManager;
    var newX, newY, newH, newW;
    for(var i=0; i < _num; i++) {
      if(i == 0) { // First block
        newW = 460; newX = 0;
        pm.platforms.push(new Platform(0, Game.HEIGHT - 20, 460, 20));
      } else {
        newX = newX + newW + pm.GAP;        
        newW = PlatformManager.randomWidth[PlatformManager.getRandomNum(0, PlatformManager.randomWidth.length - 1)];
        newH = PlatformManager.randomHeight[PlatformManager.getRandomNum(0, PlatformManager.randomHeight.length - 1)];  
        pm.platforms.push(new Platform(newX, Game.HEIGHT - newH, newW, newH));
      }
    }
  },

  reset : function() {
    PlatformManager.platforms = [];
    PlatformManager.createPlatforms(5);
  },

  draw : function() {
    PlatformManager.platforms.forEach(function(platform) {
      platform.draw();
      platform.shape.x -= Game.speed;
    });

    PlatformManager.update();
  },

  update : function() {
    for(var i=0; i < PlatformManager.platforms.length; i++) {
      if(PlatformManager.platforms[i].shape.x + PlatformManager.platforms[i].shape.width <= 0) {
        PlatformManager.transform(i);
      }
    }
  },

  transform : function(_index) {    
    var nextIndex = _index - 1;
    if(_index == 0)
      nextIndex = PlatformManager.platforms.length - 1;

    newW = PlatformManager.randomWidth[PlatformManager.getRandomNum(0, PlatformManager.randomWidth.length - 1)];
    newH = PlatformManager.randomHeight[PlatformManager.getRandomNum(0, PlatformManager.randomHeight.length - 1)];  
    newX = PlatformManager.platforms[nextIndex].shape.x + PlatformManager.platforms[nextIndex].shape.width + PlatformManager.GAP;
    newY = Game.HEIGHT - newH;

    PlatformManager.platforms[_index].shape.x = newX;
    PlatformManager.platforms[_index].shape.width = newW;
    PlatformManager.platforms[_index].shape.height = newH;
    PlatformManager.platforms[_index].shape.y = newY;
    PlatformManager.platforms[_index].setBars();
  },

  getRandomNum : function(min, max){
    if( min > max )
      return( -1 );
    if( min == max )
      return( min );
    return( min + parseInt( Math.random() * ( max-min+1 ) ) );
  }
};

// --------------------------------------------
var Platform = function(_x, _y, _w, _h) {
  this.context = Game.context;
  this.width = _w;
  this.height = _h;
  //this.src = _src;
  this.x = _x;
  this.y = _y;

  this.isVisible = true;

  this.shape = new Rectangle({
    x: _x, y: _y,
    width: _w, height: _h,
    color: '#6B421E',
    context: Game.context
  });

  // Bar
  this.bars = [];
  this.barWidth = 16; 
  this.barHeight = 165;  
  this.setBars();
};
//
Platform.prototype.draw = function() {
  //this.shape.draw();
  var that = this;
  this.bars.forEach(function(bar, index) {
    bar.draw();
    bar.x = that.shape.x + (index * bar.width);
    bar.y = that.shape.y;
   // console.log(that.shape.x, bar.x)
  });
};
//
Platform.prototype.setBars = function() {
  this.bars = [];
  this.numberOfBars = Math.round(this.shape.width / this.barWidth);

  for(var i=0; i <= this.numberOfBars; i++) {
    var bar = new ImageShape({
      context: this.context,
      width: this.barWidth,
      height: this.barHeight,
      src: 'assets/bar.png',
      x: 0,
      y: this.shape.y
    });
    this.bars.push(bar);
  }
};