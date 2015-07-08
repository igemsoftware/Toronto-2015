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
                      .attr("fill", palette.themeyellow)

      private.node.append("text")
                      .attr("class", "node-text")
                      .text(function(d) {  return d.name;})
                      .attr("font-family", "Arial")
                      .attr("fill", palette.texttest)
                      .style("opacity", 0)
                      .attr("font-size",  "0em")
                      .attr("text-anchor", "middle");
      //event listener
      private.node.on("mouseover", mouseover)
                 .on("mouseout", mouseout)

    }
    function mouseover(d) {
      //hardcoded for now
      //console.log(this);
        d3.select(this)
            .select("circle")
            .transition()
            .duration(100)
            .attr("r", 6)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-opacity", 0)
            .attr("stroke-width", 35)
            .style("opacity", 1)


        d3.select(this)
            .select(".node-text")
            .transition()
            .duration(100)
            .style("opacity", 1)
            .attr("font-size", "1.0em")
            .attr("text-anchor", "middle");

    }

    function mouseout(d) {
        //hard coded for now
        d3.select(this)
            .select("circle")
            .transition()
            .duration(800)
            .attr("r", 4)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-opacity", 0)
            .attr("stroke-width", 35)
            .attr("opacity", 1);
        d3.select(this)
            .select(".node-text")
            .transition()
            .duration(800)
            .style("opacity", 0)
            .attr("font-size", "0em")
            .attr("text-anchor", "middle");
    };
    return this.prototype
}
