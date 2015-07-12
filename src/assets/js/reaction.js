var Reaction = function(name, id, radiusScale, flux_value){
    var that = new Node(name, id, "r", radiusScale(flux_value));
    that.getFlux = function(){
      return flux_value;
    }
    that.draw = function(){
        if(flux_value != 0){
            that.node.attr("id", that.getID())
                          .append("circle")
                          .attr("class", "node-r")
                          .attr("r", radiusScale(flux_value))
                          .attr("stroke", palette.nodestroketest)
                          .attr("stroke-width", 35)
                          .attr("stroke-opacity", 0)
                          .style("opacity", 1)
                          .attr("fill", palette.themeyellow)
                          .on("mouseover", that.mouseover)
                          .on("mouseout", that.mouseout)
        }


    }
    return that
}
