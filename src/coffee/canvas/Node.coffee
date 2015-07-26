# ###Node

#
class Node
    constructor: (@x, @y, @r, @ctx) ->
        @hover = false

    draw: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.fillStyle = "black"
        @ctx.closePath()
        @ctx.fill()

    drawRed: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.fillStyle = "red"
        @ctx.closePath()
        @ctx.fill()

    checkCollision: (x,y) ->
        inside = true
        # @ctx.strokeRect(@x - @r, @y - @r, 2*@r, 2*@r)
        # @ctx.fill()
        if not ( @x - @r < x < @x + @r ) then inside = false
        if not ( @y - @r < y < @y + @r ) then inside = false

        return inside

module.exports = Node
