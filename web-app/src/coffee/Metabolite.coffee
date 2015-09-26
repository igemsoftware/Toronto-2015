Node = require "./Node"

class Metabolite extends Node
    constructor: (attr, @ctx) ->
        super(attr, @ctx)
        @compartment = @id.charAt(@id.length-1)


    draw: ->
        if not @deleted
            @ctx.beginPath()
            @ctx.moveTo(@x, @y)
            @ctx.arc(@x, @y, @r, 0, 2 * Math.PI)
            @ctx.closePath()

            @ctx.fillStyle = "black"
            @ctx.fillStyle = "green" if @hover

            @ctx.fill()

module.exports = Metabolite
