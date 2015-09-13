Compartment = require './Compartment'
utilities = require './utilities'
creators = require './creators'
force = require './force'

class Subsystem
    constructor: (attr) ->
        creators.createMetabolite = creators.createMetabolite.bind(this)
        creators.createReactionNode = creators.createReactionNode.bind(this)
        creators.createLink = creators.createLink.bind(this)
        force.initalizeForce = force.initalizeForce.bind(this)

        @metaboliteRadius  = 10

        @nodes = new Array()
        @links = new Array()
        @force = null
        @graph = new Graph()

        @data = attr.data
        @width = attr.width
        @height = attr.height
        @ctx = attr.ctx
        @everything = attr.everything
        @hideObjective = attr.hideObjective

        @radiusScale = utilities.scaleRadius(data, 5, 15)

        @buildUnsortedGraph(data.metabolites, data.reactions)

        it = @graph.vertices()
        #add all metabolites and reactions
        while not (kv = it.next()).done
            value = kv.value[1]
            @nodes.push(value)

        #create links

        it = @graph.edges()
        while not (kv = it.next()).done
            from = kv.value[0] #ids'
            to = kv.value[1]
            value = kv.value[2]
            @links.push(creators.createLink(@graph.vertexValue(from), @graph.vertexValue(to), value, 1, 2, @ctx))

        force.initalizeForce()

        #DoneDONEDONEDONEDONEDONEODNEODNEONDONE CONSTRUTOR IS DONE


        #equivelent of buildMetabolitesAndReactions
    buildUnsortedGraph: (metaboliteData, reactionData) ->

    # Loop through each metabolites in the metabolic model provided
        for metabolite in metaboliteData
            # Create a new Metabolite object using the current metabolite
            m = creators.createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius, false, @ctx)
            # Store current Metabolite in metabolites dictionary
            m.species = metabolite.species

            @graph.addVertex(metabolite.id, m)

        # Loop through each reaction
        for reaction in reactionData
            # Create 'filters' later
            # Skip if flux is 0 or if reaction name containes 'objective function'
            if (not @everything and reaction.flux_value is 0)
                continue
            if (@hideObjective and reaction.name.indexOf('objective function') isnt -1 )
                continue


            if not @graph.hasVertex(reaction.id)
                #id, name, flux_value
                @graph.addVertex(reaction.id, creators.createReactionNode(reaction.id, reaction.name, reaction.flux_value))
            # r.species = reaction.species
            for metaboliteId of reaction.metabolites
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                else
                    source = metaboliteId
                    target = reaction.id
                @graph.createNewEdge(source, target, "#{source} -> #{target}")






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
