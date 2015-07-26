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



checkCollisions = (x,y) ->
        for n in nodes
            if n.checkCollision(x,y) then n.drawRed()

mousemove = (e) ->
        e.preventDefault()
        checkCollisions(e.clientX, e.clientY)

W = window.innerWidth
H = window.innerHeight
canv = new Canvas("canvas", W, H)
canv.c.addEventListener("mousemove", mousemove, false)

nodes = (new Node(Math.floor(Math.random() * W), Math.floor(Math.random() * H), 15, canv.ctx) for n in [0...100])
n.draw() for n in nodes

network = new Network(canv, nodes)

canv.fill()
