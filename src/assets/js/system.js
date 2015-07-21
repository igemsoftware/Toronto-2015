/* global d3 */
/* global Metabolite */
/* global Reaction */
/* global palette */
'use strict';

var System = function(attributes, system){
  var _private = {
    canvas: null,
    nodes: null,     //all node elements class:node under <g> class:nodes
    links: null,    //all link elements class:link under <g> class:nodes
    force: null,
    system: null,
    attributes: attributes,
    linkSet: [],    //link data
    nodesSet: [],   //node data
    metaboliteRadius: 10,
    width: 0,
    height: 0
  };
  var originx = 0;
  var originy = 0;
  var scale = 1;
  //initalize Pathway
  init(system);
  //init
  function init(system){
      //assign selection to _private variables

      _private.network = d3.select('canvas');
      _private.canvas = d3.select('canvas')
                      //  .call(d3.behavior.zoom().scaleExtent([0.5, 8]).on("zoom", zoom))
                        .node()
                        .getContext("2d");
      _private.width = _private.attributes.canvas.width;
      _private.height = _private.attributes.canvas.height;
      buildMetabolites(system);
      //Create reaction objects
      buildReactions(system);
      _private.force = d3.layout.force()
                          .nodes(_private.nodesSet)
                          .links(_private.linkSet)
                          .charge(-500)
                          .linkStrength(2)
                          .linkDistance(50)
                          .size([_private.attributes.canvas.width, _private.attributes.canvas.height])
                          .start()
                          .on("tick", update)

    //_private.network.node().addEventListener('mousewheel', zoom);
    //  _private.network.node().addEventListener('drag', drag);
    /*_private.canvas.canvas.onDrag = function(e){
      console.log(e);
      console.log('here')
    }*/

  }
  function drag(e){
    console.log(e);
  }

  _private.canvas.canvas.onmousewheel = function(event) {
    event.preventDefault()
    //console.log(e);
    var mousex = event.clientX - _private.canvas.canvas.offsetLeft;
   var mousey = event.clientY - _private.canvas.canvas.offsetTop;
   var wheel = event.wheelDelta/120;//n or -n

   var zoom = 1 + wheel/2;

   _private.canvas.translate(
       originx,
       originy
   );
   _private.canvas.scale(zoom,zoom);
   _private.canvas.translate(
       -( mousex / scale + originx - mousex / ( scale * zoom ) ),
       -( mousey / scale + originy - mousey / ( scale * zoom ) )
   );

   originx = ( mousex / scale + originx - mousex / ( scale * zoom ) );
   originy = ( mousey / scale + originy - mousey / ( scale * zoom ) );
   scale *= zoom;
   _private.force.start();
  //  console.log(scale(e.deltaY));
    //_private.canvas.scale(scale(e.deltaY), scale(e.deltaY));
    //moving
    //_private.canvas.translate(d3.event.translate[0], d3.event.translate[1]);

//  console.log(_private.canvas.canvas.)
  //  console.log(e);
  //  _private.canvas.scale(e.deltaY, e.deltaY);
   //_private.canvas.translate(-e.deltaX, -e.deltaY);
  //  console.log(_private.canvas)
  //  _private.canvas.scale(d3.event.scale, d3.event.scale);
    //_private.canvas.translate(d3.event.translate[0], d3.event.translate[1]);
    /*_private.canvas.save();
    _private.canvas.clearRect(0, 0,   _private.width,   _private.height);

    _private.canvas.translate(d3.event.translate[0], d3.event.translate[1]);
    _private.canvas.scale(d3.event.scale, d3.event.scale);
    console.log(d3.event.scale);
    _private.canvas.restore();*/
}
  function buildMetabolites(system){
      // loop and bind metabolite data to metabolite node to nodeset
      for (var i = 0; i<system.metabolites.length; i++){
        _private.nodesSet.push(new Metabolite(system.metabolites[i].name,
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
    var r = d3.scale.linear().domain([0,largest]).range([0,15]);
    return r;
  }
  function buildReactions(system){
      var tempLinks = [];
      // scale_radius
      var radiusScale = scale_radius(system);
      // loop and bind reaction data to reaction node
      var s, t;
      for (var i = 0; i<system.reactions.length; i++){
            _private.nodesSet.push(new Reaction(system.reactions[i].name,
                                                system.reactions[i].id,
                                                  radiusScale(system.reactions[i].flux_value),
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
      var nodesMap = map(_private.nodesSet);
      for (var j=0; j<tempLinks.length;j++){
          //ineffiecient, but will do for now
          s = _private.nodesSet[nodesMap[tempLinks[j].source]];

          t =  _private.nodesSet[nodesMap[tempLinks[j].target]];
          _private.linkSet.push(new link(s.getID()+"-"+t.getID(), s, t));

      }
  }


  //utilities function
  function map(nodesSet){
      var ret = {};
      for (var j=0; j<nodesSet.length;j++){
        ret[nodesSet[j].getID()] = j;
      }
      return ret;
  }
  function update(){
    //refresh
    _private.canvas.clearRect(0, 0 , _private.width, _private.height);
    _private.nodesSet.forEach(function(d){
    
        d.nodeX = d.x;
        d.nodeY = d.y;
        d.draw();
    })

    _private.linkSet.forEach(function(d){
      d.linkX1 = d.source.x;
      d.linkY1 = d.source.y;
      d.linkX2 = d.target.x;
      d.linkY2 = d.target.y;
      d.draw();
    });

    /*_private.links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });*/
  }
  //returns nothing as of now, everything done when you create the object
  return {
    update: function(){
      update();
    }
  }
};
