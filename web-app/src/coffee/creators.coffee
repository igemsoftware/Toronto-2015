Reaction   = require './Reaction'
Metabolite = require './Metabolite'
Compartment = require './Compartment'
Link       = require './Link'

utilities = require './utilities'

module.exports =
    createReaction: (id, name, flux_value) ->
        reactionAttributes =
            x : utilities.rand(@width)
            y : utilities.rand(@height)
            r : @radiusScale(flux_value)
            name : name
            id : id
            type : "r"
            flux_value : flux_value
            # colour : utilities.stringToColour(name)
        return new Reaction(reactionAttributes, @ctx)

    createCompartment: (id, name) ->
        compartmentAttributes =
            x : utilities.rand(@width)
            y : utilities.rand(@height)
            r : @compartmentRadius
            name : name
            id : id
        return new Compartment(compartmentAttributes, @ctx)

    # System injected
    createMetabolite: (name, id, radius) ->
        nodeAttributes =
            x : utilities.rand(@width)
            y : utilities.rand(@height)
            r : radius
            name : name
            id : id
            type : "m"
        metabolite = new Metabolite(nodeAttributes, @ctx)
        return metabolite

    # System injected
    createLink: (src, tgt, name, thickness) ->
        if src.type is "r" and tgt.type is "m"
            # console.log('here')
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                thickness : thickness
                colourScale: @colourScale
            return new Link(linkAttr, @ctx)
        else if src.type is "m" and tgt.type is "r"
            # console.log(src.type)
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                thickness : thickness
                colourScale: @colourScale
            return new Link(linkAttr, @ctx)
        else
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                thickness : thickness
                colourScale: @colourScale
            return new Link(linkAttr, @ctx)

    # System injected
    # createLinks: (s1, reactionNode, s2) ->
    #     # console.log(reactionNode.flux_value)
    #     source = @compartments[s1]
    #     target = reactionNode
    #     link =
    #         id : "#{source.name}-#{target.name}"
    #         source : source
    #         target : target
    #         r : @metaboliteRadius
    #         linkScale : utilities.scaleRadius(null, 1, 5)
    #     @links.push(new Link(link, @ctx))
    #     source = reactionNode
    #     target = @compartments[s2]
    #     link =
    #         id : "#{source.name}-#{target.name}"
    #         source : source
    #         target : target
    #         r : @metaboliteRadius
    #         linkScale : utilities.scaleRadius(null, 1, 5)
    #     @links.push(new Link(link, @ctx))

    # System injected
    createLeaf: (graph) ->
        for inNeighbour of graph.inNeighbours
            for outNeighbour of graph.outNeighbours
                if inNeighbour isnt outNeighbour
                    reactionNode = @createReactionNode(graph.value)
                    @createLinks(inNeighbour, reactionNode, outNeighbour)
