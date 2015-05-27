(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Snake = PSnake.Snake = function (options) {
    options.radius = Snake.RADIUS;
    options.color = options.color || Snake.COLOR;
    this.period = options.period || PSnake.Game.FPS;
    this.velparams = options.velparams || [1, 30];
    this.veltargets = this.velparams.slice(0);
    this.segments = [];

    PSnake.MovingObject.call(this, options);
  };

  Snake.COLOR = "#0000FF";
  Snake.RADIUS = 6;

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
    if (
        (tweak[0] === 1 && this.veltargets[0] < 6) ||
        (tweak[0] === -1 && this.veltargets[0] > 1)
        ) {
      this.veltargets[0] += tweak[0];
    }
    if (
        (tweak[1] === 10 && this.veltargets[1] < (PSnake.Game.DIM_Y / 2)) ||
        (tweak[1] === -10 && this.veltargets[1] > 10)
        ) {
      this.veltargets[1] += tweak[1];
    }
  };

  Snake.prototype.addSegment = function () {
    // Reinstate first removed segment instead of adding another


    var firstRemovedSeg = this.segments[this.lastStableIdx() + 1];
    var prevSegment;

    if (this.segments.length === 0) {
      prevSegment = this;
    } else if (firstRemovedSeg && firstRemovedSeg.removed) {
      firstRemovedSeg.removed = false;
      return;
    } else {
      prevSegment = this.segments[this.segments.length - 1];
    }

    var nextSegment;
    nextSegment = new PSnake.SnakeSegment({
      game: this.game,
      snake: this,
      period: this.period,
      velparams: this.velparams,
    });

    prevSegment.nextSegment = nextSegment;
    nextSegment.prevSegment = prevSegment;

    this.segments.push(nextSegment);

    nextSegment.ord = this.segments.length;

    var xOffset = prevSegment.pos[0] - Snake.RADIUS * 2;
    nextSegment.pos = [xOffset, PSnake.Util.periodicOffset(prevSegment)];
  };

  Snake.prototype.halfSegments = function () {
    var segLength = this.segments.length;

    if (segLength > 1) {
      var removed = this.segments.slice(segLength / 2);

      removed.forEach( function (segment) {
        segment.removed = true;
      });
    } else if (segLength === 1) {
      this.segments[0].removed = true;
    } else {
      this.game.toggleGameOver();
    }
  };

  Snake.prototype.lastStableIdx = function () {
    for (var idx = 0; idx < this.segments.length; idx++) {
      if (this.segments[idx].removed) {
        idx--;
        break;
      }
    }

    return idx;
  };

  Snake.prototype.minMaxY = function () {
    var mid = PSnake.Game.DIM_Y / 2;
    var offset = this.veltargets[1] + PSnake.Snake.RADIUS + PSnake.Apple.RADIUS;
    return [mid - offset, mid + offset];
  };
})();
