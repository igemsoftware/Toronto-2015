/* global Node */
/* global palette */
'use strict';

var Metabolite = function(network, name, id, radius) {
    var that = new Node(network, name, id, "m", radius);

    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": Math.random()*2560,
      "y": Math.random()*1280, //random for now
      "size": radius
    })
  //  that.network.refresh();

    return that;
};
