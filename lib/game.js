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
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 60;
  Game.MAX_BAD_APPLES = 10;
  Game.MAX_GOOD_APPLES = 3;

  Game.prototype.add = function (object) {
    if (object instanceof PSnake.Snake) {
      this.snakes.push(object);
    } else if (object instanceof PSnake.Path) {
      this.paths.push(object);
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
    for (var i = 0; i < 5; i++) {
      snake.addSegment();
    }

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
    if (Math.random() > 0.5) {
      var badApple = new PSnake.Apple({
        game: this,
        bad: true,
        color: "#333300",
        pos: [Math.random() * Game.DIM_X,
          PSnake.Util.randomPos(this.snakes[0].minMaxY, [0, Game.DIM_Y])]
      });
      if (this.badApples.length === Game.MAX_BAD_APPLES) {
        this.badApples[this.badApples.length - 1].remove();
      }

      this.badApples.push(badApple);
    } else if (this.goodApples.length < Game.MAX_GOOD_APPLES) {
      var goodApple = new PSnake.Apple({
        game: this,
        color: "33CC33",
        pos: [Math.random() * Game.DIM_X,
          PSnake.Util.randomPos(this.snakes[0].minMaxY, [0, Game.DIM_Y])]
      });
      if (this.goodApples.length === Game.MAX_GOOD_APPLES) {
        this.goodApples[this.goodApple.length - 1].remove();
      }

      this.goodApples.push(goodApple);
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
    this.allObjects().forEach(function (object) {
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
    this.time++;
    // this.sinEase();
    this.moveObjects();
    this.checkCollisions();
    if (this.time % 300 === 0) {
      this.addApple();
    }
  };

  Game.prototype.wrap = function (pos) {
    return [
      PSnake.Util.wrap(pos[0], Game.DIM_X),
      PSnake.Util.wrap(pos[1], Game.DIM_Y)
    ];
  };

  Game.prototype.gameOver = function () {

  };
})();
