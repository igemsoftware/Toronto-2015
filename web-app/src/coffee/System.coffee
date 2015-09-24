Compartment = require './Compartment'
utilities = require './utilities'
creators = require './creators'
sortors = require './sortors'
Link  = require './Link'
Reaction = require './Reaction'
Metabolite = require './Metabolite'



class System
    constructor: (attr) ->
        # Sortables and type
        attr.sortables.index+=1
        @sortables = attr.sortables

        @type = @sortables.identifiers[@sortables.index]
        # Store attributes as properties of System
        @data = attr.data


        @width = attr.width
        @height = attr.height
        @ctx = attr.ctx
        # TODO make these into 'filters'
        @everything = attr.everything
        @hideObjective = attr.hideObjective

        # TODO be parameterized/or done through a d3 scale
        @metaboliteRadius = 10
        @compartmentRadius = 50

        # Used by createReactionNode
        # TODO get parameters from elsewhere

        @radiusScale = utilities.scaleRadius(@data, 5, 15)
        @thicknesScale = utilities.scaleRadius(@data, 5, 15)
        @colourScale = utilities.scaleRadius(@data, 144, 255)

        # Bind functions to 'this' so they have access to system's properties
        creators.createMetabolite = creators.createMetabolite.bind(this)
        creators.createReaction = creators.createReaction.bind(this)
        creators.createCompartment = creators.createCompartment.bind(this)
        creators.createLink = creators.createLink.bind(this)

        # Create a dictionary of *all* Metabolites, Reactions beforehand
        [@metabolites, @reactions] = @buildMetabolitesAndReactions(@data.metabolites, @data.reactions)

        # Bind sortors to 'this'
        # sortors[@type].compartmentor = sortors[@type].compartmentor.bind(this)
        # sortors[@type].sortor = sortors[@type].sortor.bind(this)
        @parsedData = new Object()
        # Bind and run parser for the current 'type'
        # Mutates @parsedData
        sortors[@type].parser(this)

        #console.log(@parsedData)

        # The graph holding all reactions and metabolites in @data
        @fullResGraph = new Graph()
        # The Graph of this system
        @graph = new Graph()

        # nodes and links to be used by the force layout
        @nodes = new Array()
        @links = new Array()
        # The force layout provided by D3

        @initializeForce()
        # console.log("About to build system")
        @buildSystem()

    buildMetabolitesAndReactions: (metaboliteData, reactionData) ->
        metabolites = new Object()
        reactions = new Object()

        # Loop through each metabolite in the metabolic model provided
        for metabolite in metaboliteData
        # for metabolite in @data.metabolites
            # Create a new Metabolite
            # TODO params: metabolite, ctx, metaboliteRadius?
            #m = creators.createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius)
            m = new Metabolite({
                x : utilities.rand(@width)
                y : utilities.rand(@height)
                r : @metaboliteRadius
                name : metabolite.name
                id : metabolite.id
                compartment: metabolite.compartment
                type : "m"
                charge: metabolite.charge
                }, @ctx)

            m.species = metabolite.species
            m.subsystems = metabolite.subsystems

            metabolites[metabolite.id] = m


        # Loop through each reaction in the metabolic model provided
        for reaction in reactionData
        # for reaction in @data.reactions
            # TODO Create 'filters'
            # Skip if flux is 0
            if (not @everything and reaction.flux_value is 0)
                continue
            # Skip if reaction name contains 'objective function'
            if (@hideObjective and reaction.name.toLowerCase().indexOf('objective function') isnt -1 )
                continue

            # May not need radius here
            reactions[reaction.id] = creators.createReaction(reaction.name, reaction.id, reaction.flux_value, @ctx)
            r = reactions[reaction.id]
            r.species = reaction.species
            r.metabolites = reaction.metabolites
            r.subsystem = reaction.subsystem

            # Loop through metabolites inside reaction
            # Dict. of the form: {id:stoichiometric coefficient}
            # This will create an edge of either
            #   metabolite -> reaction
            #   reaction   -> metabolite
            # In this way, two edges, two Metabolites, one ReactionNode are
            # required to represent the reaction A -> B
            for metaboliteId of reaction.metabolites
                # Create a Link for this metabolites relationship in the reaction
                # NOTE Reactions may be represented by multiple Links

                # metabolite is a product
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                    if not reactions[source]? or not  metabolites[target]?
                        continue
                    r.addLink(creators.createLink(reactions[source], metabolites[target], reaction.name,
                                                    @thicknesScale(reaction.flux_value)))
                # metabolite is a substrate
                else if reaction.metabolites[metaboliteId] < 0
                    source = metaboliteId
                    target = reaction.id
                    if not reactions[target]? or not  metabolites[source]?
                        continue
                    r.addLink(creators.createLink(metabolites[source], reactions[target], reaction.name, @thicknesScale(reaction.flux_value)))

        return [metabolites, reactions]


    findNode: (id) ->
        for node in @nodes
            if node.id is id
                return node
        return null

    addReaction: (reactionObject) ->
        reaction = new Reaction({
            x : utilities.rand(@width)
            y : utilities.rand(@height)
            r : 5
            name : reactionObject.name
            id : reactionObject.id
            type : "r"
            flux_value : 0
            colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

        }, @ctx)
        @nodes.push(reaction)
        for metaboliteid of reactionObject.metabolites
            node = @findNode(metaboliteid)
            if node is null
                continue
            if reactionObject.metabolites[metaboliteid] > 0
                source = reaction
                target = node
            else
                source = node
                target = reaction
            link = new Link({
                id : reaction.id
                source : source
                target : target
                thickness : 5
                flux_value : 0
                colourScale: @colourScale
            }, @ctx)
            link.colour = "black"
            @links.push(link)
        @force.start()

    # **buildSystem**
    # Applies `sortor` functions to construct @graph
    # Once @graph is built, loop through vertices and edges to create nodes and links
    buildSystem: ->
        # console.log(this)
        sortors[@type].compartmentor(this)
        sortors[@type].sortor(this)

        # Push all Metabolites and ReactionNodes into @nodes
        iterator = @graph.vertices()
        while not (vertex = iterator.next()).done
            value = vertex.value[1]
            @nodes.push(value)

        # Push all edges into @links as Links
        iterator = @graph.edges()
        while not (edge = iterator.next()).done
            from = edge.value[0]
            to = edge.value[1]
            value = edge.value[2]
            flux = 0
            if from.type is "r"
                flux = to.flux_value
            else if to.type is "r"
                flux = from.flux_value

            # source, target, name, flux, radius
            # TODO rename radius -> thickness
            # We don't have fluxes here!
            @links.push(creators.createLink(@graph.vertexValue(from), @graph.vertexValue(to), value,
                        Math.abs(@thicknesScale(@graph.vertexValue(to).flux_value or @graph.vertexValue(from).flux_value))))

    linkDistanceHandler : (link, i) ->
        factor = 0
        if link.target.type is 'r'
            factor = link.target.substrates.length
        else if link.source.type is 'r'
            factor = link.source.products.length

        return factor*100

    chargeHandler : (node, i) ->
        factor = node.inNeighbours.length + node.outNeighbours.length + 1
        factor = node.r*2
        return factor * -800

    initializeForce: ->
        @force = d3.layout.force()
            # The nodes: index,x,y,px,py,fixed bool, weight (# of associated links)
            .nodes(@nodes)
            # The links: mutates source, target
            .links(@links)
            # Affects gravitational center and initial random position
            .size([@width, @height])
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
            #.alpha(0.1)


        if @useStatic
            @force.tick() for n in @nodes
            @force.stop()


    # **system.buildFullResGraph**
    # Takes 'bare' data and constructs @fullResGraph
    # Called from : buildSystem
    # Requires    : @everything, @hideObjective
    # Calls       : createMetabolite, createReactionNode, Graph.addVertex, Graph.createNewEdge
    # Mutates     : @graph
    buildFullResGraph: (metaboliteData, reactionData) ->
        # Loop through each metabolite in the metabolic model provided
        for metabolite in metaboliteData
        # for metabolite in @data.metabolites
            # Create a new Metabolite
            # TODO params: metabolite, ctx, metaboliteRadius?

            m = new Metabolite({
                x : utilities.rand(@width)
                y : utilities.rand(@height)
                r : @metaboliteRadius
                name : metabolite.name
                id : metabolite.id
                compartment: metabolite.compartment
                type : "m"
                charge: metabolite.charge
                }, @ctx)

            m.species = metabolite.species

            # Create a node (vertex) for this Metabolite in system.graph
            @fullResGraph.addVertex(metabolite.id, m)

        # Loop through each reaction in the metabolic model provided
        for reaction in reactionData
        # for reaction in @data.reactions
            # TODO Create 'filters'
            # Skip if flux is 0
            if (not @everything and reaction.flux_value is 0)
                continue
            # Skip if reaction name contains 'objective function'
            if (@hideObjective and reaction.name.toLowerCase().indexOf('objective function') isnt -1 )
                continue

            # Create a vertex for a new Reaction if it does not already exist
            r = creators.createReaction(reaction.id, reaction.name, reaction.flux_value)
            r.species = reaction.species
            @fullResGraph.addVertex(r.id, r)

            # Loop through metabolites inside reaction
            # Dict. of the form: {id:stoichiometric coefficient}
            # This will create an edge of either
            #   metabolite -> reaction
            #   reaction   -> metabolite
            # In this way, two edges, two Metabolites, one ReactionNode are
            # required to represent the reaction A -> B
            for metaboliteId of reaction.metabolites
                # metabolite is a product
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                # metabolite is a substrate
                else if reaction.metabolites[metaboliteId] < 0
                    source = metaboliteId
                    target = reaction.id

                # Append Link into Reaction
                @fullResGraph.vertexValue(r.id).addLink(creators.createLink(@fullResGraph.vertexValue(source), @fullResGraph.vertexValue(target), reaction.name, reaction.flux_value, @metaboliteRadius))

                # Create an edge for this metabolites relationsip in the reaction
                # NOTE Reactions may be represented by multiple edges
                @fullResGraph.createNewEdge(source, target, "#{source} -> #{target}")

    # **system.checkCollisions**
    # Loops through @nodes and checks for mouse collision
    # Calls: Node.checkCollision
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

module.exports = System
