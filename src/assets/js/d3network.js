/* global d3 */
/* global System */
/* global console */
'use strict';

// Potentially rename
var Network = function(attributes) {
<<<<<<< HEAD

    var _private = {
        canvas     : null, // <canvas>
        network    : null, // tbr
        nodes      : null, // tbr
        links      : null, // tbr
        attributes : attributes, // User Configurable attributes related to the network
        pathways   : [], // see: system.js
        nodesSet   : [], // array of nodes data, see: node.js/metabolite.js/reaction.js
        linkSet    : [], // array of links data, see: link.js
        width      : 0,
        height     : 0
    };

    /**
     * Append the canvas DOM element.
     *
     * @return none
     */
    function init() {
        console.log('Initializing Network');
        _private.height = attributes.canvas.height;
        _private.width = attributes.canvas.width;
        _private.canvas = d3.select(attributes.divName)
            .append('canvas')
            .attr('height', _private.height)
            .attr('width', _private.width);
    }

    /**
     * @param model object The json metabolic model.
     *
     * @return none
     */
    function addSystem(model) {
        console.log('Creating new System with attributes:');
        console.log(_private.attributes);
        console.log('and model:');
        console.log(model);
        _private.pathways.push(new System(_private.attributes, model));
    }
=======
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
      //enableCamera: false
    });

  

   private.dragListener = new sigma.plugins.dragNodes(private.network, private.network.renderers[0]);
    private.dragListener.bind('startdrag', function(event) {
      console.log(event);

    });
  /*  private.dragListener.bind('drag', function(event) {
    event.data.node.data.setPosition(event.data.captor.x, event.data.captor.y) ;

    });
    private.dragListener.bind('dragend', function(event) {
      event.data.node.data.setPosition(event.data.captor.x, event.data.captor.y) ;

    });*/

  }
/*  window.requestAnimFrame = (function(){
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
  })();*/
  function render(){
    private.network.refresh();
  }
  function update(){
  /*  for(var i = 0; i < private.pathways.length; i++){
      private.pathways[i].update();
    }*/
  }
  function addSystem(model){
    private.pathways.push(new System(private.network, model, private.attributes.svg.height, private.attributes.svg.width));

>>>>>>> origin/sigma

    init();

<<<<<<< HEAD
    return {
        addSystem: function(jsonData) {
            addSystem(jsonData);
        }
    };
};
=======
  return {
    addSystem: function(jsonData){
      addSystem(jsonData);
    }
  }
}
>>>>>>> origin/sigma
