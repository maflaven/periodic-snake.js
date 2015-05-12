(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var SnakeSegment = PSnake.SnakeSegment = function (options) {
    this.snake = options.snake;
    this.prevSegment = options.prevSegment;
    this.nextSegment = options.nextSegment;
    this.xvel = options.xvel || 1;

    options.radius = window.PSnake.Snake.Radius;
    options.color = this.snake.color;

    PSnake.MovingObject.call(this, options);
  };

  PSnake.Util.inherits(SnakeSegment, PSnake.MovingObject);

  SnakeSegment.prototype.move = function (newPos) {
    var oldPos = this.pos;
    this.pos = newPos;

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }

    if (this.nextSegment) {
      this.nextSegment.move(oldPos);
    }
  };
})();
