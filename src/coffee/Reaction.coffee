Node = require("./Node")

class Reaction extends Node
    draw: ->
        nos = 6
        size = @r

        @ctx.beginPath()
        @ctx.moveTo(@x + @r * Math.cos(0), @y + @r * Math.sin(0))

        for i in [0...nos]
            @ctx.lineTo(@x + @r * Math.cos(i * 2 * Math.PI / nos), @y + @r * Math.sin (i * (2 * Math.PI / nos)))

        @ctx.strokeStyle = "rgb(120,120,120)"
        @ctx.stroke()
        @ctx.fillStyle = "blue"
        @ctx.closePath()

        @ctx.fill()

        # @ctx.beginPath()
        # @ctx.moveTo(@x, @y)
        # @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        # @ctx.closePath()
        #
        # @ctx.fillStyle = "blue"
        # @ctx.fillStyle = "red" if @hover
        #
        # @ctx.fill()

module.exports = Reaction
