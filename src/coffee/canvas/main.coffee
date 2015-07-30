# **Classes**
Canvas = require "./Canvas"
Node   = require "./Node"
Link   = require "./Link"

# Setup [AnimationFrame](https://github.com/kof/animation-frame)
AnimationFrame = window.AnimationFrame
AnimationFrame.shim()


# **Static Variables**
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

# **Live Variables**

# By *live*, these will be actively accessed/modified throughout runtime.

# The list of *Nodes*
nodes = (new Node(rand(W), rand(H), 5, ctx) for n in [0...500])
# Modified by `checkCollisions`, enables O(1) runtime when a node is already hovered
currentActiveNode = null
links = (new Link(rand(nodes.length),rand(nodes.length)) for n in nodes)


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


# **For zooming and panning**
lastX = W // 2
lastY = H // 2
cameraX = 0
cameraY = 0
cameraWidth = W
cameraHeight = H
scale = 1
svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
xform = svg.createSVGMatrix()
transformedPoint = (x, y) ->
    pt = svg.createSVGPoint()
    pt.x = x
    pt.y = y
    return pt.matrixTransform(xform.inverse())


# **Mouse Events**

# **mousemove**
mousemove = (e) ->
    e.preventDefault()

    lastX = e.clientX - CANVAS.c.offsetLeft
    lastY = e.clientY - CANVAS.c.offsetTop
    checkCollisions(e.clientX, e.clientY)

# **mousewheel**
mousewheel = (e) ->
    e.preventDefault()

    # n or -n
    wheel = event.wheelDelta / 120
    # wheel = delta
    zoom = 1 + wheel / 2
    
    # camera way

    # mouseX = e.clientX - CANVAS.c.offsetLeft
    # mouseY = e.clientY - CANVAS.c.offsetTop
    #
    # xOffset = mouseX / scale + cameraX - mouseX / (scale * zoom)
    # yOffset = mouseY / scale + cameraY - mouseY / (scale * zoom)
    #
    #
    # ctx.translate(cameraX, cameraY)
    # ctx.scale(zoom,zoom)
    # xform = xform.scaleNonUniform(zoom,zoom)
    # scale *= zoom
    # ctx.translate(-xOffset, -yOffset)
    # cameraX = xOffset
    # cameraY = yOffset
    # cameraWidth = W / scale
    # cameraHeight = H / scale

    # Matrix way
    
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

# Creating event listenerss
CANVAS.c.addEventListener("mousemove", mousemove, false)
CANVAS.c.addEventListener("mousewheel", mousewheel, false)


# **Render Pipeline**

# Clear the canvas
clear = ->
    ctx.fillStyle = BG
    # ctx.fillRect(0, 0, W, H)
    # Camera way
    # ctx.fillRect(cameraX, cameraY, cameraWidth, cameraHeight)
    # Matrix way
    p1 = transformedPoint(0,0)
    p2 = transformedPoint(W,H)
    ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    
    ctx.fill()
#
# Draw nodes and links
draw = ->
    n.draw() for n in nodes
    
    for link in links
        ctx.moveTo(nodes[link.source].x, nodes[link.source].y)
        ctx.lineTo(nodes[link.target].x, nodes[link.target].y)
    ctx.stroke()

# Update node x,y values
update = ->
    delta = (new Date()).getTime() - sTime
    n.y += Math.sin(delta/(Math.PI*100))*(i/100 + 1) for n,i in nodes
    n.x += Math.sin(delta/(Math.PI*250))*(i/100 + 1) for n,i in nodes

render = ->
    stats.begin()
    
    clear()
    draw()
    update()
    
    stats.end()
    
    # Request next frame
    requestAnimationFrame(render)

# **Start the render loop**
render()
