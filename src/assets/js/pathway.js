var Pathway = function(attributes, specie){
  var private = {
    nodes: null,     //all node elements class:node under <g> class:nodes
    links: null,    //all link elements class:link under <g> class:nodes
    force: null,
    subsystem: null,
    attributes: attributes,
    reactions: [], //Contain reactions and mataboites objects, each element is a metabolite/reaction element
    metabolites: [], //And we can for loop it maybe later in the draw function and draw each element indepently?
    linkSet: [],    //link data
    nodesSet: [],   //node data
  }
  //initalize Pathway
  init(specie);
  //init
  function init(specie){
      //assign selection to private variables

      //create subsystem tag
      private.subsystem = d3.select("svg").append("g").attr("class", "subsystem");
      //create HTML nodes tags and links tags
      private.nodes = private.subsystem.append("g").attr("class", "nodes");
      private.links = private.subsystem.append("g").attr("class", "links");
      //.data(private.linkSet);
      //Create metabolite objects
      buildMetabolites(specie);
      //Create reaction objects
      buildReactions(specie);
      // initiate force: thinking of assigning assign value to variables and move them to a variables.js
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


  //    private.links.append("line");
    //  console.log(private.links)
      draw()
      //private.subsystem.select(".nodes").selectAll(".node").attr("transform", "translate(50, 50)");
      console.log(private.nodes);
      // console.log(private.nodesSet);
      //console.log(private.linkSet);
      //private.nodes.attr("transform", "translate(50, 50)");
      //console.log(private.force.nodes())
      //console.log(private.force.links())
      private.force.start()


  }
  function buildMetabolites(specie){
      // loop and bind metabolite data to metabolite node
      for (var i = 0; i<specie.metabolites.length; i++){
        var metabolite = new Metabolite(specie.metabolites[i].name,
                                                  specie.metabolites[i].id)
        private.metabolites.push(metabolite);
        //need to bind the data with the same objectID
        private.nodesSet.push(metabolite);
      }
  }
  function buildReactions(specie){
      var tempLinks = [];
      // loop and bind reaction data to reaction node
      for (var i = 0; i<specie.reactions.length; i++){
              var reaction = new Reaction(specie.reactions[i].name,
                                                specie.reactions[i].id)
              private.reactions.push(reaction);
              private.nodesSet.push(reaction);

          // assign metabolite source and target for each reaction
          var m = Object.keys(specie.reactions[i].metabolites);
          for (var k = 0; k<m.length; k++){
              if(specie.reactions[i].metabolites[m[k]]>0){
                var s = specie.reactions[i].id;
                var t = m[k];
              }else{
                var s = m[k];
                var t = specie.reactions[i].id;
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
      .style("stroke-width", 1);

    //  addMarkers();
      for(var i = 0; i< private.metabolites.length; i++){
        private.metabolites[i].draw();
      }
      for(var i = 0; i< private.reactions.length; i++){
        private.reactions[i].draw();
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

  return{
      init: function(data){
        init(data)
      },
      addPathway: function(specie){
        addPathway(specie);
      },
      draw: function(){
        draw()
      },
      nodesSet: private.nodesSet,
      linkSet: private.linkSet
  }
}