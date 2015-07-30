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
checkCollisions = (x,y) ->
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

# **Mouse Events**

# **mousemove**
mousemove = (e) ->
        e.preventDefault()
        checkCollisions(e.clientX, e.clientY)
CANVAS.c.addEventListener("mousemove", mousemove, false)


# **Render Pipeline**

# Clear the canvas
clear = ->
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)
    ctx.fill()

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
