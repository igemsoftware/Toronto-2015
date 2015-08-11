class Link
    constructor: (@attr, @ctx) ->
        @id = @attr.id
        @r = @attr.r
        @source = @attr.source
        @target = @attr.target
        @fluxValue = @attr.fluxValue
        @thickness = 1

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1
    #
    setM: ->
        # rise over run bitches
        @m = (@target.y - @source.y) / (@target.x - @source.x)

    draw: ->

        lineAngle = Math.atan2(@target.y - @source.y, @target.x - @source.x)
        if lineAngle < 0
            lineAngle = 2*Math.PI + lineAngle
        h = 10
        theta = Math.PI/8
        @ctx.beginPath()

        sourcex = @source.x + @r*Math.cos(lineAngle)
        sourcey = @source.y + @r*Math.sin(lineAngle)
        #else if Math.PI <= lineAngle

            #sourcex = @source.x - @r*Math.cos(Math.PI - theta)
            #sourcey = @source.y - @r*Math.sin(Math.PI - theta)
        @ctx.moveTo(@target.x, @target.y)
        @ctx.lineTo(sourcex, sourcey)
        @ctx.lineTo(sourcex + h*Math.cos(theta + lineAngle), sourcey + h*Math.sin(theta + lineAngle))
        @ctx.moveTo(sourcex, sourcey)
        @ctx.lineTo(sourcex + h*Math.cos(-theta + lineAngle), sourcey + h*Math.sin(-theta + lineAngle))
        @ctx.lineWidth = @thickness
        @ctx.closePath()
        @ctx.strokeStyle = "black"
        @ctx.stroke()



module.exports = Link
