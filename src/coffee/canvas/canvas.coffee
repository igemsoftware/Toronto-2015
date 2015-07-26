# ###Canvas

#
class Canvas
    # Constructor
    constructor: (@id, @width, @height) ->
        # Create our `<canvas>` DOM element
        c = document.createElement("canvas")
        # Set some attributes
        c.id     = @id
        c.width  = @width
        c.height = @height

        # Add event listeners
        c.addEventListener("mouseover", @mouseover, false)
        c.addEventListener("mousemove", @mousemove, false)

        # Append it to the DOM
        document.body.appendChild(c)
        
        # Get 2d context
        @ctx = document.getElementById(@id).getContext("2d")

    fill: ->
        @ctx.fill()

    mouseover: (e) ->
        e.preventDefault()
        console.log("mouseover")

    mousemove: (e) ->
        e.preventDefault()
        checkCollisions(e.clientX, e.clientY)

# ###Node

#
class Node
    constructor: (@x, @y, @r, @ctx) ->
    
    draw: ->
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)

    drawRed: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.fillStyle = "red"
        @ctx.closePath()
        @ctx.fill()

    checkCollision: (x,y) ->
        inside = true
        #@ctx.strokeRect(@x - @r, @y - @r, @x + @r, @y + @r)
        @ctx.strokeRect(@x - @r, @y - @r, 2*@r, 2*@r)
        @ctx.fill()
        if not ( @x - @r < x < @x + @r ) then inside = false
        if not ( @y - @r < y < @y + @r ) then inside = false

        return inside


W = window.innerWidth
H = window.innerHeight
canv = new Canvas("canvas", W, H)
nodes = (new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 15, canv.ctx) for n in [0...100])
n.draw() for n in nodes
canv.fill()


checkCollisions = (x,y) ->
    for n in nodes
        #if x is n.x and y is n.y then n.drawRed(canv.ctx)
        if n.checkCollision(x,y) then n.drawRed()
