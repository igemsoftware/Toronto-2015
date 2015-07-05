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
  //draw function
  function draw(){

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
