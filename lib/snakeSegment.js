(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var SnakeSegment = PSnake.SnakeSegment = function (options) {
    this.snake = options.snake;
    this.prevSegment = options.prevSegment;
    this.nextSegment = options.nextSegment;
    this.xvel = options.xvel || 1;
    this.period = options.period;
    this.velparams = options.velparams;

    options.color = this.snake.color;

    PSnake.MovingObject.call(this, options);
  };

  PSnake.Util.inherits(SnakeSegment, PSnake.MovingObject);

  SnakeSegment.prototype.move = function (newPos, timeOffset) {
    var oldPosOffset = this.segmentOffsetPos(timeOffset);
    this.pos = newPos;

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }

    if (this.nextSegment) {
      this.nextSegment.move(oldPosOffset, timeOffset + 1);
    }
  };

  SnakeSegment.prototype.segmentOffsetPos = function (timeOffset) {
    var time = (this.game.time - this.radius * 2 * timeOffset) % PSnake.Game.FPS;
    var xpos = this.pos[0] - this.radius * 2;
    var ypos = PSnake.Game.DIM_Y / 2 + this.velparams[1] *
               Math.sin(2 * Math.PI * ((time - 10) / this.period));

    return [xpos, ypos];
  };
})();
