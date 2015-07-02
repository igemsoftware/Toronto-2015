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
    private.links = private.network
    .select(".links").selectAll("link");

    //nodes selected
    private.nodes = private.network
    .select(".nodes").selectAll("node");

    var temp = []

    // Get centroid(this.d)
    //Create metabolite objects
    buildMetabolites(specie);
    //Create reaction objects
    buildReactions(specie);
    private.nodes.each(function(d) {
         d.fixed = false;
     });



//  private.t = private.network.select(".nodes").selectAll("node")
    //console.log(d.parentNode)

  //  private.nodesSet = [];

  //  for(var j = 0; j < private.t[0].parentNode.childNodes.length; j++){
    //   private.nodesSet.push({id: private.t[0].parentNode.childNodes[j].id});
      //  var id = private.t[0].parentNode.childNodes[j].id.toString()
      //  console.log(id);

      //private.t[0].parentNode.childNodes[j].attr("class", "test");
    //  private.network.select(".nodes").selectAll("node").select("#" + id).append("p")
        //private.t.select("#" + id.toString()).append("p").enter().attr("class", "test");
//    }
//  console.log(private.force.nodes())
  draw();
  return {
    nodesSet: private.nodesSet,
    linkSet: private.linkSet
  }
  //console.log(test);
   //private.force.start();
  }

  function tick(){
    private.nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    private.links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
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
  //Honestly, just fuck around with it, you dont have to use this.
  function draw(){
    //Pretty ghetto, you cant take out the left side assignment.....
//  private.links = private.links.data(private.force.links(), function(d){ return d.source.id + "-" + d.target.id; })
  /*private.links.enter().insert("line")
                .attr("class", "link")
                .attr("id", function(d){return "id-"+d.id})
                .attr("stroke", palette.linktest)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke-width", 2)
                .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})*/
    //private.links.exit().remove();
    //console.log(private.force.nodes());
  //  private.nodes = private.nodes.data(private.force.nodes(private.t), function(d) { return d.id;});
  //  for(var i = 0; i < private.metabolites.length; i++)
    //  private.metabolites[i].draw();
/*  private.nodes.enter().append("g")
                .attr("class", "node")
                .attr("id", function(d){return "id-"+d.id})

    //Create circle shape for node

    private.nodes.enter().append("g")
                 .attr("class", "node")
                 .attr("id", function(d){return "id-"+d.id}).append("circle")
        .attr("class", function(d){if(d.type == 'm'){return "node-m";}else{return "node-r"}})
        .attr("r", function(d){if(d.type == 'm'){return 10;}else{return 4}})
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-width", function(d){if(d.type == 'm'){return 1;}else{return 35}})
        .attr("stroke-opacity", function(d){if(d.type == 'm'){return 1;}else{return "0"}} )
        .style("opacity", 1)
        .attr("fill", function(d){if(d.type =="m"){return palette.themedarkblue}else{return palette.themeyellow}});
*/
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
    }
  }
}
