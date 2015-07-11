var Reaction = function(name, id){
    this.prototype = new Node(name, id, "r");
    var private = {
      name: name.toString(),
      id: id.toString(),
      network: d3.select("svg").select(".subsystem"),
      node: null
    }
    private.node = private.network.select(".nodes").append("g").attr("class", "node")
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


      //event listener

      private.node.on("mouseover", this.mouseover)
                 .on("mouseout", this.mouseout)

    }
    this.prototype.mouseover =  function(d) {
      private.node.append("text")
                      .attr("class", "node-text")
                      .text(private.name)
                      .attr("font-family", "Arial")
                      .attr("fill", palette.texttest)
                      .style("opacity", 1)
                      .attr("font-size",  "1.1em")
                      .attr("text-anchor", "middle");
        d3.select(this)
            .select("circle")
            .transition()
            .duration(100)
            .attr("r", 6)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-opacity", 0)
            .attr("stroke-width", 35)
            .style("opacity", 1)

    }

    this.prototype.mouseout = function(d) {
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
          console.log(this);
        d3.select(this)
            .selectAll(".node-text")
            .transition()
            .duration(1000)
            .remove();
    };
    return this.prototype
}
