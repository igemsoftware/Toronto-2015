var Network = function(attributes) {
  //private variables
  var private = {
      container: null,    //the <svg> tag class:body
      network: null,  //the <g> tag class:network
      nodes: null,     //all node elements class:node under <g> class:nodes
      links: null,    //all link elements class:link under <g> class:nodes
      attributes: attributes, // User Configurable attributes related to the network
      pathways: [],
      nodesSet: [], //array of nodes data
      linkSet: [], //array of links data
  }
  init()
  function init(){
      // Create necessary tags/containers and initiate force
      //Append svg tag
      private.container = d3.select(attributes.divName);
      /*private.svg.append("rect").attr("width", attributes['svg']['width'])
                                .attr("height", attributes['svg']['height'])
                                .style("fill", "transparent")
                                .style("pointer-events", "all");*/
      //Assign attributes to svg tag

      var keys = Object.keys(attributes.svg);
      for(var i = 0; i < keys.length; i++)
          private.container.attr(keys[i], attributes.svg[keys[i]]);
        console.log(private.container);
      private.network = new sigma("network"); //use network id, harded right now
          /*network.graph.addNode({
            "id": "n0",
            "label": "node1",
            "x": 10,
            "y": 10,
            "size": Math.random()*10
          });*/
      //Create 2 <g> containers for nodes and links in the network <g> container

  }

  function draw(){
  }
  function addSystem(model){
      var path = new System(private.network, model);
      //refresh

  }

  return {
    addSystem: function(jsonData){
        addSystem(jsonData);
    }
  }
}
