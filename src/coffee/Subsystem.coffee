Compartment = require "./Compartment"
utilities   = require "./utilities"
creators    = require './creators'
force       = require './force'

class Subsystem
	constructor: (attr, @graph) ->
		@ctx = attr.ctx
		@W = attr.width
		@H = attr.height
		# @BG = attr.backgroundColour
		@metaboliteRadius = attr.metaboliteRadius
		# @useStatic = attr.useStatic
		# @everything = attr.everything
		# @hideObjective = attr.hideObjective

		# @force = null
		# @currentActiveNode = null

		@compartments = new Object()
		@reactions = new Object()
		@nodes = new Array()
		@links = new Array()

		@radiusScale = utilities.scaleRadius(null, 5, 15)

		# Inject System into utility functions
		# todo: remove need for injecting
		creators.createReactionNode = creators.createReactionNode.bind(this)
		creators.createLeaf = creators.createLeaf.bind(this)
		creators.createLinks = creators.createLinks.bind(this)
		force.initalizeForce = force.initalizeForce.bind(this)

		#get rid of root
		for compartment of @graph.outNeighbours
			@buildCompartments(@graph.outNeighbours[compartment])
		for compartment of @graph.outNeighbours
			@buildNodesAndLinks(@graph.outNeighbours[compartment])
		@initalizeForce()
		# console.log(@nodes)

	buildNodesAndLinks: (graph)->
		#reached leaf
		if graph.value? and graph.value.type is "r"
			#deal with leaf
			@createLeaf(graph)
		else
			for compartment of graph.outNeighbours
				@buildNodesAndLinks(graph.outNeighbours[compartment])
			#console.log(graph.outNeighbours)
			#@buildNodesAndLinks(graph.outNeighbours[])

	buildCompartments: (graph)->
		#reached leaf
		if graph.value? and graph.value.type is "r"
			return
		else
		# for compartment of graph.outNeighbours
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

	createLeaf: creators.createLeaf

	createLinks: creators.createLinks

	createReactionNode: creators.createReactionNode

	initalizeForce: force.initalizeForce

	checkCollisions: (x, y) ->
		nodeReturn = null
		for node in @nodes
			if node.checkCollision(x,y)
				nodeReturn = node
				node.hover = true
				break
			else
				node.hover = false
		return nodeReturn

	# Not even being used
	# addReaction: addors.addReaction
	# addMetabolite: addors.addMetabolite
	# deleteNode : deletors.deleteNode

module.exports = Subsystem
