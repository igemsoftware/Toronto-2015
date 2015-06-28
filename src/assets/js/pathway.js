var Pathway = function(network, specie){
  var private = {
    network: network,
    reactions: [], //bio shit
    metabolites: [],
    connections: [],
    nodesJSON: [],
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
    addForces();
    //Create metabolite objects
    buildMetabolites(specie);
    //Create reaction objects
    buildReactions(specie);
    //add forces

    draw();
    private.nodes.each(function(d) {
        d.fixed = false;
    });
  
  //  private.force.start();
  }
  function buildMetabolites(specie){
    for (var i = 0; i<specie.metabolites.length; i++){
      private.metabolites.push(new Metabolite(private.network, specie.metabolites[i].name,
                                                specie.metabolites[i].id));
      private.nodesJSON.push(private.metabolites[i].getJSON());
    }
  }
  function buildReactions(specie){
    //Reaction -> r Metabolite -> m
    var tempLinks = [];
    for (var i = 0; i<specie.reactions.length; i++){
      private.reactions.push(new Reaction(private.network,  specie.reactions[i].name,
                                          specie.reactions[i].id));
      private.nodesJSON.push(private.reactions[i].getJSON());
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
      private.connections.push({id: s.getID()+"-"+t.getID(), source: s.getJSON(), target: t.getJSON()});
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
  //  console.log(network.width);
      private.force = d3.layout.force()
                    .nodes(private.nodesJSON)
                    .links(private.connections)
                    .charge(function(d){
                      if(d.type == "m"){return -1000}else{return -500}})
                    .linkStrength(2)
                    .linkDistance(50)
                    .size([500, 500]) //temp
                    .on("tick", tick).start();

  }
  function draw(){

    private.links = private.links.data(private.force.links(), function(d){ return d.source.id + "-" + d.target.id; })
  /*  private.links.enter().insert("line")
                .attr("class", "link")
                .attr("id", function(d){return "id-"+d.id})
                .attr("stroke", palette.linktest)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke-width", 2)
                .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})
              //  .on("contextmenu", linkRightClick)
              //  .on("mousedown", function(d){
              //             d3.select(".popup").remove();
              //           contextMenuShowing = false;
              //  });*/

    private.links.exit().remove();

    private.nodes = private.nodes.data(private.force.nodes(), function(d) { return d.id;});

    private.nodes.enter().append("g")
                .attr("class", "node")
                .attr("id", function(d){return "id-"+d.id})
            /*    .on("mouseout", nodeMouseout)
                .on('mouseover', nodeMouseover)
                .on("dblclick", dblclick)
                .on("contextmenu", nodeRightClick)
                .on("mousedown", function(d){
                                    d3.select(".popup").remove();
                                    contextMenuShowing = false;
                })
                .call(drag);*/

    //Create circle shape for node
    private.nodes.append("circle")
        .attr("class", "node-circle")
        .attr("cx", function(d, i){
            return i*10
        }).attr("cy", 100)
        .attr("r", function(d){if(d.type == 'm'){return 10;}else{return 4}})
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-width", function(d){if(d.type == 'm'){return 1;}else{return 35}})
        .attr("stroke-opacity", function(d){if(d.type == 'm'){return 1;}else{return "0"}} )
        .style("opacity", 1)
        .attr("fill", function(d){if(d.type =="m"){return palette.themedarkblue}else{return palette.themeyellow}});

  }
  function tick(){
    private.nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    private.links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
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
