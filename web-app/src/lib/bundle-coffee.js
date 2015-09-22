(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Compartment, Node, stringToColour,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

stringToColour = require('./utilities').stringToColour;

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
      this.ctx.fillStyle = stringToColour(this.name);
      if (this.hover) {
        this.ctx.fillStyle = "green";
      }
      return this.ctx.fill();
    }
  };

  return Compartment;

})(Node);

module.exports = Compartment;


},{"./Node":6,"./utilities":16}],2:[function(require,module,exports){
var Graph, Link, Metabolite, Reaction, utilities;

utilities = require("./utilities");

Metabolite = require("./Metabolite");

Reaction = require("./Reaction");

Link = require("./Link");

Graph = (function() {
  function Graph(id, name) {
    this.id = id;
    this.name = name;
    this.outNeighbours = new Object();
    this.inNeighbours = new Object();
    this.value = null;
  }

  return Graph;

})();

module.exports = Graph;


},{"./Link":3,"./Metabolite":4,"./Reaction":7,"./utilities":16}],3:[function(require,module,exports){
var Link;

Link = (function() {
  function Link(attr, ctx) {
    var scale;
    this.attr = attr;
    this.ctx = ctx;
    this.id = this.attr.id;
    this.source = this.attr.source;
    this.target = this.attr.target;
    this.thickness = this.attr.thickness;
    this.colourScale = this.attr.colourScale;
    this.appendSubstratesAndProducts();
    this.flux_value = this.source.flux_value || this.target.flux_value;
    scale = this.colourScale(Math.abs(this.flux_value));
    if (this.flux_value === 0) {
      this.colour = "black";
    } else if (this.flux_value > 0) {
      this.colour = "rgb(0," + scale + ",0)";
    } else {
      this.colour = "rgb(" + scale + ",0,0)";
    }
  }

  Link.prototype.appendSubstratesAndProducts = function() {
    if (this.source.type === 'm' && this.target.type === 'r') {
      if (this.target.substrates.indexOf(this.source) < 0) {
        this.source.outNeighbours.push(this.target);
        return this.target.substrates.push(this.source);
      }
    } else if (this.source.type === 'r' && this.target.type === 'm') {
      this.target.inNeighbours.push(this.source);
      return this.source.products.push(this.target);
    } else if (this.target.type === 'r' && this.source.type === 'Compartment') {
      return this.source.products.push(this.target);
    } else if (this.source.type === 'r' && this.target.type === 'Compartment') {
      return this.target.inNeighbours.push(this.source);
    }
  };

  Link.prototype.draw = function() {
    var h, lineAngle, targetx, targety, theta;
    if (!this.target.deleted && !this.source.deleted) {
      lineAngle = Math.atan2(this.target.y - this.source.y, this.target.x - this.source.x) + Math.PI;
      h = 10;
      theta = Math.PI / 8;
      this.ctx.beginPath();
      targetx = this.target.x + this.target.r * Math.cos(lineAngle);
      targety = this.target.y + this.target.r * Math.sin(lineAngle);
      this.ctx.moveTo(this.source.x, this.source.y);
      this.ctx.lineTo(targetx, targety);
      this.ctx.lineTo(targetx + h * Math.cos(theta + lineAngle), targety + h * Math.sin(theta + lineAngle));
      this.ctx.moveTo(targetx, targety);
      this.ctx.lineTo(targetx + h * Math.cos(-theta + lineAngle), targety + h * Math.sin(-theta + lineAngle));
      this.ctx.lineWidth = this.thickness;
      this.ctx.closePath();
      this.ctx.strokeStyle = this.colour;
      return this.ctx.stroke();
    }
  };

  return Link;

})();

module.exports = Link;


},{}],4:[function(require,module,exports){
var Metabolite, Node,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Node = require("./Node");

Metabolite = (function(superClass) {
  extend(Metabolite, superClass);

  function Metabolite(attr, ctx) {
    this.ctx = ctx;
    Metabolite.__super__.constructor.call(this, attr, this.ctx);
    if (indexOf.call(this.id, "_") >= 0 && indexOf.call(this.id, "-") >= 0) {
      this.compartment = this.id.slice(this.id.lastIndexOf("-") + 1, this.id.length);
    } else if (indexOf.call(this.id, "_") >= 0) {
      this.compartment = this.id.split('_')[this.id.split('_').length - 1];
    } else {
      this.compartment = this.id.split('-')[this.id.split('-').length - 1];
    }
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


},{"./Node":6}],5:[function(require,module,exports){
var Network, System, TreeNode, ViewController;

ViewController = require('./ViewController');

TreeNode = require('./TreeNode');

System = require('./System');

Network = (function() {
  function Network(attr) {
    this.attr = attr;
    this.viewController = new ViewController(this.attr.wrapperId, 'canvas', this.attr.width, this.attr.height, this.attr.backgroundColour, this, this.attr.showStats);
    this.initalized = false;
    this.changeSpecie(this.attr.data);
    this.initalized = true;
  }

  Network.prototype.changeSpecie = function(model) {
    var results, specie, systemAttr;
    this.attr.sortables.index = -1;
    systemAttr = {
      data: model,
      width: this.attr.width,
      height: this.attr.height,
      hideObjective: this.attr.hideObjective,
      everything: this.attr.everything,
      sortables: this.attr.sortables,
      ctx: this.viewController.ctx
    };
    this.root = new TreeNode('root', new System(systemAttr));
    this.root.system.initializeForce();
    if (this.initalized) {
      this.viewController.setActiveGraph(this.root.system);
    } else {
      this.viewController.startCanvas(this.root.system);
    }
    console.log(this.root);
    this.currentLevel = this.root;
    this.species = new Object();
    results = [];
    for (specie in this.root.system.parsedData) {
      if (specie !== "Community") {
        results.push(this.species[specie] = {
          addedReactions: new Array(),
          deletedReactions: new Array()
        });
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Network.prototype.enterSpecie = function(node) {
    this.currentLevel = this.currentLevel.children[node.id];
    return this.viewController.setActiveGraph(this.currentLevel.system);
  };

  Network.prototype.exitSpecie = function(node) {
    this.currentLevel = this.currentLevel.parent;
    return this.viewController.setActiveGraph(this.currentLevel.system);
  };

  Network.prototype.addReaction = function(reactionObject) {
    this.species[reactionObject.species[0]].addedReactions.push(reactionObject);
    return this.viewController.activeGraph.addReaction(reactionObject);
  };

  Network.prototype.deleteNode = function(id, system) {
    var i, len, node, ref, results, specie;
    ref = system.nodes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      if (node.id === id) {
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = node.species;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            specie = ref1[j];
            this.species[specie].deletedReactions.push(node);
            system.graph.destroyVertex(node.id);
            results1.push(node.deleted = true);
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Network;

})();

module.exports = Network;


},{"./System":8,"./TreeNode":9,"./ViewController":10}],6:[function(require,module,exports){
var Node, rand;

rand = function(range) {
  return Math.floor(Math.random() * range);
};

Node = (function() {
  function Node(attr, ctx) {
    this.ctx = ctx;
    this.x = attr.x;
    this.y = attr.y;
    this.r = Math.abs(attr.r);
    this.hover = false;
    this.id = attr.id;
    this.name = attr.name;
    this.type = attr.type;
    this.colour = attr.colour;
    this.keepStatic = false;
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


},{}],7:[function(require,module,exports){
var Node, Reaction, stringToColour,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Node = require("./Node");

stringToColour = require('./utilities').stringToColour;

Reaction = (function(superClass) {
  extend(Reaction, superClass);

  function Reaction(attr, ctx) {
    this.ctx = ctx;
    Reaction.__super__.constructor.call(this, attr, this.ctx);
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

  Reaction.prototype.draw = function() {
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
      this.ctx.fillStyle = stringToColour(this.name);
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
      this.ctx.strokeStyle = stringToColour(this.name);
      return this.ctx.stroke();
    }
  };

  return Reaction;

})(Node);

module.exports = Reaction;


},{"./Node":6,"./utilities":16}],8:[function(require,module,exports){
var Compartment, Link, Reaction, System, creators, sortors, utilities;

Compartment = require('./Compartment');

utilities = require('./utilities');

creators = require('./creators');

sortors = require('./sortors');

Link = require('./Link');

Reaction = require('./Reaction');

System = (function() {
  function System(attr) {
    var ref;
    attr.sortables.index += 1;
    this.sortables = attr.sortables;
    this.type = this.sortables.identifiers[this.sortables.index];
    this.data = attr.data;
    this.width = attr.width;
    this.height = attr.height;
    this.ctx = attr.ctx;
    this.everything = attr.everything;
    this.hideObjective = attr.hideObjective;
    this.metaboliteRadius = 10;
    this.compartmentRadius = 50;
    this.radiusScale = utilities.scaleRadius(this.data, 5, 15);
    this.thicknesScale = utilities.scaleRadius(this.data, 5, 15);
    this.colourScale = utilities.scaleRadius(this.data, 144, 255);
    creators.createMetabolite = creators.createMetabolite.bind(this);
    creators.createReaction = creators.createReaction.bind(this);
    creators.createCompartment = creators.createCompartment.bind(this);
    creators.createLink = creators.createLink.bind(this);
    ref = this.buildMetabolitesAndReactions(this.data.metabolites, this.data.reactions), this.metabolites = ref[0], this.reactions = ref[1];
    this.parsedData = new Object();
    sortors[this.type].parser(this);
    this.fullResGraph = new Graph();
    this.graph = new Graph();
    this.nodes = new Array();
    this.links = new Array();
    this.initializeForce();
    this.buildSystem();
  }

  System.prototype.buildMetabolitesAndReactions = function(metaboliteData, reactionData) {
    var j, k, len, len1, m, metabolite, metaboliteId, metabolites, r, reaction, reactions, source, target;
    metabolites = new Object();
    reactions = new Object();
    for (j = 0, len = metaboliteData.length; j < len; j++) {
      metabolite = metaboliteData[j];
      m = creators.createMetabolite(metabolite.name, metabolite.id, this.metaboliteRadius);
      m.species = metabolite.species;
      m.subsystems = metabolite.subsystems;
      metabolites[metabolite.id] = m;
    }
    for (k = 0, len1 = reactionData.length; k < len1; k++) {
      reaction = reactionData[k];
      if (!this.everything && reaction.flux_value === 0) {
        continue;
      }
      if (this.hideObjective && reaction.name.toLowerCase().indexOf('objective function') !== -1) {
        continue;
      }
      reactions[reaction.id] = creators.createReaction(reaction.name, reaction.id, reaction.flux_value, this.ctx);
      r = reactions[reaction.id];
      r.species = reaction.species;
      r.metabolites = reaction.metabolites;
      r.subsystem = reaction.subsystem;
      for (metaboliteId in reaction.metabolites) {
        if (reaction.metabolites[metaboliteId] > 0) {
          source = reaction.id;
          target = metaboliteId;
          if ((reactions[source] == null) || (metabolites[target] == null)) {
            continue;
          }
          r.addLink(creators.createLink(reactions[source], metabolites[target], reaction.name, this.thicknesScale(reaction.flux_value)));
        } else if (reaction.metabolites[metaboliteId] < 0) {
          source = metaboliteId;
          target = reaction.id;
          if ((reactions[target] == null) || (metabolites[source] == null)) {
            continue;
          }
          r.addLink(creators.createLink(metabolites[source], reactions[target], reaction.name, this.thicknesScale(reaction.flux_value)));
        }
      }
    }
    return [metabolites, reactions];
  };

  System.prototype.createNewMetabolite = function(id, name) {
    var metabolite, metaboliteAttr;
    metaboliteAttr = {
      id: id,
      name: name,
      x: utilties.rand(this.width),
      y: utilties.rand(this.height),
      r: this.metaboliteRadius,
      type: "m"
    };
    metabolite = new Metabolite(metaboliteAttr, this.ctx);
    return this.added.metabolites[id] = name;
  };

  System.prototype.findNode = function(id) {
    var j, len, node, ref;
    ref = this.nodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.id === id) {
        return node;
      }
    }
    return null;
  };

  System.prototype.addReaction = function(reactionObject) {
    var link, metabolite, reaction, source, target;
    reaction = new Reaction({
      x: utilities.rand(this.width),
      y: utilities.rand(this.height),
      r: 5,
      name: reactionObject.name,
      id: reactionObject.id,
      type: "r",
      flux_value: 0,
      colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
    }, this.ctx);
    this.nodes.push(reaction);
    for (metabolite in reactionObject.metabolites) {
      if (reactionObject.metabolites[metabolite] > 0) {
        source = reaction;
        target = this.findNode(metabolite);
      } else {
        source = this.findNode(metabolite);
        target = reaction;
      }
      link = new Link({
        id: reaction.id,
        source: source,
        target: target,
        thickness: 5,
        flux_value: 0,
        colourScale: this.colourScale
      }, this.ctx);
      link.colour = "black";
      this.links.push(link);
    }
    return this.force.start();
  };

  System.prototype.buildSystem = function() {
    var edge, flux, from, iterator, results, to, value, vertex;
    sortors[this.type].compartmentor(this);
    sortors[this.type].sortor(this);
    iterator = this.graph.vertices();
    while (!(vertex = iterator.next()).done) {
      value = vertex.value[1];
      this.nodes.push(value);
    }
    iterator = this.graph.edges();
    results = [];
    while (!(edge = iterator.next()).done) {
      from = edge.value[0];
      to = edge.value[1];
      value = edge.value[2];
      flux = 0;
      if (from.type === "r") {
        flux = to.flux_value;
      } else if (to.type === "r") {
        flux = from.flux_value;
      }
      results.push(this.links.push(creators.createLink(this.graph.vertexValue(from), this.graph.vertexValue(to), value, Math.abs(this.thicknesScale(this.graph.vertexValue(to).flux_value || this.graph.vertexValue(from).flux_value)))));
    }
    return results;
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
    factor = node.r * 2;
    return factor * -800;
  };

  System.prototype.initializeForce = function() {
    var j, len, n, ref;
    this.force = d3.layout.force().nodes(this.nodes).links(this.links).size([this.width, this.height]).linkStrength(2).friction(0.9).linkDistance(this.linkDistanceHandler).charge(this.chargeHandler).gravity(0.1).theta(0.8);
    if (this.useStatic) {
      ref = this.nodes;
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        this.force.tick();
      }
      return this.force.stop();
    }
  };

  System.prototype.buildFullResGraph = function(metaboliteData, reactionData) {
    var j, k, len, len1, m, metabolite, metaboliteId, r, reaction, results, source, target;
    for (j = 0, len = metaboliteData.length; j < len; j++) {
      metabolite = metaboliteData[j];
      m = creators.createMetabolite(metabolite.name, metabolite.id, this.metaboliteRadius);
      m.species = metabolite.species;
      this.fullResGraph.addVertex(metabolite.id, m);
    }
    results = [];
    for (k = 0, len1 = reactionData.length; k < len1; k++) {
      reaction = reactionData[k];
      if (!this.everything && reaction.flux_value === 0) {
        continue;
      }
      if (this.hideObjective && reaction.name.toLowerCase().indexOf('objective function') !== -1) {
        continue;
      }
      r = creators.createReaction(reaction.id, reaction.name, reaction.flux_value);
      r.species = reaction.species;
      this.fullResGraph.addVertex(r.id, r);
      results.push((function() {
        var results1;
        results1 = [];
        for (metaboliteId in reaction.metabolites) {
          if (reaction.metabolites[metaboliteId] > 0) {
            source = reaction.id;
            target = metaboliteId;
          } else if (reaction.metabolites[metaboliteId] < 0) {
            source = metaboliteId;
            target = reaction.id;
          }
          this.fullResGraph.vertexValue(r.id).addLink(creators.createLink(this.fullResGraph.vertexValue(source), this.fullResGraph.vertexValue(target), reaction.name, reaction.flux_value, this.metaboliteRadius));
          results1.push(this.fullResGraph.createNewEdge(source, target, source + " -> " + target));
        }
        return results1;
      }).call(this));
    }
    return results;
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

  return System;

})();

module.exports = System;


},{"./Compartment":1,"./Link":3,"./Reaction":7,"./creators":12,"./sortors":15,"./utilities":16}],9:[function(require,module,exports){
var System, TreeNode;

System = require('./System');

TreeNode = (function() {
  function TreeNode(id, system) {
    var child, currentIndex, systemAttr;
    this.id = id;
    this.system = system;
    this.parent = null;
    this.children = new Object();
    currentIndex = this.system.sortables.index;
    for (child in this.system.parsedData) {
      if (currentIndex < this.system.sortables.identifiers.length - 1 && child !== "e" && child !== "Community") {
        this.system.sortables.index = currentIndex;
        systemAttr = {
          data: this.system.parsedData[child],
          width: this.system.width,
          height: this.system.height,
          hideObjective: this.system.hideObjective,
          everything: this.system.everything,
          sortables: this.system.sortables,
          ctx: this.system.ctx
        };
        this.children[child] = new TreeNode(child, new System(systemAttr));
        this.children[child].parent = this;
      }
    }
  }

  return TreeNode;

})();

module.exports = TreeNode;


},{"./System":8}],10:[function(require,module,exports){
var ViewController;

ViewController = (function() {
  var mousedownHandler, mousemoveHandler, mouseupHandler, mousewheelHandler;

  function ViewController(wrapperId, id1, width, height, BG, network, showStats) {
    this.wrapperId = wrapperId;
    this.id = id1;
    this.width = width;
    this.height = height;
    this.BG = BG;
    this.network = network;
    this.showStats = showStats;
    this.c = document.createElement("canvas");
    this.c.id = this.id;
    this.c.width = this.width;
    this.c.height = this.height;
    this.currentActiveNode = null;
    this.isDraggingNode = false;
    this.clientX = 0;
    this.clientY = 0;
    this.maxZoomOut = 7.5;
    this.maxZoomIn = 0.05;
    document.getElementById(this.wrapperId).appendChild(this.c);
    this.ctx = document.getElementById(this.id).getContext("2d");
    this.nodetext = $('#nodetext');
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    if (this.showStats) {
      document.body.appendChild(this.stats.domElement);
    }
  }

  ViewController.prototype.startCanvas = function(system) {
    var that;
    this.activeGraph = system;
    this.populateOptions(this.activeGraph.nodes);
    this.activeGraph.force.start();
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
      return that.activeGraph.createNewLink(source, target, $("#reaction_name").val(), 0, that.ctx);
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
    var delta, factor, pt, wheel, zoom;
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
    this.ctx.translate(-pt.x, -pt.y);
    return this.xform = this.xform.translate(-pt.x, -pt.y);
  };

  ViewController.prototype.tick = function() {
    var tPt;
    if ((this.currentActiveNode != null) && this.isDraggingNode) {
      tPt = this.transformedPoint(this.clientX, this.clientY);
      this.currentActiveNode.x = tPt.x;
      return this.currentActiveNode.y = tPt.y;
    }
  };

  ViewController.prototype.appendText = function(node, e) {
    var htmlText, product, products, substrate, substrates, that;
    this.nodetext.addClass('showing');
    this.nodetext.css({
      'left': e.clientX,
      'top': e.clientY
    });
    console.log(node);
    that = this;
    htmlText = "";
    if (node.type === 'r') {
      substrates = (function() {
        var i, len, ref, results;
        ref = node.inNeighbours;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          substrate = ref[i];
          results.push(substrate.name);
        }
        return results;
      })();
      products = (function() {
        var i, len, ref, results;
        ref = node.outNeighbours;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          product = ref[i];
          results.push(product.name);
        }
        return results;
      })();
      htmlText += substrates + " --- (" + node.name + ") ---> " + products + "<br>";
      htmlText += "Flux: " + node.flux_value + "<br>";
      htmlText += "<button id='delete'>Delete Reaction</button><br>";
    } else if (node.type === 'm') {
      htmlText += node.name + "<br>";
    } else if (node.type === 'Compartment' && (this.network.currentLevel.children[node.id] != null)) {
      htmlText += node.name + "<br>";
      htmlText += "<button id='enter'>Enter Node</button><br>";
    } else if (node.type === 'Compartment') {
      htmlText += node.name + "<br>";
    }
    if (this.network.root.system !== this.activeGraph) {
      htmlText += "<button id='network'>Return to Previous level</button><br>";
    }
    this.nodetext.html(htmlText);
    $("#delete").click(function() {
      return that.network.deleteNode(node.id, that.activeGraph);
    });
    $("#enter").click(function() {
      return that.network.enterSpecie(node);
    });
    return $("#network").click(function() {
      return that.network.exitSpecie();
    });
  };

  ViewController.prototype.setActiveGraph = function(system) {
    this.populateOptions(this.activeGraph.nodes);
    this.activeGraph.force.stop();
    this.activeGraph = system;
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
    if (this.showStats) {
      this.stats.begin();
      this.clear();
      this.draw();
      this.stats.end();
    } else {
      this.clear();
      this.draw();
    }
    return requestAnimationFrame(this.render.bind(this));
  };

  return ViewController;

})();

module.exports = ViewController;


},{}],11:[function(require,module,exports){
module.exports = {
  addMetabolite: function(id, name, type, radius) {
    var metabolite, nodeAttributes;
    nodeAttributes = {
      x: utilities.rand(this.width),
      y: utilities.rand(this.height),
      r: radius,
      name: name,
      id: id,
      type: type
    };
    metabolite = new Metabolite(nodeAttributes, this.ctx);
    this.viewController.updateOptions(name, id);
    return this.nodes.push(metabolite);
  },
  addLink: function(src, tgt, name, flux, radius, thickness) {
    var linkAttr, reaction, reactionAttributes;
    if ((src == null) || (tgt == null)) {
      return alert("No self linking!");
    } else if (src.type === "r" && tgt.type === "m" || src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return this.links.push(new Link(linkAttr, this.ctx));
    } else if (src.type === "m" && tgt.type === "m") {
      reactionAttributes = {
        x: utilities.rand(this.W),
        y: utilities.rand(this.H),
        r: radius,
        name: name,
        id: name,
        type: "r",
        flux_value: flux,
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      reaction = new Reaction(reactionAttributes, this.ctx);
      this.nodes.push(reaction);
      linkAttr = {
        id: source.id + "-" + reaction.id,
        source: src,
        target: reaction,
        thickness: thickness,
        colourScale: this.colourScale
      };
      this.links.push(new Link(linkAttr, ctx));
      linkAttr = {
        id: reaction.id + "-" + target.id,
        source: reaction,
        target: tgt,
        thickness: thickness
      };
      return this.links.push(new Link(linkAttr, ctx));
    } else {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return this.links.push(new Link(linkAttr, ctx));
    }
  },
  addReaction: function(src, tgt, name, radius, W, H, thickness) {
    var linkAttr, reaction, reactionAttributes;
    if ((src == null) || (tgt == null)) {
      return alert("No self linking!");
    } else if (src.type === "r" && tgt.type === "m" || src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        fluxValue: 0,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return this.links.push(new Link(linkAttr, this.ctx));
    } else if (src.type === "m" && tgt.type === "m") {
      reactionAttributes = {
        x: utilities.rand(W),
        y: utilities.rand(H),
        r: 5,
        name: name,
        id: name,
        type: "r",
        flux_value: 0,
        colour: "rgb(" + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ", " + (utilities.rand(255)) + ")"
      };
      reaction = new Reaction(reactionAttributes, this.ctx);
      this.nodes.push(reaction);
      linkAttr = {
        id: source.id + "-" + reaction.id,
        source: src,
        target: reaction,
        fluxValue: 0,
        r: radius,
        thickness: thickness,
        colourScale: this.colourScale
      };
      this.links.push(new Link(linkAttr, this.ctx));
      linkAttr = {
        id: reaction.id + "-" + target.id,
        source: reaction,
        target: tgt,
        fluxValue: 0,
        r: radius,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return this.links.push(new Link(linkAttr, this.ctx));
    } else {
      return alert("Invalid linkage");
    }
  }
};


},{}],12:[function(require,module,exports){
var Compartment, Link, Metabolite, Reaction, utilities;

Reaction = require('./Reaction');

Metabolite = require('./Metabolite');

Compartment = require('./Compartment');

Link = require('./Link');

utilities = require('./utilities');

module.exports = {
  createReaction: function(id, name, flux_value) {
    var reactionAttributes;
    reactionAttributes = {
      x: utilities.rand(this.width),
      y: utilities.rand(this.height),
      r: this.radiusScale(flux_value),
      name: name,
      id: id,
      type: "r",
      flux_value: flux_value
    };
    return new Reaction(reactionAttributes, this.ctx);
  },
  createCompartment: function(id, name) {
    var compartmentAttributes;
    compartmentAttributes = {
      x: utilities.rand(this.width),
      y: utilities.rand(this.height),
      r: this.compartmentRadius,
      name: name,
      id: id
    };
    return new Compartment(compartmentAttributes, this.ctx);
  },
  createMetabolite: function(name, id, radius) {
    var metabolite, nodeAttributes;
    nodeAttributes = {
      x: utilities.rand(this.width),
      y: utilities.rand(this.height),
      r: radius,
      name: name,
      id: id,
      type: "m"
    };
    metabolite = new Metabolite(nodeAttributes, this.ctx);
    return metabolite;
  },
  createLink: function(src, tgt, name, thickness) {
    var linkAttr;
    if (src.type === "r" && tgt.type === "m") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return new Link(linkAttr, this.ctx);
    } else if (src.type === "m" && tgt.type === "r") {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return new Link(linkAttr, this.ctx);
    } else {
      linkAttr = {
        id: src.id + "-" + tgt.id,
        source: src,
        target: tgt,
        thickness: thickness,
        colourScale: this.colourScale
      };
      return new Link(linkAttr, this.ctx);
    }
  }
};


},{"./Compartment":1,"./Link":3,"./Metabolite":4,"./Reaction":7,"./utilities":16}],13:[function(require,module,exports){
module.exports = {
  deleteNode: function(node) {
    var i, inNeighbour, j, len, len1, nodeIndex, outNeighbour, ref, ref1;
    this.exclusions.push(node);
    node.deleted = true;
    ref = node.inNeighbours;
    for (i = 0, len = ref.length; i < len; i++) {
      inNeighbour = ref[i];
      nodeIndex = inNeighbour.outNeighbours.indexOf(node);
      inNeighbour.outNeighbours.splice(nodeIndex, 1);
    }
    ref1 = node.outNeighbours;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      outNeighbour = ref1[j];
      nodeIndex = outNeighbour.inNeighbours.indexOf(node);
      outNeighbour.inNeighbours.splice(nodeIndex, 1);
    }
    return this.viewController.removeOption(node);
  }
};


},{}],14:[function(require,module,exports){
var Network, i, j, len, len1, metabolite, metaboliteDict, networkAttributes, reaction, ref, ref1, sortables;

Network = require("./Network");

metaboliteDict = new Object();

ref = data.metabolites;
for (i = 0, len = ref.length; i < len; i++) {
  metabolite = ref[i];
  metabolite.subsystems = new Array();
  metaboliteDict[metabolite.id] = metabolite;
}

ref1 = data.reactions;
for (j = 0, len1 = ref1.length; j < len1; j++) {
  reaction = ref1[j];
  if (reaction.subsystem === '') {
    reaction.subsystem = 'Unassigned';
  }
  for (metabolite in reaction.metabolites) {
    if (metaboliteDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
      metaboliteDict[metabolite].subsystems.push(reaction.subsystem);
    }
  }
}

data.metabolites = new Array();

for (metabolite in metaboliteDict) {
  data.metabolites.push(metaboliteDict[metabolite]);
}

sortables = {
  index: -1,
  identifiers: ['species', 'compartments', 'subsystems']
};

networkAttributes = {
  id: 'root',
  name: 'root',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColour: 'white',
  metaboliteRadius: 10,
  useStatic: false,
  everything: false,
  hideObjective: true,
  data: data,
  sortables: sortables
};

window.ConsortiaFluxVisualization = Network;


},{"./Network":5}],15:[function(require,module,exports){
var Graph, creators,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Graph = require('./Graph');

creators = require('./creators');

module.exports = {
  species: {
    parser: function(system) {
      var i, j, len, len1, metabolite, metaboliteDict, pushedMetabolites, reaction, ref, ref1, results, specie;
      metaboliteDict = new Object();
      ref = system.data.metabolites;
      for (i = 0, len = ref.length; i < len; i++) {
        metabolite = ref[i];
        metaboliteDict[metabolite.id] = metabolite;
      }
      pushedMetabolites = {};
      ref1 = system.data.reactions;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        reaction = ref1[j];
        if (reaction.name === 'Community biomass objective function') {
          continue;
        }
        specie = reaction.species[0];
        if (system.parsedData[specie] == null) {
          system.parsedData[specie] = {};
          system.parsedData[specie].metabolites = [];
          system.parsedData[specie].reactions = [];
          pushedMetabolites[specie] = [];
        }
        system.parsedData[specie].reactions.push(reaction);
        results.push((function() {
          var results1;
          results1 = [];
          for (metabolite in reaction.metabolites) {
            if (indexOf.call(pushedMetabolites[specie], metabolite) < 0) {
              pushedMetabolites[specie].push(metabolite);
              results1.push(system.parsedData[specie].metabolites.push(metaboliteDict[metabolite]));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    },
    compartmentor: function(system) {
      var i, j, k, len, len1, len2, metabolite, ref, ref1, results, specie, species;
      species = [];
      ref = system.data.metabolites;
      for (i = 0, len = ref.length; i < len; i++) {
        metabolite = ref[i];
        ref1 = metabolite.species;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          specie = ref1[j];
          if (!(indexOf.call(species, specie) >= 0)) {
            species.push(specie);
          }
        }
      }
      results = [];
      for (k = 0, len2 = species.length; k < len2; k++) {
        specie = species[k];
        results.push(system.graph.addVertex(specie, creators.createCompartment(specie, specie)));
      }
      return results;
    },
    sortor: function(system) {
      var product, r, reaction, results, specie, substrate;
      results = [];
      for (reaction in system.reactions) {
        r = system.reactions[reaction];
        results.push((function() {
          var i, j, k, len, len1, len2, ref, ref1, ref2, results1;
          ref = r.species;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            specie = ref[i];
            ref1 = r.substrates;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              substrate = ref1[j];
              if (substrate.compartment === 'e') {
                if (!system.graph.hasVertex(r.id)) {
                  system.graph.addVertex(r.id, r);
                }
                if (!system.graph.hasVertex(substrate.id)) {
                  system.graph.addVertex(substrate.id, substrate);
                }
                if (!system.graph.hasEdge(substrate.id, r.id)) {
                  system.graph.addEdge(substrate.id, r.id, substrate.id + " -> " + r.id);
                }
                ref2 = r.products;
                for (k = 0, len2 = ref2.length; k < len2; k++) {
                  product = ref2[k];
                  if (product.compartment === 'e') {
                    if (!system.graph.hasVertex(product.id)) {
                      system.graph.addVertex(product.id, product);
                    }
                    if (!system.graph.hasEdge(r.id, product.id)) {
                      system.graph.addEdge(r.id, product.id, r.id + " -> " + product.id);
                    }
                  } else {
                    if (!system.graph.hasEdge(r.id, specie)) {
                      system.graph.addEdge(r.id, specie, r.id + " -> " + specie);
                    }
                  }
                }
              }
            }
            results1.push((function() {
              var l, len3, ref3, results2;
              ref3 = r.products;
              results2 = [];
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                product = ref3[l];
                if (product.compartment === 'e') {
                  if (!system.graph.hasVertex(r.id)) {
                    system.graph.addVertex(r.id, r);
                  }
                  if (!system.graph.hasVertex(product.id)) {
                    system.graph.addVertex(product.id, product);
                  }
                  if (!system.graph.hasEdge(r.id, product.id)) {
                    system.graph.addEdge(r.id, product.id, r.id + " -> " + product.id);
                  }
                  results2.push((function() {
                    var len4, n, ref4, results3;
                    ref4 = r.substrates;
                    results3 = [];
                    for (n = 0, len4 = ref4.length; n < len4; n++) {
                      substrate = ref4[n];
                      if (substrate.compartment === 'e') {
                        if (!system.graph.hasVertex(substrate.id)) {
                          system.graph.addVertex(substrate.id, substrate);
                        }
                        if (!system.graph.hasEdge(substrate.id, r.id)) {
                          results3.push(system.graph.addEdge(substrate.id, r.id, substrate.id + " -> " + product.id));
                        } else {
                          results3.push(void 0);
                        }
                      } else {
                        if (!system.graph.hasEdge(specie, r.id)) {
                          results3.push(system.graph.addEdge(specie, r.id, specie + " -> " + r.id));
                        } else {
                          results3.push(void 0);
                        }
                      }
                    }
                    return results3;
                  })());
                } else {
                  results2.push(void 0);
                }
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    }
  },
  compartments: {
    parser: function(system) {
      var compartments, cpt, i, j, len, len1, metabolite, metaboliteDict, pushedMetabolites, pushedReactions, reaction, ref, ref1, ref2, results;
      metaboliteDict = new Object();
      ref = system.data.metabolites;
      for (i = 0, len = ref.length; i < len; i++) {
        metabolite = ref[i];
        metaboliteDict[metabolite.id] = metabolite;
      }
      pushedMetabolites = new Object();
      pushedReactions = new Object();
      ref1 = system.data.reactions;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        reaction = ref1[j];
        compartments = new Array();
        for (metabolite in reaction.metabolites) {
          if (ref2 = metaboliteDict[metabolite].compartment, indexOf.call(compartments, ref2) < 0) {
            compartments.push(metaboliteDict[metabolite].compartment);
          }
        }
        results.push((function() {
          var k, len2, ref3, results1;
          results1 = [];
          for (k = 0, len2 = compartments.length; k < len2; k++) {
            cpt = compartments[k];
            if (cpt !== 'e') {
              if (system.parsedData[cpt] == null) {
                system.parsedData[cpt] = new Object();
                system.parsedData[cpt].metabolites = new Array();
                system.parsedData[cpt].reactions = new Array();
                pushedMetabolites[cpt] = new Array();
                pushedReactions[cpt] = new Array();
              }
              if (ref3 = reaction.id, indexOf.call(pushedReactions[cpt], ref3) < 0) {
                system.parsedData[cpt].reactions.push(reaction);
                pushedReactions[cpt].push(reaction.id);
              }
              results1.push((function() {
                var results2;
                results2 = [];
                for (metabolite in reaction.metabolites) {
                  if (indexOf.call(pushedMetabolites[cpt], metabolite) < 0) {
                    system.parsedData[cpt].metabolites.push(metaboliteDict[metabolite]);
                    results2.push(pushedMetabolites[cpt].push(metabolite));
                  } else {
                    results2.push(void 0);
                  }
                }
                return results2;
              })());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    },
    compartmentor: function(system) {
      var m, mappings, metabolite, results, sorter;
      sorter = 'compartment';
      mappings = {
        c: 'cytosol',
        p: 'periplasm',
        e: 'extracellular'
      };
      results = [];
      for (metabolite in system.metabolites) {
        m = system.metabolites[metabolite];
        console.log(m);
        if (!system.graph.hasVertex(m[sorter])) {
          results.push(system.graph.addVertex(m[sorter], creators.createCompartment(m[sorter], mappings[m[sorter]])));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    sortor: function(system) {
      var cpt, i, len, r, reaction, ref, results;
      results = [];
      for (reaction in system.reactions) {
        r = system.reactions[reaction];
        if (r.substrateCompartments.length === 1 && r.productCompartments.length === 1 && r.substrateCompartments[0] === r.productCompartments[0]) {
          continue;
        }
        if (!system.graph.hasVertex(r.id)) {
          system.graph.addVertex(r.id, r);
        }
        ref = r.substrateCompartments;
        for (i = 0, len = ref.length; i < len; i++) {
          cpt = ref[i];
          system.graph.addEdge(cpt, r.id, cpt + " -> " + r.id);
        }
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = r.productCompartments;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            cpt = ref1[j];
            results1.push(system.graph.addEdge(r.id, cpt, "{r.id} -> " + cpt));
          }
          return results1;
        })());
      }
      return results;
    }
  },
  subsystems: {
    parser: function() {},
    compartmentor: function(system) {
      var m, metabolite, results, sorter, subsystem;
      sorter = 'subsystem';
      results = [];
      for (metabolite in system.metabolites) {
        m = system.metabolites[metabolite];
        results.push((function() {
          var i, len, ref, results1;
          ref = m.subsystems;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subsystem = ref[i];
            if (!system.graph.hasVertex(subsystem)) {
              results1.push(system.graph.addVertex(subsystem, creators.createCompartment(subsystem, subsystem)));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    },
    sortor: function(system) {
      var i, len, product, r, reaction, ref, results, substrate;
      results = [];
      for (reaction in system.reactions) {
        r = system.reactions[reaction];
        ref = r.substrates;
        for (i = 0, len = ref.length; i < len; i++) {
          substrate = ref[i];
          if (substrate.subsystems.length > 1) {
            if (!system.graph.hasVertex(r.id)) {
              system.graph.addVertex(r.id, r);
            }
            if (!system.graph.hasVertex(substrate.id)) {
              system.graph.addVertex(substrate.id, substrate);
            }
            system.graph.addEdge(substrate.id, r.id, substrate.id + " -> " + r.id);
            system.graph.addEdge(r.id, r.subsystem, r.id + " -> " + r.subsystem);
          }
        }
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = r.products;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            product = ref1[j];
            if (product.subsystems.length > 1) {
              if (!system.graph.hasVertex(r.id)) {
                system.graph.addVertex(r.id, r);
              }
              if (!system.graph.hasVertex(product.id)) {
                system.graph.addVertex(product.id, product);
              }
              system.graph.addEdge(r.subsystem, r.id, r.subsystem + " -> " + r.id);
              results1.push(system.graph.addEdge(r.id, product.id, r.id + " -> " + product.id));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    }
  }
};


},{"./Graph":2,"./creators":12}],16:[function(require,module,exports){
var nodeMap, rand, scaleRadius;

rand = function(range) {
  return Math.floor(Math.random() * (range + 1));
};

scaleRadius = function(model, minRadius, maxRadius) {
  var fluxes, j, largest, len, minimum, reaction, ref, threshold;
  largest = 1;
  threshold = 40;
  fluxes = [];
  ref = model.reactions;
  for (j = 0, len = ref.length; j < len; j++) {
    reaction = ref[j];
    if (reaction.flux != null) {
      fluxes.push(reaction.flux);
    }
  }
  largest = Math.max.apply(Math, fluxes);
  minimum = Math.min.apply(Math, fluxes);
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


var stringToColour = function(str) {
    if (!str) {
        str = 'foo';
    }

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}
;

module.exports = {
  rand: rand,
  scaleRadius: scaleRadius,
  nodeMap: nodeMap,
  stringToColour: stringToColour
};


},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])


//# sourceMappingURL=maps/bundle-coffee.js.map