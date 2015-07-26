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
  }

  Node.prototype.draw = function() {
    this.ctx.moveTo(this.x, this.y);
    return this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
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
    inside = true;
    this.ctx.strokeRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    this.ctx.fill();
    if (!((this.x - this.r < x && x < this.x + this.r))) {
      inside = false;
    }
    if (!((this.y - this.r < y && y < this.y + this.r))) {
      inside = false;
    }
    return inside;
  };

  return Node;

})();

module.exports = Node;


},{}],3:[function(require,module,exports){
var Canvas, H, Network, Node, W, canv, checkCollisions, i, len, mousemove, n, network, nodes;

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

checkCollisions = function(x, y) {
  var i, len, n, results;
  results = [];
  for (i = 0, len = nodes.length; i < len; i++) {
    n = nodes[i];
    if (n.checkCollision(x, y)) {
      results.push(n.drawRed());
    } else {
      results.push(void 0);
    }
  }
  return results;
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
  for (n = i = 0; i < 100; n = ++i) {
    results.push(new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 15, canv.ctx));
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