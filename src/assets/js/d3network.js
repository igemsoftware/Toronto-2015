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
      dragListener: null
  }
  init()
  function init(){
      // Create necessary tags/containers and initiate force
      //Append svg tag
      //test

      private.container = d3.select(attributes.divName);
      /*private.svg.append("rect").attr("width", attributes['svg']['width'])
                                .attr("height", attributes['svg']['height'])
                                .style("fill", "transparent")
                                .style("pointer-events", "all");*/
      //Assign attributes to svg tag

      var keys = Object.keys(attributes.svg);
      for(var i = 0; i < keys.length; i++)
          private.container.attr(keys[i], attributes.svg[keys[i]]);
      //set renderer to canvas
      sigma.renderers.def = sigma.renderers.canvas
      private.network = new sigma("network"); //use network id, harded right now
      private.dragListener = new sigma.plugins.dragNodes(private.network, private.network.renderers[0]);
      private.dragListener.bind('startdrag', function(event) {
              console.log(event);
      });


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
