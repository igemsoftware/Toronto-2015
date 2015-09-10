module.exports =
	addLink: (src, tgt, name, flux, radius, ctx) ->
		if not src? or not tgt?
			alert("No self linking!")
		else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
			linkAttr =
				id : "#{src.id}-#{tgt.id}"
				source : src
				target : tgt
				fluxValue : flux
				r : radius
				linkScale : utilities.scaleRadius(null, 1, 5)
			@links.push(new Link(linkAttr, ctx))
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
			reaction = new Reaction(reactionAttributes, ctx)
			@nodes.push(reaction)
			linkAttr =
				id : "#{source.id}-#{reaction.id}"
				source : src
				target : reaction
				fluxValue : flux
				r : radius
				linkScale : utilities.scaleRadius(null, 1, 5)

			@links.push(new Link(linkAttr, ctx))
			linkAttr =
				id : "#{reaction.id}-#{target.id}"
				source : reaction
				target : tgt
				fluxValue : flux
				r : radius
				linkScale : utilities.scaleRadius(null, 1, 5)
			@links.push(new Link(linkAttr, ctx))
		else
			linkAttr =
				id : "#{src.id}-#{tgt.id}"
				source : src
				target : tgt
				fluxValue : flux
				r : @metaboliteRadius
				linkScale : utilities.scaleRadius(null, 1, 5)
			@links.push(new Link(linkAttr, ctx))
