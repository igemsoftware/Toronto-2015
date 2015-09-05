# **Classes**
ViewController = require "./ViewController"
Node           = require "./Node"
Specie         = require "./Specie"
Metabolite     = require "./Metabolite"
Reaction       = require "./Reaction"
Link           = require "./Link"
Graph          = require './Graph'
# **Utility Functions**
utilities = require("./utilities")

class System extends Graph
    constructor: (attr, @data) ->
        super(attr, @data)
        @ctx = attr.ctx
        [@nodes, @links] = @buildReactionsAndMetabolites(@data)
        # @buildReactions(@data)

        # After Metabolites and Reactions built
        # @compartmentalize()

    compartmentalize: ->
        subgraphTypes = new Object()

        nodes = new Array()
        links = new Array()

        for metabolite in @data.metabolites
            # todo: give compartment on back-end
            compartmentType = metabolite.id.split('_')[metabolite.id.split('_').length - 1]
            if not subgraphTypes[compartmentType]?
                subgraphTypes[compartmentType] = null

        console.log(subgraphTypes)



        # for node in @nodes
        #     if node.type is 'm' and node.compartment isnt 'e'
        #         if not subgraphTypes[node.compartment]?
        #             subgraphTypes[node.compartment] = [node]
        #         else
        #             subgraphTypes[node.compartment].push(node)
        #
        #
        # # for subgraphType of subgraphTypes
        # #
        #
        #
        #
        # for subgraphType of subgraphTypes
        #     console.log(subgraphType)
        #
        #     nameMappings =
        #         c: 'cytosol'
        #         p: 'periplasm'
        #
        #     subgraph = @createMetabolite(
        #         nameMappings[subgraphType],
        #         subgraphType,
        #         false,
        #         @ctx
        #     )
        #
        #     subgraph.r = 200
        #
        #     @nodes.push(subgraph)
        #
        #     for link in @links
        #         if link.source.type is 'm' and link.source.compartment is subgraphType
        #             link.source = subgraph
        #
        #
        #
        # console.log(@nodes[0])
        # console.log('sdsdsd', @nodes[@nodes.length - 1])
        # console.log(@links[0])
        # console.log(subgraphTypes)


    buildReactionsAndMetabolites: (model) ->
        nodes = new Array()
        links = new Array()

        for metabolite in model.metabolites
            nodes.push(@createMetabolite(
                metabolite.name,
                metabolite.id,
                false,
                @ctx
            ))


        radiusScale = utilities.scaleRadius(model, 5, 15)
        # Why tempLinks? source/target Reaction may not exist yet
        tempLinks = new Array()

        for reaction in model.reactions
            # Don't include biomass objective function reaction; skews drawing
            if @hideObjective and reaction.name.indexOf('objective function') isnt -1
                continue
            else if @everything or reaction.flux_value > 0
                nodes.push(@createReaction(
                    reaction.name,
                    reaction.id,
                    radiusScale(reaction.flux_value),
                    reaction.flux_value,
                    @ctx
                ))
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

        nodesMap = utilities.nodeMap(nodes)
        for link in tempLinks
            linkAttr =
                id        : link.id
                source    : nodes[nodesMap[link.source]]
                target    : nodes[nodesMap[link.target]]
                fluxValue : link.flux_value
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(model, 1, 5)

            links.push(new Link(linkAttr, @ctx))

        return [nodes, links]




window.FBA =
    System: System

module.exports = System
