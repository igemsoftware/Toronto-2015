(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Compartment, Node,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

Compartment = (function(superClass) {
  extend(Compartment, superClass);

  function Compartment(attr, ctx) {
    this.attr = attr;
    this.ctx = ctx;
    Compartment.__super__.constructor.call(this, this.attr, this.ctx);
    this.type = "Compartment";
  }

  Compartment.prototype.draw = function() {
    if (!this.deleted) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colour;
      if (this.hover) {
        this.ctx.fillStyle = "green";
      }
      return this.ctx.fill();
    }
  };

  return Compartment;

})(Node);

module.exports = Compartment;


},{"./Node":5}],2:[function(require,module,exports){
var Graph, Link, Metabolite, Reaction, utilities;

utilities = require("./utilities");

Metabolite = require("./Metabolite");

Reaction = require("./Reaction");

Link = require("./Link");

Graph = (function() {
  function Graph(id, outNeighbours, inNeighbours) {
    this.id = id;
    this.outNeighbours = outNeighbours;
    this.inNeighbours = inNeighbours;
    this.value = null;
  }

  return Graph;

})();

module.exports = Graph;


},{"./Link":3,"./Metabolite":4,"./Reaction":6,"./utilities":12}],3:[function(require,module,exports){
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
    this.appendSubstratesAndProducts();
  }

  Link.prototype.appendSubstratesAndProducts = function() {
    if (this.source.type === 'm' && this.target.type === 'r') {
      this.source.outNeighbours.push(this.target);
      return this.target.substrates.push(this.source);
    } else if (this.source.type === 'r' && this.target.type === 'm') {
      this.target.inNeighbours.push(this.source);
      return this.source.products.push(this.target);
    } else if (this.target.type === 'r' && this.source.type === 'Compartment') {
      return this.source.products.push(this.target);
    } else if (this.source.type === 'r' && this.target.type === 'Compartment') {
      this.target.inNeighbours.push(this.source);
      return this.r = this.target.r;
    }
  };

  y = function(x1, y1, m) {
    return function(x) {
      return m * (x - x1) + y1;
    };
  };

  Link.prototype.setM = function() {
    return this.m = (this.target.y - this.source.y) / (this.target.x - this.source.x);
  };

  Link.prototype.draw = function() {
    var h, lineAngle, targetx, targety, theta;
    if (!this.target.deleted && !this.source.deleted) {
      lineAngle = Math.atan2(this.target.y - this.source.y, this.target.x - this.source.x) + Math.PI;
      h = 10;
      theta = Math.PI / 8;
      this.ctx.beginPath();
      targetx = this.target.x + this.r * Math.cos(lineAngle);
      targety = this.target.y + this.r * Math.sin(lineAngle);
      this.ctx.moveTo(this.source.x, this.source.y);
      this.ctx.lineTo(targetx, targety);
      this.ctx.lineTo(targetx + h * Math.cos(theta + lineAngle), targety + h * Math.sin(theta + lineAngle));
      this.ctx.moveTo(targetx, targety);
      this.ctx.lineTo(targetx + h * Math.cos(-theta + lineAngle), targety + h * Math.sin(-theta + lineAngle));
      this.ctx.lineWidth = this.thickness;
      this.ctx.closePath();
      this.ctx.strokeStyle = "black";
      return this.ctx.stroke();
    }
  };

  return Link;

})();

module.exports = Link;


},{}],4:[function(require,module,exports){
var Metabolite, Node,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

Metabolite = (function(superClass) {
  extend(Metabolite, superClass);

  function Metabolite(attr, ctx) {
    this.ctx = ctx;
    Metabolite.__super__.constructor.call(this, attr, this.ctx);
    this.specie = attr.specie;
  }

  Metabolite.prototype.draw = function() {
    if (!this.deleted) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fillStyle = "black";
      if (this.hover) {
        this.ctx.fillStyle = "green";
      }
      return this.ctx.fill();
    }
  };

  return Metabolite;

})(Node);

module.exports = Metabolite;


},{"./Node":5}],5:[function(require,module,exports){
var Node, rand;

rand = function(range) {
  return Math.floor(Math.random() * range);
};

Node = (function() {
  function Node(attr, ctx) {
    this.ctx = ctx;
    if (attr == null) {
      console.log(attr);
    }
    this.x = attr.x;
    this.y = attr.y;
    this.r = attr.r;
    this.hover = false;
    this.id = attr.id;
    this.name = attr.name;
    this.type = attr.type;
    this.colour = attr.colour;
    this.keepStatic = false;
    this.compartment = this.id.split('_')[this.id.split('_').length - 1];
    this.substrates = this.inNeighbours = new Array();
    this.products = this.outNeighbours = new Array();
    this.deleted = false;
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


},{}],6:[function(require,module,exports){
var Node, Reaction,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

Reaction = (function(superClass) {
  extend(Reaction, superClass);

  function Reaction(attr) {
    Reaction.__super__.constructor.call(this, attr);
    this.substrateCompartments = new Array();
    this.productCompartments = new Array();
    this.links = new Array();
  }

  Reaction.prototype.addLink = function(link) {
    this.links.push(link);
    if (link.source.type === 'r') {
      if (this.productCompartments.indexOf(link.target.compartment) === -1) {
        return this.productCompartments.push(link.target.compartment);
      }
    } else if (link.target.type === 'r') {
      if (this.substrateCompartments.indexOf(link.source.compartment) === -1) {
        return this.substrateCompartments.push(link.source.compartment);
      }
    }
  };

  return Reaction;

})(Node);

module.exports = Reaction;


},{"./Node":5}],7:[function(require,module,exports){
var Node, ReactionNode,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

ReactionNode = (function(superClass) {
  extend(ReactionNode, superClass);

  function ReactionNode(attr, ctx) {
    this.ctx = ctx;
    ReactionNode.__super__.constructor.call(this, attr, this.ctx);
  }

  ReactionNode.prototype.draw = function() {
    var factor, i, j, k, nos, ref, ref1, size;
    if (!this.deleted) {
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
    }
  };

  return ReactionNode;

})(Node);

module.exports = ReactionNode;


},{"./Node":5}],8:[function(require,module,exports){
var Compartment, Graph, Link, Metabolite, Node, Reaction, ReactionNode, Subsystem, ViewController, utilities;

ViewController = require("./ViewController");

Node = require("./Node");

Compartment = require("./Compartment");

Metabolite = require("./Metabolite");

Reaction = require("./Reaction");

Link = require("./Link");

utilities = require("./utilities");

Graph = require("./Graph");

ReactionNode = require("./ReactionNode");

Subsystem = (function() {
  function Subsystem(attr, graph1) {
    var compartment;
    this.graph = graph1;
    this.ctx = attr.ctx;
    this.W = attr.width;
    this.H = attr.height;
    this.BG = attr.backgroundColour;
    this.metaboliteRadius = attr.metaboliteRadius;
    this.useStatic = attr.useStatic;
    this.everything = attr.everything;
    this.hideObjective = attr.hideObjective;
    this.force = null;
    this.currentActiveNode = null;
    this.compartments = new Object();
    this.reactions = new Object();
    this.nodes = new Array();
    this.links = new Array();
    this.radiusScale = utilities.scaleRadius(null, 5, 15);
    for (compartment in this.graph.outNeighbours) {
      this.buildCompartments(this.graph.outNeighbours[compartment]);
    }
    for (compartment in this.graph.outNeighbours) {
      this.buildNodesAndLinks(this.graph.outNeighbours[compartment]);
    }
    this.initalizeForce();
    console.log(this.nodes);
  }

  Subsystem.prototype.createLeaf = function(graph) {
    var inNeighbour, outNeighbour, reactionNode, results;
    results = [];
    for (inNeighbour in graph.inNeighbours) {
      results.push((function() {
        var results1;
        results1 = [];
        for (outNeighbour in graph.outNeighbours) {
          if (inNeighbour !== outNeighbour) {
            reactionNode = this.createReaction(graph.value);
            results1.push(this.createLinks(inNeighbour, reactionNode, outNeighbour));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Subsystem.prototype.createLinks = function(s1, reactionNode, s2) {
    var link, source, target;
    source = this.compartments[s1];
    target = reactionNode;
    link = {
      id: source.name + "-" + target.name,
      source: source,
      target: target,
      flux_value: reactionNode.flux_value,
      r: this.metaboliteRadius,
      linkScale: utilities.scaleRadius(null, 1, 5)
    };
    this.links.push(new Link(link, this.ctx));
    source = reactionNode;
    target = this.compartments[s2];
    link = {
      id: source.name + "-" + target.name,
      source: source,
      target: target,
      flux_value: reactionNode.flux_value,
      r: this.metaboliteRadius,
      linkScale: utilities.scaleRadius(null, 1, 5)
    };
    return this.links.push(new Link(link, this.ctx));
  };

  Subsystem.prototype.createReaction = function(reaction) {
    var inNeighbour, j, k, len, len1, outNeighbour, r, reactionAttributes, ref, ref1;
    r = this.reactions[reaction.id];
    if (r == null) {
      reactionAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: this.radiusScale(reaction.flux_value),
        name: reaction.name,
        id: reaction.id,
        type: "r",
        flux_value: reaction.flux_value,
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      r = new ReactionNode(reactionAttributes, this.ctx);
      this.reactions[reaction.id] = r;
      ref = reaction.inNeighbours;
      for (j = 0, len = ref.length; j < len; j++) {
        inNeighbour = ref[j];
        r.inNeighbours.push(inNeighbour.name);
      }
      ref1 = reaction.outNeighbours;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        outNeighbour = ref1[k];
        r.outNeighbours.push(outNeighbour.name);
      }
      this.nodes.push(r);
    }
    return r;
  };

  Subsystem.prototype.buildNodesAndLinks = function(graph) {
    var compartment, results;
    if ((graph.value != null) && graph.value.type === "r") {
      return this.createLeaf(graph);
    } else {
      results = [];
      for (compartment in graph.outNeighbours) {
        results.push(this.buildNodesAndLinks(graph.outNeighbours[compartment]));
      }
      return results;
    }
  };

  Subsystem.prototype.buildCompartments = function(graph) {
    var c, compartment, nodeAttributes, results;
    if ((graph.value != null) && graph.value.type === "r") {

    } else {
      nodeAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: 150,
        name: graph.id,
        id: graph.id,
        type: "s",
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      c = new Compartment(nodeAttributes, this.ctx);
      this.compartments[graph.id] = c;
      this.nodes.push(c);
      results = [];
      for (compartment in graph.outNeighbours) {
        results.push(this.buildCompartments(graph.outNeighbours[compartment]));
      }
      return results;
    }
  };

  Subsystem.prototype.addMetabolite = function(id, name, type, ctx) {
    var metabolite, nodeAttributes;
    nodeAttributes = {
      x: utilities.rand(this.W),
      y: utilities.rand(this.H),
      r: this.metaboliteRadius,
      name: name,
      id: id,
      type: type
    };
    metabolite = new Metabolite(nodeAttributes, ctx);
    this.viewController.updateOptions(name, id);
    return this.nodes.push(metabolite);
  };

  Subsystem.prototype.linkDistanceHandler = function(link, i) {
    var factor;
    factor = 0;
    if (link.target.type === 'r') {
      factor = link.target.substrates.length;
    } else if (link.source.type === 'r') {
      factor = link.source.products.length;
    }
    return factor * 100;
  };

  Subsystem.prototype.chargeHandler = function(node, i) {
    var factor;
    factor = node.inNeighbours.length + node.outNeighbours.length + 1;
    factor = node.r * 2;
    return factor * -800;
  };

  Subsystem.prototype.initalizeForce = function() {
    var j, len, n, ref;
    this.force = d3.layout.force().nodes(this.nodes).links(this.links).size([this.W, this.H]).linkStrength(2).friction(0.9).linkDistance(this.linkDistanceHandler).charge(this.chargeHandler).gravity(0.1).theta(0.8).alpha(0.1);
    if (this.useStatic) {
      ref = this.nodes;
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        this.force.tick();
      }
      return this.force.stop();
    }
  };

  Subsystem.prototype.checkCollisions = function(x, y) {
    var j, len, node, nodeReturn, ref;
    nodeReturn = null;
    ref = this.nodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.checkCollision(x, y)) {
        nodeReturn = node;
        node.hover = true;
        break;
      } else {
        node.hover = false;
      }
    }
    return nodeReturn;
  };

  Subsystem.prototype.deleteNode = function(node) {
    var inNeighbour, j, k, len, len1, nodeIndex, outNeighbour, ref, ref1;
    this.exclusions.push(node);
    node.deleted = true;
    ref = node.inNeighbours;
    for (j = 0, len = ref.length; j < len; j++) {
      inNeighbour = ref[j];
      nodeIndex = inNeighbour.outNeighbours.indexOf(node);
      inNeighbour.outNeighbours.splice(nodeIndex, 1);
    }
    ref1 = node.outNeighbours;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      outNeighbour = ref1[k];
      nodeIndex = outNeighbour.inNeighbours.indexOf(node);
      outNeighbour.inNeighbours.splice(nodeIndex, 1);
    }
    return this.viewController.removeOption(node);
  };

  Subsystem.prototype.addReaction = function(source, target, name, ctx) {
    var j, len, linkAttr, node, reaction, reactionAttributes, ref, src, tgt;
    ref = this.nodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.id === source.id && node.name === node.name) {
        src = node;
      } else if (node.id === target.id && node.name === node.name) {
        tgt = node;
      }
    }
    if ((src == null) || (tgt == null)) {
      return alert("No self linking!");
    } else if (src.type === "r" && tgt.type === "m" || src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: 0,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return this.links.push(new Link(linkAttr, ctx));
    } else if (src.type === "m" && tgt.type === "m") {
      reactionAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: 5,
        name: name,
        id: name,
        type: "r",
        flux_value: 0,
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      reaction = new Reaction(reactionAttributes, ctx);
      this.nodes.push(reaction);
      linkAttr = {
        id: source.id + "-" + reaction.id,
        source: src,
        target: reaction,
        fluxValue: 0,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      this.links.push(new Link(linkAttr, ctx));
      linkAttr = {
        id: reaction.id + "-" + target.id,
        source: reaction,
        target: tgt,
        fluxValue: 0,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return this.links.push(new Link(linkAttr, ctx));
    } else {
      return alert("Invalid linkage");
    }
  };

  return Subsystem;

})();

module.exports = Subsystem;


},{"./Compartment":1,"./Graph":2,"./Link":3,"./Metabolite":4,"./Node":5,"./Reaction":6,"./ReactionNode":7,"./ViewController":10,"./utilities":12}],9:[function(require,module,exports){
var Compartment, Graph, Link, Metabolite, Node, Reaction, Subsystem, System, ViewController, utilities;

Subsystem = require("./Subsystem");

ViewController = require("./ViewController");

Node = require("./Node");

Compartment = require("./Compartment");

Metabolite = require("./Metabolite");

Reaction = require("./Reaction");

Link = require("./Link");

Graph = require('./Graph');

utilities = require("./utilities");

System = (function() {
  function System(attr, data) {
    this.attr = attr;
    this.data = data;
    this.viewController = new ViewController("canvas", this.attr.width, this.attr.height, this.attr.backgroundColour, null);
    this.attr.ctx = this.viewController.ctx;
    this.ctx = this.viewController.ctx;
    this.everything = this.attr.everything;
    this.hideObjective = this.attr.hideObjective;
    this.graph = this.buildGraph(this.data, 'root', 'compartment');
    this.subsystems = new Object();
    this.subsystems["ecoli"] = new Subsystem(this.attr, this.graph);
    this.viewController.startCanvas(this.subsystems["ecoli"]);
  }

  System.prototype.buildGraph = function(model, graphId, sorter) {
    var _cpt, counter, cpt, graph, j, k, l, leaf, len, len1, len2, len3, len4, len5, m, metabolite, metaboliteId, metabolites, o, p, potentialLeaf, r, reaction, reactions, ref, ref1, ref2, ref3, ref4, ref5, source, target;
    counter = 0;
    graph = new Graph(graphId, new Object(), new Object());
    metabolites = new Object();
    reactions = new Object();
    ref = model.metabolites;
    for (j = 0, len = ref.length; j < len; j++) {
      metabolite = ref[j];
      metabolite = this.createMetabolite(metabolite.name, metabolite.id, false, this.ctx);
      metabolites[metabolite.id] = metabolite;
      if (graph.outNeighbours[metabolite[sorter]] == null) {
        graph.outNeighbours[metabolite[sorter]] = new Graph(metabolite[sorter], new Object(), new Object());
      }
    }
    ref1 = model.reactions;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      reaction = ref1[k];
      if ((!this.everything && reaction.flux_value === 0) || (this.hideObjective && reaction.name.indexOf('objective function') !== -1)) {
        continue;
      }
      reactions[reaction.id] = this.createReaction(reaction.name, reaction.id, 9001, 0, this.ctx);
      r = reactions[reaction.id];
      for (metaboliteId in reaction.metabolites) {
        if (reaction.metabolites[metaboliteId] > 0) {
          source = reaction.id;
          target = metaboliteId;
          r.addLink(this.createLink(reactions[source], metabolites[target], reaction.name, reactions.flux, this.ctx));
        } else {
          source = metaboliteId;
          target = reaction.id;
          r.addLink(this.createLink(metabolites[source], reactions[target], reaction.name, reactions.flux, this.ctx));
        }
      }
      ref2 = r.substrateCompartments;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        cpt = ref2[l];
        leaf = null;
        ref3 = r.substrateCompartments;
        for (m = 0, len3 = ref3.length; m < len3; m++) {
          _cpt = ref3[m];
          potentialLeaf = graph.outNeighbours[_cpt].outNeighbours[reaction.id];
          if (potentialLeaf != null) {
            leaf = potentialLeaf;
          }
        }
        if (leaf == null) {
          leaf = new Graph(r.id, new Object(), new Object());
          counter++;
          leaf.value = r;
        }
        leaf.inNeighbours[cpt] = graph.outNeighbours[cpt];
        graph.outNeighbours[cpt].outNeighbours[reaction.id] = leaf;
      }
      ref4 = r.productCompartments;
      for (o = 0, len4 = ref4.length; o < len4; o++) {
        cpt = ref4[o];
        leaf = null;
        ref5 = r.substrateCompartments;
        for (p = 0, len5 = ref5.length; p < len5; p++) {
          _cpt = ref5[p];
          potentialLeaf = graph.outNeighbours[_cpt].outNeighbours[reaction.id];
          if (potentialLeaf != null) {
            leaf = potentialLeaf;
          }
        }
        if (leaf == null) {
          leaf = new Graph(r.id, new Object(), new Object());
          leaf.value = r;
          counter++;
        }
        leaf.outNeighbours[cpt] = graph.outNeighbours[cpt];
        graph.outNeighbours[cpt].inNeighbours[leaf.id] = leaf;
      }
      if (r.outNeighbours.length === 0) {
        leaf.outNeighbours["e"] = graph.outNeighbours["e"];
        graph.outNeighbours["e"].inNeighbours[leaf.id] = leaf;
      }
    }
    return graph;
  };

  System.prototype.compartmentalize = function() {
    var compartmentType, j, len, link, links, metabolite, nameMappings, nodes, ref, ref1, results, subgraph, subgraphType, subgraphTypes;
    subgraphTypes = new Object();
    ref = this.buildReactionsAndMetabolites(this.data), nodes = ref[0], links = ref[1];
    ref1 = this.data.metabolites;
    for (j = 0, len = ref1.length; j < len; j++) {
      metabolite = ref1[j];
      compartmentType = metabolite.id.split('_')[metabolite.id.split('_').length - 1];
      if ((subgraphTypes[compartmentType] == null) && compartmentType !== 'e') {
        subgraphTypes[compartmentType] = new Object();
      }
    }
    results = [];
    for (subgraphType in subgraphTypes) {
      nameMappings = {
        c: 'cytosol',
        p: 'periplasm'
      };
      subgraph = this.createMetabolite(nameMappings[subgraphType], subgraphType, false, this.ctx);
      subgraph.r = 50;
      this.nodes.push(subgraph);
      results.push((function() {
        var k, len1, results1;
        results1 = [];
        for (k = 0, len1 = links.length; k < len1; k++) {
          link = links[k];
          if (link.source.type === 'm') {
            if (link.source.compartment === subgraphType) {
              link.source = subgraph;
              this.nodes.push(link.target);
              results1.push(this.links.push(link));
            } else {
              results1.push(void 0);
            }
          } else if (link.source.type === 'r') {
            results1.push(console.log('links'));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  System.prototype.buildReactionsAndMetabolites = function(model) {
    var j, k, l, len, len1, len2, len3, link, linkAttr, links, m, metabolite, nodes, nodesMap, radiusScale, reaction, ref, ref1, ref2, source, target, tempLinks;
    nodes = new Array();
    links = new Array();
    ref = model.metabolites;
    for (j = 0, len = ref.length; j < len; j++) {
      metabolite = ref[j];
      nodes.push(this.createMetabolite(metabolite.name, metabolite.id, false, this.ctx));
    }
    radiusScale = utilities.scaleRadius(model, 5, 15);
    tempLinks = new Array();
    ref1 = model.reactions;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      reaction = ref1[k];
      if (this.hideObjective && reaction.name.indexOf('objective function') !== -1) {
        continue;
      } else if (this.everything || reaction.flux_value > 0) {
        nodes.push(this.createReaction(reaction.name, reaction.id, radiusScale(reaction.flux_value), reaction.flux_value, this.ctx));
        ref2 = Object.keys(reaction.metabolites);
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          metabolite = ref2[l];
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
            id: source + "-" + target,
            source: source,
            target: target,
            flux_value: reaction.flux_value
          };
          tempLinks.push(link);
        }
      }
    }
    nodesMap = utilities.nodeMap(nodes);
    for (m = 0, len3 = tempLinks.length; m < len3; m++) {
      link = tempLinks[m];
      linkAttr = {
        id: link.id,
        source: nodes[nodesMap[link.source]],
        target: nodes[nodesMap[link.target]],
        fluxValue: link.flux_value,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(model, 1, 5)
      };
      links.push(new Link(linkAttr, this.ctx));
    }
    return [nodes, links];
  };

  System.prototype.createReaction = function(name, id, radius, flux, ctx) {
    var reactionAttributes;
    reactionAttributes = {
      x: utilities.rand(this.W),
      y: utilities.rand(this.H),
      r: 5,
      name: name,
      id: id,
      type: "r",
      flux_value: flux,
      colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
    };
    return new Reaction(reactionAttributes, ctx);
  };

  System.prototype.createMetabolite = function(name, id, updateOption, ctx) {
    var metabolite, nodeAttributes;
    nodeAttributes = {
      x: utilities.rand(this.W),
      y: utilities.rand(this.H),
      r: this.metaboliteRadius,
      name: name,
      id: id,
      type: "m"
    };
    metabolite = new Metabolite(nodeAttributes, ctx);
    if (updateOption) {
      this.viewController.updateOptions(name, id);
    }
    return metabolite;
  };

  System.prototype.linkDistanceHandler = function(link, i) {
    var factor;
    factor = 0;
    if (link.target.type === 'r') {
      factor = link.target.substrates.length;
    } else if (link.source.type === 'r') {
      factor = link.source.products.length;
    }
    return factor * 100;
  };

  System.prototype.chargeHandler = function(node, i) {
    var factor;
    factor = node.inNeighbours.length + node.outNeighbours.length + 1;
    return factor * -100;
  };

  System.prototype.initalizeForce = function() {
    var j, len, n, ref;
    this.force = d3.layout.force().nodes(this.nodes).links(this.links).size([this.W, this.H]).linkStrength(2).friction(0.9).linkDistance(this.linkDistanceHandler).charge(this.chargeHandler).gravity(0.1).theta(0.8).alpha(0.1);
    if (this.useStatic) {
      ref = this.nodes;
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        this.force.tick();
      }
      return this.force.stop();
    }
  };

  System.prototype.checkCollisions = function(x, y) {
    var j, len, node, nodeReturn, ref;
    nodeReturn = null;
    ref = this.nodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.checkCollision(x, y)) {
        nodeReturn = node;
        node.hover = true;
        break;
      } else {
        node.hover = false;
      }
    }
    return nodeReturn;
  };

  System.prototype.deleteNode = function(node) {
    var inNeighbour, j, k, len, len1, nodeIndex, outNeighbour, ref, ref1;
    this.exclusions.push(node);
    node.deleted = true;
    ref = node.inNeighbours;
    for (j = 0, len = ref.length; j < len; j++) {
      inNeighbour = ref[j];
      nodeIndex = inNeighbour.outNeighbours.indexOf(node);
      inNeighbour.outNeighbours.splice(nodeIndex, 1);
    }
    ref1 = node.outNeighbours;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      outNeighbour = ref1[k];
      nodeIndex = outNeighbour.inNeighbours.indexOf(node);
      outNeighbour.inNeighbours.splice(nodeIndex, 1);
    }
    return this.viewController.removeOption(node);
  };

  System.prototype.addLink = function(source, target, name, flux, ctx) {
    var j, len, linkAttr, node, reaction, reactionAttributes, ref, src, tgt;
    ref = this.nodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.id === source.id && node.name === node.name) {
        src = node;
      } else if (node.id === target.id && node.name === node.name) {
        tgt = node;
      }
    }
    if ((src == null) || (tgt == null)) {
      return alert("No self linking!");
    } else if (src.type === "r" && tgt.type === "m" || src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return this.links.push(new Link(linkAttr, ctx));
    } else if (src.type === "m" && tgt.type === "m") {
      reactionAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: this.metaboliteRadius,
        name: name,
        id: name,
        type: "r",
        flux_value: flux,
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      reaction = new Reaction(reactionAttributes, ctx);
      this.nodes.push(reaction);
      linkAttr = {
        id: source.id + "-" + reaction.id,
        source: src,
        target: reaction,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      this.links.push(new Link(linkAttr, ctx));
      linkAttr = {
        id: reaction.id + "-" + target.id,
        source: reaction,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return this.links.push(new Link(linkAttr, ctx));
    } else {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return this.links.push(new Link(linkAttr, ctx));
    }
  };

  System.prototype.createLink = function(src, tgt, name, flux, ctx) {
    var linkAttr;
    if (src.type === "r" && tgt.type === "m") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return new Link(linkAttr, ctx);
    } else if (src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return new Link(linkAttr, ctx);
    } else {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: flux,
        r: this.metaboliteRadius,
        linkScale: utilities.scaleRadius(null, 1, 5)
      };
      return new Link(linkAttr, ctx);
    }
  };

  return System;

})();

window.FBA = {
  System: System
};

module.exports = System;


},{"./Compartment":1,"./Graph":2,"./Link":3,"./Metabolite":4,"./Node":5,"./Reaction":6,"./Subsystem":8,"./ViewController":10,"./utilities":12}],10:[function(require,module,exports){
var ViewController;

ViewController = (function() {
  var mousedownHandler, mousemoveHandler, mouseupHandler, mousewheelHandler;

  function ViewController(id1, width, height, BG, system) {
    this.id = id1;
    this.width = width;
    this.height = height;
    this.BG = BG;
    this.c = document.createElement("canvas");
    this.activeGraph = system;
    this.network = system;
    this.c.id = this.id;
    this.c.width = this.width;
    this.c.height = this.height;
    this.currentActiveNode = null;
    this.isDraggingNode = false;
    this.clientX = 0;
    this.clientY = 0;
    document.body.appendChild(this.c);
    this.ctx = document.getElementById(this.id).getContext("2d");
    this.nodetext = $('#nodetext');
  }

  ViewController.prototype.startCanvas = function(graph) {
    var that;
    this.activeGraph = graph;
    $(this.id).css({
      "-moz-user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "-o-user-select": "none",
      "unselectable": "on"
    });
    that = this;
    $('#addMetabolite').click(function() {
      return that.activeGraph.nodes.push(that.activeGraph.createMetabolite($('#metab_name').val().trim(), $('#metab_id').val().trim(), true, that.ctx));
    });
    $("#addReaction").click(function() {
      var source, target;
      source = {
        id: $('#source').val().trim(),
        name: $('#source :selected').text()
      };
      target = {
        id: $('#target').val().trim(),
        name: $('#target :selected').text()
      };
      return that.activeGraph.addLink(source, target, $("#reaction_name").val(), 0, that.ctx);
    });
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.xform = this.svg.createSVGMatrix();
    this.dragStart = null;
    this.dragScaleFactor = 1.5;
    this.lastX = Math.floor(this.width / 2);
    this.lastY = Math.floor(this.width / 2);
    this.activeGraph.force.start();
    this.c.addEventListener("mousewheel", mousewheelHandler.bind(this), false);
    this.c.addEventListener("mousedown", mousedownHandler.bind(this), false);
    this.c.addEventListener("mouseup", mouseupHandler.bind(this), false);
    this.c.addEventListener("mousemove", mousemoveHandler.bind(this), false);
    return this.startAnimate();
  };

  ViewController.prototype.populateOptions = function(nodes) {
    var i, len, node, results, source, target;
    $("#source").html("");
    $("#target").html("");
    source = d3.select("#source");
    target = d3.select("#target");
    results = [];
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      source.append("option").attr("value", node.id).text(node.name);
      results.push(target.append("option").attr("value", node.id).text(node.name));
    }
    return results;
  };

  ViewController.prototype.updateOptions = function(name, id) {
    d3.select("#source").append("option").attr("value", id).text(name);
    return d3.select("#target").append("option").attr("value", id).text(name);
  };

  ViewController.prototype.removeOption = function(node) {
    d3.select("#source").selectAll("option")[0].forEach(function(d) {
      if ($(d).val() === node.id && $(d).text() === node.name) {
        return $(d).remove();
      }
    });
    d3.select("#target").selectAll("option")[0].forEach(function(d) {
      if ($(d).val() === node.id && $(d).text() === node.name) {
        return $(d).remove();
      }
    });
    return $('#nodetext').removeClass('showing');
  };

  ViewController.prototype.transformedPoint = function(x, y) {
    var pt;
    pt = this.svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(this.xform.inverse());
  };

  mousedownHandler = function(e) {
    var tPt;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.lastX = e.clientX - this.c.offsetLeft;
    this.lastY = e.clientY - this.c.offsetTop;
    tPt = this.transformedPoint(e.clientX, e.clientY);
    this.activeGraph.checkCollisions(tPt.x, tPt.y);
    if (this.currentActiveNode == null) {
      return this.dragStart = this.transformedPoint(this.lastX, this.lastY);
    } else {
      $('#nodetext').removeClass('showing');
      return this.isDraggingNode = true;
    }
  };

  mousemoveHandler = function(e) {
    var clientX, clientY, dX, dY, tPt;
    e.preventDefault();
    clientX = e.clientX;
    clientY = e.clientY;
    this.lastX = e.clientX - this.c.offsetLeft;
    this.lastY = e.clientY - this.c.offsetTop;
    tPt = this.transformedPoint(this.lastX, this.lastY);
    if ((this.dragStart != null) && !this.isDraggingNode) {
      dX = (tPt.x - this.dragStart.x) * this.dragScaleFactor;
      dY = (tPt.y - this.dragStart.y) * this.dragScaleFactor;
      this.xform = this.xform.translate(dX, dY);
      return this.ctx.translate(dX, dY);
    } else if (this.isDraggingNode) {
      this.currentActiveNode.x = tPt.x;
      return this.currentActiveNode.y = tPt.y;
    } else {
      this.currentActiveNode = this.activeGraph.checkCollisions(tPt.x, tPt.y);
      if (this.currentActiveNode != null) {
        return this.appendText(this.currentActiveNode, e);
      } else {
        return $('#nodetext').removeClass('showing');
      }
    }
  };

  mouseupHandler = function(e) {
    e.preventDefault();
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.dragStart = null;
    this.isDraggingNode = false;
    return this.currentActiveNode = null;
  };

  mousewheelHandler = function(e) {
    var delta, factor, i, len, pt, ref, specie, wheel, zoom;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
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
    if (this.activeGraph === this.network) {
      ref = this.network.species;
      for (i = 0, len = ref.length; i < len; i++) {
        specie = ref[i];
        if (specie.checkCollision(pt.x, pt.y)) {
          if (specie.r * this.xform.a >= this.c.width && specie.r * this.xform.a >= this.c.height) {
            this.network.enterSpecie(specie);
          }
        }
      }
    } else {
      if (this.xform.a <= 0.02) {
        this.network.exitSpecie();
      }
    }
    this.ctx.translate(-pt.x, -pt.y);
    return this.xform = this.xform.translate(-pt.x, -pt.y);
  };

  ViewController.prototype.tick = function() {
    var tPt;
    if ((this.currentActiveNode != null) && this.isDraggingNode) {
      tPt = this.canvas.transformedPoint(this.clientX, this.clientY);
      this.currentActiveNode.x = tPt.x;
      return this.currentActiveNode.y = tPt.y;
    }
  };

  ViewController.prototype.appendText = function(node, e) {
    var product, products, substrate, substrates, that;
    this.nodetext.addClass('showing');
    this.nodetext.css({
      'left': e.clientX,
      'top': e.clientY
    });
    that = this;
    if (node.type === 'r') {
      substrates = (function() {
        var i, len, ref, results;
        ref = node.inNeighbours;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          substrate = ref[i];
          results.push(substrate);
        }
        return results;
      })();
      products = (function() {
        var i, len, ref, results;
        ref = node.outNeighbours;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          product = ref[i];
          results.push(product);
        }
        return results;
      })();
      this.nodetext.html(substrates + " --- (" + node.name + ") ---> " + products + "<br>");
      this.nodetext.append("<button id='delete'>Delete Reaction</button><br>");
    } else {
      this.nodetext.html(node.name + "<br>");
      this.nodetext.append("<button id='delete'>Delete Node</button><br>");
      if (node.type === 's') {
        this.nodetext.append("<button id='enter'>Enter Specie</button><br>");
        $("#enter").click(function() {
          return that.network.enterSpecie(node);
        });
      }
    }
    if (this.network !== this.activeGraph) {
      this.nodetext.append("<button id='network'>Return to network</button><br>");
      $("#network").click(function() {
        return that.network.exitSpecie();
      });
    }
    return $("#delete").click(function() {
      return that.system.deleteNode(node);
    });
  };

  ViewController.prototype.setActiveGraph = function(graph) {
    var scale;
    this.activeGraph.force.stop();
    this.activeGraph = graph;
    this.nodes = this.activeGraph.nodes;
    this.links = this.activeGraph.links;
    this.xform = this.svg.createSVGMatrix();
    scale = 0.25;
    if (this.network === this.activeGraph) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
      this.xform.a = scale;
      this.xform.d = scale;
    }
    this.populateOptions(this.activeGraph.nodes);
    this.activeGraph.initalizeForce();
    this.activeGraph.force.on("tick", this.tick.bind(this)).start();
    return this.activeGraph.force.resume();
  };

  ViewController.prototype.startAnimate = function() {
    var AnimationFrame;
    AnimationFrame = window.AnimationFrame;
    AnimationFrame.shim();
    return this.render();
  };

  ViewController.prototype.clear = function() {
    var p1, p2;
    this.ctx.fillStyle = this.BG;
    p1 = this.transformedPoint(0, 0);
    p2 = this.transformedPoint(this.width, this.height);
    this.ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    return this.ctx.fill();
  };

  ViewController.prototype.draw = function() {
    var i, j, len, len1, link, node, ref, ref1, results;
    ref = this.activeGraph.links;
    for (i = 0, len = ref.length; i < len; i++) {
      link = ref[i];
      link.draw();
    }
    ref1 = this.activeGraph.nodes;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      node = ref1[j];
      results.push(node.draw());
    }
    return results;
  };

  ViewController.prototype.render = function() {
    stats.begin();
    this.clear();
    this.draw();
    stats.end();
    return requestAnimationFrame(this.render.bind(this));
  };

  return ViewController;

})();

module.exports = ViewController;


},{}],11:[function(require,module,exports){
var Subsystem, System, network, systemAttributes;

System = require("./System");

Subsystem = require("./Subsystem");

systemAttributes = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColour: "white",
  metaboliteRadius: 10,
  useStatic: false,
  everything: false,
  hideObjective: true
};

network = new System(systemAttributes, data);


},{"./Subsystem":8,"./System":9}],12:[function(require,module,exports){
var nodeMap, rand, scaleRadius;

rand = function(range) {
  return Math.floor(Math.random() * (range + 1));
};

scaleRadius = function(model, minRadius, maxRadius) {
  var fluxes, largest, reaction;
  largest = 1;
  if (model) {
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
  }
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


},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12])


//# sourceMappingURL=maps/bundle-coffee.js.map