var Metabolite = function(network, name, id){
  var private = {
    network: network,
    id: id,
    name: name,
    type: "m"
  }
  return{
    toString: function(){
      console.log("Metabolite: " + private.name + " id: " + private.id + "\n");
    },
    getID: function(){
      return private.id;
    },
    getJSON: function(){
      return{
        name: private.name,
        id: private.id,
        type: private.type
      }
    }
  }
}
