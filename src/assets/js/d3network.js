/* global d3 */
/* global System */
'use strict';

var Network = function(attributes) {

  var _private = {
    canvas     : null, //the <canvas> tag class: body
    network    : null, //the <g> tag class: network
    nodes      : null, //all node elements class: node under <g> class: nodes
    links      : null, //all link elements class: link under <g> class: nodes
    attributes : attributes, // User Configurable attributes related to the network
    pathways   : [],
    nodesSet   : [], //array of nodes data
    linkSet    : [], //array of links data
    width      : 0,
    height     : 0
  };

  init();

  function init() {
    // Append canvas DOM element
    _private.height = attributes.canvas.height;
    _private.width  = attributes.canvas.width;
    _private.canvas = d3.select(attributes.divName).append('canvas')
      .attr('height', _private.height)
      .attr('width', _private.width)
      .node().getContext('2d');

    // d3.select('canvas').node().addEventListener("click", onClick);
  }

  /*

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 30);
      };
    })();

    (function animloop(){
      requestAnimFrame(animloop);
      update();

    })();*/

  function update() {
    // Clear canvas
    _private.canvas.clearRect(0, 0, _private.width, _private.height);

    // And draw each pathway
    for (var i = 0; i < _private.pathways.length; i++) {
      _private.pathways[i].update();
    }
  }

  function addSystem(model) {
    _private.pathways.push(new System(_private.attributes, model));
  }

  return {
    addSystem: function(jsonData) {
      addSystem(jsonData);
    }
  };
};
