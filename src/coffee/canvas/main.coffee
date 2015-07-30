# **Classes**
Canvas = require "./Canvas"
Node = require "./Node"

# **Settings**
bg = "white"
W = window.innerWidth
H = window.innerHeight

# Setup [AnimationFrame](https://github.com/kof/animation-frame)
AnimationFrame = window.AnimationFrame
AnimationFrame.shim()

# **Live Variables**

# By *live*, these will be actively accessed/modified throughout runtime.

# The painters `<canvas>`
canv = new Canvas("canvas", W, H)
# For some convenience
ctx = canv.ctx
# The list of *Nodes*
nodes = (new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 5, canv.ctx) for n in [0...500])
# Modified by `checkCollisions`, enables O(1) runtime when a node is already hovered
currentActiveNode = null


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
canv.c.addEventListener("mousemove", mousemove, false)


# **Render Pipeline**

clear = ->
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canv.width, canv.height)
    ctx.fill()
render = ->
    stats.begin()
    clear()
    n.draw() for n in nodes
    stats.end()

    requestAnimationFrame(render)

# **Start the render loop**
render()
