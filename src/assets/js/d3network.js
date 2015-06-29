var Network = function(divName, attributes) {
  //private variables
  var private = {
      that: this, //probably dont need this, jsut in case though....
      svg: null,
      attributes: attributes,
      pathways: [],
      network: null
  }


  init(divName, attributes);

  function init(divName, attributes){
      private.svg = d3.select(divName).append('svg');
      private.svg.attr("class", "body");
      var keys = Object.keys(attributes);
      for(var i = 0; i < keys.length; i++)
        private.svg.attr(keys[i], attributes[keys[i]]);

      private.network = private.svg.append("g").attr("class", "network");
  }

  function addSpecie(specie){
    private.pathways.push(new Pathway(private.network, private.attributes, specie));
    return private.pathway;
  }
  function changeDimensions(width, height) {
    private.attributes.width = width;
    private.attributes.height = height;
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
