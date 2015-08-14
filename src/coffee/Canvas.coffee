# ###Canvas


window.fba =
    isDraggingNode: false
class Canvas
    # **Constructor**
    constructor: (@id, @width, @height, @BG) ->
        # Create our `<canvas>` DOM element
        @c = document.createElement("canvas")
        # Set some attributes
        @c.id     = @id
        @c.width  = @width
        @c.height = @height

        # Add event listeners. Bind so we preserve `this`.
        @c.addEventListener("mousewheel", mousewheelHandler.bind(this), false)
        @c.addEventListener("mousedown", mousedownHandler.bind(this), false)
        @c.addEventListener("mouseup", mouseupHandler.bind(this), false)
        @c.addEventListener("mousemove", mousemoveHandler.bind(this), false)

        # Append it to the DOM
        document.body.appendChild(@c)

        # Get 2d context
        @ctx = document.getElementById(@id).getContext("2d")

        # SVG Matrix for zooming/panning
        @svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
        @xform = @svg.createSVGMatrix()
        @dragStart = null
        @dragScaleFactor = 1.5
        @lastX = @width // 2
        @lastY = @width // 2

    clear: ->
        @ctx.fillStyle = @BG
        p1 = @transformedPoint(0,0)
        p2 = @transformedPoint(@width, @height)
        @ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
        @ctx.fill()

    transformedPoint: (x, y) ->
        pt = @svg.createSVGPoint()
        pt.x = x
        pt.y = y
        return pt.matrixTransform(@xform.inverse())

    mousedownHandler = (e) ->
        @lastX = e.clientX - @c.offsetLeft
        @lastY = e.clientY - @c.offsetTop

        if not window.fba.isDraggingNode
            @dragStart = @transformedPoint(@lastX, @lastY)

    # **mouseup**
    mouseupHandler = (e) ->
        @dragStart = null

    # **mousemove**
    mousemoveHandler = (e) ->
        e.preventDefault()

        # Dragging
        @lastX = e.clientX - @c.offsetLeft
        @lastY = e.clientY - @c.offsetTop
        if @dragStart? and not window.fba.isDraggingNode
            tPt = @transformedPoint(@lastX, @lastY)
            dX = (tPt.x - @dragStart.x) * @dragScaleFactor
            dY = (tPt.y - @dragStart.y) * @dragScaleFactor
            @xform = @xform.translate(dX, dY)
            @ctx.translate(dX, dY)

    mousewheelHandler = (e) ->
        e.preventDefault()

        # `n` or `-n`
        wheel = e.wheelDelta / 120
        zoom = 1 + wheel / 2

        delta = 0
        if e.wheelDelta?
            delta = e.wheelDelta / 120
        else
            if e.detail?
                delta = -e.detail

        factor = zoom
        pt = @transformedPoint(@lastX, @lastY)

        # Translate,
        @ctx.translate(pt.x, pt.y)
        @xform = @xform.translate(pt.x, pt.y)
        # scale,
        @ctx.scale(factor, factor)
        @xform = @xform.scaleNonUniform(factor, factor)
        # and translate again.
        @ctx.translate(-pt.x, -pt.y)
        @xform = @xform.translate(-pt.x, -pt.y)

module.exports = Canvas
