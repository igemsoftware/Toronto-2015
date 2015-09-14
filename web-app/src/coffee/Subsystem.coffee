Compartment = require './Compartment'
utilities   = require './utilities'
creators    = require './creators'
parsors     = require './parsors'
force       = require './force'

class Subsystem
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

        # Sortables
        attr.sortables.index++
        @sortables = attr.sortables

        # TODO be parameterized/or done through a d3 scale
        @metaboliteRadius = 10

        # Used by createReactionNode
        # TODO get parameters from elsewhere
        @radiusScale = utilities.scaleRadius(@data, 5, 15)

        # Bind functions to 'this' so they have access to Subsystem's properties
        creators.createMetabolite   = creators.createMetabolite.bind(this)
        creators.createReaction     = creators.createReaction.bind(this)
        creators.createReactionNode = creators.createReactionNode.bind(this)
        creators.createLink         = creators.createLink.bind(this)
        force.initalizeForce        = force.initalizeForce.bind(this)

        [@metabolites, @reactions] = @buildMetabolitesAndReactions(@data.metabolites, @data.reactions)
        console.log(@metabolites, @reactions)

        # The Graph of this Subsystem
        @graph = new Graph()

        # nodes and links to be used by the force layout
        @nodes = new Array()
        @links = new Array()
        # The force layout provided by D3
        @force = null

        # Bind and run parser for the current 'type'
        # Mutates @parsedData
        @parsedData = new Array()
        (parsors[@type].parser.bind(this))()

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

    # **Subsystem.buildGraph**
    # Takes 'bare' data and constructs @graph
    # Called from : buildSystem
    # Requires    : @everything, @hideObjective
    # Calls       : createMetabolite, createReactionNode, Graph.addVertex, Graph.createNewEdge
    # Mutates     : @graph
    buildGraph: (metaboliteData, reactionData) ->
        # Loop through each metabolite in the metabolic model provided
        for metabolite in metaboliteData
        # for metabolite in @data.metabolites
            # Create a new Metabolite
            # TODO params: metabolite, ctx, metaboliteRadius?
            m = creators.createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius, false, @ctx)
            m.species = metabolite.species

            # Create a node (vertex) for this Metabolite in Subsystem.graph
            @graph.addVertex(metabolite.id, m)

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
            # @Albert is this check required? Why? There was no check for Metabolites
            if not @graph.hasVertex(reaction.id)
                @graph.addVertex(reaction.id, creators.createReactionNode(reaction.id, reaction.name, reaction.flux_value))

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

                # Create an edge for this metabolites relationsip in the reaction
                # NOTE Reactions may be represented by multiple edges
                @graph.createNewEdge(source, target, "#{source} -> #{target}")

    # **Subsystem.buildSystem**
    # Calls: @buildGraph, initializeForce, createLink
    # Mutates: @nodes, @links
    buildSystem: (data) ->
        # TODO buildGraph needs to be slightly augmented so it will work with compartments
        @buildGraph(data.metabolites, data.reactions)

        # Push all Metabolites and ReactionNodes into @nodes
        iterator = @graph.vertices()
        while not (vertex = iterator.next()).done
            value = vertex.value[1]
            @nodes.push(value)

        # Push all edges into @links as Links
        iterator = @graph.edges()
        while not (edge = iterator.next()).done
            from = edge.value[0] #ids'
            to = edge.value[1]
            value = edge.value[2]
            # source, target, name, flux, radius
            # TODO rename radius -> thickness
            # We don't have fluxes here!
            @links.push(creators.createLink(@graph.vertexValue(from), @graph.vertexValue(to), value, 1, 2))

        # Initilize a force layout
        force.initalizeForce()

    # Responsible for returning array of parsed data objects
    # Potentially disconnect from System and take a bunch of params?
    parseData: ->
        # 'this' DOES NOT refer to 'System' in the following :/
        parsors[@type].parser()

    # **Subsystem.checkCollisions**
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

module.exports = Subsystem
