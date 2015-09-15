Compartment = require './Compartment'
utilities   = require './utilities'
creators    = require './creators'
sortors     = require './sortors'
force       = require './force'

class System
    constructor: (attr) ->
        # Store attributes as properties of System
        @data          = attr.data
        @width         = attr.width
        @height        = attr.height
        @ctx           = attr.ctx
        @type          = attr.type
        # TODO make these into 'filters'
        @everything    = attr.everything
        @hideObjective = attr.hideObjective

        # TODO be parameterized/or done through a d3 scale
        @metaboliteRadius = 10
        @compartmentRadius = 50

        # Used by createReactionNode
        # TODO get parameters from elsewhere
        @radiusScale = utilities.scaleRadius(@data, 5, 15)

        # Bind functions to 'this' so they have access to system's properties
        creators.createMetabolite   = creators.createMetabolite.bind(this)
        creators.createReaction     = creators.createReaction.bind(this)
        creators.createReactionNode = creators.createReactionNode.bind(this)
        creators.createCompartment  = creators.createCompartment.bind(this)
        creators.createLink         = creators.createLink.bind(this)
        force.initalizeForce        = force.initalizeForce.bind(this)

        # Sortables
        attr.sortables.index++
        @sortables = attr.sortables

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
        @force = null

        # Further function calling will occur from TreeNode

    buildMetabolitesAndReactions: (metaboliteData, reactionData) ->
        metabolites = new Object()
        reactions   = new Object()

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

    # **system.buildGraph**
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
            from  = edge.value[0]
            to    = edge.value[1]
            value = edge.value[2]
            # source, target, name, flux, radius
            # TODO rename radius -> thickness
            # We don't have fluxes here!
            @links.push(creators.createLink(@graph.vertexValue(from), @graph.vertexValue(to), value, 1, 2))

        # Initilize a force layout
        force.initalizeForce()

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
