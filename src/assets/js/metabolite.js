var Metabolite = function(name, id){
  this.prototype = new Node(name, id, "m");
  var private = this.prototype.private


  //create a node
  this.prototype.draw = function(){
      var json = {//temp
        name: private.name,
        id: private.id,
        type: private.type
      }
      // loading data to node
      private.node.data(json)
      private.node.attr("id", private.id)
                    .append("circle")
                    .attr("class", "node-m")
                    .attr("r", 10)
                    .attr("stroke", palette.nodestroketest)
                    .attr("stroke-width", 1)
                    .attr("stroke-opacity", 1)
                    .style("opacity", 1)
                    .attr("fill", palette.themedarkblue)
      private.node.append("text")
                      .attr("class", "node-text")
                      .text(function(d, i) { return d.name; })
                      .attr("x", 0)
                      .attr("y", -18)
                      .attr("font-family",  "Arial")
                      .attr("fill", palette.texttest)
                      .style("opacity", 0)
                      .attr("font-size", "1.1em")
                      .attr("text-anchor", "middle");
      private.node.on("mouseover", mouseover)
                  .on("mouseout", mouseout)

  }
  function mouseover(d) {

      d3.select(this).selectAll("circle").transition()
          .duration(100)
          .attr("r",  14)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2)
          .attr("opacity", 1);

      d3.select(this).selectAll(".node-text").transition()
          .duration(100)
          .style("opacity", 1)
          .attr("font-size", "1.4em")
          .attr("text-anchor", "middle");
  };

  function mouseout(d) {
      d3.select(this).selectAll(".node-circle").transition()
          .duration(100)
          .attr("r", 10)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)
          .attr("opacity", 1);
      d3.select(this).selectAll(".node-text")
          .transition()
          .duration(100)
          .style("opacity", 0)
          .attr("font-size",  "1.1em")
          .attr("text-anchor", "middle");
  }


  return this.prototype

}
