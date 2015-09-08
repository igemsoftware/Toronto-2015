# **Classes**
Subsystem      = require "./Subsystem"
ViewController = require "./ViewController"
Node           = require "./Node"
Compartment    = require "./Compartment"
Metabolite     = require "./Metabolite"
Reaction       = require "./Reaction"
Link           = require "./Link"
Graph          = require './Graph'

# **Utility Functions**
utilities = require("./utilities")

class System
    constructor: (@attr, @data) ->
        @viewController = new ViewController("canvas", @attr.width, @attr.height, @attr.backgroundColour, null)
        # [@nodes, @links] = @buildReactionsAndMetabolites(@data)
        @attr.ctx = @viewController.ctx
        @ctx = @viewController.ctx
        @everything = @attr.everything
        @hideObjective = @attr.hideObjective

        [@metabolites, @reactions] = @buildMetabolitesAndReactions(@data)

        @graph = @buildGraph('root', 'compartment')

        @subsystems = new Object()
        @subsystems["ecoli"] = new Subsystem(@attr, @graph)

        @viewController.startCanvas(@subsystems["ecoli"])

    buildMetabolitesAndReactions: (model) ->
        metabolites = new Object()
        reactions   = new Object()

        # Loop through each metabolites in the metabolic model provided
        for metabolite in model.metabolites
            # Create a new Metabolite object using the current metabolite
            metabolite =  @createMetabolite(metabolite.name, metabolite.id, false, @ctx)
            # Store current Metabolite in metabolites dictionary
            metabolites[metabolite.id] = metabolite

        # Loop through each reaction
        for reaction in model.reactions
            # Skip if flux is 0 or if reaction name containes 'objective function'
            if (not @everything and reaction.flux_value is 0)
                continue
            if (@hideObjective and reaction.name.indexOf('objective function') isnt -1 )
                continue

            # Create fresh Reaction object
            # Push links into Reaction object
            reactions[reaction.id] = @createReaction(reaction.name, reaction.id, 9001, 0, @ctx)
            r = reactions[reaction.id]
            for metaboliteId of reaction.metabolites
                if reaction.metabolites[metaboliteId] > 0
                    source = reaction.id
                    target = metaboliteId
                    r.addLink(@createLink(reactions[source], metabolites[target], reaction.name, reactions.flux, @ctx))
                else
                    source = metaboliteId
                    target = reaction.id
                    r.addLink(@createLink(metabolites[source], reactions[target], reaction.name, reactions.flux, @ctx))

        return [metabolites, reactions]

    # graphId -> Id for "current" root
    # sorter -> string to designate compartments, e.g. `compartment`, `specie`, `subsystem`, etc.
    buildGraph: (graphId, sorter) ->
        counter = 0
        graph = new Graph(graphId, new Object(), new Object())
        # May not be needed
        [metabolites, reactions] = @buildMetabolitesAndReactions(@data)

        for metabolite of metabolites
            # If current Metabolite's compartment is not a child of `graph`, add it
            if not graph.outNeighbours[metabolites[metabolite][sorter]]?
                # Create a new child with no outNeighbours or parents
                graph.outNeighbours[metabolites[metabolite][sorter]] = new Graph(metabolites[metabolite][sorter], new Object(), new Object())

        # At this point, there is a child for each type within the 'sorter'
        # For example, a child for each compartment, that is 'c', 'e', 'p'
        for reaction of reactions
            r = reactions[reaction]
            # todo, create new 'sortee' objects for each potential 'sorter' inside reaction
            # for sortee in r[sorteeHolder]
            # todo: generalizable

            for cpt in r.substrateCompartments
                leaf = null
                for _cpt in r.substrateCompartments
                    potentialLeaf = graph.outNeighbours[_cpt].outNeighbours[r.id]
                    if potentialLeaf?
                        leaf = potentialLeaf

                if not leaf?
                    leaf = new Graph(r.id, new Object(), new Object())
                    counter++

                    leaf.value = r
                leaf.inNeighbours[cpt] = graph.outNeighbours[cpt]
                graph.outNeighbours[cpt].outNeighbours[r.id] = leaf

            for cpt in r.productCompartments
                leaf = null
                for _cpt in r.substrateCompartments
                    potentialLeaf = graph.outNeighbours[_cpt].outNeighbours[r.id]
                    if potentialLeaf?
                        leaf = potentialLeaf

                if not leaf?
                    leaf = new Graph(r.id, new Object(), new Object())
                    leaf.value = r
                    counter++

                leaf.outNeighbours[cpt] = graph.outNeighbours[cpt]
                graph.outNeighbours[cpt].inNeighbours[leaf.id] = leaf

            if r.outNeighbours.length is 0 #outNeighbour is e to be augmented later
                leaf.outNeighbours["e"] = graph.outNeighbours["e"]
                graph.outNeighbours["e"].inNeighbours[leaf.id] = leaf

        return graph

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

    addLink: (src, tgt, name, flux, ctx) ->
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
