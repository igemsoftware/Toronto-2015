var Metabolite = function(name, id){
  this.prototype = new Node(name, id, "m");
  var private = {
    name: name.toString(),
    id: id.toString(),
    network: d3.select("svg").select(".subsystem"),
    node: null,
    force: d3.layout.force() //temp
  }
  //init
  private.node = private.network.select(".nodes").append("g").attr("class", "node")
                .attr("id", private.id)

  this.prototype.draw = function(){

      private.node.append("circle")
                    .attr("class", "node-m")
                    .attr("r", 10)
                    .attr("stroke", palette.nodestroketest)
                    .attr("stroke-width", 1)
                    .attr("stroke-opacity", 1)
                    .style("opacity", 1)
                    .attr("fill", palette.themedarkblue)

      private.node.on("mouseover", this.mouseover)
                  .on("mouseout", this.mouseout)
  }
  this.prototype.mouseover = function(d) {
    private.node.append("text")
                    .attr("class", "node-text")
                    .text(name)
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
