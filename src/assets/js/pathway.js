var Pathway = function(attributes, specie){
  var private = {
    network: null,  //the <g> tag class:network
    nodes: null,     //all node elements class:node under <g> class:nodes
    links: null,    //all link elements class:link under <g> class:nodes
    attributes: attributes,
    reactions: [], //Contain reactions and mataboites objects, each element is a metabolite/reaction element
    metabolites: [], //And we can for loop it maybe later in the draw function and draw each element indepently?
    linkSet: [],    //link data
    nodesSet: [],   //node data
    currentNodeSet: {},

  }
  //initalize Pathway
  init(specie);
  //init
  function init(specie){
      //assign selection to private variables
      private.network = d3.select(private.attributes['divName']).select("svg").select("g.network");
      private.nodes = private.network.select('.nodes').selectAll(".node");
      private.links = private.network.select(".links").selectAll(".link");
      //Create metabolite objects
      buildMetabolites(specie);
      //Create reaction objects
      buildReactions(specie);

      var dragCircle = d3.behavior.drag()
                .on('dragstart', dragstart);
      private.nodes.call(dragCircle);

  }
  function dragstart(d) {
        //move specific node
        console.log(this);
        d3.event.sourceEvent.stopPropagation();
      //  console.log(d3.select(this))
        d3.select(this).attr("transform", "translate(" + d.x+ "," + d.y + ")");

        //.transform("transform", "translate(100, 100)")
    }
  function buildMetabolites(specie){
      // loop and bind metabolite data to metabolite node
      for (var i = 0; i<specie.metabolites.length; i++){
        private.metabolites.push(new Metabolite(specie.metabolites[i].name,
                                                  specie.metabolites[i].id));
        private.nodesSet.push(private.metabolites[i].getJSON()); //if if-statement executes, i will be out of index
      }
  }
  function buildReactions(specie){
      var tempLinks = [];
      // loop and bind reaction data to reaction node
      for (var i = 0; i<specie.reactions.length; i++){

              private.reactions.push(new Reaction(specie.reactions[i].name,
                                                specie.reactions[i].id));
              private.nodesSet.push(private.reactions[i].getJSON());

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

      for (var j=0; j<tempLinks.length;j++){
          //ineffiecient, but will do for now
          var s = private.nodesSet[nodesMap[tempLinks[j].source]];
          var t =  private.nodesSet[nodesMap[tempLinks[j].target]];
          private.linkSet.push({id: s.id+"-"+t.id, source: s, target: t});
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

      addMarkers();
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
        ret[nodesSet[j].id] = j;
      }
      return ret;
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
