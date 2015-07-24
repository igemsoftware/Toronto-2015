/* global Node */
/* global palette */
'use strict';

var Metabolite = function(attr) {

    var that = new Node(attr.name, attr._id, attr.type, attr.radius);
    that.radius = attr.radius;

    that.draw = function() {
        that.context.beginPath();
        that.context.arc(that.x, that.y, that.radius, 0, 2 * Math.PI);
        that.context.fillStyle = 'green';
        that.context.fill();
        that.context.closePath();
    };

    return that;
};
