module.exports =
    addMetabolite: (id, name, type, radius) ->
        nodeAttributes =
            x : utilities.rand(@width)
            y : utilities.rand(@height)
            r : radius
            name : name
            id : id
            type : type
        metabolite = new Metabolite(nodeAttributes, @ctx)
        @viewController.updateOptions(name, id)

        @nodes.push(metabolite)

    addLink: (src, tgt, name, flux, radius, thickness) ->
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                thickness: thickness
                colourScale: @colourScale
            @links.push(new Link(linkAttr, @ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x : utilities.rand(@W)
                y : utilities.rand(@H)
                r : radius
                name : name
                id : name
                type : "r"
                flux_value : flux
                colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @ctx)
            @nodes.push(reaction)
            linkAttr =
                id : "#{source.id}-#{reaction.id}"
                source : src
                target : reaction
                thickness: thickness
                colourScale: @colourScale
            @links.push(new Link(linkAttr, ctx))
            linkAttr =
                id : "#{reaction.id}-#{target.id}"
                source : reaction
                target : tgt
                thickness: thickness
            @links.push(new Link(linkAttr, ctx))
        else
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                thickness: thickness
                colourScale: @colourScale
            @links.push(new Link(linkAttr, ctx))

    addReaction: (src, tgt, name, radius, W, H, thickness) ->
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id : "#{src.id}-#{tgt.id}"
                source : src
                target : tgt
                fluxValue : 0
                thickness: thickness
                colourScale: @colourScale
            @links.push(new Link(linkAttr, @ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x : utilities.rand(W)
                y : utilities.rand(H)
                r : 5 #hardcoded right now
                name : name
                id : name
                type : "r"
                flux_value : 0
                colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @ctx)
            @nodes.push(reaction)
            linkAttr =
                id : "#{source.id}-#{reaction.id}"
                source : src
                target : reaction
                fluxValue : 0
                r : radius
                thickness: thickness
                colourScale: @colourScale

            @links.push(new Link(linkAttr, @ctx))
            linkAttr =
                id : "#{reaction.id}-#{target.id}"
                source : reaction
                target : tgt
                fluxValue : 0
                r : radius
                thickness: thickness
                colourScale: @colourScale
                
            @links.push(new Link(linkAttr, @ctx))
        else
            alert("Invalid linkage")
