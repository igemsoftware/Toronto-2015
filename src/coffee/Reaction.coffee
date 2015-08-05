Node = require("./Node")

class Reaction extends Node
    draw: ->
        @ctx.beginPath()
        @ctx.moveTo(@x, @y)
        @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
        @ctx.closePath()

        @ctx.fillStyle = "blue"
        @ctx.fillStyle = "red" if @hover

        @ctx.fill()

module.exports = Reaction
