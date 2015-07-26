Canvas = require "./Canvas"
Node = require "./Node"

checkCollisions = (x,y) ->
    for n in nodes
        #if x is n.x and y is n.y then n.drawRed(canv.ctx)
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
canv.fill()
