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

    options.color = this.snake.color;

    PSnake.MovingObject.call(this, options);
  };

  PSnake.Util.inherits(SnakeSegment, PSnake.MovingObject);

  SnakeSegment.prototype.move = function () {
    this.pos = [this.xPos(), PSnake.Util.periodicOffset(this, true)];

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
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
})();
