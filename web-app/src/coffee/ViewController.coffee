# Canvas
class ViewController
    # **Constructor**
    constructor: (@wrapperId, @id, @width, @height, @BG, @network, @showStats) ->
        # Create our `<canvas>` DOM element

        @c = document.createElement("canvas")
        # Set some attributes
        @c.id = @id
        @c.width = @width
        @c.height = @height
        @currentActiveNode = null
        @isDraggingNode = false
        #current mouse position
        @clientX = 0
        @clientY = 0

        @maxZoomOut = 7.5
        @maxZoomIn = 0.05
        # Append it to the DOM
        #tried to disable select, failed misribly.
        document.getElementById(@wrapperId).appendChild(@c)
        # Get 2d context
        @ctx = document.getElementById(@id).getContext("2d")
        @nodetext = $('#nodetext')

        @stats = new Stats()

        @stats.domElement.style.position = 'absolute'
        @stats.domElement.style.left = '0px'
        @stats.domElement.style.top = '0px'

        if @showStats
            document.body.appendChild(@stats.domElement)


    startCanvas:(system) ->
        @activeGraph = system
        @populateOptions(@activeGraph.nodes)
        @activeGraph.force.start()
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


        $('#addMetabolite').click(->
            that.activeGraph.nodes.push(
                that.activeGraph.createMetabolite($('#metab_name').val().trim(), $('#metab_id').val().trim(),
                    true, that.ctx)
            )
        )
        $("#addReaction").click(->
            source =
                id : $('#source').val().trim()
                name : $('#source :selected').text()
            target =
                id: $('#target').val().trim()
                name: $('#target :selected').text()
            that.activeGraph.createNewLink(source, target, $("#reaction_name").val(), 0, that.ctx)
        )



        # SVG Matrix for zooming/panning
        @svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
        @xform = @svg.createSVGMatrix()
        @dragStart = null
        @dragScaleFactor = 1.5
        @lastX = @width // 2
        @lastY = @width // 2
        @activeGraph.force.start()

        # Add event listeners. Bind so we preserve `this`.
        @c.addEventListener("mousewheel", mousewheelHandler.bind(this), false)
        @c.addEventListener("mousedown", mousedownHandler.bind(this), false)
        @c.addEventListener("mouseup", mouseupHandler.bind(this), false)
        @c.addEventListener("mousemove", mousemoveHandler.bind(this), false)

        @startAnimate()

    populateOptions: (nodes) ->
        $("#source").html("")
        $("#target").html("")
        source = d3.select("#source")
        target = d3.select("#target")
        for node in nodes
            source.append("option").attr("value", node.id).text(node.name)
            target.append("option").attr("value", node.id).text(node.name)


    updateOptions: (name, id) ->
        d3.select("#source").append("option").attr("value", id).text(name)
        d3.select("#target").append("option").attr("value", id).text(name)

    removeOption: (node) ->
        d3.select("#source").selectAll("option")[0].forEach((d)->
            if $(d).val() is node.id and $(d).text() is node.name
                $(d).remove()
            )
        d3.select("#target").selectAll("option")[0].forEach((d)->
            if $(d).val() is node.id and $(d).text() is node.name
                $(d).remove()
            )
        $('#nodetext').removeClass('showing')

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

        @activeGraph.checkCollisions(tPt.x, tPt.y)
        #pan screen if not dragging node
        if not @currentActiveNode?
            @dragStart = @transformedPoint(@lastX, @lastY)
        else
            $('#nodetext').removeClass('showing')
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
            @currentActiveNode = @activeGraph.checkCollisions(tPt.x, tPt.y)
            if @currentActiveNode?
                @appendText(@currentActiveNode, e)
            else
                $('#nodetext').removeClass('showing')


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
        # if @xform.a <= @maxZoomIn and factor <= 1
        #     return
        # else if @xform.a >= @maxZoomOut and factor >= 1
        #     return


            #or @xform.a >= 7.5

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
            tPt = @transformedPoint(@clientX, @clientY)
            @currentActiveNode.x = tPt.x
            @currentActiveNode.y = tPt.y

    appendText : (node, e) ->
        @nodetext.addClass('showing')
        @nodetext.css({
            'left': e.clientX,
            'top': e.clientY

        })
        that = this
        htmlText = ""
        if node.type is 'r'
            # console.log(node)
            substrates = (substrate.name for substrate in node.inNeighbours)
            products = (product.name for product in node.outNeighbours)
            htmlText+= ("#{substrates} --- (#{node.name}) ---> #{products}<br>")
            htmlText+= ("Flux: #{node.flux_value}<br>")
            htmlText+= ("<button id='delete'>Delete Reaction</button><br>")
        else if node.type is 'm'
            htmlText+= ("#{node.name}<br>")
            htmlText+= ("<button id='delete'>Delete Node</button><br>")
        else if node.type is 'Compartment' and @network.currentLevel.children[node.id]?
            htmlText += ("#{node.name}<br>")
            htmlText += ("<button id='enter'>Enter Node</button><br>")
        else if node.type is 'Compartment'
            htmlText += ("#{node.name}<br>")

        if @network.root.system isnt @activeGraph
            htmlText += ("<button id='network'>Return to Previous level</button><br>")

        @nodetext.html(htmlText)
        $("#delete").click(->
            that.network.deleteNode(node.id, that.activeGraph)
        )
        $("#enter").click(->
            that.network.enterSpecie(node)
        )
        $("#network").click(->
            that.network.exitSpecie()
        )

    setActiveGraph: (system) ->
        @populateOptions(@activeGraph.nodes)
        @activeGraph.force.stop()
        @activeGraph = system
        @activeGraph.force.on("tick", @tick.bind(this)).start()
        @activeGraph.force.resume()

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
        link.draw() for link in @activeGraph.links
        node.draw() for node in @activeGraph.nodes

    render: ->
        if @showStats
            @stats.begin()
            @clear()
            @draw()
            @stats.end()
        else
            @clear()
            @draw()
        # Request next frame
        requestAnimationFrame(@render.bind(this))

module.exports = ViewController
