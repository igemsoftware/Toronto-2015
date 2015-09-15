Compartment = require './Compartment'
utilities = require './utilities'
creators = require './creators'
sortors = require './sortors'
force = require './force'
Link  = require './Link'

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

        # Bind functions to 'this' so they have access to system's properties
        creators.createMetabolite = creators.createMetabolite.bind(this)
        creators.createReaction = creators.createReaction.bind(this)
        creators.createReactionNode = creators.createReactionNode.bind(this)
        creators.createCompartment = creators.createCompartment.bind(this)
        creators.createLink = creators.createLink.bind(this)
        force.initializeForce = force.initializeForce.bind(this)

        # Create a dictionary of *all* Metabolites, Reactions beforehand
        [@metabolites, @reactions] = @buildMetabolitesAndReactions(@data.metabolites, @data.reactions)

        # Bind sortors to 'this'

        sortors[@type].compartmentor = sortors[@type].compartmentor.bind(this)
        sortors[@type].sortor = sortors[@type].sortor.bind(this)


        @parsedData = new Object()
        # Bind and run parser for the current 'type'
        # Mutates @parsedData
        (sortors[@type].parser.bind(this))()

        # The graph holding all reactions and metabolites in @data
        @fullResGraph = new Graph()
        # The Graph of this system
        @graph = new Graph()

        # nodes and links to be used by the force layout
        @nodes = new Array()
        @links = new Array()
        # The force layout provided by D3
        @deleted = {
            reactions: new Object()
            metabolites: new Object()
            species: new Object()
        }
        @added = {
            reactions: new Object()
            metabolites: new Object()
            species: new Object()
        }

        # Further function calling will occur from TreeNode

    buildMetabolitesAndReactions: (metaboliteData, reactionData) ->
        metabolites = new Object()
        reactions = new Object()

        # Loop through each metabolite in the metabolic model provided
        for metabolite in metaboliteData
        # for metabolite in @data.metabolites
            # Create a new Metabolite
            # TODO params: metabolite, ctx, metaboliteRadius?
            m = creators.createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius, false, @ctx)
            m.species = metabolite.species

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
                    r.addLink(creators.createLink(reactions[source], metabolites[target], reaction.name, reaction.flux_value, @metaboliteRadius, @ctx))
                # metabolite is a substrate
                else if reaction.metabolites[metaboliteId] < 0
                    source = metaboliteId
                    target = reaction.id
                    r.addLink(creators.createLink(metabolites[source], reactions[target], reaction.name, reaction.flux_value, @metaboliteRadius, @ctx))

        return [metabolites, reactions]

    deleteNode: (id, name) ->
        @graph.destroyVertex(id)
        toDelete = null
        for node in @nodes
            if node.id is id and node.name is name
                toDelete = node
                node.deleted = true
        if toDelete.type is "r"
            @deleted.reactions[toDelete.id] = toDelete.name
        else if toDelete.type is "m"
            @deleted.metabolites[toDelete.id] = toDelete.name
        else if toDelete.type is "specie"
            @deleted.species[toDelete.id] = toDelete.name

    #create a metabolite on the current running graph
    createNewMetabolite: (id, name) ->
        metaboliteAttr =
            id : id
            name : name
            x : utilties.rand(@width)
            y : utilties.rand(@height)
            r : @metaboliteRadius
            type : "m"
        metabolite = new Metabolite(metaboliteAttr, @ctx)
        @added.metabolites[id] = name


    #Adds a brand new reaction/link to the current RUNNING graph
    #name and ID are optional if there is just a link
    #Source/target is an object with name and id
    createNewReactionOrLink: (source, target, id, name) ->
        src = null
        for node in @nodes
            if source.id is node.id and source.name is node.name
                src = node
            else if target.id is node.id and target.name is node.name
                tgt = node
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                fluxValue : 0
                r : radius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x : utilities.rand(@width)
                y : utilities.rand(@height)
                r : 1
                name : name
                id : id
                type : "r"
                flux_value : flux
                colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @ctx)
            @added.reactions[reactionAttributes.id] = name
            @nodes.push(reaction)
            linkAttr =
                id : "#{source.id}-#{reaction.id}"
                source : src
                target : reaction
                fluxValue : 0
                r : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, @ctx))
            linkAttr =
                id : "#{reaction.id}-#{target.id}"
                source : reaction
                target : tgt
                fluxValue : 0
                r : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @ctx))
        else
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                fluxValue : 0
                r : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @ctx))



    # **buildSystem**
    # Applies `sortor` functions to construct @graph
    # Once @graph is built, loop through vertices and edges to create nodes and links
    buildSystem: ->
        sortors[@type].compartmentor()
        sortors[@type].sortor()

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
            # source, target, name, flux, radius
            # TODO rename radius -> thickness
            # We don't have fluxes here!
            @links.push(creators.createLink(@graph.vertexValue(from), @graph.vertexValue(to), value, 1, 2))

        # Initilize a force layout

        # console.log('activating force')
        # force.initalizeForce()
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
            .alpha(0.1)
            # Let's get this party start()ed

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
            m = creators.createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius, false, @ctx)
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
                @fullResGraph.vertexValue(r.id).addLink(creators.createLink(@fullResGraph.vertexValue(source), @fullResGraph.vertexValue(target), reaction.name, reaction.flux_value, @metaboliteRadius, @ctx))

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
