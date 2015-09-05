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
        @buildMetabolites(@data)
        @buildReactions(@data)

    buildMetabolites: (model) ->
        for metabolite in model.metabolites
            @nodes.push(@createMetabolite(
                metabolite.name,
                metabolite.id,
                false,
                @ctx
            ))

    buildReactions: (model) ->
        radiusScale = utilities.scaleRadius(model, 5, 15)
        # Why tempLinks? source/target Reaction may not exist yet
        tempLinks = new Array()

        for reaction in model.reactions
            # Don't include biomass objective function reaction; skews drawing
            if @hideObjective and reaction.name.indexOf('objective function') isnt -1
                continue
            else if @everything or reaction.flux_value > 0
                @nodes.push(@createReaction(
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

        nodesMap = utilities.nodeMap(@nodes)
        for link in tempLinks
            linkAttr =
                id        : link.id
                source    : @nodes[nodesMap[link.source]]
                target    : @nodes[nodesMap[link.target]]
                fluxValue : link.flux_value
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(model, 1, 5)

            @links.push(new Link(linkAttr, @ctx))

window.FBA =
    System: System

module.exports = System
