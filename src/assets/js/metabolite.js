/* global Node */
/* global palette */
'use strict';

var Metabolite = function(name, id, radius) {
    var that = new Node(name, id, "m", radius);
    that.radius = radius;
    that.draw = function() {
        that._node.append("circle")
            .attr("class", "node-m")
            .attr("r", 10)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 1)
            .style("opacity", 1)
            .attr("fill", palette.themedarkblue)
        that._node
            .on("mouseover", that.mouseover)
            .on("mouseout", that.mouseout)
            .on("dblclick", that.dblclick);
    };

    return that;
};
