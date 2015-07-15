/* global Node */
/* global palette */
'use strict';

var Metabolite = function(network, name, id, radius) {
    var that = new Node(network, name, id, "m", radius);
    that.network.graph.addNode({
      "id": id,
      "label": name,
      "x": Math.random()*1080,
      "y": Math.random()*1920, //random for now
      "size": radius
    })

    that.node = that.network.graph.nodes()[that.network.graph.nodes().length-1];


    return that;
};
