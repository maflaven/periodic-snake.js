(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Apple = PSnake.Apple = function (options) {
    options.radius = 0;
    this.bad = options.bad || false;
    this.removed = false;

    PSnake.MovingObject.call(this, options);
  };

  Apple.RADIUS = 8;

  PSnake.Util.inherits(Apple, PSnake.MovingObject);

  Apple.prototype.collideWith = function (otherObject) {
    if (this.bad) {
      this.game.cutSnake();
    } else {
      this.game.growSnake();
      this.game.resetEatTimer();
    }

    this.remove();
  };

  Apple.prototype.move = function () {
    if (this.removed) {
      this.shrink();
    } else {
      this.grow();
    }
  };

  Apple.prototype.grow = function () {
    if (this.radius != Apple.RADIUS) {
      this.radius = PSnake.Util.linEase(this.radius, Apple.RADIUS)[0];
    }
  };

  Apple.prototype.shrink = function () {
    if (this.radius === 0) {
      this.remove();
    } else {
      this.radius = PSnake.Util.linEase(this.radius, 0)[0];
    }
  };
})();
