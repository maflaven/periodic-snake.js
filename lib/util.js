(function () {
  if (typeof PSnake === "undefined") {
    window.PSnake = {};
  }

  var Util = PSnake.Util = {};

  // Normalize the length of the vector to 1, maintaining direction.
  var dir = Util.dir = function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  // Find distance between two points.
  var dist = Util.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  // Find the length of the vector.
  var norm = Util.norm = function (vec) {
    return Util.dist([0, 0], vec);
  };

  // Return a randomly oriented vector with the given length.
  var randomVec = Util.randomVec = function (length) {
    var deg = 2 * Math.PI * Math.random();

    return scale([Math.sin(deg), Math.cos(deg)], length);
  };

  // Returns a random position with the given bounds.
  var randomPos = Util.randomPos = function (innerBounds, outerBounds) {
    var innerMin = innerBounds[0]; var innerMax = innerBounds[1];
    var outerMin = outerBounds[0]; var outerMax = outerBounds[1];

    var pos;
    if (Math.random() > 0.5) {
      pos = Math.random() * (innerMin - outerMin) + outerMin;
    } else {
      pos = Math.random() * (outerMax - innerMax) + innerMax;
    }

    return pos;
  };

  // Scale the length of a vector by the given amount.
  var scale = Util.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  // Returns an offsetted position from the given object and offset value.
  var periodicOffset = Util.periodicOffset = function (obj, ord) {
    var timeOffset = obj.radius * 2;
    if (ord) {
      timeOffset *= obj.ord;
    }
    var time = (obj.game.time - timeOffset) % PSnake.Game.FPS;

    var pos = PSnake.Game.DIM_Y / 2 + obj.velparams[1] *
               Math.sin(2 * Math.PI * ((time - timeOffset / 5) / obj.period));

    return pos;
  };

  var wrap = Util.wrap = function (coord, max) {
    if (coord < 0) {
      return max + coord;
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  };

  var linEase = Util.linEase = function (current, target) {
    var diff;
    var stepFactor = 10;
    if (target >= 10) {
      diff = 10 / (PSnake.Game.FPS / stepFactor);
    } else {
      diff = 1 / (PSnake.Game.FPS / stepFactor);
    }

    if (current > target) {
      diff *= -1;
      current += diff;
      if (current < target) {return [target, diff];}
    } else {
      current += diff;
      if (current > target) {return [target, diff];}
    }
    return [current, diff];
  };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };
})();
