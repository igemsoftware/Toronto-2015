/* global Node */
/* global palette */
'use strict';

var Reaction = function(network, name, id, radius, flux_value) {
    var that = new Node(network, name, id, "r", radius);
    
    network.graph.addNode({
      "id": id,
      "label": name,
      "x": that.position.x,
      "y": that.position.y, //random for now
      "size": 3
    })
    that.node = network.graph.nodes()[network.graph.nodes().length-1];
    return that;
};
