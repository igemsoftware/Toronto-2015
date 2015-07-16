/* global d3 */
/* global palette */
'use strict';

var Node = function(network, name, id, type, radius){
  var _private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),
    network: network
  };
  var yrand = Math.random()*1080;
  var xrand = Math.random()*1920;
  var _public = {
    node: null,
    acceleration: new Victor(0, 0),
    position: new Victor(xrand, yrand),
    velocity: new Victor(0, 0),
    radius: radius,
    //updates according to velocity and acceleration
    update: function(){

      _public.velocity.add(_public.acceleration);
      _public.position.add(_public.velocity);
      _public.node.x = _public.position.x;
      _public.node.y = _public.position.y;


    },
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
    setPosition: function(x, y){
      _public.position = new Victor(x, y);
    },
    translate: function(dx, dy){
      _public.node.y+= dy;
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
