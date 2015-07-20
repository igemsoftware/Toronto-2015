/* global Node */
/* global palette */
'use strict';

var Reaction = function(name, id, radius, flux_value) {
    var that = new Node(name, id, "r", radius);
    that.getFlux = function() {
        return flux_value;
    };
    that.draw = function() {
      that.context.beginPath();
      that.context.arc(that.x, that.y, that.radius,0, 2*Math.PI);
      that.context.fillStyle="blue";

      that.context.fill();
      that.context.closePath();
        /*if (flux_value !== 0) {
            that._node.attr("id", that.getID())
                .append("circle")
                .attr("class", "node-r")
                .attr("r", radius)
                .attr("stroke", palette.nodestroketest)
                .attr("stroke-width", 35)
                .attr("stroke-opacity", 0)
                .style("opacity", 1)
                .attr("fill", palette.themeyellow)
                .on("mouseover", that.mouseover)
                .on("mouseout", that.mouseout);
        }*/
    };
  
    return that;
};
