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

    addMetabolite: (id, name, type) ->
        nodeAttributes =
            x    : utilities.rand(@W)
            y    : utilities.rand(@H)
            r    : @metaboliteRadius
            name : name
            id   : id
            type : type
        metabolite = new Metabolite(nodeAttributes, @ctx)
        @viewController.updateOptions(name, id)

        @nodes.push(metabolite)


    addReaction: (source, target, name) ->
        for node in @nodes
            if node.id is source.id and node.name is node.name
                src = node
            else if node.id is target.id and node.name is node.name
                tgt = node
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : 0
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x          : utilities.rand(@W)
                y          : utilities.rand(@H)
                r          : 5 #hardcoded right now
                name       : name
                id         : name
                type       : "r"
                flux_value : 0
                colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @ctx)
            @nodes.push(reaction)
            linkAttr =
                id        : "#{source.id}-#{reaction.id}"
                source    : src
                target    : reaction
                fluxValue : 0
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, @ctx))
            linkAttr =
                id        : "#{reaction.id}-#{target.id}"
                source    : reaction
                target    : tgt
                fluxValue : 0
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @ctx))
        else
            alert("Invalid linkage")

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
