(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var GameView = PSnake.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.snake = this.game.addSnake();
    this.timerId = null;
  };

  GameView.MOVES = {
    "w": [0, 10],
    "s": [0, -10],
    "a": [-1, 0],
    "d": [1, 0],
  };

  GameView.prototype.bindKeyHandlers = function () {
    var snake = this.snake;

    Object.keys(GameView.MOVES).forEach(function (k) {
      var move = GameView.MOVES[k];
      key(k, function () { snake.power(move); });
    });

    // key("space", function () { snake.fireBullet() });
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
      }, 1000 / PSnake.Game.FPS
    );

    this.bindKeyHandlers();
  };

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };
})();
