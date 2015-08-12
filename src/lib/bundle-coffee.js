(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvas;

Canvas = (function() {
  var mousedownHandler, mousemoveHandler, mouseupHandler, mousewheelHandler;

  function Canvas(id, width, height, BG) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.BG = BG;
    this.c = document.createElement("canvas");
    this.c.id = this.id;
    this.c.width = this.width;
    this.c.height = this.height;
    this.c.addEventListener("mousewheel", mousewheelHandler.bind(this), false);
    this.c.addEventListener("mousedown", mousedownHandler.bind(this), false);
    this.c.addEventListener("mouseup", mouseupHandler.bind(this), false);
    this.c.addEventListener("mousemove", mousemoveHandler.bind(this), false);
    document.body.appendChild(this.c);
    this.ctx = document.getElementById(this.id).getContext("2d");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.xform = this.svg.createSVGMatrix();
    this.dragStart = null;
    this.dragScaleFactor = 1.5;
    this.lastX = Math.floor(this.width / 2);
    this.lastY = Math.floor(this.width / 2);
  }

  Canvas.prototype.clear = function() {
    var p1, p2;
    this.ctx.fillStyle = this.BG;
    p1 = this.transformedPoint(0, 0);
    p2 = this.transformedPoint(this.width, this.height);
    this.ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    return this.ctx.fill();
  };

  Canvas.prototype.transformedPoint = function(x, y) {
    var pt;
    pt = this.svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(this.xform.inverse());
  };

  mousedownHandler = function(e) {
    this.lastX = e.clientX - this.c.offsetLeft;
    this.lastY = e.clientY - this.c.offsetTop;
    return this.dragStart = this.transformedPoint(this.lastX, this.lastY);
  };

  mouseupHandler = function(e) {
    return this.dragStart = null;
  };

  mousemoveHandler = function(e) {
    var dX, dY, tPt;
    e.preventDefault();
    this.lastX = e.clientX - this.c.offsetLeft;
    this.lastY = e.clientY - this.c.offsetTop;
    if (this.dragStart != null) {
      tPt = this.transformedPoint(this.lastX, this.lastY);
      dX = (tPt.x - this.dragStart.x) * this.dragScaleFactor;
      dY = (tPt.y - this.dragStart.y) * this.dragScaleFactor;
      this.xform = this.xform.translate(dX, dY);
      return this.ctx.translate(dX, dY);
    }
  };

  mousewheelHandler = function(e) {
    var delta, factor, pt, wheel, zoom;
    e.preventDefault();
    wheel = e.wheelDelta / 120;
    zoom = 1 + wheel / 2;
    delta = 0;
    if (e.wheelDelta != null) {
      delta = e.wheelDelta / 120;
    } else {
      if (e.detail != null) {
        delta = -e.detail;
      }
    }
    factor = zoom;
    pt = this.transformedPoint(this.lastX, this.lastY);
    this.ctx.translate(pt.x, pt.y);
    this.xform = this.xform.translate(pt.x, pt.y);
    this.ctx.scale(factor, factor);
    this.xform = this.xform.scaleNonUniform(factor, factor);
    this.ctx.translate(-pt.x, -pt.y);
    return this.xform = this.xform.translate(-pt.x, -pt.y);
  };

  return Canvas;

})();

module.exports = Canvas;


},{}],2:[function(require,module,exports){
var Link;

Link = (function() {
  var y;

  function Link(attr, ctx) {
    this.attr = attr;
    this.ctx = ctx;
    this.id = this.attr.id;
    this.r = this.attr.r;
    this.source = this.attr.source;
    this.target = this.attr.target;
    this.fluxValue = this.attr.fluxValue;
    this.linkScale = this.attr.linkScale;
    this.thickness = this.linkScale(this.fluxValue);
  }

  y = function(x1, y1, m) {
    return function(x) {
      return m * (x - x1) + y1;
    };
  };

  Link.prototype.setM = function() {
    return this.m = (this.target.y - this.source.y) / (this.target.x - this.source.x);
  };

  Link.prototype.draw = function() {
    var h, lineAngle, sourcex, sourcey, theta;
    lineAngle = Math.atan2(this.target.y - this.source.y, this.target.x - this.source.x);
    h = 10;
    theta = Math.PI / 8;
    this.ctx.beginPath();
    sourcex = this.source.x + this.r * Math.cos(lineAngle);
    sourcey = this.source.y + this.r * Math.sin(lineAngle);
    this.ctx.moveTo(this.target.x, this.target.y);
    this.ctx.lineTo(sourcex, sourcey);
    this.ctx.lineTo(sourcex + h * Math.cos(theta + lineAngle), sourcey + h * Math.sin(theta + lineAngle));
    this.ctx.moveTo(sourcex, sourcey);
    this.ctx.lineTo(sourcex + h * Math.cos(-theta + lineAngle), sourcey + h * Math.sin(-theta + lineAngle));
    this.ctx.lineWidth = this.thickness;
    this.ctx.closePath();
    this.ctx.strokeStyle = "black";
    return this.ctx.stroke();
  };

  return Link;

})();

module.exports = Link;


},{}],3:[function(require,module,exports){
var Metabolite, Node,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

Metabolite = (function(superClass) {
  extend(Metabolite, superClass);

  function Metabolite() {
    return Metabolite.__super__.constructor.apply(this, arguments);
  }

  Metabolite.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = "black";
    if (this.hover) {
      this.ctx.fillStyle = "green";
    }
    return this.ctx.fill();
  };

  return Metabolite;

})(Node);

module.exports = Metabolite;


},{"./Node":4}],4:[function(require,module,exports){
var Node, rand;

rand = function(range) {
  return Math.floor(Math.random() * range);
};

Node = (function() {
  function Node(attr, ctx) {
    this.ctx = ctx;
    this.x = attr.x;
    this.y = attr.y;
    this.r = attr.r;
    this.hover = false;
    this.id = attr.id;
    this.name = attr.name;
    this.type = attr.type;
    this.colour = attr.colour;
    this.flux_value = attr.flux_value;
  }

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


},{}],5:[function(require,module,exports){
var Node, Reaction,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

Reaction = (function(superClass) {
  extend(Reaction, superClass);

  function Reaction() {
    return Reaction.__super__.constructor.apply(this, arguments);
  }

  Reaction.prototype.draw = function() {
    var factor, i, j, k, nos, ref, ref1, size;
    nos = 6;
    size = this.r;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.r * Math.cos(0), this.y + this.r * Math.sin(0));
    for (i = j = 0, ref = nos; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      this.ctx.lineTo(this.x + this.r * Math.cos(i * 2 * Math.PI / nos), this.y + this.r * Math.sin(i * (2 * Math.PI / nos)));
    }
    this.ctx.lineTo(this.x + this.r * Math.cos(0), this.y + this.r * Math.sin(0));
    this.ctx.lineTo(this.x + this.r * Math.cos(1 * 2 * Math.PI / nos), this.y + this.r * Math.sin(1 * (2 * Math.PI / nos)));
    this.ctx.fillStyle = this.colour;
    this.ctx.closePath();
    this.ctx.fill();
    factor = 1.2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + factor * this.r * Math.cos(0), this.y + factor * this.r * Math.sin(0));
    for (i = k = 0, ref1 = nos; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
      this.ctx.lineTo(this.x + factor * this.r * Math.cos(i * 2 * Math.PI / nos), this.y + factor * this.r * Math.sin(i * (2 * Math.PI / nos)));
    }
    this.ctx.lineTo(this.x + factor * this.r * Math.cos(0), this.y + factor * this.r * Math.sin(0));
    this.ctx.lineTo(this.x + factor * this.r * Math.cos(1 * 2 * Math.PI / nos), this.y + factor * this.r * Math.sin(1 * (2 * Math.PI / nos)));
    this.ctx.closePath();
    this.ctx.strokeStyle = this.colour;
    return this.ctx.stroke();
  };

  return Reaction;

})(Node);

module.exports = Reaction;


},{"./Node":4}],6:[function(require,module,exports){
var Canvas, Link, Metabolite, Node, Reaction, System, utilities;

Canvas = require("./Canvas");

Node = require("./Node");

Metabolite = require("./Metabolite");

Reaction = require("./Reaction");

Link = require("./Link");

utilities = require("./utilities");

System = (function() {
  var mousemoveHandler;

  function System(attr) {
    var AnimationFrame, i, len, n, ref;
    this.W = attr.width;
    this.H = attr.height;
    this.BG = attr.backgroundColour;
    this.metaboliteRadius = attr.metaboliteRadius;
    this.useStatic = attr.useStatic;
    this.everything = attr.everything;
    this.currentActiveNode = null;
    this.canvas = new Canvas("canvas", this.W, this.H, this.BG);
    this.canvas.c.addEventListener("mousemove", mousemoveHandler.bind(this), false);
    this.nodes = this.buildMetabolites(data);
    this.links = new Array();
    this.buildReactions(data);
    this.force = d3.layout.force().nodes(this.nodes).links(this.links).size([this.W, this.H]).linkStrength(2).friction(0.9).linkDistance(50).charge(-500).gravity(0.1).theta(0.8).alpha(0.1).start();
    if (this.useStatic) {
      ref = this.nodes;
      for (i = 0, len = ref.length; i < len; i++) {
        n = ref[i];
        this.force.tick();
      }
      this.force.stop();
    }
    AnimationFrame = window.AnimationFrame;
    AnimationFrame.shim();
    this.render();
  }

  System.prototype.checkCollisions = function(x, y) {
    var i, len, node, ref, results;
    if (this.currentActiveNode == null) {
      ref = this.nodes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        if (node.checkCollision(x, y)) {
          node.hover = true;
          results.push(this.currentActiveNode = node);
        } else {
          results.push(node.hover = false);
        }
      }
      return results;
    } else {
      if (!this.currentActiveNode.checkCollision(x, y)) {
        return this.currentActiveNode = null;
      }
    }
  };

  mousemoveHandler = function(e) {
    var tPt;
    e.preventDefault();
    tPt = this.canvas.transformedPoint(e.clientX, e.clientY);
    return this.checkCollisions(tPt.x, tPt.y);
  };

  System.prototype.buildMetabolites = function(model) {
    var i, len, metabolite, nodeAttributes, ref, tempNodes;
    tempNodes = new Array();
    ref = model.metabolites;
    for (i = 0, len = ref.length; i < len; i++) {
      metabolite = ref[i];
      nodeAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: this.metaboliteRadius,
        name: metabolite.name,
        id: metabolite.id,
        type: "m"
      };
      tempNodes.push(new Metabolite(nodeAttributes, this.canvas.ctx));
    }
    return tempNodes;
  };

  System.prototype.buildReactions = function(model) {
    var i, j, k, len, len1, len2, link, linkAttr, metabolite, nodesMap, radiusScale, reaction, reactionAttributes, ref, ref1, results, source, target, tempLinks;
    radiusScale = utilities.scaleRadius(model, 5, 15);
    tempLinks = new Array();
    ref = model.reactions;
    for (i = 0, len = ref.length; i < len; i++) {
      reaction = ref[i];
      if (this.everything || reaction.flux_value > 0) {
        reactionAttributes = {
          x: utilities.rand(this.W),
          y: utilities.rand(this.H),
          r: radiusScale(reaction.flux_value),
          name: reaction.name,
          id: reaction.id,
          type: "r",
          flux_value: reaction.flux_value,
          colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
        };
        this.nodes.push(new Reaction(reactionAttributes, this.canvas.ctx));
        ref1 = Object.keys(reaction.metabolites);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          metabolite = ref1[j];
          source = null;
          target = null;
          if (reaction.metabolites[metabolite] > 0) {
            source = reaction.id;
            target = metabolite;
          } else {
            source = metabolite;
            target = reaction.id;
          }
          link = {
            id: source.id + "-" + target.id,
            source: source,
            target: target,
            flux_value: reaction.flux_value
          };
          tempLinks.push(link);
        }
      }
    }
    nodesMap = utilities.nodeMap(this.nodes);
    results = [];
    for (k = 0, len2 = tempLinks.length; k < len2; k++) {
      link = tempLinks[k];
      linkAttr = {
        id: link.id,
        source: this.nodes[nodesMap[link.source]],
        target: this.nodes[nodesMap[link.target]],
        fluxValue: link.flux_value,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(model, 1, 5)
      };
      results.push(this.links.push(new Link(linkAttr, this.canvas.ctx)));
    }
    return results;
  };

  System.prototype.draw = function() {
    var i, j, len, len1, link, node, ref, ref1, results;
    ref = this.links;
    for (i = 0, len = ref.length; i < len; i++) {
      link = ref[i];
      link.draw();
    }
    ref1 = this.nodes;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      node = ref1[j];
      results.push(node.draw());
    }
    return results;
  };

  System.prototype.render = function() {
    stats.begin();
    this.canvas.clear();
    this.draw();
    stats.end();
    return requestAnimationFrame(this.render.bind(this));
  };

  return System;

})();

module.exports = System;


},{"./Canvas":1,"./Link":2,"./Metabolite":3,"./Node":4,"./Reaction":5,"./utilities":8}],7:[function(require,module,exports){
var System, system, systemAttributes;

System = require("./System");

systemAttributes = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColour: "white",
  metaboliteRadius: 10,
  useStatic: false,
  everything: true
};

system = new System(systemAttributes);


},{"./System":6}],8:[function(require,module,exports){
var nodeMap, rand, scaleRadius;

rand = function(range) {
  return Math.floor(Math.random() * (range + 1));
};

scaleRadius = function(model, minRadius, maxRadius) {
  var fluxes, largest, reaction;
  fluxes = (function() {
    var j, len, ref, results;
    ref = model.reactions;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      reaction = ref[j];
      results.push(reaction.flux_value);
    }
    return results;
  })();
  largest = Math.max.apply(Math, fluxes);
  return d3.scale.linear().domain([0, largest]).range([minRadius, maxRadius]);
};

nodeMap = function(nodes) {
  var i, j, len, map, node;
  map = new Object();
  for (i = j = 0, len = nodes.length; j < len; i = ++j) {
    node = nodes[i];
    map[node.id] = i;
  }
  return map;
};

module.exports = {
  rand: rand,
  scaleRadius: scaleRadius,
  nodeMap: nodeMap
};


},{}]},{},[1,2,3,4,5,6,7,8])


//# sourceMappingURL=maps/bundle-coffee.js.map