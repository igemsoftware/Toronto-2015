var Pathway = function(attributes, specie){
  var private = {
    network: null,
    attributes: attributes,
    reactions: [], //Reactions and mataboites, each element is a metabolite/reaction element
    metabolites: [], //And we can for loop it maybe later in the draw function and draw each element indepently?
    linkSet: [],//to be fed to D3
    nodesSet: [],
    links: null, //D3 shit
    nodes: null,
    force: null
  }
  //initalize Pathway
  init(specie);
  //init
  function init(specie){
    //links selected
    private.network = d3.select(private.attributes.divName).select("svg").select(".network");
    //Create metabolite objects
    buildMetabolites(specie);
    //Create reaction objects
    buildReactions(specie);
    //private.links.data(private.linkSet);
    private.links = private.network.select(".links").selectAll("link");


  }

  function buildMetabolites(specie){
    for (var i = 0; i<specie.metabolites.length; i++){
      private.metabolites.push(new Metabolite(specie.metabolites[i].name,
                                                specie.metabolites[i].id));
      private.nodesSet.push(private.metabolites[i].getJSON());
    }
  }
  function buildReactions(specie){
    //Reaction -> r Metabolite -> m
    var tempLinks = [];
    for (var i = 0; i<specie.reactions.length; i++){
      private.reactions.push(new Reaction(specie.reactions[i].name,
                                          specie.reactions[i].id));

      private.nodesSet.push(private.reactions[i].getJSON());
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

/*  private.links.data(private.linkSet).enter().insert("line")
                .attr("class", "link")
                .attr("id", function(d){return d.id})
                .attr("stroke", palette.linktest)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke-width", 2)
                .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})
  addMarkers();*/
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
