Node = require("./Node")

class Reaction extends Node
    constructor: (attr, @ctx) ->
        super(attr, @ctx)

        @substrateCompartments = new Array()
        @productCompartments = new Array()
        @links = new Array()

    addLink: (link) ->
        @links.push(link)

        # console.log(link.source.type)

        if link.source.type is 'r'
            # R -> m
            # console.log(link.target.compartment)
            if @productCompartments.indexOf(link.target.compartment) is -1
                @productCompartments.push(link.target.compartment)
        else if link.target.type is 'r'
            # m -> R
            if @substrateCompartments.indexOf(link.source.compartment) is -1
                @substrateCompartments.push(link.source.compartment)


    draw: ->
        if not @deleted
            nos = 6
            size = @r

            @ctx.beginPath()
            @ctx.moveTo(@x + @r * Math.cos(0), @y + @r * Math.sin(0))

            for i in [0...nos]
                @ctx.lineTo(@x + @r * Math.cos(i * 2 * Math.PI / nos), @y + @r * Math.sin (i * (2 * Math.PI / nos)))

            @ctx.lineTo(@x + @r * Math.cos(0), @y + @r * Math.sin(0))
            @ctx.lineTo(@x + @r * Math.cos(1 * 2 * Math.PI / nos), @y + @r * Math.sin (1 * (2 * Math.PI / nos)))

            # @ctx.strokeStyle = "rgb(120,120,120)"
            # @ctx.stroke()
            @ctx.fillStyle = @colour
            @ctx.closePath()

            @ctx.fill()

            factor = 1.2
            @ctx.beginPath()
            @ctx.moveTo(@x + factor * @r * Math.cos(0), @y + factor * @r * Math.sin(0))

            for i in [0...nos]
                @ctx.lineTo(@x + factor * @r * Math.cos(i * 2 * Math.PI / nos), @y + factor * @r * Math.sin (i * (2 * Math.PI / nos)))

            @ctx.lineTo(@x + factor * @r * Math.cos(0), @y + factor * @r * Math.sin(0))
            @ctx.lineTo(@x + factor * @r * Math.cos(1 * 2 * Math.PI / nos), @y + factor * @r * Math.sin (1 * (2 * Math.PI / nos)))

            @ctx.closePath()
            # @ctx.strokeStyle = "rgb(120,120,120)"
            @ctx.strokeStyle = @colour
            @ctx.stroke()

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
