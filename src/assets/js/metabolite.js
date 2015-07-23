/* global Node */
/* global palette */
'use strict';

var Metabolite = function(name, id, radius) {

  var that = new Node(name, id, 'm', radius);
  that.radius = radius;

  that.draw = function() {
    that.context.beginPath();
    that.context.arc(that.x, that.y, that.radius, 0, 2 * Math.PI);
    that.context.fillStyle = 'blue';
    that.context.fill();
    that.context.closePath();
  };

  return that;
};
