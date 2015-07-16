/* global Node */
/* global palette */
'use strict';

var Metabolite = function(network, name, id, radius) {
    var that = new Node(network, name, id, "m", radius);

    network.graph.addNode({
      "id": id,
      "label": name,
      "x": that.position.x,
      "y": that.position.y, //random for now
      "size": radius
    });

    that.node = network.graph.nodes()[network.graph.nodes().length-1];

  
    return that;
};
