Reaction   = require './Reaction'
ReactionNode = require './ReactionNode'
Metabolite = require './Metabolite'
Link       = require './Link'

utilities = require './utilities'

module.exports =
	createReaction: (name, id, radius, flux, ctx) ->
		reactionAttributes =
			x : utilities.rand(@W)
			y : utilities.rand(@H)
			r : radius
			name : name
			id : id
			type : "r"
			flux_value : flux
			# colour : utilities.stringToColour(name)
		return new Reaction(reactionAttributes, ctx)

	# System injected
	createReactionNode: (reaction) ->
		r = @reactions[reaction.id]
		if not r?
			reactionAttributes =
				x : utilities.rand(@W)
				y : utilities.rand(@H)
				r : @radiusScale(reaction.flux_value)
				name : reaction.name
				id : reaction.id
				type : "r"
				flux_value : reaction.flux_value
				colour : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

			r = new ReactionNode(reactionAttributes, @ctx)
			@reactions[reaction.id] = r
			for inNeighbour in reaction.inNeighbours
				r.inNeighbours.push(inNeighbour.name)
			for outNeighbour in reaction.outNeighbours
				r.outNeighbours.push(outNeighbour.name)
			@nodes.push(r)
		return r

	# System injected
	createMetabolite: (name, id, radius, updateOption, ctx) ->
		nodeAttributes =
			x : utilities.rand(@W)
			y : utilities.rand(@H)
			r : radius
			name : name
			id : id
			type : "m"
		metabolite = new Metabolite(nodeAttributes, ctx)
		if updateOption
			@viewController.updateOptions(name, id)
		return metabolite

	# System injected
	createLink: (src, tgt, name, flux, radius, ctx) ->
        if src.type is "r" and tgt.type is "m"
            # console.log('here')
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : radius
                linkScale : utilities.scaleRadius(null, 1, 5)

            return new Link(linkAttr, ctx)
        else if src.type is "m" and tgt.type is "r"
            # console.log(src.type)
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : radius
                linkScale : utilities.scaleRadius(null, 1, 5)
            return new Link(linkAttr, ctx)
        else
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : flux
                r         : radius
                linkScale : utilities.scaleRadius(null, 1, 5)
            return new Link(linkAttr, ctx)

	# System injected
	createLinks: (s1, reactionNode, s2) ->
		source = @compartments[s1]
		target = reactionNode
		link =
			id : "#{source.name}-#{target.name}"
			source : source
			target : target
			flux_value : reactionNode.flux_value
			r : @metaboliteRadius
			linkScale : utilities.scaleRadius(null, 1, 5)
		@links.push(new Link(link, @ctx))
		source = reactionNode
		target = @compartments[s2]
		link =
			id : "#{source.name}-#{target.name}"
			source : source
			target : target
			flux_value : reactionNode.flux_value
			r : @metaboliteRadius
			linkScale : utilities.scaleRadius(null, 1, 5)
		@links.push(new Link(link, @ctx))

	# System injected
	createLeaf: (graph) ->
		for inNeighbour of graph.inNeighbours
			for outNeighbour of graph.outNeighbours
				if inNeighbour isnt outNeighbour
					reactionNode = @createReactionNode(graph.value)
					@createLinks(inNeighbour, reactionNode, outNeighbour)
