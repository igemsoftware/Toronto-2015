/* global d3 */
/* global System */
'use strict';

var Network = function(attributes) {
    //_private variables
    var _private = {
       canvas: null, //the <canvas> tag class:body
       conext: null,
        network: null, //the <g> tag class:network
        nodes: null, //all node elements class:node under <g> class:nodes
        links: null, //all link elements class:link under <g> class:nodes
        attributes: attributes, // User Configurable attributes related to the network
        pathways: [],
        nodesSet: [], //array of nodes data
        linkSet: [], //array of links data
    };
    init();

    function init() {
        // Create necessary tags/containers and initiate force
        //Append canvas tag
        _private.canvas = d3.select(attributes.divName).append('canvas').attr("class", "body")
                                                        .attr("height", attributes.canvas.height)
                                                        .attr("width", attributes.canvas.width)

        /*_private.canvas.append("rect").attr("width", attributes.canvas.width)
            .attr("height", attributes.canvas.height)
            .style("fill", "transparent")
            .style("pointer-events", "all");
        //Assign attributes to canvas tag
        var keys = Object.keys(attributes.canvas);
        for (var i = 0; i < keys.length; i++)
            _private.canvas.attr(keys[i], attributes.canvas[keys[i]]);
        //Create 2 <g> containers for nodes and links in the network <g> container
        _private.network = _private.canvas.append("g").attr("class",
            "network");
        _private.canvas.call(d3.behavior.zoom().scaleExtent([0.01, 100]).on(
            "zoom", zoom));*/

    }

    function draw() {
      
    }

    function addSystem(model) {
        var path = new System(_private.attributes, model);
    }

    return {
        addSystem: function(jsonData) {
            addSystem(jsonData);
        }
    };
};
