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
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();

    PSnake.MovingObject.call(this, options);
  };

  Snake.RADIUS = 5;

  PSnake.Util.inherits(Snake, PSnake.MovingObject);

  // Snake.prototype.move = function () {
  //   this.game.
  // };

  Snake.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };
})();
