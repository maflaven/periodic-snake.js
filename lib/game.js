(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Game = PSnake.Game = function () {
    this.snakes = [];
    this.paths = [];
    this.goodApples = [];
    this.badApples = [];
    this.time = 0;
    this.eatTimer = 20;
    this.highScore = 0;
  };

  Game.BG_COLOR = "#00c9a8";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 60;
  Game.APPLE_TIMER = 3;
  Game.MAX_BAD_APPLES = 5;
  Game.MAX_GOOD_APPLES = 4;

  Game.prototype.add = function (object) {
    if (object instanceof PSnake.Snake) {
      this.snakes.push(object);
    } else if (object instanceof PSnake.Path) {
      this.paths.push(object);
    } else if (object instanceof PSnake.Apple && object.bad) {
      this.badApples.push(object);
    } else if (object instanceof PSnake.Apple && !object.bad) {
      this.goodApples.push(object);
    } else {
      throw "invalid object";
    }
  };

  Game.prototype.addSnake = function () {
    var snake = new PSnake.Snake({
      pos: [Game.DIM_X * 0.2, Game.DIM_Y / 2],
      game: this
    });

    this.add(snake);

    var path = new PSnake.Path({
      snake: snake,
      game: this,
      color: "#555",
      radius: 1
    });
    this.add(path);

    return snake;
  };

  Game.prototype.cutSnake = function () {
    this.snakes.forEach( function (snake) {
      snake.halfSegments();
    });
  };

  Game.prototype.growSnake = function () {
    this.snakes.forEach( function (snake) {
      snake.addSegment();
    });
  };

  Game.prototype.addApple = function () {
    if (Math.random() > 0.6) {
      var badApple = new PSnake.Apple({
        game: this,
        bad: true,
        color: "#333300",
        pos: [Math.random() * Game.DIM_X,
          PSnake.Util.randomPos(this.snakes[0].minMaxY(),
          [Game.DIM_Y * 0.1, Game.DIM_Y - Game.DIM_Y * 0.1])]
      });
      if (this.badApples.length === Game.MAX_BAD_APPLES) {
        this.badApples[0].removed = true;
      }

      this.add(badApple);
    } else {
      var goodApple = new PSnake.Apple({
        game: this,
        bad: false,
        color: "#0000FF",
        pos: [Math.random() * Game.DIM_X,
          PSnake.Util.randomPos(this.snakes[0].minMaxY(),
          [Game.DIM_Y * 0.1, Game.DIM_Y - Game.DIM_Y * 0.1])]
      });
      if (this.goodApples.length === Game.MAX_GOOD_APPLES) {
        this.goodApples[0].removed = true;
      }

      this.add(goodApple);
    }
  };

  Game.prototype.allObjects = function () {
    var segments = [];
    this.snakes.forEach( function (snake) {
      segments = segments.concat(snake.segments);
    });
    return []
      .concat(this.snakes)
      .concat(segments)
      .concat(this.goodApples)
      .concat(this.badApples);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 == obj2) {
          // don't allow self-collision
          return;
        }

        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    objects = this.paths.concat(this.allObjects());

    objects.forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0)
      || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach( function (object) {
      object.move();
    });
  };

  Game.prototype.randomPosition = function () {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  };

  Game.prototype.remove = function (object) {
    if (object instanceof PSnake.Snake) {
      this.snakes.splice(this.snakes.indexOf(object), 1);
    } else if (object instanceof PSnake.Apple && object.bad) {
      this.badApples.splice(this.badApples.indexOf(object), 1);
    } else if (object instanceof PSnake.Apple && !object.bad) {
      this.goodApples.splice(this.goodApples.indexOf(object), 1);
    } else {
      throw "invalid object";
    }
  };

  Game.prototype.step = function () {
    this.time ++;

    if (this.time % Game.FPS === 0) {
      this.eatTimer --;
    }
    if (this.time % (Game.FPS * Game.APPLE_TIMER) === 0) {
      this.addApple();
    }
    if (this.eatTimer === 0) {
      this.snakes.forEach( function (snake) {
        snake.halfSegments();
      });
      this.eatTimer = 20;
    }

    this.moveObjects();
    this.checkCollisions();
    this.updateStats();
  };

  Game.prototype.wrap = function (pos) {
    return [
      PSnake.Util.wrap(pos[0], Game.DIM_X),
      PSnake.Util.wrap(pos[1], Game.DIM_Y)
    ];
  };

  Game.prototype.gameOver = function () {

  };

  Game.prototype.updateStats = function () {
    var score = this.snakes[0].segments.length;
    if (score > this.highScore) {
      this.highScore = score;
    }
  };

  Game.prototype.resetEatTimer = function () {
    this.eatTimer = 20;
  };
})();
