# **Classes**
ViewController  = require "./ViewController"
Node       = require "./Node"
Specie = require "./Specie"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"
Graph = require './Graph'
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
            if metabolite.id.toString() is "Zn2tex"
                console.log("heress")
            for exclusion in @exclusions
                if metabolite.id.toString() is exclusion.id.toString()
                    console.log ("here")
            nodeAttributes =
                x    : utilities.rand(@W)
                y    : utilities.rand(@H)
                r    : @metaboliteRadius
                name : metabolite.name
                id   : metabolite.id
                type : "m"

            @nodes.push(new Metabolite(nodeAttributes, @ctx))



    buildReactions: (model) ->
        radiusScale = utilities.scaleRadius(model, 5, 15)
        tempLinks = new Array()

        for reaction in model.reactions

            if @everything or reaction.flux_value > 0
                reactionAttributes =
                    x          : utilities.rand(@W)
                    y          : utilities.rand(@H)
                    r          : radiusScale(reaction.flux_value)
                    name       : reaction.name
                    id         : reaction.id
                    type       : "r"
                    flux_value : reaction.flux_value
                    colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

                # Hardcoded kinda
                # Don't include biomass objective function reaction; skews drawing
                if @hideObjective
                    if reactionAttributes.name.indexOf('objective function') isnt -1
                        continue

                @nodes.push(new Reaction(reactionAttributes, @ctx))

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
