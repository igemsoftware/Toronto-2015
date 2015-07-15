/* global Node */
/* global palette */
'use strict';

var Reaction = function(network, name, id, radius, flux_value) {
    var that = new Node(network, name, id, "r", radius);
    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": Math.random()*1080,
      "y": Math.random()*1920, //random for now
      "size": 3
    })
    that.node = that.network.graph.nodes()[that.network.graph.nodes().length-1];
    return that;
};
