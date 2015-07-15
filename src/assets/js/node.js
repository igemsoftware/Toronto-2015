/* global d3 */
/* global palette */
'use strict';

var Node = function(network, name, id, type, radius){
  var _private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),

  };
  var _public = {
    node: null,
    network: network,
    radius: radius,
    setX: function(x){
      _public.node.x = x;
    },
    setY: function(y){
      _public.node.y = y;
    },
    updateY: function(dy){
      _public.node.y+= dy;
    },
    updateX: function(dx){
      _public.node.x += dx;
    },
    setRadius: function(r){
        _public.radius = r;
    },
    toString: function(){
        return (name.type+": " + _private.name + " id: " + _private.id + "\n");
    },
    getID: function(){
        return _private.id;
    },
    getType: function(){
        return _private.type;
    }
  };
  return _public;
};
