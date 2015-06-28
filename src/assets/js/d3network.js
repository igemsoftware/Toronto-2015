var Network = function(divName, attributes) {
  // The instance
  var that = this;
  init(divName, attributes);

  function init(divName, attributes){
      that.svg = d3.select(divName).append('svg');
      that.svg.attr("class", "body");
      that.attributes = attributes;
      var keys = Object.keys(attributes);
      for(var i = 0; i < keys.length; i++)
        that.svg.attr(keys[i], attributes[keys[i]]);

      that.network = that.svg.append("g").attr("class", "network");
  }

  function addSpecie(specie){
    that.species = specie;
    that.pathways = [];
    that.pathways.push(new Pathway(that.network, specie));
    return that;
  }
  function draw(){

  }
  function changeDimensions(width, height) {
    that.attributes.width = width;
    that.attributes.height = height;
    //  that.force
    //.size([inst.traits.w, inst.traits.h]).start();
  }
      return {
        addSpecie: function(specie){
            addSpecie(specie);
        },
        changeDimensions: function(width, height) {
            changeDimensions(width, height);
        }
      }
}
