

var forcelayout = function(data){

  var keyresult = "";
  var num = 1;

  // Setting up the canvas
  var w = screen.width;
  var h = screen.height;


  //Palette
  var palette = {
      "red": "#FF0000",
      "blue": "#3E87D1",
      "green": "#33CC33",
      "yellow": "#FFFF00",
      "scarlet": "#990033",
      "pink": "#FF99CC",
      "purple": "#990099",
      "black": "#000000",
      "white": "#FFFFFF",
      "gray": "#D2D2D2",
      "brown": "#663300",
      "orange": "#FF7519",
      "darkblue": "#354458",
      "skyblue": "#77c5f7",
      "salmon": "#eb7260",
      "aqua": "#eb7260",
      "beige": "#e9e0d6",
      "themedarkblue": "#C4E4E6",
      "themenodestroke": "#3D8D8F",
      "themelightblue": "#BFE1BF",
      "themeyellow": "#FCD059",
      "themewhite": "#EDEDEA",
      "linktest": "#AED9AE",
      "nodestroketest": "#A2D7D8", //#A2D7D8 vs #62BBBD
      "texttest": "#DE5842"
  };

  // Triangle
  var markers = [{
      id: "triangle",
      path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z',
      viewbox: '-5 -5 10 10'
  }];
  // why include lowercase m

  // Zooming
  var zoom = d3.behavior.zoom()
      .scaleExtent([0.2, 40])
      .on("zoom", zoom);

  // Init svg canvas
  var svg = d3.select("body")
      .append("svg")
      .attr("class", "body")
      .attr("width", w)
      .attr("height", h)
      .call(zoom)
      .on("dblclick.zoom", null)
      .on("contextmenu", function(d, i) {
          d3.event.preventDefault();
      }) //prevents default right click pop-up
      .on("mousedown", function(d) {
          d3.select(".popup").remove();
          contextMenuShowing = false;
      });
  //why listen to mousedown

  svg.append("rect")
      .attr("width", w)
      .attr("height", h)
      .style("fill", "transparent")
      .style("pointer-events", "all");
  // why append rect to svg

  var network = svg
      .append("g")
      .attr("class", "network");
  //what is relationship between g and rect

  var nodes = [];
  var links = [];

  var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .charge(function(d) {
          if (d.type == "m") {
              return -1000
          } else {
              return -500
          }
      })
      .linkStrength(2)
      .linkDistance(50)
      .size([w, h])
      .on("tick", tick);
  //.start();

  var drag = force.drag().on("dragstart", dragstart);

  var link = network.append("g")
      .attr("class", "links")
      .selectAll("link");
  // link is a tag?? where is it declared?
  var node = network.append("g")
      .attr("class", "nodes")
      .selectAll("node");

  var marker = network.append("g")
      .attr("class", "markers")
      .selectAll(".marker")
      .data(markers)
      .enter()
    .append('svg:marker')
      .attr('id', function(d) {
          return d.id
      })
      .attr('markerHeight', 5)
      .attr('markerWidth', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('fill', palette.linktest)
      .attr('opacity', 1)
      .attr('viewBox', function(d) {
          return d.viewbox
      })
    .append('svg:path')
      .attr('d', function(d) {
          return d.path
      });

    window.addEventListener("keydown", function(event) {

      switch (event.keyCode) {
          case 77:
              // Do something for "down arrow" key press.
              keyresult = "m";
              break;
          case 82:
              // Do something for "up arrow" key press.
              keyresult = "r";
              break;

          default:

              return;

      }

      // Consume the event for suppressing "double action".
      event.preventDefault();
      if (keyresult === "m") {
          nodes.push({
              id: "New" + num.toString(),
              name: "New" + num.toString(),
              type: 'm'
          });
          num++;
          draw();
          force.start();

      } else if (keyresult === "r") {
          nodes.push({
              id: "New" + num.toString(),
              name: "New" + num.toString(),
              type: 'r'
          });
          num++;
          draw();
      }

      keyresult = "";


  });

  var check = [];

  var tempLinks = [];
  //making metabolite nodes

  for (var i = 0; i < data.metabolites.length; i++) {
      if (check.indexOf(data.metabolites[i].id != -1)) {

          nodes.push({
              id: data.metabolites[i].id,
              name: data.metabolites[i].name,
              selflink: false,
              type: "m"
          });
          check.push(data.metabolites[i].id);
      }

  }


  //making reaction nodes

  for (var i = 0; i < data.reactions.length; i++) {
      if (check.indexOf(data.reactions[i].id != -1)) {
          nodes.push({
              id: data.reactions[i].id,
              name: data.reactions[i].name,
              selflink: false,
              type: "r"
          });
          check.push(data.reactions[i].id);
      }

      var m = Object.keys(data.reactions[i].metabolites);
      for (var k = 0; k < m.length; k++) {
          if (data.reactions[i].metabolites[m[k]] > 0) {
              var s = data.reactions[i].id;
              var t = m[k];
          } else {
              var s = m[k];
              var t = data.reactions[i].id;
          }
          tempLinks.push({
              id: s + "-" + t,
              source: s,
              target: t
          });
      }
  }


  var nodesMap = map(nodes);

  for (var j = 0; j < tempLinks.length; j++) {
      var s = nodes[nodesMap[tempLinks[j].source]];
      var t = nodes[nodesMap[tempLinks[j].target]];
      links.push({
          id: s.id + "-" + t.id,
          source: s,
          target: t
      });
  }

  function map(nodes) {
      var ret = {};
      for (var j = 0; j < nodes.length; j++) {
          ret[nodes[j].id] = j;
      }
      return ret;
  }

  //=============DRAW ALL THIS SHIT YEEEEEEEEEEE=========
  draw();


  //==========================================================================================================================================
  //Removing Nodes and Links==================================================================================================================

  //UNCOMMENT THE CODE BELOW TO REMOVE DATA

  /*
  nodes.splice(0, 1); //Removes node a
  links.splice(0, 1); //Removes link a-b
  draw(); //After changing your nodes and links arrays, redraw the network
  */

  //====================RIGHT-CLICK CONTEXT MENUS========================

  /*
  var contextMenuShowing = false;
  d3.select("body").on("contextmenu", function(d, i){
        var target = d3.select(d3.event.target);

        if (contextMenuShowing) {
            d3.event.preventDefault();
            d3.select(".popup").remove();
            contextMenuShowing = false;
        }else if(target.classed("node-m")){
            d3.event.preventDefault();
            contextMenuShowing = true;
            var pop = d3.select("body");
            var mousePosition = d3.mouse(pop.node());

            var popup = pop.append("div")
                           .attr("class", "popup")
                           .style("left", mousePosition[0] + "px")
                           .style("top", mousePosition[1] + "px");
            //RENAME BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Rename")
                 .on("click", function(d){
                    alert("Rename this metabobitch")
                 });
            //Delete BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Delete")
                 .on("click", function(d){
                    alert("Delete function")
                 });

        }else if(target.classed("node-r")){
            d3.event.preventDefault();
            contextMenuShowing = true;
            var pop = d3.select("body");
            var mousePosition = d3.mouse(pop.node());

            var popup = pop.append("div")
                           .attr("class", "popup")
                           .style("left", mousePosition[0] + "px")
                           .style("top", mousePosition[1] + "px");
          //RENAME BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Rename")
                 .on("click", function(d){
                    alert("Rename this bitchreaction")
                 });
          //Delete BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Delete")
                 .on("click", function(d){
                    alert("Delete function")
                 });

        }else if(target.classed("link")){
            d3.event.preventDefault();
            contextMenuShowing = true;
            var pop = d3.select("body");
            var mousePosition = d3.mouse(pop.node());

            var popup = pop.append("div")
                           .attr("class", "popup")
                           .style("left", mousePosition[0] + "px")
                           .style("top", mousePosition[1] + "px");
          //RENAME BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Rename")
                 .on("click", function(d){
                    alert("Rename this limpdick")
                 });
          //Delete BUTTON
            popup.append("input")
                 .attr("type", "button")
                 .attr("value", "Delete")
                 .on("click", function(d){
                    alert("Delete function")
                 });

        }else{
          d3.event.preventDefault();
        }

        d3.select("body").on("mousedown", function(d){
            d3.select(".popup").remove();
            contextMenuShowing = false;
        });
  });

  */


  // Draw
  function draw() {
      d3.selectAll("[class=node-selflink]").remove();
      d3.selectAll("[class=node-text]").remove();
      d3.selectAll("[class=node-circle]").remove();
      //d3.selectAll("[class=node-m]").remove();
      //d3.selectAll("[class=node-r]").remove();


      link = link.data(force.links(), function(d) {
          return d.source.id + "-" + d.target.id;
      })
      link.enter().insert("line")
          .attr("class", "link")
          .attr("id", function(d) {
              return "id-" + d.id
          })
          .attr("stroke", palette.linktest)
          .attr("fill", "none")
          .attr("opacity", 1)
          .attr("stroke-width", 2)
          .attr("marker-end", function(d) {
              if (d.source.type == "r") {
                  return "url(#triangle)"
              }
          })
          .on("contextmenu", linkRightClick)
          .on("mousedown", function(d) {
              d3.select(".popup").remove();
              contextMenuShowing = false;
          });

      link.exit().remove();

      node = node.data(force.nodes(), function(d) {
          return d.id;
      });

      node.enter().append("g")
          .attr("class", "node")
          .attr("id", function(d) {
              return "id-" + d.id
          })
          .on("mouseout", nodeMouseout)
          .on('mouseover', nodeMouseover)
          .on("dblclick", dblclick)
          .on("contextmenu", nodeRightClick)
          .on("mousedown", function(d) {
              d3.select(".popup").remove();
              contextMenuShowing = false;
          })
          .call(drag);

      //Create circle shape for node
      node.append("circle")
          .attr("class", "node-circle")
          //.attr("class", function(d){if(d.type == 'm'){return "node-m";}else{return "node-r"}})
          .attr("r", function(d) {
              if (d.type == 'm') {
                  return 10;
              } else {
                  return 4
              }
          })
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-width", function(d) {
              if (d.type == 'm') {
                  return 1;
              } else {
                  return 35
              }
          })
          .attr("stroke-opacity", function(d) {
              if (d.type == 'm') {
                  return 1;
              } else {
                  return "0"
              }
          })
          .style("opacity", 1)
          .attr("fill", function(d) {
              if (d.type == "m") {
                  return palette.themedarkblue
              } else {
                  return palette.themeyellow
              }
          });

      //Create text for node
      node.append("text")
          .attr("class", "node-text")
          .text(function(d, i) {
              return d.name;
          })
          .attr("x", 0)
          .attr("y", function(d) {
              if (d.type == 'm') {
                  return -18;
              } else {
                  return -5
              }
          })
          .attr("font-family", "Arial")
          .attr("fill", palette.texttest)
          .style("opacity", function(d) {
              if (d.type == 'm') {
                  return 0.8;
              } else {
                  return 0
              }
          })
          .attr("font-size", function(d) {
              if (d.type == 'm') {
                  return "1.1em";
              } else {
                  return "0em"
              }
          })
          .attr("text-anchor", "middle");
      node.exit().remove();

      function linkRightClick(d, i) {
          var copy = [];
          if (contextMenuShowing) {
              d3.event.preventDefault();
              d3.select(".popup").remove();
              contextMenuShowing = false;
          } else {
              d3.event.preventDefault();
              contextMenuShowing = true;
              var pop = d3.select("body");
              var mousePosition = d3.mouse(pop.node());

              var popup = pop.append("div")
                  .attr("class", "popup")
                  .style("left", mousePosition[0] + "px")
                  .style("top", mousePosition[1] + "px");
              //RENAME BUTTON
              popup.append("input")
                  .attr("type", "button")
                  .attr("value", "Rename")
                  .on("click", function() {
                      alert("Rename this" + d.id)
                      force.start();
                  });
              //Delete BUTTON
                popup.append("input")
                  .attr("type", "button")
                  .attr("value", "Delete")
                  .on("click", function() {
                      for (var i = 0; i < nodes.length; i++) {
                          if (d.id == nodes[i].id) {
                              nodes.splice(i, i + 1);
                              i = nodes.length + 100;
                          }
                      }
                      for (var i = 0; i < links.length; i++) {
                          if (d.id == links[i].id) {
                              links.splice(i, i + 1);
                              i = links.length + 100;
                          }
                      }
                      draw();
                  });

          }
      }

      function nodeRightClick(d, i) {
              if (contextMenuShowing) {
                  d3.event.preventDefault();
                  d3.select(".popup").remove();
                  contextMenuShowing = false;
              } else if (d.type == "m") {
                  d3.event.preventDefault();
                  contextMenuShowing = true;
                  var pop = d3.select("body");
                  var mousePosition = d3.mouse(pop.node());

                  var popup = pop.append("div")
                      .attr("class", "popup")
                      .style("left", mousePosition[0] + "px")
                      .style("top", mousePosition[1] + "px");
                  //RENAME BUTTON
                  popup.append("input")
                      .attr("type", "button")
                      .attr("value", "Rename")
                      .on("click", function(d) {
                          prompt("Rename this metabobitch")
                      });
                  //Delete BUTTON
                  popup.append("input")
                      .attr("type", "button")
                      .attr("value", "Delete")
                      .on("click", function(d) {
                          alert("Delete function")
                      });
              } else {
                  d3.event.preventDefault();
                  contextMenuShowing = true;
                  var pop = d3.select("body");
                  var mousePosition = d3.mouse(pop.node());

                  var popup = pop.append("div")
                      .attr("class", "popup")
                      .style("left", mousePosition[0] + "px")
                      .style("top", mousePosition[1] + "px");
                  //RENAME BUTTON
                  popup.append("input")
                      .attr("type", "button")
                      .attr("value", "Rename")
                      .on("click", function() {
                          alert("Rename this" + d.id)
                      });
                  //Delete BUTTON
                  popup.append("input")
                      .attr("type", "button")
                      .attr("value", "Delete")
                      .on("click", function() {

                          for (var i = 0; i < nodes.length; i++) {
                              if (d.id == nodes[i].id) {
                                  for (var o = 0; o < i; o++) {
                                      copy.push(nodes[o]);
                                  }
                                  for (var u = i + 1; u < nodes.length; u++) {
                                      copy.push(nodes[u]);
                                  }
                                  nodes = copy;
                                  copy = [];
                                  i = nodes.length + 200;
                              }

                          }
                          /*
                                                            for (var i =0; i<links.length;i++){
                                                            if (d.id==links[i].id){
                                                              links.splice(i, i+1);
                                                              i=links.length+100;
                                                            }}*/

                      });

              }
          }
          //Starts force layout
      force.start();
  };

  // why use transform traslate on tick. what is default value of d.x d.y
  function tick() {
      node.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
      });
      link.attr("x1", function(d) {
              return d.source.x;
          })
          .attr("y1", function(d) {
              return d.source.y;
          })
          .attr("x2", function(d) {
              return d.target.x;
          })
          .attr("y2", function(d) {
              return d.target.y;
          });
  };

  function zoom() {
      network.attr("transform", "translate(" + d3.event.translate + ")scale(" +
          d3.event.scale + ")");
  };

  function dblclick(d) {
      //Doubleclick to place forces on node
      d3.select(this).classed("fixed", d.fixed = false);
      force.start();
  };

  function dragstart(d) {
      //Drag to fix node's position
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("fixed", d.fixed = true);
  };

  function nodeMouseover(d) {
      d3.select(this).selectAll(".node-circle").transition()
          .duration(100)
          .attr("r", function(d) {
              if (d.type == "m") {
                  return 14
              } else {
                  return 6
              }
          })
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", function(d) {
              if (d.type == "m") {
                  return 1
              } else {
                  return 0
              }
          })
          .attr("stroke-width", function(d) {
              if (d.type == "m") {
                  return 2
              } else {
                  return 35
              }
          })
          .attr("opacity", 1);
      /*
      d3.select(this).selectAll(".node-m").transition()
        .duration(100)
            .attr('r', 14)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-opacity", 1)
            .attr("stroke-wdith", 2)
            .style("opacity", 1);
      d3.select(this).selectAll(".node-r").transition()
        .duration(100)
            .attr('r', 6)
            .attr("stroke", palette.nodestroketest)
            .attr("stroke-opacity", 0)
            .attr("stroke-wdith", 35)
            .style("opacity", 1);
       */
      d3.select(this).selectAll(".node-text").transition()
          .duration(100)
          .attr("x", 0)
          .attr("y", function(d) {
              if (d.type == 'm') {
                  return -24;
              } else {
                  return -10
              }
          })
          .style("opacity", 1)
          .attr("font-size", function(d) {
              if (d.type == 'm') {
                  return "1.4em";
              } else {
                  return "1.0em"
              }
          })
          .attr("text-anchor", "middle");
  };

  function nodeMouseout(d) {

      d3.select(this).selectAll(".node-circle").transition()
          .duration(function(d) {
              if (d.type == 'm') {
                  return 100;
              } else {
                  return 800
              }
          })
          .attr("r", function(d) {
              if (d.type == "m") {
                  return 10
              } else {
                  return 4
              }
          })
          .attr("stroke", palette.nodestroketest)
          .attr("stroke-opacity", function(d) {
              if (d.type == "m") {
                  return 1
              } else {
                  return 0
              }
          })
          .attr("stroke-width", function(d) {
              if (d.type == "m") {
                  return 1
              } else {
                  return 35
              }
          })
          .attr("opacity", 1);
      /*
      d3.select(this).selectAll(".node-m").transition()
        .duration(100)
            .attr('r', 10)
            .attr("stroke-wdith", 1)
            .style("opacity", 1);
      d3.select(this).selectAll(".node-r").transition()
        .duration(800)
            .attr('r', 4)
            .attr("stroke-wdith", 35)
            .style("opacity", 1);
      */
      d3.select(this).selectAll(".node-text").transition()
          .duration(function(d) {
              if (d.type == 'm') {
                  return 100;
              } else {
                  return 800
              }
          })
          .attr("x", 0)
          .attr("y", function(d) {
              if (d.type == 'm') {
                  return -18;
              } else {
                  return -5
              }
          })
          .style("opacity", function(d) {
              if (d.type == 'm') {
                  return 0.8;
              } else {
                  return 0
              }
          })
          .attr("font-size", function(d) {
              if (d.type == 'm') {
                  return "1.1em";
              } else {
                  return "0em"
              }
          })
          .attr("text-anchor", "middle");
  };
}
