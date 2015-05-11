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
    this.velparams = options.velparams || [1, 50];

    PSnake.MovingObject.call(this, options);
  };

  Snake.RADIUS = 5;

  PSnake.Util.inherits(Snake, PSnake.MovingObject);

  Snake.prototype.move = function () {
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
  };

  Snake.prototype.power = function (modify) {
    this.velparams[0] += modify[0];
    this.velparams[1] += modify[1];
  };
})();
