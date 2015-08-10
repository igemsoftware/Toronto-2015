class Link
    constructor: (@id, @source, @target, @ctx) ->
        @thickness = 3

    y = (x1, y1, m) ->
        return (x)->
            return m*(x-x1)+y1 + translate
    solveForX = (g, h) ->


    draw: ->

        

module.exports = Link
