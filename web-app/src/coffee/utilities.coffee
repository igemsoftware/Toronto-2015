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

module.exports =
    rand        : rand
    scaleRadius : scaleRadius
    nodeMap     : nodeMap
