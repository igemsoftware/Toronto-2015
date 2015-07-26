Canvas = require "./Canvas"
Node = require "./Node"

class Network
    constructor: (@canvas, @nodes) ->
        @foo("foobars")
        # @mousemove()
        # @canvas.c.addEventListener("mousemove", @mousemove, false)

    foobar = (bar) ->
        console.log(bar)

    foo: (bar) ->
        console.log(@nodes)
        foobar(bar)

    # checkCollisions = (x,y, nodes) ->
    #     for n in nodes
    #         if n.checkCollision(x,y) then n.drawRed()

    # mousemove: (e) ->
    #     #e.preventDefault()
    #     #foo()
    #     console.log(@nodes)
    #     #checkCollisions(e.clientX, e.clientY, @nodes)


currentActiveNode = null

checkCollisions = (x,y) ->
        if not currentActiveNode?
            console.log(currentActiveNode)
            for n in nodes
                inside = n.checkCollision(x,y)
                console.log(inside)
                if inside then n.hover = true; n.drawRed(); currentActiveNode = n

                if n.hover and (not inside) then n.hover = false; n.draw()
                
                #if n.hover then n.drawRed() else n.draw()

                # if n.hover and (not n.checkCollision(x,y)) then
                #     n.hover = false
                #     n.draw()
        else
            inside = currentActiveNode.checkCollision(x,y)
            if not inside then currentActiveNode.draw(); currentActiveNode = null

mousemove = (e) ->
        e.preventDefault()
        checkCollisions(e.clientX, e.clientY)

W = window.innerWidth
H = window.innerHeight
canv = new Canvas("canvas", W, H)
canv.c.addEventListener("mousemove", mousemove, false)

nodes = (new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 10, canv.ctx) for n in [0...3000])
n.draw() for n in nodes

network = new Network(canv, nodes)

canv.fill()
