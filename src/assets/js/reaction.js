/* global Node */
/* global palette */
'use strict';

var Reaction = function(network, name, id, radius, flux_value) {
    var that = new Node(network, name, id, "r", radius);
    that.x = Math.random()*1920;
    that.y = Math.random()*1080;
    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": that.x,
      "y": that.y, //random for now
      "size": 3
    })
    that.node = that.network.graph.nodes()[that.network.graph.nodes().length-1];
    return that;
};
