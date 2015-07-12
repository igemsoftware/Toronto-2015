var Node = function(name, id, type, radius){
  var private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),
    network: d3.select("svg").select(".system"),
  }
  var public = {
    radius: radius,
    draw: null,
    _node: private.network.select(".nodes").append("g").attr("class", "node")
                  .attr("id", private.id),
    mouseover: function(d){
      mouseover(d);
    },
    setRadius: function(r){
      public.radius = r;
    },
    mouseout: function(d){
      mouseout(d);
    },
    toString: function(){
      return (name.type+": " + private.name + " id: " + private.id + "\n");
    },
    getID: function(){
      return private.id;
    },
    getType: function(){
      return private.type;
    }
  }

  function mouseover(d) {
    public._node.append("text")
                    .attr("class", "node-text")
                    .text(name)
                    .attr("x", 0)
                    .attr("y", -18)
                    .attr("font-family",  "Arial")
                    .attr("fill", palette.texttest)
                    .style("opacity", 1)
                    .attr("font-size", "1.1em")
                    .attr("text-anchor", "middle");
      public._node.select("circle")
          .transition()
          .duration(100)
          .attr("r",  public.radius + 5)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2)
          .attr("opacity", 1);

  }


  function mouseout(d) {
      public._node.select("circle").transition()
          .duration(100)
          .attr("r", public.radius)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)
          .attr("opacity", 1);
      public._node
          .selectAll(".node-text")
          .transition()
          .duration(500)
          .remove()
  }
  return public
}
