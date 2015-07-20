/* global Node */
/* global palette */
'use strict';

var Metabolite = function(name, id, radius) {
    var that = new Node(name, id, "m", radius);
    that.radius = radius;
    that.draw = function() {
        //console.log(that.context);
        console.log(d3.select('canvas').node().getContext("2d"));
        /*that.context.beginPath();
        that.context.rect(15, 150, 10, 10);
        that.context.fillStyle="red";
        that.context.fill();
        that.context.closePath();*/
        that.context.beginPath();
        that.context.arc(Math.random()*800, Math.random()*600, that.radius,0, 2*Math.PI);
        that.context.fillStyle="blue";

        that.context.fill();
        that.context.closePath();
        /*that._node.append("circle")
            .attr("class", "node-m")
            .attr("r", 10)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 1)
            .style("opacity", 1)
            .attr("fill", palette.themedarkblue)
            .on("mouseover", that.mouseover)
            .on("mouseout", that.mouseout);*/

    };

    return that;
};
