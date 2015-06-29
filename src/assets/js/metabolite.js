var Metabolite = function(nodes, name, id, force){
  var private = {
    nodes: nodes,
    id: id,
    name: name,
    type: "m",
    force: force
  }
  function draw(){

    private.nodes.enter().append("g")
                .attr("class", "node")
                .attr("id", private.id)
                .append("circle")
        .attr("class", "node-circle")
        .attr("r", 10)
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-width", 1)
        .attr("stroke-opacity",1)
        .style("opacity", 1)
        .attr("fill",  palette.themedarkblue);
  }
  return{
    toString: function(){
      console.log("Metabolite: " + private.name + " id: " + private.id + "\n");
    },
    getID: function(){
      return private.id;
    },
    draw: function(){
      draw();
    },
    getJSON: function(){
      return{
        name: private.name,
        id: private.id,
        type: private.type,
        selflink: false
      }
    }
  }
}
