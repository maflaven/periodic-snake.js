(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Game = PSnake.Game = function () {
    this.snakes = [];
    this.time = 0;
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 60;

  Game.prototype.add = function (object) {
    if (object instanceof PSnake.Snake) {
      this.snakes.push(object);
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

    return snake;
  };

  Game.prototype.allObjects = function () {
    return []
      .concat(this.snakes);
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

    this.allObjects().forEach(function (object) {
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
    } else {
      throw "invalid object";
    }
  };

  Game.prototype.step = function () {
    this.time++;
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
    return [
      wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap (coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };
})();
