(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvas;

Canvas = (function() {
  function Canvas(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.c = document.createElement("canvas");
    this.c.id = this.id;
    this.c.width = this.width;
    this.c.height = this.height;
    this.c.addEventListener("mouseover", this.mouseover, false);
    document.body.appendChild(this.c);
    this.ctx = document.getElementById(this.id).getContext("2d");
  }

  Canvas.prototype.fill = function() {
    return this.ctx.fill();
  };

  Canvas.prototype.mouseover = function(e) {
    e.preventDefault();
    return console.log("mouseover");
  };

  return Canvas;

})();

module.exports = Canvas;


},{}],2:[function(require,module,exports){
var Node;

Node = (function() {
  function Node(x1, y1, r, ctx) {
    this.x = x1;
    this.y = y1;
    this.r = r;
    this.ctx = ctx;
    this.hover = false;
  }

  Node.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Node.prototype.drawRed = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "red";
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Node.prototype.checkCollision = function(x, y) {
    var inside;
    inside = false;
    console.log(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    if (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.r, 2)) {
      inside = true;
    }
    return inside;
  };

  return Node;

})();

module.exports = Node;


},{}],3:[function(require,module,exports){
var Canvas, H, Network, Node, W, canv, checkCollisions, currentActiveNode, i, len, mousemove, n, network, nodes;

Canvas = require("./Canvas");

Node = require("./Node");

Network = (function() {
  var foobar;

  function Network(canvas, nodes1) {
    this.canvas = canvas;
    this.nodes = nodes1;
    this.foo("foobars");
  }

  foobar = function(bar) {
    return console.log(bar);
  };

  Network.prototype.foo = function(bar) {
    console.log(this.nodes);
    return foobar(bar);
  };

  return Network;

})();

currentActiveNode = null;

checkCollisions = function(x, y) {
  var i, inside, len, n, results;
  if (currentActiveNode == null) {
    results = [];
    for (i = 0, len = nodes.length; i < len; i++) {
      n = nodes[i];
      inside = n.checkCollision(x, y);
      if (inside) {
        n.hover = true;
        n.drawRed();
        currentActiveNode = n;
      }
      if (n.hover && (!inside)) {
        n.hover = false;
        results.push(n.draw());
      } else {
        results.push(void 0);
      }
    }
    return results;
  } else {
    inside = currentActiveNode.checkCollision(x, y);
    if (!inside) {
      currentActiveNode.draw();
      return currentActiveNode = null;
    }
  }
};

mousemove = function(e) {
  e.preventDefault();
  return checkCollisions(e.clientX, e.clientY);
};

W = window.innerWidth;

H = window.innerHeight;

canv = new Canvas("canvas", W, H);

canv.c.addEventListener("mousemove", mousemove, false);

nodes = (function() {
  var i, results;
  results = [];
  for (n = i = 0; i < 1000; n = ++i) {
    results.push(new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 5, canv.ctx));
  }
  return results;
})();

for (i = 0, len = nodes.length; i < len; i++) {
  n = nodes[i];
  n.draw();
}

network = new Network(canv, nodes);

canv.fill();


},{"./Canvas":1,"./Node":2}]},{},[1,2,3])


//# sourceMappingURL=maps/bundle-coffee.js.map