/* global Node */
/* global palette */
'use strict';

var Metabolite = function(network, name, id, radius) {
    var that = new Node(network, name, id, "m", radius);
    that.x = Math.random()*1920;
    that.y = Math.random()*1080;
    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": that.x,
      "y": that.y, //random for now
      "size": radius
    })

    return that;
};
