/* global d3 */
/* global Metabolite */
/* global Reaction */
/* global Link */
/* global palette */
/* global console */
'use strict';

var System = function(attributes, system) {

  var _private = {
    canvas           : null,
    nodes            : null, // tbr
    links            : null, // tbr
    force            : null,
    system           : null,
    attributes       : attributes,
    linkSet          : [], // link data
    nodesSet         : [], // node data
    metaboliteRadius : 10,
    cameraWidth      : 0,
    cameraHeight     : 0,
    cameraX          : 0,
    cameraY          : 0,
    scale            : 1
  };

  // Initalize Pathway
  init(system);

  function init(system) {
    // Assign selection to _private variables
    _private.network      = d3.select('canvas');
    _private.canvas       = d3.select('canvas')
      .node()
      .getContext('2d');
    _private.canvasWidth  = _private.attributes.canvas.width;
    _private.canvasHeight = _private.attributes.canvas.height;
    _private.cameraWidth  = _private.attributes.canvas.width;
    _private.cameraHeight = _private.attributes.canvas.height;

    // Build metabolites
    buildMetabolites(system);

    // Create reaction objects
    buildReactions(system);

    // Force layout
    _private.force = d3.layout.force()
      .nodes(_private.nodesSet)
      .links(_private.linkSet)
      .charge(-500)
      .linkStrength(2)
      .linkDistance(50)
      // variablize w/ cameraWidth,H
      .size([_private.attributes.canvas.width, _private.attributes.canvas.height])
      .start()
      .on('tick', update);
  }

  _private.canvas.canvas.onmousewheel = function(event) {
    event.preventDefault();
      //console.log(e);
    var mousex = event.clientX - _private.canvas.canvas.offsetLeft;
    var mousey = event.clientY - _private.canvas.canvas.offsetTop;
    var wheel = event.wheelDelta / 120; //n or -n

    var zoom = 1 + wheel / 2;

    _private.canvas.translate(
      _private.cameraX,
      _private.cameraY
    );

    _private.canvas.scale(zoom, zoom);
    // this line is too long; makes no sense
    // variabilize this, split variable assignment into meaningful lines
    _private.canvas.translate(-(mousex / _private.scale + _private.cameraX - mousex / (_private.scale * zoom)), -(mousey / _private.scale + _private.cameraY - mousey / (_private.scale * zoom)));
    // also, isnt this the same? -> variabilize
    _private.cameraX = (mousex / _private.scale + _private.cameraX - mousex / (_private.scale * zoom));
    _private.cameraY = (mousey / _private.scale + _private.cameraY - mousey / (_private.scale * zoom));
    _private.scale *= zoom;
    _private.cameraWidth = _private.canvasWidth * 1 / _private.scale;
    _private.cameraHeight = _private.canvasHeight * 1 / _private.scale;
    // or resume()
    // shit gets fucked up w/o this
    _private.force.start();
  };

  function buildMetabolites(system) {
    // loop and bind metabolite data to metabolite node to nodeset
    for (var i = 0; i < system.metabolites.length; i++) {
      _private.nodesSet.push(new Metabolite(
        system.metabolites[i].name,
        system.metabolites[i].id,
        _private.metaboliteRadius
      ));
    }
  }

  function scale_radius(system) {
    // find largest flux value and scale radius of reaction node accordingly
    var flux_array = [];
    for (var i = 0; i < system.reactions.length; i++) {
      flux_array.push(system.reactions[i].flux_value);
    }

    var largest = Math.max.apply(Math, flux_array);
    var r = d3.scale.linear()
      .domain([0, largest])
      .range([0, 15]);

    return r;
  }

  function buildReactions(system) {
    var tempLinks = [];
    // scale_radius
    var radiusScale = scale_radius(system);
    // loop and bind reaction data to reaction node
    var s, t;
    for (var i = 0; i < system.reactions.length; i++) {
      _private.nodesSet.push(new Reaction(
        system.reactions[i].name,
        system.reactions[i].id,
        radiusScale(system.reactions[i].flux_value),
        system.reactions[i].flux_value
      ));

      // assign metabolite source and target for each reaction
      var m = Object.keys(system.reactions[i].metabolites);

      for (var k = 0; k < m.length; k++) {
        if (system.reactions[i].metabolites[m[k]] > 0) {
          s = system.reactions[i].id;
          t = m[k];
        } else {
          s = m[k];
          t = system.reactions[i].id;
        }

        tempLinks.push({
          id: s + '-' + t,
          source: s,
          target: t
        });
      }
    }

    var nodesMap = map(_private.nodesSet);
    for (var j = 0; j < tempLinks.length; j++) {
      //ineffiecient, but will do for now
      s = _private.nodesSet[nodesMap[tempLinks[j].source]];

      t = _private.nodesSet[nodesMap[tempLinks[j].target]];
      _private.linkSet.push(new Link(
        s.getID() + "-" + t.getID(),
        s,
        t
      ));
    }
  }

  //utilities function
  function map(nodesSet) {
    var ret = {};
    for (var j = 0; j < nodesSet.length; j++) {
      ret[nodesSet[j].getID()] = j;
    }
    return ret;
  }

  function update() {
    //refresh
    _private.canvas.clearRect(_private.cameraX, _private.cameraY, _private.cameraWidth, _private.cameraHeight);

    _private.nodesSet.forEach(function(d) {
      d.nodeX = d.x;
      d.nodeY = d.y;
      d.draw();
    });

    _private.linkSet.forEach(function(d) {
      d.linkX1 = d.source.x;
      d.linkY1 = d.source.y;
      d.linkX2 = d.target.x;
      d.linkY2 = d.target.y;
      d.draw();
    });
  }
};
