var Node = function(name, id, type){
  var private = {
    id: id,
    name: name,
    type: type
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
