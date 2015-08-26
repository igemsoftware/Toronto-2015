# **Classes**
ViewController  = require "./ViewController"
Node       = require "./Node"
Specie = require "./Specie"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

# **Utility Functions**
utilities = require("./utilities")

class System
    constructor: (attr, @data) ->
        @W                = attr.width
        @H                = attr.height
        @BG               = attr.backgroundColour
        @metaboliteRadius = attr.metaboliteRadius
        @useStatic        = attr.useStatic
        @everything       = attr.everything
        @hideObjective    = attr.hideObjective




        # Modified by `checkCollisions`, enables O(1) runtime when a node is already hovered
        @currentActiveNode = null

        # Create Canvas Object
        # Handles zooming and panning
        @nodes = new Array()
        @links = new Array()
        @exclusions = new Array()

        @compartments = new Object()
        @species = new Object()

        @force = null
        #nodes to be exlcuded (Deleted)
        @viewController = new ViewController("canvas", @W, @H, @BG, this)
        if @data?
            @createNetwork(@data)
            #building metabolites will be later when zoomed in
            #@buildMetabolites(@data)
            #@buildReactions(@data)
            @viewController.populateOptions(@nodes)
        @initalizeForce()

    createNetwork: (data) ->
        ns = []
        compartments = new Object()
        species = new Object()

        for metabolite, i in data.metabolites
            m = data.metabolites[i]
            species[m.id] = m.species
            if ns.indexOf(m.species) < 0
             nodeAttributes =
                 x    : utilities.rand(@W)
                 y    : utilities.rand(@H)
                 r    : @metaboliteRadius + 15
                 name : m.species
                 id   : m.species
                 type : "s"
             @nodes.push(new Specie(nodeAttributes, @viewController.ctx))
             ns.push(m.species)
            compartments[m.id] = m.compartment

            if m.compartment is "e" and ns.indexOf(m.id) < 0
                nodeAttributes =
                    x    : utilities.rand(@W)
                    y    : utilities.rand(@H)
                    r    : @metaboliteRadius
                    name : m.name
                    id   : m.id
                    type : "m"
                @nodes.push(new Metabolite(nodeAttributes, @viewController.ctx))
                ns.push(m.id)
                species[m.id] = m.species
        templinks = []
        rct = []
        for reaction, i in data.reactions
            nodeAttributes =
                x    : utilities.rand(@W)
                y    : utilities.rand(@H)
                r    : @metaboliteRadius
                name : reaction.name
                id   : reaction.id
                type : "r"
            m = Object.keys(reaction.metabolites)

            for key in m
                if compartments[key] is "e" and rct.indexOf(reaction.id) < 0
                    @nodes.push(new Reaction(nodeAttributes, @viewController.ctx))
                    rct.push(reaction.id)
                    if reaction.metabolites[key] > 0
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is reaction.id
                                source = n
                            else if n.id is key
                                target = n
                        linkAttr =
                            id        : "#{source.id}-#{target.id}"
                            source    : source
                            target    : target
                            fluxValue : 0
                            linkScale : utilities.scaleRadius(null, 1, 5)
                            r         : @metaboliteRadius
                        @links.push(new Link(linkAttr, @viewController.ctx))

                    else
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is key
                                source = n
                            else if n.id is reaction.id
                                target = n
                        linkAttr =
                            id        : "#{source.id}-#{target.id}"
                            source    : source
                            target    : target
                            fluxValue : 0
                            linkScale : utilities.scaleRadius(null, 1, 5)
                            r         : @metaboliteRadius
                        @links.push(new Link(linkAttr, @viewController.ctx))
                else
                    console.log(reaction.metabolites[key])
                    if reaction.metabolites[key] > 0
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is reaction.id
                                source = n
                            else if n.id is key
                                target = n
                        if not source? or not target?
                            continue
                        linkAttr =
                            id        : "#{source.id}-#{target.id}"
                            source    : source
                            target    : target
                            fluxValue : 0
                            linkScale : utilities.scaleRadius(null, 1, 5)
                            r         : @metaboliteRadius
                        @links.push(new Link(linkAttr, @viewController.ctx))

                    # else
                    #     source = null
                    #     target = null
                    #     for n in @nodes
                    #         if n.id is key
                    #             source = n
                    #         else if n.id is reaction.id
                    #             target = n
                    #     linkAttr =
                    #         id        : "#{source.id}-#{target.id}"
                    #         source    : source
                    #         target    : target
                    #         fluxValue : 0
                    #         linkScale : utilities.scaleRadius(null, 1, 5)
                    #         r         : @metaboliteRadius
                    #     @links.push(new Link(linkAttr, @viewController.ctx))


    #tempfunction
    linkToSpecies: () ->
        

    addMetabolite: (id, name, type) ->
        nodeAttributes =
            x    : utilities.rand(@W)
            y    : utilities.rand(@H)
            r    : @metaboliteRadius
            name : name
            id   : id
            type : type
        metabolite = new Metabolite(nodeAttributes, @viewController.ctx)
        @viewController.updateOptions(name, id)

        @nodes.push(metabolite)
        @force.start()

    addReaction: (source, target, name) ->
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
                fluxValue : 0
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @viewController.ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x          : utilities.rand(@W)
                y          : utilities.rand(@H)
                r          : 5 #hardcoded right now
                name       : name
                id         : name
                type       : "r"
                flux_value : 0
                colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @viewController.ctx)
            @nodes.push(reaction)
            linkAttr =
                id        : "#{source.id}-#{reaction.id}"
                source    : src
                target    : reaction
                fluxValue : 0
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, @viewController.ctx))
            linkAttr =
                id        : "#{reaction.id}-#{target.id}"
                source    : reaction
                target    : tgt
                fluxValue : 0
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @viewController.ctx))
        else
            alert("Invalid linkage")
        @force.start()

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
            .on("tick", @viewController.tick.bind(this))
            .start()

        if @useStatic
            @force.tick() for n in @nodes
            @force.stop()

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

    # *checkCollisions*
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



    buildMetabolites: (model) ->
        for metabolite in model.metabolites
            if metabolite.id.toString() is "Zn2tex"
                console.log("heress")
            for exclusion in @exclusions
                if metabolite.id.toString() is exclusion.id.toString()
                    console.log ("here")
            nodeAttributes =
                x    : utilities.rand(@W)
                y    : utilities.rand(@H)
                r    : @metaboliteRadius
                name : metabolite.name
                id   : metabolite.id
                type : "m"

            @nodes.push(new Metabolite(nodeAttributes, @viewController.ctx))



    buildReactions: (model) ->
        radiusScale = utilities.scaleRadius(model, 5, 15)
        tempLinks = new Array()

        for reaction in model.reactions

            if @everything or reaction.flux_value > 0
                reactionAttributes =
                    x          : utilities.rand(@W)
                    y          : utilities.rand(@H)
                    r          : radiusScale(reaction.flux_value)
                    name       : reaction.name
                    id         : reaction.id
                    type       : "r"
                    flux_value : reaction.flux_value
                    colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

                # Hardcoded kinda
                # Don't include biomass objective function reaction; skews drawing
                if @hideObjective
                    if reactionAttributes.name.indexOf('objective function') isnt -1
                        continue

                @nodes.push(new Reaction(reactionAttributes, @viewController.ctx))

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

        nodesMap = utilities.nodeMap(@nodes)
        for link in tempLinks
            linkAttr =
                id        : link.id
                source    : @nodes[nodesMap[link.source]]
                target    : @nodes[nodesMap[link.target]]
                fluxValue : link.flux_value
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(model, 1, 5)

            @links.push(new Link(linkAttr, @viewController.ctx))



window.FBA =
    System: System

module.exports = System
