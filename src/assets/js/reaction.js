/* global Node */
/* global palette */
'use strict';

<<<<<<< HEAD
var Reaction = function(attr) {

    //var that = new Node(attr.name, attr._id, attr.type, attr.radius);
    var that = new Node(attr);

    that.getFlux = function() {
        return attr.fluxValue;
    };

    if (that.radius <= 0) {
        that.radius = 0;
    }

    var col = 'blue';
    if (that.radius === 5) {
        col = 'red';
    }

    that.draw = function() {
        that.context.beginPath();
        that.context.arc(that.x, that.y, that.radius, 0, 2 * Math.PI);
        that.context.fillStyle = col;
        that.context.fill();
        that.context.closePath();
    };

=======
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
    
>>>>>>> origin/sigma
    return that;
};
