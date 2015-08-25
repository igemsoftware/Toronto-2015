# ###Canvas


class ViewController
    # **Constructor**
    constructor: (@id, @width, @height, @BG, @system) ->
        # Create our `<canvas>` DOM element
        @c = document.createElement("canvas")
        # Set some attributes
        @c.id     = @id
        @c.width  = @width
        @c.height = @height

        @currentActiveNode = null
        @isDraggingNode = false
        #current mouse position
        @clientX = 0
        @clientY = 0
        # Add event listeners. Bind so we preserve `this`.
        @c.addEventListener("mousewheel", mousewheelHandler.bind(this), false)
        @c.addEventListener("mousedown", mousedownHandler.bind(this), false)
        @c.addEventListener("mouseup", mouseupHandler.bind(this), false)
        @c.addEventListener("mousemove", mousemoveHandler.bind(this), false)

        # Append it to the DOM
        #tried to disable select, failed misribly.
        document.body.appendChild(@c)

        @nodetext =  $('#nodetext')
        #disable highlighting (Still doesnt work WIP)
        $(@id).css({
            "-moz-user-select": "none",
            "-webkit-user-select": "none",
            "-ms-user-select" : "none",
            "user-select": "none",
            "-o-user-select": "none",
            "unselectable": "on"
        })
        #temporary
        that = this
        $('#nodetext').click(->
            console.log(that)
            that.system.deleteNode(that.currentActiveNode)
        )
        $('#addMetabolite').click(->
            that.system.addMetabolite($('#metab_id').val().trim(), $('#metab_name').val().trim(), "m")
        )
        $("#addReaction").click(->
            source =
                id : $('#source').val().trim()
                name : $('#source :selected').text()
            target =
                id:  $('#target').val().trim()
                name: $('#target :selected').text()
            that.system.addReaction(source, target, $("#reaction_name").val())
        )
        # Get 2d context
        @ctx = document.getElementById(@id).getContext("2d")

        # SVG Matrix for zooming/panning
        @svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
        @xform = @svg.createSVGMatrix()
        @dragStart = null
        @dragScaleFactor = 1.5
        @lastX = @width // 2
        @lastY = @width // 2
        @startAnimate()


    populateOptions: (nodes) ->
        source = d3.select("#source")
        target = d3.select("#target")
        for node in nodes
            source.append("option").attr("value", node.id).text(node.name)
            target.append("option").attr("value", node.id).text(node.name)

    updateOptions: (name, id) ->
        d3.select("#source").append("option").attr("value", id).text(name)
        d3.select("#target").append("option").attr("value", id).text(name)

    transformedPoint: (x, y) ->
        pt = @svg.createSVGPoint()
        pt.x = x
        pt.y = y
        return pt.matrixTransform(@xform.inverse())

    mousedownHandler = (e) ->
        @clientX = e.clientX
        @clientY = e.clientY
        @lastX = e.clientX - @c.offsetLeft
        @lastY = e.clientY - @c.offsetTop

        tPt = @transformedPoint(e.clientX, e.clientY)
        @system.checkCollisions(tPt.x, tPt.y)
        #pan screen if not dragging node
        if not @currentActiveNode?
            @dragStart = @transformedPoint(@lastX, @lastY)
        else
            $('#nodetext').removeClass('showing');
            @isDraggingNode = true

    # **mousemove**
    mousemoveHandler = (e) ->
        e.preventDefault()
        clientX = e.clientX
        clientY = e.clientY
        # Dragging
        @lastX = e.clientX - @c.offsetLeft
        @lastY = e.clientY - @c.offsetTop
        tPt = @transformedPoint(@lastX, @lastY)
        #pan screen
        if @dragStart? and not @isDraggingNode
            dX = (tPt.x - @dragStart.x) * @dragScaleFactor
            dY = (tPt.y - @dragStart.y) * @dragScaleFactor
            @xform = @xform.translate(dX, dY)
            @ctx.translate(dX, dY)
        #drag node if isDraggingNode
        else if @isDraggingNode
            @currentActiveNode.x = tPt.x
            @currentActiveNode.y = tPt.y
        #Collision detection for non-active nodes
        else
            @currentActiveNode = @system.checkCollisions(tPt.x, tPt.y)
            if @currentActiveNode?
                @appendText(@currentActiveNode, e)
            else
                $('#nodetext').removeClass('showing');


    # **mouseup**
    mouseupHandler = (e) ->
        e.preventDefault()
        @clientX = e.clientX
        @clientY = e.clientY
        @dragStart = null
        @isDraggingNode = false
        @currentActiveNode = null

    mousewheelHandler = (e) ->
        @clientX = e.clientX
        @clientY = e.clientY

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
    tick: () ->
        if @currentActiveNode? and @isDraggingNode
            tPt = @canvas.transformedPoint(@clientX, @clientY)
            @currentActiveNode.x = tPt.x
            @currentActiveNode.y = tPt.y

    appendText : (node, e) ->
        @nodetext.addClass('showing')
        @nodetext.css({
            'left': e.clientX,
            'top': e.clientY

        })
        if node.type is 'r'
            substrates = (substrate.name for substrate in node.substrates)
            products = (product.name for product in node.products)
            @nodetext.html("#{substrates} --- (#{node.name}) ---> #{products}<br>")
        else
            @nodetext.html("#{node.name}<br>")
        @nodetext.append("Click above text to delete node (WIP)")
    startAnimate: () ->
        # Setup [AnimationFrame](https://github.com/kof/animation-frame)
        AnimationFrame = window.AnimationFrame
        AnimationFrame.shim()
        # Render: to cause to be or become
        @render()
    clear: ->
        @ctx.fillStyle = @BG
        p1 = @transformedPoint(0,0)
        p2 = @transformedPoint(@width, @height)
        @ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
        @ctx.fill()

    draw: ->
        link.draw() for link in @system.links
        node.draw() for node in @system.nodes

    render: ->
        stats.begin()
        @clear()
        @draw()
        stats.end()
        # Request next frame
        requestAnimationFrame(@render.bind(this))

module.exports = ViewController
