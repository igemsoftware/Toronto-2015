ViewController = require "./ViewController"
Node = require "./Node"
Compartment = require "./Compartment"
Metabolite = require "./Metabolite"
Reaction = require "./Reaction"
Link = require "./Link"
utilities = require "./utilities"
Graph = require "./Graph"
ReactionNode = require "./ReactionNode"

class Subsystem
    # attr
    #
    constructor: (attr, @graph) ->
        @ctx = attr.ctx
        @W = attr.width
        @H = attr.height
        @BG = attr.backgroundColour
        @metaboliteRadius = attr.metaboliteRadius
        @useStatic = attr.useStatic
        @everything = attr.everything
        @hideObjective = attr.hideObjective

        @force = null
        @currentActiveNode = null

        @compartments = new Object()
        @reactions = new Object()
        @nodes = new Array()
        @links = new Array()

        @radiusScale = utilities.scaleRadius(null, 5, 15)
        #get rid of root
        for compartment of @graph.outNeighbours
            @buildCompartments(@graph.outNeighbours[compartment])
        for compartment of @graph.outNeighbours
            @buildNodesAndLinks(@graph.outNeighbours[compartment])
        @initalizeForce()
        console.log(@nodes)


    createLeaf: (graph) ->
        for inNeighbour of graph.inNeighbours
            for outNeighbour of graph.outNeighbours
                if inNeighbour isnt outNeighbour
                    reactionNode = @createReaction(graph.value)
                    @createLinks(inNeighbour, reactionNode, outNeighbour)

    createLinks: (s1, reactionNode, s2) ->
        source = @compartments[s1]
        target = reactionNode
        link =
            id         : "#{source.name}-#{target.name}"
            source     : source
            target     : target
            flux_value : reactionNode.flux_value
            r         : @metaboliteRadius
            linkScale : utilities.scaleRadius(null, 1, 5)
        @links.push(new Link(link, @ctx))
        source = reactionNode
        target =  @compartments[s2]
        link =
            id         : "#{source.name}-#{target.name}"
            source     : source
            target     : target
            flux_value : reactionNode.flux_value
            r         : @metaboliteRadius
            linkScale : utilities.scaleRadius(null, 1, 5)
        @links.push(new Link(link, @ctx))



    createReaction: (reaction) ->
        r =  @reactions[reaction.id]
        if not r?
            reactionAttributes =
                x : utilities.rand(@W)
                y : utilities.rand(@H)
                r : @radiusScale(reaction.flux_value)
                name : reaction.name
                id : reaction.id
                type : "r"
                flux_value : reaction.flux_value
                colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

            r = new ReactionNode(reactionAttributes, @ctx)
            @reactions[reaction.id] = r
            for inNeighbour in reaction.inNeighbours
                r.inNeighbours.push(inNeighbour.name)
            for outNeighbour in reaction.outNeighbours
                r.outNeighbours.push(outNeighbour.name)
            @nodes.push(r)
        return r


    buildNodesAndLinks: (graph)->
        #reached leaf
        if graph.value? and graph.value.type is "r"
            #deal with leaf
            @createLeaf(graph)
        else
            for compartment of graph.outNeighbours
                @buildNodesAndLinks(graph.outNeighbours[compartment])
            #console.log(graph.outNeighbours)
            #@buildNodesAndLinks(graph.outNeighbours[])

    buildCompartments: (graph)->
        #reached leaf
        if graph.value? and graph.value.type is "r"
            return
        else
        # for compartment of graph.outNeighbours
            mappings =
                c: 'cytosol'
                e: 'extracellular'
                p: 'periplasm'

            nodeAttributes =
                x : utilities.rand(@W)
                y : utilities.rand(@H)
                r : 150
                name : mappings[graph.id]
                id : graph.id
                type : "s"
                colour: "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            c = new Compartment(nodeAttributes, @ctx)
            @compartments[graph.id] = c
            @nodes.push(c)
            for compartment of graph.outNeighbours
                @buildCompartments(graph.outNeighbours[compartment])




    addMetabolite: (id, name, type, ctx) ->
        nodeAttributes =
            x : utilities.rand(@W)
            y : utilities.rand(@H)
            r : @metaboliteRadius
            name : name
            id : id
            type : type
        metabolite = new Metabolite(nodeAttributes, ctx)
        @viewController.updateOptions(name, id)

        @nodes.push(metabolite)

    linkDistanceHandler: (link, i) ->
        factor = 0
        if link.target.type is 'r'
            factor = link.target.substrates.length
        else if link.source.type is 'r'
            factor = link.source.products.length

        return factor*100

    chargeHandler: (node, i) ->
        factor = node.inNeighbours.length + node.outNeighbours.length + 1
        factor = node.r*2
        return factor * -800

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

    addReaction: (source, target, name, ctx) ->
        for node in @nodes
            if node.id is source.id and node.name is node.name
                src = node
            else if node.id is target.id and node.name is node.name
                tgt = node
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                fluxValue : 0
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x : utilities.rand(@W)
                y : utilities.rand(@H)
                r : 5 #hardcoded right now
                name : name
                id : name
                type : "r"
                flux_value : 0
                colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, ctx)
            @nodes.push(reaction)
            linkAttr =
                id : "#{source.id}-#{reaction.id}"
                source : src
                target : reaction
                fluxValue : 0
                r : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, ctx))
            linkAttr =
                id : "#{reaction.id}-#{target.id}"
                source : reaction
                target : tgt
                fluxValue : 0
                r : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, ctx))
        else
            alert("Invalid linkage")


module.exports = Subsystem
