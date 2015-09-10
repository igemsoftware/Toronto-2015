linkDistanceHandler = (link, i) ->
	factor = 0
	if link.target.type is 'r'
		factor = link.target.substrates.length
	else if link.source.type is 'r'
		factor = link.source.products.length

	return factor*100

chargeHandler = (node, i) ->
	factor = node.inNeighbours.length + node.outNeighbours.length + 1
	factor = node.r*2
	return factor * -800

module.exports = initalizeForce: ->
	# console.log(@links.length)
	@force = d3.layout.force()
		# The nodes: index,x,y,px,py,fixed bool, weight (# of associated links)
		.nodes(@nodes)
		# The links: mutates source, target
		.links(@links)
		# Affects gravitational center and initial random position
		.size([@W, @H])
		# Sets "rigidity" of links in range [0,1]; func(link, index), this -> force; evaluated at start()
		.linkStrength(2)
		# At each tick of the simulation, the particle velocity is scaled by the specified friction
		.friction(0.9)
		# Target distance b/w nodes; func(link, index), this -> force; evaluated at start()
		.linkDistance(linkDistanceHandler)
		# Charges to be used in calculation for quadtree BH traversal; func(node,index), this -> force; evaluated at start()
		.charge(chargeHandler)
		# Sets the maximum distance over which charge forces are applied; \infty if not specified
		#.chargeDistance()
		# Weak geometric constraint similar to a virtual spring connecting each node to the center of the layout's size
		.gravity(0.1)
		# Barnes-Hut theta: (area of quadrant) / (distance b/w node and quadrants COM) < theta => treat quadrant as single large node
		.theta(0.8)
		# Force layout's cooling parameter from [0,1]; layout stops when this reaches 0
		.alpha(0.1)
		# Let's get this party start()ed

	if @useStatic
		@force.tick() for n in @nodes
		@force.stop()
