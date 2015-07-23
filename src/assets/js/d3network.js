/* global d3 */
/* global System */
'use strict';

// Potentially rename
var Network = function(attributes) {

  var _private = {
    canvas     : null, // <canvas>
    network    : null, // tbr
    nodes      : null, // tbr
    links      : null, // tbr
    attributes : attributes, // User Configurable attributes related to the network
    pathways   : [], // see: system.js
    nodesSet   : [], // array of nodes data, see: node.js/metabolite.js/reaction.js
    linkSet    : [], // array of links data, see: link.js
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
  }

  /**
   * @param model: object
   *
   * @return none
   */
  function addSystem(model) {
    _private.pathways.push(new System(_private.attributes, model));
  }

  return {
    addSystem: function(jsonData) {
      addSystem(jsonData);
    }
  };
};
