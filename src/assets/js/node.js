/* global d3 */
/* global palette */
'use strict';

var Node = function(name, id, type, radius){
  var _private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),
    network: d3.select("canvas")
  }
  var _public = {
    nodeX: -18,
    nodeY: -18,
    radius: radius,
    draw: null,
    _node: null,
    context: d3.select("canvas").node().getContext("2d"),
    mouseover: function(d){
      mouseover(d);
    },
    setRadius: function(r){
      _public.radius = r;
    },
    mouseout: function(d){
      mouseout(d);
    },
    toString: function(){
      return (name.type+": " + _private.name + " id: " + _private.id + "\n");
    },
    getID: function(){
      return _private.id;
    },
    getType: function(){
      return _private.type;
    }
  };

  function mouseover(d) {
    _public._node.append("text")
                    .attr("class", "node-text")
                    .text(name)
                    .attr("x", 0)
                    .attr("y", -18)
                    .attr("font-family",  "Arial")
                    .attr("fill", palette.texttest)
                    .style("opacity", 1)
                    .attr("font-size", "1.1em")
                    .attr("text-anchor", "middle");
      _public._node.select("circle")
          .transition()
          .duration(100)
          .attr("r",  _public.radius + 5)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2)
          .attr("opacity", 1);

  }


  function mouseout(d) {
      _public._node.select("circle").transition()
          .duration(100)
          .attr("r", _public.radius)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)
          .attr("opacity", 1);
      _public._node
          .selectAll(".node-text")
          .transition()
          .duration(500)
          .remove();
  }
  return _public;
};
