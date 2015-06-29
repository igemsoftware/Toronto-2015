var Reaction = function(name, id){
  this.prototype = new Node(name, id, "r");
  return this.prototype;
}
