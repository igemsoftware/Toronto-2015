var Node = function(name, id, type, links){
  var private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),
    network: null,
    node: null,
    links: [],
    force: null
  }
  //it might have to be id- + id
  init();
  function draw(){}
  function tick(){}
  function init(){
    //hardcoded for now
      private.network = d3.select("#network").select("svg").select(".network");
      private.node = private.network.select(".nodes").append("g").attr("class", "node")
      //private.node = private.network.select(".nodes")//.selectAll("node");

  }
  return{
    toString: function(){
      console.log(name.type+": " + private.name + " id: " + private.id + "\n");
    },
    getID: function(){
      return private.id;
    },
    draw: function(){
      draw();
    },
    tick: function(){
      tick()
    },
    getJSON: function(){
      return{
        name: private.name,
        id: private.id,
        type: private.type,
        selflink: false
      }
    },
    private: private
  }
}
