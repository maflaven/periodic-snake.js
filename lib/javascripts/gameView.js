(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var GameView = PSnake.GameView = function (game, ctx, timer, highScore, screens) {
    this.ctx = ctx;
    this.timer = timer;
    this.highScore = highScore;
    this.pauseScreen = screens[0];
    this.gameOverScreen = screens[1];
    this.game = game;
    this.snake = this.game.addSnake();
    this.pause = false;
    this.timerId = null;
    this.initialStart = true;

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

  GameView.prototype.togglePause = function () {
    if (this.game.gameOver) {
      this.toggleGameOver(true);
    } else if (!this.pause) {
      this.pauseScreen.className = "visible";
      clearInterval(this.timerId);
      this.pause = true;
    } else if (this.pause) {
      this.pauseScreen.className = "";
      this.start();
      this.pause = false;
    }
  };

  GameView.prototype.toggleGameOver = function (restart) {
    if (restart) {
      this.gameOverScreen.className = "";
      this.game.restart();
      this.start();
    } else {
      this.gameOverScreen.className = "visible";
      clearInterval(this.timerId);
    }
  };

  GameView.prototype.updateStats = function () {
    this.timer.innerHTML = "time to starvation: " + this.game.eatTimer;
    this.highScore.innerHTML = "high score: " + this.game.highScore;
  };

  GameView.prototype.checkGameOver = function () {
    if (this.game.gameOver) {
      this.toggleGameOver();
    }
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
        gameView.updateStats();
        gameView.checkGameOver();
      }, 1000 / PSnake.Game.FPS
    );
  };
})();
