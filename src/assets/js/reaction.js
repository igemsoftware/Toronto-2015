var Reaction = function(network, name, id){
  var private = {
    network: network,
    id: id,
    name: name,
    type: "r"
  }
 return{
   toString: function(){
     console.log("Reaction: " + private.name + " id: " + private.id + "\n");
   },
   getID: function(){
     return private.id;
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
