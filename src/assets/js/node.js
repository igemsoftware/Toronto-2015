/* global d3 */
/* global palette */
'use strict';

<<<<<<< HEAD
var Node = function(attr) {

    var _private = {
        id      : attr.id.toString(),
        name    : attr.name.toString(),
        type    : attr.type.toString(),
        network : d3.select('canvas')
    };

    var _public = {
        nodeX: -18,
        nodeY: -18,
        radius: attr.radius,
        draw: null,
        _node: null,
        context: d3.select('canvas').node().getContext('2d'),

        mouseover: function(d) {
            mouseover(d);
        },

        setRadius: function(r) {
            _public.radius = r;
        },

        mouseout: function(d) {
            mouseout(d);
        },

        toString: function() {
            return (attr.name.type + ': ' + _private.name + ' id: ' +
                _private.id + '\n');
        },

        getID: function() {
            return _private.id;
        },

        getType: function() {
            return _private.type;
        }
    };

    function mouseover(d) {
        _public._node.append('text')
            .attr('class', 'node-text')
            .text(attr.name)
            .attr('x', 0)
            .attr('y', -18)
            .attr('font-family', 'Arial')
            .attr('fill', palette.texttest)
            .style('opacity', 1)
            .attr('font-size', '1.1em')
            .attr('text-anchor', 'middle');

        _public._node.select('circle')
            .transition()
            .duration(100)
            .attr('r', _public.radius + 5)
            .attr('stroke', palette.nodestroketest)
            .attr('stroke-opacity', 1)
            .attr('stroke-width', 2)
            .attr('opacity', 1);
    }


    function mouseout(d) {
        _public._node.select('circle').transition()
            .duration(100)
            .attr('r', _public.radius)
            .attr('stroke', palette.nodestroketest)
            .attr('stroke-opacity', 1)
            .attr('stroke-width', 1)
            .attr('opacity', 1);

        _public._node
            .selectAll('.node-text')
            .transition()
            .duration(500)
            .remove();
    }

    return _public;
=======
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
>>>>>>> origin/sigma
};
