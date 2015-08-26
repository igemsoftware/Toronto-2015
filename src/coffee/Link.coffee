class Link
    constructor: (@attr, @ctx) ->
        @id = @attr.id
        @r = @attr.r
        @source = @attr.source
        @target = @attr.target
        @fluxValue = @attr.fluxValue
        @linkScale = @attr.linkScale
        @thickness = @linkScale(@fluxValue)

        @appendSubstratesAndProducts()

    appendSubstratesAndProducts: ->

        if @source.type is 'm' and @target.type is 'r'
            # Case 1: substrate - reaction
            @source.outNeighbours.push(@target)
            @target.substrates.push(@source)
        else if @source.type is 'r' and @target.type is 'm'
            # Case 2: reaction -> product
            @target.inNeighbours.push(@source)
            @source.products.push(@target)

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1
    #
    setM: ->
        # rise over run bitches
        @m = (@target.y - @source.y) / (@target.x - @source.x)

    draw: ->
        if not @target.deleted and not @source.deleted
            lineAngle = Math.atan2(@target.y - @source.y, @target.x - @source.x) + Math.PI
            #h is the hypotonous length of the arrow
            h = 10
            #theta is the angle from the line to the arrow
            theta = Math.PI/8
            @ctx.beginPath()
            if @target.type is "r"
                targetx = @target.x
                targety = @target.y
            else
                targetx = @target.x + @r*Math.cos(lineAngle)
                targety = @target.y + @r*Math.sin(lineAngle)

            @ctx.moveTo(@source.x, @source.y)
            @ctx.lineTo(targetx, targety)
            #create arrow
            if @source.type is "r"
                @ctx.lineTo(targetx + h*Math.cos(theta + lineAngle), targety + h*Math.sin(theta + lineAngle))
                @ctx.moveTo(targetx, targety)
                @ctx.lineTo(targetx + h*Math.cos(-theta + lineAngle), targety + h*Math.sin(-theta + lineAngle))
            @ctx.lineWidth = @thickness
            @ctx.closePath()
            @ctx.strokeStyle = "black"
            @ctx.stroke()



module.exports = Link
