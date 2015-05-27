(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var SnakeSegment = PSnake.SnakeSegment = function (options) {
    this.snake = options.snake;
    this.prevSegment = options.prevSegment;
    this.nextSegment = options.nextSegment;
    this.period = options.period;
    this.velparams = options.velparams;
    this.ord = options.ord;
    this.removed = false;

    options.radius = options.radius || 0;
    options.color = this.snake.color;

    PSnake.MovingObject.call(this, options);
  };

  PSnake.Util.inherits(SnakeSegment, PSnake.MovingObject);

  SnakeSegment.prototype.move = function () {
    this.pos = [this.xPos(), PSnake.Util.periodicOffset(this, true)];

    // if (this.game.isOutOfBounds(this.pos)) {
    //   if (this.isWrappable) {
    //     this.pos = this.game.wrap(this.pos);
    //   } else {
    //     this.remove();
    //   }
    // }

    if (this.removed) {
      this.shrink();
    } else {
      this.grow();
    }
  };

  SnakeSegment.prototype.xPos = function () {
    var prevSegXPos = this.prevSegment.pos[0];
    var xPos = prevSegXPos - this.velparams[0] * PSnake.Snake.RADIUS * 2;
    return PSnake.Util.wrap(xPos, PSnake.Game.DIM_X);
  };

  SnakeSegment.prototype.remove = function () {
    this.snake.segments.splice(this.snake.segments.indexOf(this), 1);
  };

  SnakeSegment.prototype.grow = function () {
    if (this.radius != PSnake.Snake.RADIUS) {
      this.radius = PSnake.Util.linEase(this.radius, PSnake.Snake.RADIUS)[0];
    }
  };

  SnakeSegment.prototype.shrink = function () {
    if (this.radius === 0) {
      this.remove();
    } else {
      this.radius = PSnake.Util.linEase(this.radius, 0)[0];
    }
  };
})();
