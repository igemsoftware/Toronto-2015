Node = require "./Node"

class Metabolite extends Node
    constructor: (attr, @ctx) ->
        super(attr, @ctx)
        @compartment = attr.compartment
        if @compartment? and @compartment isnt "p" and @compartment isnt "c" and @compartment isnt "e"
            if @compartment.toLowerCase() is "cytosol"
                @compartment = "c"
            else if @compartment.toLowerCase is "periplasm"
                @compartment = "p"
            else
                @compartment = "e"
        else
            #Anthony case
            if "_" in @id and "-" in @id
                @compartment = @id.slice(@id.lastIndexOf("-") + 1, @id.length)
            else if "_" in  @id
                @compartment = @id.split('_')[@id.split('_').length - 1]
            else
                @compartment = @id.split('-')[@id.split('-').length - 1]


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
