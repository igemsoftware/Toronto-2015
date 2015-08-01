# ###Node

#
class Node
    constructor: (@x, @y, @r, @ctx) ->
        @hover = false

    draw: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.closePath()

        if @hover
            @ctx.fillStyle = "red"
        else
            @ctx.fillStyle = "black"

        @ctx.fill()

    drawRed: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.fillStyle = "red"
        @ctx.closePath()
        @ctx.fill()

    checkCollision: (x,y) ->
        inside = false
        # @ctx.strokeRect(@x - @r, @y - @r, 2*@r, 2*@r)
        # @ctx.fill()
        if  ((x-@x)**2 + (y-@y)**2 <= @r**2 )
          inside = true



        return inside

module.exports = Node
