# Quick and easy random integers from [0,range]
rand = (range) ->
    return Math.floor(Math.random() * (range + 1))

scaleRadius = (model, minRadius, maxRadius) ->
    largest = 1
    if model
        fluxes = (reaction.flux_value for reaction in model.reactions)
        largest = Math.max.apply(Math, fluxes)

    return d3.scale.linear()
        .domain([0, largest])
        .range([minRadius, maxRadius])

nodeMap = (nodes) ->
    map = new Object()

    for node,i in nodes
        map[node.id] = i

    return map


hashCode = (str) ->
    hash = 0
    for i in [0,str.length]
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return hash

intToRGB = (i) ->
    c = (i & 0x00FFFFFF).toString(16).toUpperCase()

    return '00000'.substring(0, 6 - c.length) + c

hashStringToColour = (str) ->
    return intToRGB(hashCode(str))
# function hashCode(str) { // java String#hashCode
#     var hash = 0;
#     for (var i = 0; i < str.length; i++) {
#        hash = str.charCodeAt(i) + ((hash << 5) - hash);
#     }
#     return hash;
# }
#
# function intToRGB(i){
#     var c = (i & 0x00FFFFFF)
#         .toString(16)
#         .toUpperCase();
#
#     return "00000".substring(0, 6 - c.length) + c;
# }
`
var stringToColour = function(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}
`

module.exports =
    rand               : rand
    scaleRadius        : scaleRadius
    nodeMap            : nodeMap
    stringToColour : stringToColour
