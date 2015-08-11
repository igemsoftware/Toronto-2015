class Link
    constructor: (@attr, @ctx) ->
        @id = @attr.id
        @source = @attr.source
        @target = @attr.target
        @fluxValue = @attr.fluxValue
        @thickness = 5

        console.log(@fluxValue)

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1

    setM: ->
        # rise over run bitches
        @m = (@target.y - @source.y) / (@target.x - @source.x)

    draw: ->
        @setM()

        @ctx.beginPath()
        @ctx.moveTo(@source.x, @source.y)
        @ctx.lineTo(@target.x, @target.y)
        @ctx.lineWidth = @thickness
        @ctx.closePath()

        @ctx.strokeStyle = "black"
        @ctx.stroke()

        # foo = 1
        # @ctx.beginPath()
        # @ctx.moveTo(@source.x, @source.y)
        # @ctx.lineTo(@target.x, @target.y)
        # @ctx.lineTo(@target.x + foo, @target.y + foo)
        # @ctx.lineTo(@source.x + foo, @source.y + foo)
        # @ctx.closePath()
        #
        # @ctx.fillStyle = "black"
        # @ctx.fill()

        # length = Math.sqrt((@source.x - @target.x)**2 + (@source.y - @target.y)**2)
        # angle = Math.atan2(@target.y-@source.y,@target.x-@source.x);
        # #temporary constant to offset the size
        # #since the hexagone will be a static size, this constant can change, but this is temporary
        # c = 10
        # @ctx.save()
        # @ctx.translate(@source.x, @source.y)
        # @ctx.rotate(angle - Math.PI/2)
        # @ctx.rect(-@thickness/2, 0, @thickness, length - c)
        # @ctx.fill()
        # @ctx.restore()
        # #arrow
        # # @ctx.save()
        # # @ctx.translate(-@thickness/2 ,length - c)
        # # @ctx.rotate(angle - Math.PI/2)
        # #
        # # @ctx.lineTo(@thickness, length)
        #
        # @ctx.fill()
        # @ctx.restore()
        #
        # # @ctx.moveTo(@target.x, @target.y);
        # # @ctx.lineTo(@target.x-@thickness*Math.cos(angle-Math.PI/6),@target.y-@thickness*Math.sin(angle-Math.PI/6));
        # # @ctx.moveTo(@target.x, @target.y);
        # # @ctx.lineTo(@target.x-@thickness*Math.cos(angle+Math.PI/6),@target.y-@thickness*Math.sin(angle+Math.PI/6));

module.exports = Link
