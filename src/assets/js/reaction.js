/* global Node */
/* global palette */
'use strict';

var Reaction = function(network, name, id, radius, flux_value) {
    var that = new Node(network, name, id, "r", radius);
    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": Math.random()*2560,
      "y": Math.random()*1200, //random for now
      "size": 3
    })
  //  that.network.refresh();
    return that;
};
