class Link
    constructor: (@id, @source, @target, @ctx) ->
        @thickness = 5

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1

    draw: ->
        length = Math.sqrt((@source.x - @target.x)**2 + (@source.y - @target.y)**2)
        angle = Math.atan2(@source.y-@target.y, @source.x - @target.x)
        #@ctx.moveTo(@source.x, @source.y)
        #@ctx.lineTo(@target.x, @target.y)
        # @ctx.save()
        # @ctx.rect(@source.x, @source.y, length, @thickness)
        # @ctx.fill()

        @ctx.save()
        @ctx.translate(@source.x, @source.y)
        @ctx.rotate(angle + Math.PI/2)
        @ctx.rect(-@thickness/2, 0, @thickness, length)
        #@ctx.beginPath()
        # @ctx.lineTo(@target.x-2*@thickness*Math.cos(angle-Math.PI/6),@target.y-2*@thickness*Math.sin(angle-Math.PI/6));
        # @ctx.moveTo(@target.x, @target.y);
        # @ctx.lineTo(@target.x-2*@thickness*Math.cos(angle+Math.PI/6),@target.y-2*@thickness*Math.sin(angle+Math.PI/6));
        @ctx.fill()
        @ctx.restore()



        #@ctx.fillRect(50, 50, 100, 100)

# m = (@source.y - @target.y)/(@source.x - @target.x)
# lineFromSourceTranslatedPlus = y(@source.x, @source.y + @thickness, m)
# lineFromSourceTranslatedMinus = y(@source.x, @source.y - @thickness, m)
# perpToSource = y(@source.x, @source.y, -1/m)
# perpToTarget = y(@target.x, @target.y, -1/m)
# angle = Math.atan2(@target.y-@source.y,@target.x-@source.x);
# @ctx.moveTo(@source.x, @source.y);
# @ctx.lineTo(@target.x, @target.y);
# @ctx.lineTo(@target.x-@thickness*Math.cos(angle-Math.PI/6),@target.y-@thickness*Math.sin(angle-Math.PI/6));
# @ctx.moveTo(@target.x, @target.y);
# @ctx.lineTo(@target.x-@thickness*Math.cos(angle+Math.PI/6),@target.y-@thickness*Math.sin(angle+Math.PI/6));

    # draw: ->
    #
    #     #@ctx.moveTo(@source.x, @source.y)
    #     m = (@source.y-@target.y)/(@source.x-@target.x)
    #     # lineFromSourceTranslatedPlus = y(@source.x, @source.y + @thickness,  m)
    #     # lineFromSourceTranslatedMinus = y(@source.x, @source.y - @thickness, m)
    #     # perpToSource = y(@source.x, @source.y, -1/m)
    #     # perpToTarget = y(@target.x, @target.y, -1/m)
    #     line1 =
    #         start:
    #             x: @source.x
    #             y: @source.y
    #         end:
    #             x: @target.x
    #             y: @target.y + @thickness
    #     line2 =
    #         start:
    #             x: @source.x
    #             y: @source.y
    #         end:
    #             x: @target.x
    #             y:  @target.y - @thickness
    #     temp = y(@source.x, @source.y, -1/m)
    #     linePerpSource =
    #         start:
    #             x: @source.x
    #             y: @source.y
    #         end:
    #             x: 0
    #             y: temp(0)
    #     temp = y(@target.x, @target.y, -1/m)
    #     linePerpTarget =
    #         start:
    #             x: @target.x
    #             y: @target.y
    #         end:
    #             x: 0
    #             y: temp(0)
    #
    #
    #     start = intersection.intersect(line1, linePerpSource)
    #
    #     @ctx.moveTo(start.x, start.y)
    #
    #     inters = intersection.intersect(line1, linePerpTarget)
    #     #console.log intersection.describe(line2, linePerpSource)
    #     @ctx.lineTo(inters.x, inters.y)
    #     inters = intersection.intersect(line2, linePerpTarget)
    #     @ctx.lineTo(inters.x, inters.y)
    #     inters = intersection.intersect(line1, linePerpTarget)
    #     @ctx.lineTo(inters.x, inters.y)
    #     @ctx.lineTo(start.x, start.y)
    #     #@ctx.closePath()
    #     # @ctx.fillStyle = "red"
    #     # @ctx.fill()


module.exports = Link
