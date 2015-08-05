class Link
    constructor: (@id, @source, @target, @ctx) ->

    draw: ->
        @ctx.moveTo(@source.x, @source.y)
        @ctx.lineTo(@target.x, @target.y)

module.exports = Link
