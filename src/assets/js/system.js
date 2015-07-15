/* global d3 */
/* global Metabolite */
/* global Reaction */
/* global palette */
'use strict';

var System = function(network, system){
  var _private = {
    network: network,
    force: null,
    system: null,
    edges: [],    //link data
    nodes: [],   //node data
    metaboliteRadius: 10
  };
  //initalize Pathway
  init(system);
  //init
  function init(system){

      buildMetabolites(system);
      //Create reaction objects
      buildReactions(system);

      addEdges();
      _private.network.refresh();
  //    network.startForceAtlas2();
      //start force
      //rec();
    function rec(){
      setTimeout(function(){

        for(var i = 0; i < _private.nodes.length; i++)
        {
          _private.nodes[i].x = Math.random()*1920;
          _private.nodes[i].y = Math.random()*1080;
        }

      }, 2000);
      _private.network.refresh();
    }


  }

  function addEdges(){
    for(var i = 0; i < _private.edges.length; i++)
      _private.network.graph.addEdge(_private.edges[i])
  }
  function buildMetabolites(system){
      // loop and bind metabolite data to metabolite node to nodeset
      for (var i = 0; i<system.metabolites.length; i++){
        _private.nodes.push(new Metabolite(_private.network, system.metabolites[i].name,
                                                  system.metabolites[i].id, _private.metaboliteRadius));
      }
  }
  function scale_radius(system){
    // find largest flux value and scale radius of reaction node accordingly
    var flux_array = [];
    for (var i = 0; i< system.reactions.length; i ++){
        flux_array.push(system.reactions[i].flux_value);
    }
    var largest = Math.max.apply(Math, flux_array);
    var r = d3.scale.linear().domain([0,largest]).range([1, 5]);
    return r;
  }
  function buildReactions(system){
      var tempLinks = [];
      // scale_radius
      var radiusScale = scale_radius(system);
      // loop and bind reaction data to reaction node
      var s, t;
      for (var i = 0; i<system.reactions.length; i++){
          if(system.reactions[i].flux_value){
              _private.nodes.push(new Reaction(_private.network, system.reactions[i].name,
                                                  system.reactions[i].id,
                                                  3, //hardcoded rn
                                                  //radiusScale(system.reactions[i].flux_value),
                                                  system.reactions[i].flux_value
                                                ));
              // assign metabolite source and target for each reaction
              var m = Object.keys(system.reactions[i].metabolites);

              for (var k = 0; k<m.length; k++){
                  if(system.reactions[i].metabolites[m[k]]>0){
                    s = system.reactions[i].id;
                    t = m[k];
                  }else{
                    s = m[k];
                    t = system.reactions[i].id;
                  }
                  tempLinks.push({id: s+"-"+t, source: s, target: t});
              }
          }

      }
      var nodesMap = map(_private.nodes);

      for (var j=0; j<tempLinks.length;j++){
          //ineffiecient, but will do for now

          s = _private.nodes[nodesMap[tempLinks[j].source]];

          t =  _private.nodes[nodesMap[tempLinks[j].target]];

          _private.edges.push({id: s.getID()+"-"+t.getID(), source: s.getID(), target: t.getID()});
      }

  }
  //to be fixed later
  //utilities function
  function map(nodes){
      var ret = {};
      for (var j=0; j<nodes.length;j++){
        ret[nodes[j].getID()] = j;
      }
      return ret;
  }

};
