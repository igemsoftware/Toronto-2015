var Metabolite = function(name, id){
  this.prototype = new Node(name, id, "m");
  var private = this.prototype.private


  //create a node
  this.prototype.draw = function draw(){

    private.node.attr("id", private.id)
                  .append("circle")
                  .attr("class", "node-m")
                  .attr("r", 10)
                  .attr("stroke", palette.nodestroketest)
                  .attr("stroke-width", 1)
                  .attr("stroke-opacity", 1)
                  .style("opacity", 1)
                  .attr("fill", palette.themedarkblue);
  }
  return this.prototype

}
