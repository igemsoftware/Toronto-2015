(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvas, H, Node, W, canv, checkCollisions, i, len, n, nodes;

Canvas = (function() {
  function Canvas(id, width, height) {
    var c;
    this.id = id;
    this.width = width;
    this.height = height;
    c = document.createElement("canvas");
    c.id = this.id;
    c.width = this.width;
    c.height = this.height;
    c.addEventListener("mouseover", this.mouseover, false);
    c.addEventListener("mousemove", this.mousemove, false);
    document.body.appendChild(c);
    this.ctx = document.getElementById(this.id).getContext("2d");
  }

  Canvas.prototype.fill = function() {
    return this.ctx.fill();
  };

  Canvas.prototype.mouseover = function(e) {
    e.preventDefault();
    return console.log("mouseover");
  };

  Canvas.prototype.mousemove = function(e) {
    e.preventDefault();
    return checkCollisions(e.clientX, e.clientY);
  };

  return Canvas;

})();

Node = (function() {
  function Node(x1, y1, r) {
    this.x = x1;
    this.y = y1;
    this.r = r;
  }

  Node.prototype.draw = function(ctx) {
    ctx.moveTo(this.x, this.y);
    return ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  };

  Node.prototype.drawRed = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.closePath();
    return ctx.fill();
  };

  return Node;

})();

W = window.innerWidth;

H = window.innerHeight;

canv = new Canvas("canvas", W, H);

nodes = (function() {
  var i, results;
  results = [];
  for (n = i = 0; i < 100; n = ++i) {
    results.push(new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 15));
  }
  return results;
})();

for (i = 0, len = nodes.length; i < len; i++) {
  n = nodes[i];
  n.draw(canv.ctx);
}

canv.fill();

checkCollisions = function(x, y) {
  var j, len1, results;
  results = [];
  for (j = 0, len1 = nodes.length; j < len1; j++) {
    n = nodes[j];
    if (x === n.x && y === n.y) {
      results.push(n.drawRed(canv.ctx));
    } else {
      results.push(void 0);
    }
  }
  return results;
};


},{}]},{},[1])


//# sourceMappingURL=maps/bundle-coffee.js.map