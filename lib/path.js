(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Path = PSnake.Path = function (options) {
    this.snake = options.snake;
    this.game = options.game;
    this.color = options.color;
    this.radius = options.radius;
  };

  Path.prototype.draw = function (ctx) {
    ctx.strokeStyle = this.color;

    var max = this.snake.pos[0] + 70 + (10 * this.snake.veltargets[0]);
    var xpos = this.snake.pos[0];
    var time = this.game.time;

    ctx.beginPath();
    ctx.moveTo(this.snake.pos[0], this.ypos(time));

    while (xpos < max) {
      var ypos = this.ypos(time);

      ctx.lineTo(xpos, ypos);
      ctx.moveTo(xpos, ypos);

      xpos += this.snake.veltargets[0];

      if (xpos > PSnake.Game.DIM_X) {
        max -= xpos;
        xpos = PSnake.Util.wrap(xpos, PSnake.Game.DIM_X);

        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xpos, this.ypos(time));
      }
      time ++;
    }
    ctx.stroke();
  };

  Path.prototype.ypos = function (time) {
    var adjustedTime = time % (PSnake.Game.FPS * this.snake.veltargets[0]);

    var ypos = PSnake.Game.DIM_Y / 2 + this.snake.velparams[1] *
               Math.sin(2 * Math.PI * (adjustedTime / this.snake.period));

    return ypos;
  };

  Path.prototype.collideWith = function (otherObject) {
    // do nothing
  };
})();
