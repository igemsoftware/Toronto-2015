var Node = function(name, id, type, links){
  var private = {
    id: id.toString(),
    name: name.toString(),
    type: type.toString(),
    network: null,
    node: null,
    links: [],
    force: null,
    link: null
  }
  //it might have to be id- + id
  function draw(){}
  function mouseover(d){}
  function mouseout(d){}

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
    }
  }
}
