var Pathway = function(network, specie){
  var private = {
    network: network,
    reactions: [], //bio shit
    metabolites: [],
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
    for (var i = 0; i<specie.metabolites.length; i++){
        private.metabolites.push ({
          id: specie.metabolites[i].id,
          name:specie.metabolites[i].name,
          selflink: false,
          type: "m"
        });
      }
      console.log(private.metabolites);
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
