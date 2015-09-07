Node = require "./Node"

class Compartment extends Node
    constructor: (@attr, @ctx)->
        super(@attr, @ctx)
        @type = "Compartment"
    draw: ->
        if not @deleted
            @ctx.beginPath()
            @ctx.moveTo(@x, @y)
            @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
            @ctx.closePath()

            @ctx.fillStyle = @colour
            @ctx.fillStyle = "green" if @hover

            @ctx.fill()

module.exports = Compartment
