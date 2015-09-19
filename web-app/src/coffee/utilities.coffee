# Quick and easy random integers from [0,range]
rand = (range) ->
    return Math.floor(Math.random() * (range + 1))

scaleRadius = (model, minRadius, maxRadius) ->
    largest = 1

    threshold = 40
    fluxes = []
    fluxes = (reaction.flux_value for reaction in model.reactions)


    largest = Math.max.apply(Math, fluxes)
    minimum = Math.min.apply(Math, fluxes)
    return d3.scale.linear()
        .domain([0, largest])
        .range([minRadius, maxRadius])

nodeMap = (nodes) ->
    map = new Object()

    for node,i in nodes
        map[node.id] = i

    return map

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
    rand           : rand
    scaleRadius    : scaleRadius
    nodeMap        : nodeMap
    stringToColour : stringToColour
