/* global d3 */
/* global System */
'use strict';

var Network = function(attributes) {
    //_private variables
    var _private = {
        svg: null, //the <svg> tag class:body
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
        //Append svg tag
        _private.svg = d3.select(attributes.divName).append('svg').attr("class", "body");
        _private.svg.append("rect").attr("width", attributes.svg.width)
            .attr("height", attributes.svg.height)
            .style("fill", "transparent")
            .style("pointer-events", "all");
        //Assign attributes to svg tag
        var keys = Object.keys(attributes.svg);
        for (var i = 0; i < keys.length; i++)
            _private.svg.attr(keys[i], attributes.svg[keys[i]]);
        //Create 2 <g> containers for nodes and links in the network <g> container
        _private.network = _private.svg.append("g").attr("class",
            "network");
        _private.svg.call(d3.behavior.zoom().scaleExtent([0.01, 100]).on(
            "zoom", zoom)).on("dblclick.zoom", null);
    }

    function draw() {}

    function addSystem(model) {
        var path = new System(_private.attributes, model);
    }

    function zoom() {
        _private.network.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    return {
        addSystem: function(jsonData) {
            addSystem(jsonData);
        }
    };
};
