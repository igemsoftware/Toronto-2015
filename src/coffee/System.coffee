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
        # [@nodes, @links] = @buildReactionsAndMetabolites(@data)

        # After Metabolites and Reactions built
        @compartmentalize()

    compartmentalize: ->
        subgraphTypes = new Object()

        [nodes, links] = @buildReactionsAndMetabolites(@data)

        for metabolite in @data.metabolites
            # todo: give compartment on back-end
            compartmentType = metabolite.id.split('_')[metabolite.id.split('_').length - 1]
            if not subgraphTypes[compartmentType]? and compartmentType isnt 'e'
                subgraphTypes[compartmentType] = new Object()


        # for link in links
        #     if link.source.type is 'r' and link.target.compartment is 'e'
        #         console.log(link)

        for subgraphType of subgraphTypes
            nameMappings =
                c: 'cytosol'
                p: 'periplasm'

            subgraph = @createMetabolite(
                nameMappings[subgraphType],
                subgraphType,
                false,
                @ctx
            )

            subgraph.r = 50

            @nodes.push(subgraph)

            for link in links
                if link.source.type is 'm'
                    # case 1: m -> r
                    if link.source.compartment is subgraphType
                        # SG -> r
                        # if subgraphType is 'c'
                        #     console.log(subgraph)
                        link.source = subgraph
                        @nodes.push(link.target)
                        @links.push(link)
                else if link.source.type is 'r'
                    # case 2: r -> m
                    console.log('links')




                # 'c' -> X goes into 'c' blob
                # if link.source.type is 'm' and link.source.compartment is subgraphType
                #     link.source = subgraph
                #     @nodes.push(link.target)
                #     @links.push(link)

                # X -> 'c' goes into 'c' blob
                # if link.source.type is 'm'
                #     link.target = subgraph
                #     @nodes.push(link.source)
                #     @links.push(link)

                # if link.source.type is 'r' and link.target.type is 'm' and link.target.compartment is 'e'
                #     @nodes.push(link.target)
                #     @links.push(link)


                # if link.source.type is 'p' and




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
