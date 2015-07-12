var System = function(attributes, system){
  var private = {
    network: null,
    nodes: null,     //all node elements class:node under <g> class:nodes
    links: null,    //all link elements class:link under <g> class:nodes
    force: null,
    system: null,
    attributes: attributes,
    linkSet: [],    //link data
    nodesSet: [],   //node data
  }
  //initalize Pathway
  init(system);
  //init
  function init(system){
      //assign selection to private variables
      private.network = d3.select('svg').select('.network') ;
      //create system tag
      private.system = d3.select("svg").select(".network").append("g").attr("class", "system");
      //create HTML nodes tags and links tags
      private.nodes = private.system.append("g").attr("class", "nodes");
      private.links = private.system.append("g").attr("class", "links");
      //Create metabolite objects
      buildMetabolites(system);
      //Create reaction objects
      buildReactions(system);
      // initiate force
      private.force = d3.layout.force()
                          .nodes(private.nodesSet)
                          .links(private.linkSet)
                          .charge(-500)
                          .linkStrength(2)
                          .linkDistance(50)
                          .size([private.attributes['svg']['width'], private.attributes['svg']['height']])
                          .start()
                          .on("tick", tick);
      //adds data for links
      private.links = private.links.selectAll("line").data(private.linkSet);
      //and binds data for nodes
      private.nodes = private.nodes.selectAll(".node").data(private.nodesSet);
      //dragging
      var drag = private.force.drag().on("dragstart", function(d){
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("fixed", d.fixed = true);
      });
      private.nodes.call(drag);
      draw();
  }
  function buildMetabolites(system){
      // loop and bind metabolite data to metabolite node to nodeset
      for (var i = 0; i<system.metabolites.length; i++){
        private.nodesSet.push(new Metabolite(system.metabolites[i].name,
                                                  system.metabolites[i].id));
      }
  }
  function buildReactions(system){
      var tempLinks = [];
      // loop and bind reaction data to reaction node
      for (var i = 0; i<system.reactions.length; i++){
              private.nodesSet.push(new Reaction(system.reactions[i].name,
                                                system.reactions[i].id));

          // assign metabolite source and target for each reaction
          var m = Object.keys(system.reactions[i].metabolites);
          for (var k = 0; k<m.length; k++){
              if(system.reactions[i].metabolites[m[k]]>0){
                var s = system.reactions[i].id;
                var t = m[k];
              }else{
                var s = m[k];
                var t = system.reactions[i].id;
              }

              tempLinks.push({id: s+"-"+t, source: s, target: t});
          }
      }

      var nodesMap = map(private.nodesSet);
      //console.log(nodesMap);
      for (var j=0; j<tempLinks.length;j++){
          //ineffiecient, but will do for now
          var s = private.nodesSet[nodesMap[tempLinks[j].source]];
          var t =  private.nodesSet[nodesMap[tempLinks[j].target]];

          private.linkSet.push({id: s.getID()+"-"+t.getID(), source: s, target: t});
      }

  }
  //to be fixed later
  function addMarkers(){
      var markers = [
                      {id: "triangle", path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10' }
                    ];
      var marker = private.network.append("g")
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
  }
  //draw function
  function draw(){

    private.links = private.links
      .enter()
      .append("g")
      .attr("class", "link")
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", 1)
      .attr("marker-end", function(d) {
          if (d.source.type == "r") {
              return "url(#triangle)"
          }
      })
      // call draw function in reaction and metabolite node class
      for(var i = 0; i< private.nodesSet.length; i++){
        private.nodesSet[i].draw();
      }


  }
  //utilities function
  function map(nodesSet){
      var ret = {};
      for (var j=0; j<nodesSet.length;j++){
        ret[nodesSet[j].getID()] = j;
      }
      return ret;
  }
  function tick(){
    private.nodes.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"; });
    private.links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }
  //returns nothing as of now, everything done when you create the object
}
