(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var GameView = PSnake.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.snake = this.game.addSnake();
    this.pause = false;
    this.timerId = null;

    this.bindKeyHandlers();
  };

  GameView.TWEAKS = {
    "w": [0, 10],
    "s": [0, -10],
    "a": [-1, 0],
    "d": [1, 0],
  };

  GameView.prototype.bindKeyHandlers = function () {
    var snake = this.snake;

    Object.keys(GameView.TWEAKS).forEach(function (k) {
      var tweak = GameView.TWEAKS[k];
      key(k, function () { snake.tweak(tweak); });
    });

    key("space", function () { this.togglePause(); }.bind(this));
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
      }, 1000 / PSnake.Game.FPS
    );

    // this.bindKeyHandlers();
  };

  GameView.prototype.togglePause = function () {
    if (this.pause) {
      this.start();
      this.pause = false;
    } else {
      clearInterval(this.timerId);
      this.pause = true;
    }
  };
})();
