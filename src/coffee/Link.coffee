class Link
    constructor: (@id, @source, @target, @ctx) ->
        @thickness = 5

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1

    draw: ->
        length = Math.sqrt((@source.x - @target.x)**2 + (@source.y - @target.y)**2)
        angle = Math.atan2(@target.y-@source.y,@target.x-@source.x);
        #temporary constant to offset the size
        #since the hexagone will be a static size, this constant can change, but this is temporary
        c = 10
        @ctx.save()
        @ctx.translate(@source.x, @source.y)
        @ctx.rotate(angle - Math.PI/2)
        @ctx.rect(-@thickness/2, 0, @thickness, length - c)
        @ctx.fill()
        @ctx.restore()
        #arrow
        # @ctx.save()
        # @ctx.translate(-@thickness/2 ,length - c)
        # @ctx.rotate(angle - Math.PI/2)
        #
        # @ctx.lineTo(@thickness, length)

        @ctx.fill()
        @ctx.restore()

        # @ctx.moveTo(@target.x, @target.y);
        # @ctx.lineTo(@target.x-@thickness*Math.cos(angle-Math.PI/6),@target.y-@thickness*Math.sin(angle-Math.PI/6));
        # @ctx.moveTo(@target.x, @target.y);
        # @ctx.lineTo(@target.x-@thickness*Math.cos(angle+Math.PI/6),@target.y-@thickness*Math.sin(angle+Math.PI/6));




module.exports = Link
