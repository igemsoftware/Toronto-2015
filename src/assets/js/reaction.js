var Reaction = function(name, id){
    this.prototype = new Node(name, id, "r");
    var private = this.prototype.private
    this.prototype.draw = function draw(){
        private.node.attr("id", private.id)
                      .append("circle")
                      .attr("class", "node-r")
                      .attr("r", 4)
                      .attr("stroke", palette.nodestroketest)
                      .attr("stroke-width", 35)
                      .attr("stroke-opacity", 0)
                      .style("opacity", 1)
                      .attr("fill", palette.themeyellow);
    }
    return this.prototype
}
