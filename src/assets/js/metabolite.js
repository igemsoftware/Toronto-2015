var Metabolite = function(name, id){
  this.prototype = new Node(name, id, "m");
  var private = {
    name: name.toString(),
    id: id.toString(),
    network: d3.select("#network").select("svg").select(".network"),
    node: null,
    force: d3.layout.force() //temp
  }
  private.node = private.network.select(".nodes").append("g").attr("class", "node");
  //create a node
  this.prototype.draw = function(){
      // loading data to node
      private.node.data(this.getJSON)
      private.node.attr("id", private.id)
                    .append("circle")
                    .attr("class", "node-m")
                    .attr("r", 10)
                    .attr("stroke", palette.nodestroketest)
                    .attr("stroke-width", 1)
                    .attr("stroke-opacity", 1)
                    .style("opacity", 1)
                    .attr("fill", palette.themedarkblue)
                    .call(private.force.drag().on("dragstart", function(d){
                      d3.event.sourceEvent.stopPropagation();

                    }))

      private.node.on("mouseover", this.mouseover)
                  .on("mouseout", this.mouseout)



  }
  this.prototype.mouseover = function(d) {
    private.node.append("text")
                    .attr("class", "node-text")
                    .text(function(d, i) { return d.name; })
                    .attr("x", 0)
                    .attr("y", -18)
                    .attr("font-family",  "Arial")
                    .attr("fill", palette.texttest)
                    .style("opacity", 1)
                    .attr("font-size", "1.1em")
                    .attr("text-anchor", "middle");
      d3.select(this).select("circle")
          .transition()
          .duration(100)
          .attr("r",  14)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2)
          .attr("opacity", 1);

  }


  this.prototype.mouseout = function(d) {
      d3.select(this).select("circle").transition()
          .duration(100)
          .attr("r", 10)
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)
          .attr("opacity", 1);
      d3.select(this)
          .selectAll(".node-text")
          .transition()
          .duration(1000)
          .remove()
  }


  return this.prototype

}
