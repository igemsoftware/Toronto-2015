# **Classes**
Canvas     = require "./Canvas"
Node       = require "./Node"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

# Setup [AnimationFrame](https://github.com/kof/animation-frame)
AnimationFrame = window.AnimationFrame
AnimationFrame.shim()


# **Static Variables**
metaboliteRadius = 10
BG = "white"
W = window.innerWidth
H = window.innerHeight
# The painters `<canvas>`
CANVAS = new Canvas("canvas", W, H)
sTime = (new Date()).getTime()
# For some convenience
ctx = CANVAS.ctx
rand = (range) ->
    return Math.floor(Math.random() * range)

# Modified by `checkCollisions`, enables O(1) runtime when a node is already hovered
currentActiveNode = null

# **Functions**

# **checkCollisions**
checkCollisions = (x, y) ->
    if not currentActiveNode?
        for n in nodes
            if n.checkCollision(x,y)
                n.hover = true
                currentActiveNode = n
            else
                n.hover = false
    else
        if not currentActiveNode.checkCollision(x,y)
            currentActiveNode = null


# **For zooming**
scale = 1
svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
xform = svg.createSVGMatrix()

# **transformedPoint**
transformedPoint = (x, y) ->
    pt = svg.createSVGPoint()
    pt.x = x
    pt.y = y
    return pt.matrixTransform(xform.inverse())


# **For dragging**
dragStart = null
dragScaleFactor = 1.5
lastX = W // 2
lastY = H // 2

# **Mouse Events**

# **mousedown**
mousedown = (e) ->
    lastX = e.clientX - CANVAS.c.offsetLeft
    lastY = e.clientY - CANVAS.c.offsetTop
    dragStart = transformedPoint(lastX, lastY)

# **mouseup**
mouseup = (e) ->
    dragStart = null

# **mousemove**
mousemove = (e) ->
    e.preventDefault()

    # Collisons
    tPt = transformedPoint(e.clientX, e.clientY)
    checkCollisions(tPt.x, tPt.y)

    # Dragging
    lastX = e.clientX - CANVAS.c.offsetLeft
    lastY = e.clientY - CANVAS.c.offsetTop

    if dragStart?
        tPt = transformedPoint(lastX, lastY)
        dX = (tPt.x - dragStart.x) * dragScaleFactor
        dY = (tPt.y - dragStart.y) * dragScaleFactor
        xform = xform.translate(dX, dY)
        ctx.translate(dX, dY)

# **mousewheel**
mousewheel = (e) ->
    e.preventDefault()

    # `n` or `-n`
    wheel = event.wheelDelta / 120
    zoom = 1 + wheel / 2

    delta = 0
    if e.wheelDelta?
        delta = e.wheelDelta/120
    else
        if e.detail?
            delta = -e.detail

    pt = transformedPoint(lastX, lastY)
    ctx.translate(pt.x, pt.y)
    xform = xform.translate(pt.x, pt.y)
    factor = zoom
    ctx.scale(factor, factor)
    xform = xform.scaleNonUniform(factor, factor)
    ctx.translate(-pt.x, -pt.y)
    xform = xform.translate(-pt.x, -pt.y)

# Creating event listeners
CANVAS.c.addEventListener("mousedown", mousedown, false)
CANVAS.c.addEventListener("mouseup", mouseup, false)
CANVAS.c.addEventListener("mousemove", mousemove, false)
CANVAS.c.addEventListener("mousewheel", mousewheel, false)


# **Network construction pipeline**

# 1. Push "System" into "Pathways"
# pathways.push(new System(attributes, model))

# 2. init(model) ->
#       buildMetabolites(model)
#       buildReactions(model)
#       set up force layout

console.log(data)
console.log("#{data.metabolites.length} metabolites")

buildMetabolites = (model) ->
    tempNodes = new Array()
    for metabolite in model.metabolites
        nodeAttributes =
            x: rand(W)
            y: rand(H)
            r: metaboliteRadius
            name: metabolite.name
            id: metabolite.id
            type: "m"

        tempNodes.push(new Metabolite(nodeAttributes, ctx))

    return tempNodes


scaleRadius = (model, minRadius, maxRadius) ->
    fluxes = (reaction.flux_value for reaction in model.reactions)
    largest = Math.max.apply(Math, fluxes)

    return d3.scale.linear()
        .domain([0, largest])
        .range([minRadius, maxRadius])

nodeMap = (nodes) ->
    map = new Object()

    for node,i in nodes
        map[node.id] = i

    return map

buildReactions = (model) ->
    radiusScale = scaleRadius(model, 5, 15)
    tempLinks = new Array()

    # tempNodes = new Array()

    for reaction in model.reactions
        if reaction.flux_value > 0
            nodeAttributes =
                x: rand(W)
                y: rand(H)
                r: radiusScale(reaction.flux_value)
                name: reaction.name
                id: reaction.id
                type: "r"
                flux_value: reaction.flux_value

            # tempNodes.push(new Node(nodeAttributes, ctx))
            nodes.push(new Reaction(nodeAttributes, ctx))

            # Assign metabolite source and target for each reaction
            for metabolite in Object.keys(reaction.metabolites)
                source = null
                target = null

                if metabolite > 0
                    source = reaction.id
                    target = metabolite
                else
                    source = metabolite
                    target = reaction.id

                link =
                    id: "#{source.id}-#{target.id}"
                    source: source
                    target: target
                    flux_value: reaction.flux_value

                tempLinks.push(link)

    nodesMap = nodeMap(nodes)
    for link in tempLinks
        linkAttr =
            id: link.id
            source: nodes[nodesMap[link.source]]
            target: nodes[nodesMap[link.target]]
            fluxValue: link.flux_value
            r: metaboliteRadius
            linkScale: scaleRadius(model, 1, 5)

        links.push(new Link(linkAttr, ctx))


nodes = buildMetabolites(data)

links = new Array()
buildReactions(data)
#links = (new Link(rand(nodes.length),rand(nodes.length)) for n in nodes)

# **D3 Force Layout**
force = d3.layout.force()
    # The nodes: index,x,y,px,py,fixed bool, weight (# of associated links)
    .nodes(nodes)
    # The links: mutates source, target
    .links(links)
    # Affects gravitational center and initial random position
    .size([W, H])
    # Sets "rigidity" of links in range [0,1]; func(link, index), this -> force; evaluated at start()
    .linkStrength(2)
    # At each tick of the simulation, the particle velocity is scaled by the specified friction
    .friction(0.9)
    # Target distance b/w nodes; func(link, index), this -> force; evaluated at start()
    .linkDistance(50)
    # Charges to be used in calculation for quadtree BH traversal; func(node,index), this -> force; evaluated at start()
    .charge(-500)
    # Sets the maximum distance over which charge forces are applied; \infty if not specified
    #.chargeDistance()
    # Weak geometric constraint similar to a virtual spring connecting each node to the center of the layout's size
    .gravity(0.1)
    # Barnes-Hut theta: (area of quadrant) / (distance b/w node and quadrants COM) < theta => treat quadrant as single large node
    .theta(0.8)
    # Force layout's cooling parameter from [0,1]; layout stops when this reaches 0
    .alpha(0.1)
    # Let's get this party start()ed
    .start()

# Uncomment this and reanable force.tick() in render()
# Although, then nothing happens.
#force.stop()

# Precompute layout for static rendering
# optionify this later
# This will *need* a loading gif
#force.tick() for n in nodes
#force.stop()

# **Render Pipeline**

# Clear the canvas
clear = ->
    ctx.fillStyle = BG
    p1 = transformedPoint(0,0)
    p2 = transformedPoint(W,H)
    ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    ctx.fill()

# Draw nodes and links
draw = ->
    # ctx.strokeStyle = "black"
    # ctx.fillStyle = "black"
    link.draw() for link in links
    # ctx.stroke()

    node.draw() for node in nodes


# Update node x,y values
update = ->
    delta = (new Date()).getTime() - sTime
    n.y += Math.sin(delta/(Math.PI*100))*(i/100 + 1) for n,i in nodes
    n.x += Math.sin(delta/(Math.PI*250))*(i/100 + 1) for n,i in nodes

render = ->
    stats.begin()
    clear()
    draw()
    # turn update() on for some sinusoidal rythmic fun
    #update()
    #force.tick()

    stats.end()

    # Request next frame
    requestAnimationFrame(render)

# **Start the render loop**

render()

# or use the non-animation frame way
# I get same FPS either way
# we probably need some JS testing library to get useful benchmarks
# or compare frame times with profiler
# but it seems basically the same

# force.on("tick", ->
#     stats.begin()
#
#     clear()
#     draw()
#
#     stats.end()
# )
