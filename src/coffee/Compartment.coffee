Node = require "./Node"

class Compartment extends Node
    draw: ->
        if not @deleted
            @ctx.beginPath()
            @ctx.moveTo(@x, @y)
            @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
            @ctx.closePath()

            @ctx.fillStyle = "orange"
            @ctx.fillStyle = "green" if @hover

            @ctx.fill()

module.exports = Compartment
