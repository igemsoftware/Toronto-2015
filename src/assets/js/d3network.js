/* global d3 */
/* global System */
'use strict';

var Network = function(attributes) {
    //_private variables
    //d3.ns.prefix.custom = "http://github.com/mbostock/d3/examples/dom";
    var _private = {
        svg: null, //the <svg> tag class:body
        network: null, //the <g> tag class:network
        nodes: null, //all node elements class:node under <g> class:nodes
        links: null, //all link elements class:link under <g> class:nodes
        attributes: attributes, // User Configurable attributes related to the network
        pathways: [],
        nodesSet: [], //array of nodes data
        linkSet: [], //array of links data
        sketch: null
    };
    init();

    function init() {
        // Create necessary tags/containers and initiate force
        //Append svg tag
        _private.sketch = d3.select(attributes.divName).append("custom:sketch")
                                .attr("width", attributes.svg.width)
                                .attr("height", attributes.svg.height)


        /*_private.svg = d3.select(attributes.divName).append('svg').attr("class", "body");
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
            "zoom", zoom));*/
    }

    function custom(selection) {
      selection.each(function() {
        var root = this,
        canvas = root.parentNode.appendChild(document.createElement("canvas")),
        context = canvas.getContext("2d");

    canvas.style.position = "absolute";
    canvas.style.top = root.offsetTop + "px";
    canvas.style.left = root.offsetLeft + "px";

    // It'd be nice to use DOM Mutation Events here instead.
    // However, they appear to arrive irregularly, causing choppy animation.
    d3.timer(redraw);
    //draw();
    // Clear the canvas and then iterate over child elements.
    function redraw() {

      canvas.width = root.getAttribute("width");
      canvas.height = root.getAttribute("height");
      for (var child = root.firstChild; child; child = child.nextSibling){
          draw(child);
      }
    }

    //draw circles eh
    function draw(element) {
    //  console.log(  d3.select(element).select(".nodes").selectAll(".node")[0])
      d3.select(element).select(".nodes").selectAll(".node")[0].forEach(function(d){

            var circle = d3.select(d).select("circle")
            if(!circle[0][0])
              return
            context.strokeStyle = '#000000';
            context.beginPath();
            var rad = circle.attr("r")
            if(rad <= 0)
              rad = 1
            context.arc(circle.attr("x"), circle.attr("y"), rad, 0, 2 * Math.PI);
            context.stroke();

          })
    //return
    d3.select(element).select(".links").selectAll(".link")[0].forEach(function(d){

                var line = d3.select(d).select("line")

                context.strokeStyle = '#000000';
                context.beginPath();
                context.strokeStyle = '#000000';
                context.moveTo(line.attr("x1"), line.attr("y1"))
                context.lineTo(line.attr("x2"), line.attr("y2"))
                context.stroke();

              })
        }
      });


    }


    function addSystem(model) {
        var path = new System(_private.attributes, model);
        _private.sketch.call(custom);
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
