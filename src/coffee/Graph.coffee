utilities  = require "./utilities"
Specie     = require "./Specie"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

class Graph
    constructor: (attr, @data) ->
        @W                 = attr.width
        @H                 = attr.height
        @BG                = attr.backgroundColour
        @useStatic         = attr.useStatic
        @everything        = attr.everything
        @hideObjective     = attr.hideObjective
        @metaboliteRadius  = attr.metaboliteRadius
        # Initialize the remaining properties as empty for now
        @currentActiveNode = null
        @force             = null
        @nodes             = new Array()
        @links             = new Array()
        @exclusions        = new Array()
        @children = new Object()
        @siblings = new Object()
        @parents = new Object()

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

module.exports = Graph
