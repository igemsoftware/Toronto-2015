var Pathway = function(network, specie){
  var private = {
    network: network,
    reactions: [], //bio shit
    metabolites: [],
    links: [], //D3 shit
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
    //Create metabolite objects
    buildMetabolites(specie);
    //Create reaction objects
    buildReactions(specie);
  }
  function buildMetabolites(specie){
    for (var i = 0; i<specie.metabolites.length; i++){
      private.metabolites.push(new Metabolite(private.network, specie.metabolites[i].name,
                                                specie.metabolites[i].id));
    }
  }
  function buildReactions(specie){
    //Reaction -> r Metabolite -> m
    var tempLinks = [];
    for (var i = 0; i<specie.reactions.length; i++){
      private.reactions.push(new Reaction(private.network,  specie.reactions[i].name,
                                          specie.reactions[i].id));
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
    var nodesMap = map(private.metabolites, private.reactions);

    for (var j=0; j<tempLinks.length;j++){
      var s = private.metabolites[nodesMap[tempLinks[j].source]] || private.reactions[nodesMap[tempLinks[j].source]];
      var t =  private.metabolites[nodesMap[tempLinks[j].target]] || private.reactions[nodesMap[tempLinks[j].target]];
      private.links.push({id: s.getID()+"-"+t.getID(), source: s.getJSON(), target: t.getJSON()});
    }

  }
  //utilities function
  function map(metabolites, reactions){
    var ret = {};
    for (var j=0; j<metabolites.length;j++){
      ret[metabolites[j].getID()] = j;
      //private.nodes.push(metabolites[j]);
    }
    for(var j = 0; j < reactions.length; j++){
      ret[reactions[j].getID()] = j
      //private.nodes.push(reactions[j]);
    }

    return ret;
  }
  function addForces(){
    private.force = d3.layout.force()
    .nodes()
    .links(links)
    .charge(function(d){if(d.type == "m"){return -1000}else{return -500}})
    .linkStrength(2)
    .linkDistance(50)
    .size([w, h])
    .on("tick", tick);
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
