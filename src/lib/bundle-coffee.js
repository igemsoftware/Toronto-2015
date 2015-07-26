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

W = window.innerWidth;

H = window.innerHeight;

canv = new Canvas("canvas", W, H);

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

canv.fill();

checkCollisions = function(x, y) {
  var j, len1, results;
  results = [];
  for (j = 0, len1 = nodes.length; j < len1; j++) {
    n = nodes[j];
    if (n.checkCollision(x, y)) {
      results.push(n.drawRed());
    } else {
      results.push(void 0);
    }
  }
  return results;
};


},{}]},{},[1])


//# sourceMappingURL=maps/bundle-coffee.js.map