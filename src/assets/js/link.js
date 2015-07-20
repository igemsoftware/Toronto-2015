'use strict';

var link = function(id, source, target) {
    var _public = {
      source: source,
      target: target,
      context: d3.select("canvas").node().getContext("2d"),
      linkX1: -18,
      linkX2: -18,
      linkY1: -18,
      linkY2: -18,
      draw: function(){
        draw()
      }
    }
    function draw(){
      _public.context.beginPath();
      _public.context.moveTo(_public.linkX1, _public.linkY1);
      _public.context.lineTo(_public.linkX2, _public.linkY2);
      _public.context.stroke();
    }
    return _public;
};
