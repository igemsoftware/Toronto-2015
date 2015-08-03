rand = (range) ->
    return Math.floor(Math.random() * range)

# ###Node

#
class Node
    constructor: (attr, @ctx) ->
        @x = attr.x
        @y = attr.y
        @r = attr.r
        @hover = false
        @id = attr.id
        @name = attr.name
        @type = attr.type

        # reaction has flux value

    draw: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.closePath()

        # todo: draw metabolite, reaction different colours

        if @hover
            @ctx.fillStyle = "red"
        else
            @ctx.fillStyle = "black"
            #@ctx.fillStyle = "rgb(#{rand(155)+100},0,0)"

        @ctx.fill()

    checkCollision: (x,y) ->
        inside = false
        if ((x-@x)**2 + (y-@y)**2 <= @r**2) then inside = true

        return inside

module.exports = Node
