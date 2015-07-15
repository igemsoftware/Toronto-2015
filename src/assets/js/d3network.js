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
  init();
  function init(){
    // Create necessary tags/containers and initiate force
    //Append svg tag

    private.container = d3.select(attributes.divName);
    var keys = Object.keys(attributes.svg);
    for(var i = 0; i < keys.length; i++)
    private.container.attr(keys[i], attributes.svg[keys[i]]);

    var settings = {
      //autoRescale: false, for later
      defaultLabelColor: palette.darkblue,
      defaultEdgeColor: palette.darkblue,
      defaultNodeColor: palette.theblue,
      edgeColor: "default",
      minArrowSize: 2,
      labelColor: "#009688",
      // for hover events
      borderSize: 3,
      defaultNodeBorderColor: palette.theblue,
      nodeHoverColor: "default",
      defaultnodeHoverColor: palette.themeyellow,
      // scaling
      scalingMode: "outside",
      //captors
      doubleClickZoomingRatio: 5, //useful on zooming fast into a place
      zoomMin: 0.005,
      zoomMax: 10,
      mouseInertiaDuration: 0
    }
    var renderer = {
      type: 'canvas',
      container: "network"
    }
    private.network = new sigma({
      renderer: renderer,
      settings: settings
    });

    private.dragListener = new sigma.plugins.dragNodes(private.network, private.network.renderers[0]);
    private.dragListener.bind('startdrag', function(event) {
      console.log(event);
    });
    render()
  }
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 30);
      };
  })();

  (function animloop(){
    requestAnimFrame(animloop);
    update();
    render();
  })();
  function render(){
    private.network.refresh()
  }
  function update(){
    for(var i = 0; i < private.pathways.length; i++){
      private.pathways[i].update();
      console.log("here");
    }
  }
  function addSystem(model){
    //console.log("making a path")
    private.pathways.push(new System(private.network, model));


  }

  return {
    addSystem: function(jsonData){
      addSystem(jsonData);
    }
  }
}
