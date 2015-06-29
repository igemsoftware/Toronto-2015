

var keyresult="";
var num=1;

//==========================================================================================================================================
//SMBL Data=================================================================================================================================
//==========================================================================================================================================
var data = [{
              "species": "Escherichia coli",
              "strain": "MG1655",
              "id": "1",
              "genes": [],
              "metabolites": [{
                                "id": "10fthf_c",
                                "name": "Formyltetrahydrofolate",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -2,
                                "_bound": 0,
                                "formula": "C20H21N7O7",
                                "annotation": {}
                              },
                              {
                                "id": "12dgr120_c",
                                "name": "1,2-Diacyl-sn-glycerol (didodecanoyl, n-C12:0)",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -2,
                                "_bound": 0,
                                "formula": "C27H52O5",
                                "annotation": {}
                              },
                              {
                                "id": "4crsol_c",
                                "name": "p-Cresol",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": 0,
                                "_bound": 0,
                                "formula": "C7H8O",
                                "annotation": {}
                              },
                              {
                                "id": "5drib_c",
                                "name": "5'-deoxyribose",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": 0,
                                "_bound": 0.0,
                                "formula": "C5H10O4",
                                "annotation": {}
                              },
                              {
                                "id": "2agpg141_c",
                                "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1)",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -1,
                                "_bound": 0.0,
                                "formula": "C20H38O9P1",
                                "annotation": {}
                              },
                              {
                                "id": "2agpg141_p",
                                "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1)",
                                "compartment": "p",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -1,
                                "_bound": 0.0,
                                "formula": "C20H38O9P1",
                                "annotation": {}
                              },
                              {
                                "id": "coa_c",
                                "name": "Coenzyme A",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -4,
                                "_bound": 0.0,
                                "formula": "C21H32N7O16P3S",
                                "annotation": {}
                              },
                              {
                                "id": "glu_DASH_L_c",
                                "name": "L-Glutamate",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -1,
                                "_bound": 0.0,
                                "formula": "C5H8NO4",
                                "annotation": {}
                              },
                              {
                                "id": "accoa_c",
                                "name": "Acetyl-CoA",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -4,
                                "_bound": 0.0,
                                "formula": "C23H34N7O17P3S",
                                "annotation": {}
                              },
                              {
                                "id": "h_c",
                                "name": "H+",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": 1,
                                "_bound": 0.0,
                                "formula": "H",
                                "annotation": {}
                              },
                              {
                                "id": "1_acglu_c",
                                "name": "N-Acetyl-L-glutamate",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -2,
                                "_bound": 0.0,
                                "formula": "C7H9NO5",
                                "annotation": {}
                              }],
              "notes": [],
              "reactions": [{
                              "id": "DM_4CRSOL",
                              "metabolites": {"4crsol_c": -1},
                              "name": "Sink needed to allow p-Cresol to leave system",
                              "upper_bound": 1000,
                              "notes": {},
                              "subsystem": "",
                              "variable_kind": "countinuous",
                              "lower_bound": 0,
                              "gene_reaction_rule": "",
                              "objective_coefficient":0
                            },
                            {
                              "id": "DM_5DRIB",
                              "metabolites": {"5drib_c": -1},
                              "name": "Sink needed to allow 5'-deoxyribose to leave system",
                              "upper_bound": 1000,
                              "notes": {},
                              "subsystem": "",
                              "variable_kind": "countinuous",
                              "lower_bound": 0,
                              "gene_reaction_rule": "",
                              "objective_coefficient": 0
                            },
                            {
                              "id": "2AGPG141tipp",
                              "metabolites": {"2agpg141_p": -1.0, "2agpg141_c": 1.0},
                              "name": "2-Acyl-sn-glycero-3-phosphoglycerol (n-C14:1) transporter via facilitated diffusion (periplasm)",
                              "upper_bound": 1000.0,
                              "notes": {},
                              "subsystem": "Transport, Inner Membrane",
                              "variable_kind": "continuous",
                              "lower_bound": 0.0,
                              "gene_reaction_rule": "",
                              "objective_coefficient": 0.0
                            },
                            {
                              "id": "ACGS",
                              "metabolites": {"coa_c": 1.0, "glu_DASH_L_c": -1.0, "accoa_c": -1.0, "h_c": 1.0, "1_acglu_c": 1.0},
                              "name": "N-acetylglutamate synthase",
                              "upper_bound": 1000.0,
                              "notes": {},
                              "subsystem": "Arginine and Proline Metabolism", "variable_kind": "continuous",
                              "lower_bound": 0.0,
                              "gene_reaction_rule": "",
                              "objective_coefficient": 0.0
                            }]
           },
           {
              "species": "Pseudomonas putida",
              "strain": "F1",
              "id": "2",
              "genes": [],
              "metabolites": [{
                                "id": "h_w",
                                "name": "Hello World",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -2,
                                "_bound": 0,
                                "formula": "HELLOWORLD",
                                "annotation": {}
                              },
                              {
                                "id": "2_acglu_c",
                                "name": "N-Acetyl-L-glutamate",
                                "compartment": "c",
                                "notes": {},
                                "_constraint_sense": "E",
                                "charge": -2,
                                "_bound": 0.0,
                                "formula": "C7H9NO5",
                                "annotation": {}
                              }],
              "notes": [],
              "reactions": [{
                              "id": "hello_world",
                              "metabolites": {"h_w": 3.0, "1_acglu_c": -1.0},
                              "name": "Hello world synthase",
                              "upper_bound": 1000.0,
                              "notes": {},
                              "subsystem": "",
                              "lower_bound": 0.0,
                              "gene_reaction_rule": "",
                              "objective_coefficient": 0.0
                            }]
           }];

//==========================================================================================================================================
//Setting up the canvas=====================================================================================================================
//==========================================================================================================================================
var w = screen.width;
var h = screen.height;

//Palette
var palette = {
                "red": "#FF0000",
                "blue": "#3E87D1",
                "green": "#33CC33",
                "yellow": "#FFFF00",
                "scarlet": "#990033",
                "pink": "#FF99CC",
                "purple": "#990099",
                "black": "#000000",
                "white": "#FFFFFF",
                "gray": "#D2D2D2",
                "brown": "#663300",
                "orange": "#FF7519",
                "darkblue": "#354458",
                "skyblue": "#77c5f7",
                "salmon": "#eb7260",
                "aqua": "#eb7260",
                "beige": "#e9e0d6",
                "themedarkblue" : "#C4E4E6",
                "themenodestroke" :"#3D8D8F",
                "themelightblue" : "#BFE1BF",
                "themeyellow" : "#FCD059",
                "themewhite" : "#EDEDEA",
                "linktest" : "#AED9AE",
                "nodestroketest" : "#A2D7D8", //#A2D7D8 vs #62BBBD
                "texttest": "#DE5842"
                };

var markers = [
                {id: "triangle", path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10' }
              ];

var zoom = d3.behavior.zoom()
             .scaleExtent([0.2, 40])
             .on("zoom", zoom);

var svg = d3.select("body")
            .append("svg")
            .attr("class", "body")
            .attr("width", w)
            .attr("height", h)
            .call(zoom)
            .on("dblclick.zoom", null)
            .on("contextmenu", function(d, i){d3.event.preventDefault();}) //prevents default right click pop-up
            .on("mousedown", function(d){
                      d3.select(".popup").remove();
                      contextMenuShowing = false;
                  });

svg.append("rect")
   .attr("width", w)
   .attr("height", h)
   .style("fill","transparent")
   .style("pointer-events", "all");

var network = svg.append("g")
                 .attr("class", "network");

var nodes = [];
//JSON array{src:endpoint}
var links = [];

var force = d3.layout.force()
              .nodes(nodes)
              .links(links)
              .charge(function(d){if(d.type == "m"){return -1000}else{return -500}})
              .linkStrength(2)
              .linkDistance(50)
              .size([w, h])
              .on("tick", tick);
              //.start();

//
var drag = force.drag().on("dragstart", dragstart);

var link = network.append("g")
                  .attr("class", "links")
                  .selectAll("link");

var node = network.append("g")
                      .attr("class", "nodes")
                      .selectAll("node");

var marker = network.append("g")
                      .attr("class", "markers")
                      .selectAll(".marker")
                      .data(markers)
                      .enter()
                        .append('svg:marker')
                        .attr('id', function(d){ return d.id})
                        .attr('markerHeight', 5)
                        .attr('markerWidth', 5)
                        .attr('markerUnits', 'strokeWidth')
                        .attr('orient', 'auto')
                        .attr('refX', 13)
                        .attr('refY', 0)
                        .attr('fill', palette.linktest)
                        .attr('opacity', 1)
                        .attr('viewBox', function(d){ return d.viewbox })
                        .append('svg:path')
                        .attr('d', function(d){ return d.path });

window.addEventListener("keydown", function (event) {

  switch (event.keyCode) {
    case 77:
  // Do something for "down arrow" key press.
      keyresult= "m";
      break;
    case 82:
       // Do something for "up arrow" key press.
      keyresult= "r";
      break;

    default:

      return;

  }

  // Consume the event for suppressing "double action".
       event.preventDefault();
      if (keyresult==="m"){
 nodes.push({id:"New"+num.toString(), name:"New"+num.toString(), type:'m'});
     num++;
     draw();
     force.start();

   }
  else if (keyresult==="r")
   { nodes.push({id:"New"+num.toString(), name:"New"+num.toString(), type:'r'});
    num++;
    draw();
  }

  keyresult="";


 });

//==========================================================================================================================================
//Adding Nodes and Links====================================================================================================================



var check = [];

var tempLinks = [];
//making metabolite nodes
for (var j=0; j<data.length;j++){
  for (var i = 0; i<data[j].metabolites.length; i++){
      nodes.push ({
                    id: data[j].metabolites[i].id,
                    name:data[j].metabolites[i].name,
                    selflink: false,
                    type: "m"
                  });
      check.push(data[j].metabolites[i].id);

  }
};
//making reaction nodes
//Reaction -> r Metabolite -> m
for (var j=0; j<data.length;j++){
  for (var i = 0; i<data[j].reactions.length; i++){
    if(check.indexOf(data[j].reactions[i].id != -1)){
      nodes.push ({id: data[j].reactions[i].id, name:data[j].reactions[i].name, selflink: false, type: "r"});
      check.push(data[j].reactions[i].id);
    }

    var m = Object.keys(data[j].reactions[i].metabolites);
    for (var k = 0; k<m.length; k++){
      if(data[j].reactions[i].metabolites[m[k]]>0){
        var s = data[j].reactions[i].id;
        var t = m[k];
      }else{
        var s = m[k];
        var t = data[j].reactions[i].id;
      }
      tempLinks.push({id: s+"-"+t, source: s, target: t});
    }
  }
};

var nodesMap = map(nodes);

for (var j=0; j<tempLinks.length;j++){
  var s = nodes[nodesMap[tempLinks[j].source]];
  var t = nodes[nodesMap[tempLinks[j].target]];
  links.push({id: s.id+"-"+t.id, source: s, target: t});
}

function map(nodes){
  var ret = {};
  for (var j=0; j<nodes.length;j++){
    ret[nodes[j].id] = j;
  }
  return ret;
}

//=============DRAW ALL THIS SHIT YEEEEEEEEEEE=========//
draw();






//=========================================================================================================================================
//FUNCTIONS================================================================================================================================
//=========================================================================================================================================
function draw(){
  d3.selectAll("[class=node-selflink]").remove();
  d3.selectAll("[class=node-text]").remove();
  d3.selectAll("[class=node-circle]").remove();
  //d3.selectAll("[class=node-m]").remove();
  //d3.selectAll("[class=node-r]").remove();


  link = link.data(force.links(), function(d){ return d.source.id + "-" + d.target.id; })
  link.enter().insert("line")
              .attr("class", "link")
              .attr("id", function(d){return "id-"+d.id})
              .attr("stroke", palette.linktest)
              .attr("fill", "none")
              .attr("opacity", 1)
              .attr("stroke-width", 2)
              .attr("marker-end", function(d){if(d.source.type == "r"){return "url(#triangle)"}})
              .on("contextmenu", linkRightClick)
              .on("mousedown", function(d){
                         d3.select(".popup").remove();
                         contextMenuShowing = false;
              });

  link.exit().remove();

  node = node.data(force.nodes(), function(d) { return d.id;});

  node.enter().append("g")
              .attr("class", "node")
              .attr("id", function(d){return "id-"+d.id})
              .on("mouseout", nodeMouseout)
              .on('mouseover', nodeMouseover)
              .on("dblclick", dblclick)
              .on("contextmenu", nodeRightClick)
              .on("mousedown", function(d){
                                  d3.select(".popup").remove();
                                  contextMenuShowing = false;
              })
              .call(drag);

  //Create circle shape for node
  node.append("circle")
      .attr("class", "node-circle")
      //.attr("class", function(d){if(d.type == 'm'){return "node-m";}else{return "node-r"}})
      .attr("r", function(d){if(d.type == 'm'){return 10;}else{return 4}})
      .attr("stroke", palette.nodestroketest)
      .attr("stroke-width", function(d){if(d.type == 'm'){return 1;}else{return 35}})
      .attr("stroke-opacity", function(d){if(d.type == 'm'){return 1;}else{return "0"}} )
      .style("opacity", 1)
      .attr("fill", function(d){if(d.type =="m"){return palette.themedarkblue}else{return palette.themeyellow}});

  //Create text for node
  node.append("text")
      .attr("class", "node-text")
      .text(function(d, i) { return d.name; })
      .attr("x", 0)
      .attr("y", function(d){if(d.type == 'm'){return -18;}else{return -5}})
      .attr("font-family",  "Arial")
      .attr("fill", palette.texttest)
      .style("opacity", function(d){if(d.type == 'm'){return 0.8;}else{return 0}})
      .attr("font-size", function(d){if(d.type == 'm'){return "1.1em";}else{return "0em"}})
      .attr("text-anchor", "middle");
  node.exit().remove();
//WIP
function linkRightClick(d,i){
                      var copy=[];
                      if (contextMenuShowing) {
                        d3.event.preventDefault();
                        d3.select(".popup").remove();
                        contextMenuShowing = false;
                      }
                      else{
                        d3.event.preventDefault();
                        contextMenuShowing = true;
                        var pop = d3.select("body");
                        var mousePosition = d3.mouse(pop.node());

                        var popup = pop.append("div")
                                       .attr("class", "popup")
                                       .style("left", mousePosition[0] + "px")
                                       .style("top", mousePosition[1] + "px");
                      //RENAME BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Rename")
                             .on("click", function(){
                                alert("Rename this" + d.id)
                             });
                      //Delete BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Delete")
                             .on("click", function(){
                                  for (var i =0; i<nodes.length;i++){
                                    if (d.id==nodes[i].id){
                                    nodes.splice(i, i+1);
                                    i=nodes.length+100;
                                  }}
                                  for (var i =0; i<links.length;i++){
                                  if (d.id==links[i].id){
                                    links.splice(i, i+1);
                                    i=links.length+100;
                                  }}
                                  draw();
                             });

                      }
}
function nodeRightClick(d,i){
                      if (contextMenuShowing) {
                        d3.event.preventDefault();
                        d3.select(".popup").remove();
                        contextMenuShowing = false;
                      }
                      else if(d.type == "m"){
                        d3.event.preventDefault();
                        contextMenuShowing = true;
                        var pop = d3.select("body");
                        var mousePosition = d3.mouse(pop.node());

                        var popup = pop.append("div")
                                       .attr("class", "popup")
                                       .style("left", mousePosition[0] + "px")
                                       .style("top", mousePosition[1] + "px");
                        //RENAME BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Rename")
                             .on("click", function(d){
                                prompt("Rename this metabobitch")
                             });
                        //Delete BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Delete")
                             .on("click", function(d){
                                alert("Delete function")
                             });
                      }
                      else{
                        d3.event.preventDefault();
                        contextMenuShowing = true;
                        var pop = d3.select("body");
                        var mousePosition = d3.mouse(pop.node());

                        var popup = pop.append("div")
                                       .attr("class", "popup")
                                       .style("left", mousePosition[0] + "px")
                                       .style("top", mousePosition[1] + "px");
                      //RENAME BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Rename")
                             .on("click", function(){
                                alert("Rename this" + d.id)
                             });
                      //Delete BUTTON
                        popup.append("input")
                             .attr("type", "button")
                             .attr("value", "Delete")
                             .on("click", function(){

                                      for (var i=0; i<nodes.length ; i++){
                                          if (d.id == nodes[i].id){
                                              for (var o=0; o<i; o++){
                                                copy.push(nodes[o]);
                                              }
                                              for (var u=i+1; u<nodes.length; u++){
                                                copy.push (nodes[u]);
                                              }
                                              nodes=copy;
                                              copy=[];
                                              i=nodes.length+200;
                                         }

                                    }

                      }
}
  //Starts force layout
  force.start();
};

function tick(){
  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
};

function zoom() {
  network.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
};

function dblclick(d) {
  //Doubleclick to place forces on node
  d3.select(this).classed("fixed", d.fixed = false);
  force.start();
};

function dragstart(d) {
  //Drag to fix node's position
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("fixed", d.fixed = true);
};

function nodeMouseover(d){
  d3.select(this).selectAll(".node-circle").transition()
    .duration(100)
        .attr("r", function(d){if(d.type == "m"){return 14} else{return 6}})
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-opacity", function(d){if(d.type == "m"){return 1} else{return 0}})
        .attr("stroke-width", function(d){if(d.type =="m"){return 2} else{return 35}})
        .attr("opacity", 1);

  d3.select(this).selectAll(".node-text").transition()
    .duration(100)
        .attr("x", 0)
        .attr("y", function(d){if(d.type == 'm'){return -24;}else{return -10}})
        .style("opacity", 1)
        .attr("font-size",function(d){if(d.type == 'm'){return "1.4em";}else{return "1.0em"}})
        .attr("text-anchor", "middle");
};

function nodeMouseout(d){

  d3.select(this).selectAll(".node-circle").transition()
    .duration(function(d){if(d.type == 'm'){return 100;}else{return 800}})
        .attr("r", function(d){if(d.type == "m"){return 10} else{return 4}})
        .attr("stroke", palette.nodestroketest)
        .attr("stroke-opacity", function(d){if(d.type == "m"){return 1} else{return 0}})
        .attr("stroke-width", function(d){if(d.type =="m"){return 1} else{return 35}})
        .attr("opacity", 1);

  d3.select(this).selectAll(".node-text").transition()
    .duration(function(d){if(d.type == 'm'){return 100;}else{return 800}})
        .attr("x", 0)
        .attr("y", function(d){if(d.type == 'm'){return -18;}else{return -5}})
        .style("opacity", function(d){if(d.type == 'm'){return 0.8;}else{return 0}})
        .attr("font-size", function(d){if(d.type == 'm'){return "1.1em";}else{return "0em"}})
        .attr("text-anchor", "middle");
};
