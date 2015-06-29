var Reaction = function(that, name, id){
  var private = {
    that: that,
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
