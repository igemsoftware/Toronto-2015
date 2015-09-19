class Link
    constructor: (@attr, @ctx) ->
        @id = @attr.id
        @source = @attr.source
        @target = @attr.target
        @thickness = @attr.thickness
        @colourScale = @attr.colourScale
        @appendSubstratesAndProducts()
        @flux_value = @source.flux_value or @target.flux_value
        scale = @colourScale(Math.abs(@flux_value))
        if @flux_value is 0
            @colour = "black"
        else if @flux_value > 0
            @colour = "rgb(0,#{scale},0)"
        else
            @colour = "rgb(#{scale},0,0)"
    appendSubstratesAndProducts: ->
        #update this
        if @source.type is 'm' and @target.type is 'r'
            # Case 1: substrate - reaction
            if @target.substrates.indexOf(@source) < 0
                @source.outNeighbours.push(@target)
                @target.substrates.push(@source)

        else if @source.type is 'r' and @target.type is 'm'
            # Case 2: reaction -> product
            @target.inNeighbours.push(@source)
            @source.products.push(@target)
        else if @target.type is 'r' and @source.type is 'Compartment'#implies compartment
            #case 3: specie - reaction
            #@target.inNeighbours.push(@source.name)
            @source.products.push(@target)
        else if @source.type is 'r' and @target.type is 'Compartment'
            @target.inNeighbours.push(@source)
            #@source.products.push(@target.name)
    draw: ->
        if not @target.deleted and not @source.deleted
            lineAngle = Math.atan2(@target.y - @source.y, @target.x - @source.x) + Math.PI
            #h is the hypotonous length of the arrow
            h = 10
            #theta is the angle from the line to the arrow
            theta = Math.PI/8
            @ctx.beginPath()


            targetx = @target.x + @target.r*Math.cos(lineAngle)
            targety = @target.y + @target.r*Math.sin(lineAngle)

            @ctx.moveTo(@source.x, @source.y)
            @ctx.lineTo(targetx, targety)
            #create arrow


            @ctx.lineTo(targetx + h*Math.cos(theta + lineAngle), targety + h*Math.sin(theta + lineAngle))
            @ctx.moveTo(targetx, targety)
            @ctx.lineTo(targetx + h*Math.cos(-theta + lineAngle), targety + h*Math.sin(-theta + lineAngle))

            @ctx.lineWidth = @thickness
            @ctx.closePath()
            @ctx.strokeStyle = @colour
            @ctx.stroke()

module.exports = Link
