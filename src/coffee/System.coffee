# **Classes**
ViewController = require "./ViewController"
Node           = require "./Node"
Specie         = require "./Specie"
Metabolite     = require "./Metabolite"
Reaction       = require "./Reaction"
Link           = require "./Link"
Graph          = require './Graph'
# **Utility Functions**
utilities = require("./utilities")

class System
    constructor: (@attr, @data) ->
        @ctx = @attr.ctx
        # [@nodes, @links] = @buildReactionsAndMetabolites(@data)

        # After Metabolites and Reactions built
        # @compartmentalize()
        @root = null
        @buildPeices(@data)


    buildPeices: (model) ->
        nodes = new Object()
        reactions = new Object()
        compartments = new Object()

        for metabolite in model.metabolites
            metabolite =  @createMetabolite(
                metabolite.name,
                metabolite.id,
                false,
                @ctx
            )
            nodes[metabolite.id] = metabolite
            if not compartments[metabolite.compartment]?
                compartments[metabolite.compartment] = new Graph(@attr, null) #no data



        for reaction in model.reactions
            reactions[reaction.id] = @createReaction(reaction.name, reaction.id, 9001, 0, @ctx)

            for metaboliteId of reaction.metabolites
                #add to c or p or e compartment in objects for children
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                    reactions[reaction.id].addLink(@createLink(reactions[source], nodes[target], reaction.name, reactions.flux, @ctx))
                else
                    source = metaboliteId
                    target = reaction.id
                    reactions[reaction.id].addLink(@createLink(nodes[source], reactions[target], reaction.name, reactions.flux, @ctx))
            for compartment in reactions[reaction.id].substrateCompartments
                compartments[compartment].children[reaction.id] = reactions[reaction.id]
            for compartment in reactions[reaction.id].productCompartments
                compartments[compartment].parents[reaction.id] = reactions[reaction.id]


        console.log(compartments)

        # for reaction in reactions
            # console.log(reaction) if reaction.productCompartments.length > 0
            # consol

    compartmentalize: ->
        subgraphTypes = new Object()

        [nodes, links] = @buildReactionsAndMetabolites(@data)

        for metabolite in @data.metabolites
            # todo: give compartment on back-end
            compartmentType = metabolite.id.split('_')[metabolite.id.split('_').length - 1]
            if not subgraphTypes[compartmentType]? and compartmentType isnt 'e'
                subgraphTypes[compartmentType] = new Object()


        # for link in links
        #     if link.source.type is 'r' and link.target.compartment is 'e'
        #         console.log(link)

        for subgraphType of subgraphTypes
            nameMappings =
                c: 'cytosol'
                p: 'periplasm'

            subgraph = @createMetabolite(
                nameMappings[subgraphType],
                subgraphType,
                false,
                @ctx
            )

            subgraph.r = 50

            @nodes.push(subgraph)

            for link in links
                if link.source.type is 'm'
                    # case 1: m -> r
                    if link.source.compartment is subgraphType
                        # SG -> r
                        # if subgraphType is 'c'
                        #     console.log(subgraph)
                        link.source = subgraph
                        @nodes.push(link.target)
                        @links.push(link)
                else if link.source.type is 'r'
                    # case 2: r -> m
                    console.log('links')




                # 'c' -> X goes into 'c' blob
                # if link.source.type is 'm' and link.source.compartment is subgraphType
                #     link.source = subgraph
                #     @nodes.push(link.target)
                #     @links.push(link)

                # X -> 'c' goes into 'c' blob
                # if link.source.type is 'm'
                #     link.target = subgraph
                #     @nodes.push(link.source)
                #     @links.push(link)

                # if link.source.type is 'r' and link.target.type is 'm' and link.target.compartment is 'e'
                #     @nodes.push(link.target)
                #     @links.push(link)


                # if link.source.type is 'p' and




    buildReactionsAndMetabolites: (model) ->
        nodes = new Array()
        links = new Array()

        for metabolite in model.metabolites
            nodes.push(@createMetabolite(
                metabolite.name,
                metabolite.id,
                false,
                @ctx
            ))


        radiusScale = utilities.scaleRadius(model, 5, 15)
        # Why tempLinks? source/target Reaction may not exist yet
        tempLinks = new Array()

        for reaction in model.reactions
            # Don't include biomass objective function reaction; skews drawing
            if @hideObjective and reaction.name.indexOf('objective function') isnt -1
                continue
            else if @everything or reaction.flux_value > 0
                nodes.push(@createReaction(
                    reaction.name,
                    reaction.id,
                    radiusScale(reaction.flux_value),
                    reaction.flux_value,
                    @ctx
                ))
                # Assign metabolite source and target for each reaction
                for metabolite in Object.keys(reaction.metabolites)
                    source = null
                    target = null

                    if reaction.metabolites[metabolite] > 0
                        source = reaction.id
                        target = metabolite
                    else
                        source = metabolite
                        target = reaction.id
                    link =
                        id         : "#{source}-#{target}"
                        source     : source
                        target     : target
                        flux_value : reaction.flux_value
                    tempLinks.push(link)

        nodesMap = utilities.nodeMap(nodes)
        for link in tempLinks
            linkAttr =
                id        : link.id
                source    : nodes[nodesMap[link.source]]
                target    : nodes[nodesMap[link.target]]
                fluxValue : link.flux_value
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(model, 1, 5)

            links.push(new Link(linkAttr, @ctx))

        return [nodes, links]
    createReaction: (name, id, radius, flux, ctx) ->
        reactionAttributes =
            x          : utilities.rand(@W)
            y          : utilities.rand(@H)
            r          : 5
            name       : name
            id         : id
            type       : "r"
            flux_value : flux
            colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
        return new Reaction(reactionAttributes, ctx)

    createMetabolite: (name, id, updateOption, ctx) ->
        nodeAttributes =
            x    : utilities.rand(@W)
            y    : utilities.rand(@H)
            r    : @metaboliteRadius
            name : name
            id   : id
            type : "m"
        metabolite = new Metabolite(nodeAttributes, ctx)
        if updateOption
            @viewController.updateOptions(name, id)
        return metabolite

    linkDistanceHandler: (link, i) ->
        factor = 0
        if link.target.type is 'r'
            factor = link.target.substrates.length
        else if link.source.type is 'r'
            factor = link.source.products.length

        return factor * 100

    chargeHandler: (node, i) ->
        factor = node.inNeighbours.length + node.outNeighbours.length + 1

        return factor * -100

    initalizeForce: () ->
        @force = d3.layout.force()
            # The nodes: index,x,y,px,py,fixed bool, weight (# of associated links)
            .nodes(@nodes)
            # The links: mutates source, target
            .links(@links)
            # Affects gravitational center and initial random position
            .size([@W, @H])
            # Sets "rigidity" of links in range [0,1]; func(link, index), this -> force; evaluated at start()
            .linkStrength(2)
            # At each tick of the simulation, the particle velocity is scaled by the specified friction
            .friction(0.9)
            # Target distance b/w nodes; func(link, index), this -> force; evaluated at start()
            .linkDistance(@linkDistanceHandler)
            # Charges to be used in calculation for quadtree BH traversal; func(node,index), this -> force; evaluated at start()
            .charge(@chargeHandler)
            # Sets the maximum distance over which charge forces are applied; \infty if not specified
            #.chargeDistance()
            # Weak geometric constraint similar to a virtual spring connecting each node to the center of the layout's size
            .gravity(0.1)
            # Barnes-Hut theta: (area of quadrant) / (distance b/w node and quadrants COM) < theta => treat quadrant as single large node
            .theta(0.8)
            # Force layout's cooling parameter from [0,1]; layout stops when this reaches 0
            .alpha(0.1)
            # Let's get this party start()ed

        if @useStatic
            @force.tick() for n in @nodes
            @force.stop()

    checkCollisions: (x, y) ->
        nodeReturn = null
        for node in @nodes
            if node.checkCollision(x,y)
                nodeReturn = node
                node.hover = true
                break
            else
                node.hover = false
        return nodeReturn

    deleteNode : (node) ->
        @exclusions.push(node)
        node.deleted = true
        for inNeighbour in node.inNeighbours
            nodeIndex = inNeighbour.outNeighbours.indexOf(node)
            inNeighbour.outNeighbours.splice(nodeIndex, 1)
        for outNeighbour in node.outNeighbours
            nodeIndex = outNeighbour.inNeighbours.indexOf(node)
            outNeighbour.inNeighbours.splice(nodeIndex, 1)
        @viewController.removeOption(node)

    addLink: (source, target, name, flux, ctx) ->
        for node in @nodes
            if node.id is source.id and node.name is node.name
                src = node
            else if node.id is target.id and node.name is node.name
                tgt = node

        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x          : utilities.rand(@W)
                y          : utilities.rand(@H)
                r          : @metaboliteRadius
                name       : name
                id         : name
                type       : "r"
                flux_value : flux
                colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, ctx)
            @nodes.push(reaction)
            linkAttr =
                id        : "#{source.id}-#{reaction.id}"
                source    : src
                target    : reaction
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, ctx))
            linkAttr =
                id        : "#{reaction.id}-#{target.id}"
                source    : reaction
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, ctx))
        else
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, ctx))

    createLink: (src, tgt, name, flux, ctx) ->
        if src.type is "r" and tgt.type is "m"
            # console.log('here')
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            return new Link(linkAttr, ctx)
        else if src.type is "m" and tgt.type is "r"
            # console.log(src.type)
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            return new Link(linkAttr, ctx)
        else
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            return new Link(linkAttr, ctx)



window.FBA =
    System: System

module.exports = System
