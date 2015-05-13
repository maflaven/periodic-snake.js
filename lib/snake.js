(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  function randomColor () {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i++) {
      color += hexDigits[Math.round((Math.random() * 16))];
    }

    return color;
  }

  var Snake = PSnake.Snake = function (options) {
    options.radius = Snake.RADIUS;
    options.color = options.color || randomColor();
    this.period = options.period || PSnake.Game.FPS;
    this.velparams = options.velparams || [1, 30];
    this.veltargets = this.velparams.slice(0);
    this.segments = [];

    PSnake.MovingObject.call(this, options);
  };

  Snake.RADIUS = 5;

  PSnake.Util.inherits(Snake, PSnake.MovingObject);

  // Snake.prototype.phase = function () {
  //   return (((this.game.time - 1) + this.period / 2) % PSnake.Game.FPS) / this.period;
  // };

  Snake.prototype.move = function () {
    var oldPos = this.pos;
    var time = this.game.time % PSnake.Game.FPS;
    var ypos = PSnake.Game.DIM_Y / 2 + this.velparams[1] *
               Math.sin(2 * Math.PI * (time / this.period));

    this.pos = [this.pos[0] + this.velparams[0], ypos];

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }

    this.easeParams();
  };

  Snake.prototype.easeParams = function () {
    if (this.velparams[0] != this.veltargets[0]) {
      this.velparams[0] = PSnake.Util.linEase(this.velparams[0], this.veltargets[0])[0];
    }
    if (this.velparams[1] != this.veltargets[1]) {
      this.velparams[1] = PSnake.Util.linEase(this.velparams[1], this.veltargets[1])[0];
    }
  };

  Snake.prototype.tweak = function (tweak) {
    if (this.velparams[0] > 1 || tweak[0] === 1) {
      this.veltargets[0] = this.velparams[0] + tweak[0];
      this.updateSegmentsOffset(tweak[0]);
    }
    if (this.velparams[1] > 10 || tweak[1] === 10) {
      this.veltargets[1] = this.velparams[1] + tweak[1];
    }
  };

  Snake.prototype.addSegment = function () {
    var prevSegment;
    if (this.segments.length === 0) {
      prevSegment = this;
    } else {
      prevSegment = this.segments[this.segments.length - 1];
    }

    var nextSegment;
    nextSegment = new PSnake.SnakeSegment({
      game: this.game,
      snake: this,
      radius: this.radius,
      period: this.period,
      velparams: this.velparams,
    });

    prevSegment.nextSegment = nextSegment;
    nextSegment.prevSegment = prevSegment;

    this.segments.push(nextSegment);

    nextSegment.ord = this.segments.length;

    var xOffset = prevSegment.pos[0] - Snake.RADIUS * 2 * this.velparams[0];
    nextSegment.pos = [xOffset, PSnake.Util.periodicOffset(prevSegment)];
  };

  Snake.prototype.halfSegments = function () {
    var segLength = this.segments.length;

    if (segLength > 2) {
      var removed = this.segments.slice(segLength / 2, segLength);

      removed.forEach( function (segment) {
        segment.remove();
      });
    } else {
      this.game.gameOver();
    }
  };

  Snake.prototype.updateSegmentsOffset = function (tweak) {
    if (this.velparams[0] >= 1) {
      this.segments.forEach( function (segment) {
        segment.pos[0] -= tweak * Snake.RADIUS * 2 * segment.ord;
      });
    }
  };

  Snake.prototype.minMaxY = function () {
    var mid = PSnake.Game.DIM_Y / 2;
    return [mid - this.velparams[1], mid + this.velparams[1]];
  };
})();
