# **Classes**
Subsystem      = require "./Subsystem"
ViewController = require "./ViewController"
Compartment    = require "./Compartment"
Graph          = require './Graph'

creators = require './creators'
deletors = require './deletors'
addors   = require './addors'

class System
    constructor: (@rootId, @attr, data) ->
        # Setting up ViewController
        @viewController = new ViewController("canvas", @attr.width, @attr.height, @attr.backgroundColour, null)
        @attr.ctx = @viewController.ctx
        @ctx = @viewController.ctx

        # Settings for hiding certain Reactions
        @everything = @attr.everything
        @hideObjective = @attr.hideObjective
        # If this is too far below, not accessible for some reason
        @metaboliteRadius = 5

        # The "full resolution" set of Metabolites and Reactions for this System
        [@metabolites, @reactions] = @buildMetabolitesAndReactions(data.metabolites, data.reactions)

        # @rootId = 'globalroot'
        @graph = new Graph(@rootId)

        # Construct the Graph for this System
        sortor = ->
            for reaction of @reactions
                r = @reactions[reaction]
                # todo, create new 'sortee' objects for each potential 'sorter' inside reaction
                # for sortee in r[sorteeHolder]
                # todo: generalizable

                for cpt in r.substrateCompartments
                    leaf = null
                    for _cpt in r.substrateCompartments
                        potentialLeaf = @graph.outNeighbours[_cpt].outNeighbours[r.id]
                        if potentialLeaf?
                            leaf = potentialLeaf

                    if not leaf?
                        leaf = new Graph(r.id)

                        leaf.value = r
                    leaf.inNeighbours[cpt] = @graph.outNeighbours[cpt]
                    @graph.outNeighbours[cpt].outNeighbours[r.id] = leaf

                for cpt in r.productCompartments
                    leaf = null
                    for _cpt in r.substrateCompartments
                        potentialLeaf = @graph.outNeighbours[_cpt].outNeighbours[r.id]
                        if potentialLeaf?
                            leaf = potentialLeaf

                    if not leaf?
                        leaf = new Graph(r.id)
                        leaf.value = r

                    leaf.outNeighbours[cpt] = @graph.outNeighbours[cpt]
                    @graph.outNeighbours[cpt].inNeighbours[leaf.id] = leaf

                if r.outNeighbours.length is 0 #outNeighbour is e to be augmented later
                    leaf.outNeighbours["e"] = @graph.outNeighbours["e"]
                    @graph.outNeighbours["e"].inNeighbours[leaf.id] = leaf
        compartmentor = ->
            sorter = 'compartment'
            for metabolite of @metabolites
                m = @metabolites[metabolite]
                # If current Metabolite's compartment is not a child of `graph`, add it
                if not @graph.outNeighbours[m[sorter]]?
                    # Create a new child with no outNeighbours or parents
                    @graph.outNeighbours[m[sorter]] = new Graph(@metabolites[metabolite][sorter])
        @buildGraph(compartmentor.bind(this), sortor.bind(this))

        @subsystems = new Object()
        @subsystems["ecoli"] = new Subsystem(@attr, @graph)

        @viewController.startCanvas(@subsystems["ecoli"])

        # Inject System into utility functions
        # todo: remove need for injecting
        creators.createLink = creators.createLink.bind(this)
        deletors.deleteNode = deletors.deleteNode.bind(this)

    buildMetabolitesAndReactions: (metaboliteData, reactionData) ->
        metabolites = new Object()
        reactions   = new Object()

        # Loop through each metabolites in the metabolic model provided
        for metabolite in metaboliteData
            # Create a new Metabolite object using the current metabolite
            metabolite =  @createMetabolite(metabolite.name, metabolite.id, @metaboliteRadius, false, @ctx)
            # Store current Metabolite in metabolites dictionary
            metabolites[metabolite.id] = metabolite

        # Loop through each reaction
        for reaction in reactionData
            # Create 'filters' later
            # Skip if flux is 0 or if reaction name containes 'objective function'
            if (not @everything and reaction.flux_value is 0)
                continue
            if (@hideObjective and reaction.name.indexOf('objective function') isnt -1 )
                continue

            # Create fresh Reaction object
            # Push links into Reaction object
            reactions[reaction.id] = @createReaction(reaction.name, reaction.id, 20, 0,@ctx)
            r = reactions[reaction.id]
            for metaboliteId of reaction.metabolites
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                    r.addLink(@createLink(reactions[source], metabolites[target], reaction.name, reactions.flux, @metaboliteRadius, @ctx))
                else
                    source = metaboliteId
                    target = reaction.id
                    r.addLink(@createLink(metabolites[source], reactions[target], reaction.name, reactions.flux, @metaboliteRadius, @ctx))

        return [metabolites, reactions]

    # graphId -> Id for "current" root
    # sorter -> string to designate compartments, e.g. `compartment`, `specie`, `subsystem`, etc.
    buildGraph: (compartmentor, sortor) ->
        compartmentor()
        sortor()

    createReaction: creators.createReaction

    createMetabolite: creators.createMetabolite

    createLink: creators.createLink

    deleteNode : deletors.deleteNode

module.exports = System

# Expose API to global namespace
window.FBA =
    System: System
