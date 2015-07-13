/* global Node */
/* global palette */
'use strict';

var Reaction = function(name, id, radius, flux_value) {
    var that = new Node(name, id, "r", radius);
    that.getFlux = function() {
        return flux_value;
    };
    that.draw = function() {
        if (flux_value !== 0) {
            that._node.attr("id", that.getID())
                .append("circle")
                .attr("class", "node-r")
                .attr("r", radius)
                .attr("stroke", palette.nodestroketest)
                .attr("stroke-width", 35)
                .attr("stroke-opacity", 0)
                .style("opacity", 1)
                .attr("fill", palette.theblue)
            that._node
                .on("mouseover", that.mouseover)
                .on("mouseout", that.mouseout)
                .on("dblclick", that.dblclick)
                .on("click", that.mousedown);
        }
    };
    return that;
};
