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

  return Canvas;

})();

module.exports = Canvas;


},{}],2:[function(require,module,exports){
var Link;

Link = (function() {
  function Link(source, target) {
    this.source = source;
    this.target = target;
  }

  return Link;

})();

module.exports = Link;


},{}],3:[function(require,module,exports){
var Node, rand;

rand = function(range) {
  return Math.floor(Math.random() * range);
};

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
    this.ctx.closePath();
    if (this.hover) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "rgb(" + (rand(155) + 100) + ",0,0)";
    }
    return this.ctx.fill();
  };

  Node.prototype.checkCollision = function(x, y) {
    var inside;
    inside = false;
    if (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.r, 2)) {
      inside = true;
    }
    return inside;
  };

  return Node;

})();

module.exports = Node;


},{}],4:[function(require,module,exports){
var AnimationFrame, BG, CANVAS, Canvas, H, Link, Node, W, checkCollisions, clear, ctx, currentActiveNode, dragScaleFactor, dragStart, draw, force, lastX, lastY, links, mousedown, mousemove, mouseup, mousewheel, n, nodes, rand, render, sTime, scale, svg, transformedPoint, update, xform;

Canvas = require("./Canvas");

Node = require("./Node");

Link = require("./Link");

AnimationFrame = window.AnimationFrame;

AnimationFrame.shim();

BG = "black";

W = window.innerWidth;

H = window.innerHeight;

CANVAS = new Canvas("canvas", W, H);

sTime = (new Date()).getTime();

ctx = CANVAS.ctx;

rand = function(range) {
  return Math.floor(Math.random() * range);
};

nodes = (function() {
  var j, results;
  results = [];
  for (n = j = 0; j < 4000; n = ++j) {
    results.push(new Node(rand(W), rand(H), 5, ctx));
  }
  return results;
})();

currentActiveNode = null;

links = (function() {
  var j, len, results;
  results = [];
  for (j = 0, len = nodes.length; j < len; j++) {
    n = nodes[j];
    results.push(new Link(rand(nodes.length), rand(nodes.length)));
  }
  return results;
})();

checkCollisions = function(x, y) {
  var j, len, results;
  if (currentActiveNode == null) {
    results = [];
    for (j = 0, len = nodes.length; j < len; j++) {
      n = nodes[j];
      if (n.checkCollision(x, y)) {
        n.hover = true;
        results.push(currentActiveNode = n);
      } else {
        results.push(n.hover = false);
      }
    }
    return results;
  } else {
    if (!currentActiveNode.checkCollision(x, y)) {
      return currentActiveNode = null;
    }
  }
};

scale = 1;

svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

xform = svg.createSVGMatrix();

transformedPoint = function(x, y) {
  var pt;
  pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(xform.inverse());
};

dragStart = null;

dragScaleFactor = 1.5;

lastX = Math.floor(W / 2);

lastY = Math.floor(H / 2);

mousedown = function(e) {
  lastX = e.clientX - CANVAS.c.offsetLeft;
  lastY = e.clientY - CANVAS.c.offsetTop;
  return dragStart = transformedPoint(lastX, lastY);
};

mouseup = function(e) {
  return dragStart = null;
};

mousemove = function(e) {
  var dX, dY, tPt;
  e.preventDefault();
  tPt = transformedPoint(e.clientX, e.clientY);
  checkCollisions(tPt.x, tPt.y);
  lastX = e.clientX - CANVAS.c.offsetLeft;
  lastY = e.clientY - CANVAS.c.offsetTop;
  if (dragStart != null) {
    tPt = transformedPoint(lastX, lastY);
    dX = (tPt.x - dragStart.x) * dragScaleFactor;
    dY = (tPt.y - dragStart.y) * dragScaleFactor;
    xform = xform.translate(dX, dY);
    return ctx.translate(dX, dY);
  }
};

mousewheel = function(e) {
  var delta, factor, pt, wheel, zoom;
  e.preventDefault();
  wheel = event.wheelDelta / 120;
  zoom = 1 + wheel / 2;
  delta = 0;
  if (e.wheelDelta != null) {
    delta = e.wheelDelta / 120;
  } else {
    if (e.detail != null) {
      delta = -e.detail;
    }
  }
  pt = transformedPoint(lastX, lastY);
  ctx.translate(pt.x, pt.y);
  xform = xform.translate(pt.x, pt.y);
  factor = zoom;
  ctx.scale(factor, factor);
  xform = xform.scaleNonUniform(factor, factor);
  ctx.translate(-pt.x, -pt.y);
  return xform = xform.translate(-pt.x, -pt.y);
};

CANVAS.c.addEventListener("mousedown", mousedown, false);

CANVAS.c.addEventListener("mouseup", mouseup, false);

CANVAS.c.addEventListener("mousemove", mousemove, false);

CANVAS.c.addEventListener("mousewheel", mousewheel, false);

force = d3.layout.force().nodes(nodes).links(links).size([W, H]).linkStrength(0.1).friction(0.9).linkDistance(20).charge(-30).gravity(0.1).theta(4).alpha(0.1).start();

clear = function() {
  var p1, p2;
  ctx.fillStyle = BG;
  p1 = transformedPoint(0, 0);
  p2 = transformedPoint(W, H);
  ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  return ctx.fill();
};

draw = function() {
  var j, k, len, len1, link;
  for (j = 0, len = nodes.length; j < len; j++) {
    n = nodes[j];
    n.draw();
  }
  for (k = 0, len1 = links.length; k < len1; k++) {
    link = links[k];
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
  }
  ctx.strokeStyle = "rgb(100,0,0)";
  return ctx.stroke();
};

update = function() {
  var delta, i, j, k, len, len1, results;
  delta = (new Date()).getTime() - sTime;
  for (i = j = 0, len = nodes.length; j < len; i = ++j) {
    n = nodes[i];
    n.y += Math.sin(delta / (Math.PI * 100)) * (i / 100 + 1);
  }
  results = [];
  for (i = k = 0, len1 = nodes.length; k < len1; i = ++k) {
    n = nodes[i];
    results.push(n.x += Math.sin(delta / (Math.PI * 250)) * (i / 100 + 1));
  }
  return results;
};

render = function() {
  stats.begin();
  clear();
  draw();
  stats.end();
  return requestAnimationFrame(render);
};

render();


},{"./Canvas":1,"./Link":2,"./Node":3}]},{},[1,2,3,4])


//# sourceMappingURL=maps/bundle-coffee.js.map