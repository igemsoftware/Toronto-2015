var Metabolite = function(name, id){
  this.prototype = new Node(name, id, "m");
  var private = this.prototype.private


  //create a node
  this.prototype.draw = function(){
    var json = {//temp
      name: private.name,
      id: private.id,
      type: private.type,
      selflink: false
    }
    private.node.data(json)
  //  var node = private.network.select(".nodes")

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
                      .attr("y", function(d){if(d.type == 'm'){return -18;}else{return -5}})
                      .attr("font-family",  "Arial")
                      .attr("fill", palette.texttest)
                      .style("opacity", function(d){if(d.type == 'm'){return 0.8;}else{return 0}})
                      .attr("font-size", function(d){if(d.type == 'm'){return "1.1em";}else{return "0em"}})
                      .attr("text-anchor", "middle");
  }

  return this.prototype

}
