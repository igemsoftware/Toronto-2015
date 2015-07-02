var Network = function(divName, attributes) {
  //private variables
  var private = {
      that: this, //probably dont need this, just in case though....
      svg: null,
      attributes: attributes,
      pathways: [],
      network: null,
      nodesSet: [],
      linkSet: [],
      links: null,

  }


  init(divName, attributes);

  function init(divName, attributes){
      private.svg = d3.select(divName).append('svg');
      private.svg.attr("class", "body");
      var keys = Object.keys(attributes);
      for(var i = 0; i < keys.length; i++)
        private.svg.attr(keys[i], attributes[keys[i]]);

      private.network = private.svg.append("g").attr("class", "network");
      //Create node and link HTML
      private.network.append("g").attr("class", "nodes").selectAll("node");
      private.network.append("g").attr("class", "links").selectAll("link");
      private.force = d3.layout.force()
                          .nodes(private.nodesSet)
                          .links(private.linkSet)
                          .charge(function(d){if(d.type == "m"){return -1000}else{return -500}})
                          .linkStrength(2)
                          .linkDistance(50)
                          .size([private.attributes.width, private.attributes.height])
                          .on("tick", tick);


  }
  function draw(){
    //Pretty ghetto, you cant take out the left side assignment.....
//  private.links = private.links.data(private.force.links(), function(d){ return d.source.id + "-" + d.target.id; })
  private.links.enter().insert("line")
                .attr("class", "link")
                .attr("id", function(d){return "id-"+d.id})
                .attr("stroke", palette.linktest)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke-width", 2)
                .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})
    //private.links.exit().remove();
    //console.log(private.force.nodes());
  private.nodes = private.nodes.data(private.force.nodes(), function(d) { return d.id;});
  //  for(var i = 0; i < private.metabolites.length; i++)
  //  private.metabolites[i].draw();
  private.nodes.enter().append("g")
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


/*  for(var i = 0; i< private.metabolites.length; i++){
    private.metabolites[i].draw();
  }
  for(var i = 0; i< private.reactions.length; i++){
    private.reactions[i].draw();
  }*/
  }
  function addSpecie(specie){
      var path = new Pathway({height: private.attributes.height,
                                        width: private.attributes.width,
                                        divName: divName}, specie);
      private.pathways.push(path);
      private.nodesSet = private.nodesSet.concat(path.nodesSet);
      private.linkSet = private.linkSet.concat(path.linkSet);
      private.force.start();
      private.links = private.links.data(private.force.links(private.linkSet), function(d){ return d.source.id + "-" + d.target.id; })
      private.nodes = private.nodes.data(private.force.nodes(private.nodesSet), function(d) { return d.id;});
      draw();
  }
  function tick(){
    private.nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    private.links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }
  function changeDimensions(width, height) {
    private.attributes.width = width;
    private.attributes.height = height;
    //  that.force
    //.size([inst.traits.w, inst.traits.h]).start();
  }
      return {
        addSpecie: function(specie){
            addSpecie(specie);
        },
        changeDimensions: function(width, height) {
            changeDimensions(width, height);
        }
      }
}
