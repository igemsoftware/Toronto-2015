var Pathway = function(network){
    //not private yet;
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
      "themedarkblue" : "#C4E4E6",
      "themenodestroke" :"#3D8D8F",
      "themelightblue" : "#BFE1BF",
      "themeyellow" : "#FCD059",
      "themewhite" : "#EDEDEA",
      "linktest" : "#AED9AE",
      "nodestroketest" : "#A2D7D8", //#A2D7D8 vs #62BBBD
      "texttest": "#DE5842"
    };

    var private = {
        that: network
    }

    //init for the first time
    function init(data){
        private.that.nodes = [];
        private.that.links = [];

        private.that.link = private.that.network.append("g")
        .attr("class", "links")
        .selectAll("link");

        private.that.node = private.that.network.append("g")
        .attr("class", "nodes")
        .selectAll("node");

        var check = [];
        private.that.force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .charge(function(d){if(d.type == "m"){return -1000}else{return -500}})
        .linkStrength(2)
        .linkDistance(50)
        .size([private.that.attributes.width, private.that.attributes.height])
        .on("tick", tick)
        .start();
        //TEMP!!!!!!!!
        private.that.data = data;
        private.that.drag = force.drag().on("dragstart", dragstart);
        createReactionNodes(data);

        var markers = [
          {id: "triangle", path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10' }
        ];


        var marker = private.that.network.append("g")
        .attr("class", "markers")
        .selectAll(".marker")
        .data(markers)
        .enter()
        .append('svg:marker')
        .attr('id', function(d){ return d.id})
        .attr('markerHeight', 5)
        .attr('markerWidth', 5)
        .attr('markerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('refX', 13)
        .attr('refY', 0)
        .attr('fill', palette.linktest)
        .attr('opacity', 1)
        .attr('viewBox', function(d){ return d.viewbox })
        .append('svg:path')
        .attr('d', function(d){ return d.path });


        draw();
    }
    var dragstart = function(d) {
              //Drag to fix node's position
              d3.event.sourceEvent.stopPropagation();
              d3.select(this).classed("fixed", d.fixed = true);
            };
    function createReactionNodes(data){
      var tempLinks = [];
      var check = [];
      //making metabolite nodes
      for (var j=0; j<data.length;j++){
        for (var i = 0; i<data[j].metabolites.length; i++){
          private.that.nodes.push ({
            id: data[j].metabolites[i].id,
            name:data[j].metabolites[i].name,
            selflink: false,
            type: "m"
          });
          check.push(data[j].metabolites[i].id);

        }
      };
      var nodesMap = map(nodes);
      for (var j=0; j<tempLinks.length;j++){
        var s = nodes[nodesMap[tempLinks[j].source]];
        var t = nodes[nodesMap[tempLinks[j].target]];
        links.push({id: s.id+"-"+t.id, source: s, target: t});
      }
    }
    //Mouse listener behaviour on nodes

    function dblclick(d) {
          //Doubleclick to place forces on node
          d3.select(this).classed("fixed", d.fixed = false);
          force.start();
    }
    function nodeMouseover(d){
      d3.select(this).selectAll(".node-circle").transition()
      .duration(100)
      .attr("r", function(d){if(d.type == "m"){return 14} else{return 6}})
      .attr("stroke", palette.nodestroketest)
      .attr("stroke-opacity", function(d){if(d.type == "m"){return 1} else{return 0}})
      .attr("stroke-width", function(d){if(d.type =="m"){return 2} else{return 35}})
      .attr("opacity", 1);

      d3.select(this).selectAll(".node-text").transition()
      .duration(100)
      .attr("x", 0)
      .attr("y", function(d){if(d.type == 'm'){return -24;}else{return -10}})
      .style("opacity", 1)
      .attr("font-size",function(d){if(d.type == 'm'){return "1.4em";}else{return "1.0em"}})
      .attr("text-anchor", "middle");
    };

    function nodeMouseout(d){

      d3.select(this).selectAll(".node-circle").transition()
      .duration(function(d){if(d.type == 'm'){return 100;}else{return 800}})
      .attr("r", function(d){if(d.type == "m"){return 10} else{return 4}})
      .attr("stroke", palette.nodestroketest)
      .attr("stroke-opacity", function(d){if(d.type == "m"){return 1} else{return 0}})
      .attr("stroke-width", function(d){if(d.type =="m"){return 1} else{return 35}})
      .attr("opacity", 1);

      d3.select(this).selectAll(".node-text").transition()
      .duration(function(d){if(d.type == 'm'){return 100;}else{return 800}})
      .attr("x", 0)
      .attr("y", function(d){if(d.type == 'm'){return -18;}else{return -5}})
      .style("opacity", function(d){if(d.type == 'm'){return 0.8;}else{return 0}})
      .attr("font-size", function(d){if(d.type == 'm'){return "1.1em";}else{return "0em"}})
      .attr("text-anchor", "middle");
    }


    function map(nodes){
      var ret = {};
      for (var j=0; j<nodes.length;j++){
        ret[nodes[j].id] = j;
      }
      return ret;
    }
    function tick(){

        private.that.node.attr("transform", function(d) {
              console.log(node);
          return "translate(" + d.x + "," + d.y + ")"; });
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      }
      function draw(){
        d3.selectAll("[class=node-selflink]").remove();
        d3.selectAll("[class=node-text]").remove();
        d3.selectAll("[class=node-circle]").remove();
        //d3.selectAll("[class=node-m]").remove();
        //d3.selectAll("[class=node-r]").remove();


        link = link.data(private.that.force.links(), function(d){ return d.source.id + "-" + d.target.id; })
        link.enter().insert("line")
        .attr("class", "link")
        .attr("id", function(d){return "id-"+d.id})
        .attr("stroke", palette.linktest)
        .attr("fill", "none")
        .attr("opacity", 1)
        .attr("stroke-width", 2)
        .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})
        .on("contextmenu", linkRightClick)
        .on("mousedown", function(d){
          d3.select(".popup").remove();
          contextMenuShowing = false;
        });

        link.exit().remove();

        node = node.data(force.nodes(), function(d) { return d.id;});

        node.enter().append("g")
        .attr("class", "node")
        .attr("id", function(d){return "id-"+d.id})
        .on("mouseout", nodeMouseout)
        .on('mouseover', nodeMouseover)
        .on("dblclick", dblclick)
        .on("contextmenu", nodeRightClick)
        .on("mousedown", function(d){
          d3.select(".popup").remove();
          contextMenuShowing = false;
        })
        .call(drag);

        //Create circle shape for node
        node.append("circle")
        .attr("class", "node-circle")
        //.attr("class", function(d){if(d.type == 'm'){return "node-m";}else{return "node-r"}})
        .attr("r", function(d){if(d.type == 'm'){return 10;}else{return 4}})
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-width", function(d){if(d.type == 'm'){return 1;}else{return 35}})
        .attr("stroke-opacity", function(d){if(d.type == 'm'){return 1;}else{return "0"}} )
        .style("opacity", 1)
        .attr("fill", function(d){if(d.type =="m"){return palette.themedarkblue}else{return palette.themeyellow}});

        //Create text for node
        node.append("text")
        .attr("class", "node-text")
        .text(function(d, i) { return d.name; })
        .attr("x", 0)
        .attr("y", function(d){if(d.type == 'm'){return -18;}else{return -5}})
        .attr("font-family",  "Arial")
        .attr("fill", palette.texttest)
        .style("opacity", function(d){if(d.type == 'm'){return 0.8;}else{return 0}})
        .attr("font-size", function(d){if(d.type == 'm'){return "1.1em";}else{return "0em"}})
        .attr("text-anchor", "middle");
        node.exit().remove();
        //WIP
        function linkRightClick(d,i){
          var copy=[];
          if (contextMenuShowing) {
            d3.event.preventDefault();
            d3.select(".popup").remove();
            contextMenuShowing = false;
          }
          else{
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
            .on("click", function(){
              alert("Rename this" + d.id)
            });
            //Delete BUTTON
            popup.append("input")
            .attr("type", "button")
            .attr("value", "Delete")
            .on("click", function(){
              for (var i =0; i<nodes.length;i++){
                if (d.id==nodes[i].id){
                  nodes.splice(i, i+1);
                  i=nodes.length+100;
                }}
                for (var i =0; i<links.length;i++){
                  if (d.id==links[i].id){
                    links.splice(i, i+1);
                    i=links.length+100;
                  }}
                  draw();
                });

              }
            }
            function nodeRightClick(d,i){
              if (contextMenuShowing) {
                d3.event.preventDefault();
                d3.select(".popup").remove();
                contextMenuShowing = false;
              }
              else if(d.type == "m"){
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
                  prompt("Rename this metabobitch")
                });
                //Delete BUTTON
                popup.append("input")
                .attr("type", "button")
                .attr("value", "Delete")
                .on("click", function(d){
                  alert("Delete function")
                });
              }
              else{
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
                .on("click", function(){
                  alert("Rename this" + d.id)
                });
                //Delete BUTTON
                popup.append("input")
                .attr("type", "button")
                .attr("value", "Delete")
                .on("click", function(){

                  for (var i=0; i<nodes.length ; i++){
                    if (d.id == nodes[i].id){
                      for (var o=0; o<i; o++){
                        copy.push(nodes[o]);
                      }
                      for (var u=i+1; u<nodes.length; u++){
                        copy.push (nodes[u]);
                      }
                      nodes=copy;
                      copy=[];
                      i=nodes.length+200;
                    }

                  }

                });
              //Starts force layout
              force.start();
            }
          }
        }
    return{
      init: function(data){
          init(data)
      },
      test: function(){
        alert("test");
      }
    }

}
