Reaction   = require './Reaction'
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
