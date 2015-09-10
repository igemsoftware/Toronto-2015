Compartment = require './Compartment'

utilities = require './utilities'

creators = require './creators'

class SystemRenderable
	constructor: (graph) ->
		@nodes = new Array()
		@links = new Array()


		@compartments = new Object()

		@radiusScale = utilities.scaleRadius(null, 5, 15)
		@reactions = new Object()


		# Inject System into utility functions
		# todo: remove need for injecting
		creators.createReactionNode = creators.createReactionNode.bind(this)
		creators.createLeaf = creators.createLeaf.bind(this)
		creators.createLinks = creators.createLinks.bind(this)

		# Build a compartment for each immidiate outNeighbour
		for compartment of graph.outNeighbours
			@buildCompartments(graph.outNeighbours[compartment])
		for compartment of graph.outNeighbours
			@buildNodesAndLinks(graph.outNeighbours[compartment])

		delete @compartments
		delete @reactions
		delete @radiusScale

	buildCompartments: (graph)->
		# Reached a Leaf
		if graph.value? and graph.value.type is "r"
			return
		else
			nodeAttributes =
				x : utilities.rand(@W)
				y : utilities.rand(@H)
				r : 150
				name : graph.name
				id : graph.id
				type : "s"
				colour: "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
			c = new Compartment(nodeAttributes, @ctx)
			@compartments[graph.id] = c
			@nodes.push(c)
			for compartment of graph.outNeighbours
				@buildCompartments(graph.outNeighbours[compartment])

	buildNodesAndLinks: (graph)->
		#reached leaf
		if graph.value? and graph.value.type is "r"
			#deal with leaf
			@createLeaf(graph)
		else
			for compartment of graph.outNeighbours
				@buildNodesAndLinks(graph.outNeighbours[compartment])

	createLeaf: creators.createLeaf

	createLinks: creators.createLinks

	createReactionNode: creators.createReactionNode

module.exports = SystemRenderable
