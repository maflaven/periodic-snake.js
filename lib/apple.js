(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Apple = PSnake.Apple = function (options) {
    options.radius = Apple.RADIUS;
    this.bad = options.bad || false;

    PSnake.MovingObject.call(this, options);
  };

  Apple.RADIUS = 8;

  PSnake.Util.inherits(Apple, PSnake.MovingObject);

  Apple.prototype.collideWith = function (otherObject) {
    if (this.bad) {
      this.game.cutSnake();
    } else {
      this.game.growSnake();
    }

    this.remove();
  };
})();
