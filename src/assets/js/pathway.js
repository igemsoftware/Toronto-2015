var Pathway = function(that, specie){

  var private = {
    that: that,
    network: that.network,
    reactions: [], //bio shit
    metabolites: [],
    linkSet: [],
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
    private.links = private.network.append("g")
    .attr("class", "links")
    .selectAll("link");
    //nodes selected
    private.nodes = private.network.append("g")
    .attr("class", "nodes")
    .selectAll("node");
    private.force = d3.layout.force()
                        .nodes(private.nodesSet)
                        .links(private.linkSet)
                        .charge(function(d){if(d.type == "m"){return -1000}else{return -500}})
                        .linkStrength(2)
                        .linkDistance(50)
                        .size([that.attributes.width, that.attributes.height]);

    //Create metabolite objects
    buildMetabolites(specie);
    //Create reaction objects
    buildReactions(specie);
    private.nodes.each(function(d) {
        d.fixed = false;
    });
    private.force.start();
  }

  function buildMetabolites(specie){
    for (var i = 0; i<specie.metabolites.length; i++){
      private.metabolites.push(new Metabolite(private.network, specie.metabolites[i].name,
                                                specie.metabolites[i].id));
      private.nodesSet.push(private.metabolites[i].getJSON());
    }
  }
  function buildReactions(specie){
    //Reaction -> r Metabolite -> m
    var tempLinks = [];
    for (var i = 0; i<specie.reactions.length; i++){
      private.reactions.push(new Reaction(private.network,  specie.reactions[i].name,
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
    test: function(){
      alert("test");
    }
  }
}
