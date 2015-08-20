/* global Node */
/* global palette */
'use strict';

var Metabolite = function(attr) {

<<<<<<< HEAD
    //var that = new Node(attr.name, attr._id, attr.type, attr.radius);
    var that = new Node(attr);
    that.radius = attr.radius;

    that.draw = function() {
        that.context.beginPath();
        that.context.arc(that.x, that.y, that.radius, 0, 2 * Math.PI);
        that.context.fillStyle = 'green';
        that.context.fill();
        that.context.closePath();
    };
=======
    network.graph.addNode({
      "id": id,
      "label": name,
      "x": that.position.x,
      "y": that.position.y, //random for now
      "size": radius
    });
>>>>>>> origin/sigma

    that.node = network.graph.nodes()[network.graph.nodes().length-1];
  
    return that;
};
