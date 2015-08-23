# **Classes**
Canvas     = require "./Canvas"
Node       = require "./Node"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

# **Utility Functions**
utilities = require("./utilities")

class System
    constructor: (attr, @data) ->
        @W                = attr.width
        @H                = attr.height
        @BG               = attr.backgroundColour
        @metaboliteRadius = attr.metaboliteRadius
        @useStatic        = attr.useStatic
        @everything       = attr.everything
        @hideObjective    = attr.hideObjective

        @nodetext =  $('#nodetext')


        # Modified by `checkCollisions`, enables O(1) runtime when a node is already hovered
        @currentActiveNode = null

        # Create Canvas Object
        # Handles zooming and panning
        @canvas = new Canvas("canvas", @W, @H, @BG)
        # Event listeners. Bind so we preserve `this`
        @canvas.c.addEventListener("mousemove", mousemoveHandler.bind(this), false)
        @canvas.c.addEventListener("mousedown", mousedownHandler.bind(this), false)
        @canvas.c.addEventListener("mouseup", mouseupHandler.bind(this), false)

        @clientX = 0
        @clientY = 0
        @exclusions = new Array()

        @nodes = new Array()
        @links = new Array()
        @force = null
        that = this
        $('#nodetext').click(->
            that.deleteNode(that.currentActiveNode)
        )
        $('#addMetabolite').click(->
            that.addMetabolite($('#metab_id').val().trim(), $('#metab_name').val().trim(), "m")
        )
        $("#addReaction").click(->
            source =
                id : $('#source').val().trim()
                name : $('#source :selected').text()
            target =
                id:  $('#target').val().trim()
                name: $('#target :selected').text()
            that.addReaction(source, target, $("#reaction_name").val())
        )
        #nodes to be exlcuded (Deleted)
        if @data?
            @buildMetabolites(@data)
            @buildReactions(@data)
            @populateOptions(@nodes)

        @initalizeForce()

        @startAnimate()

    populateOptions: (nodes) ->
        source = d3.select("#source")
        target = d3.select("#target")
        for node in nodes
            source.append("option").attr("value", node.id).text(node.name)
            target.append("option").attr("value", node.id).text(node.name)
    addMetabolite: (id, name, type) ->
        nodeAttributes =
            x    : utilities.rand(@W)
            y    : utilities.rand(@H)
            r    : @metaboliteRadius
            name : name
            id   : id
            type : type
        metabolite = new Metabolite(nodeAttributes, @canvas.ctx)
        d3.select("#source").append("option").attr("value", id).text(name)
        d3.select("#target").append("option").attr("value", id).text(name)
        @nodes.push(metabolite)


    addReaction: (source, target, name) ->
        for node in @nodes
            if node.id is source.id and node.name is node.name
                src = node
            else if node.id is target.id and node.name is node.name
                tgt = node
        if not src? or not tgt?
            alert("No self linking!")
        else if src.type is "r" and tgt.type is "m" or src.type is "m" and tgt.type is "r"
            linkAttr =
                id        : "#{src.id}-#{tgt.id}"
                source    : src
                target    : tgt
                fluxValue : 0
                r         : @metaboliteRadius #why does this even need this? idc rn
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @canvas.ctx))
        else if src.type is "m" and tgt.type is "m"
            reactionAttributes =
                x          : utilities.rand(@W)
                y          : utilities.rand(@H)
                r          : 5 #hardcoded right now
                name       : name
                id         : name
                type       : "r"
                flux_value : 0
                colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"
            reaction = new Reaction(reactionAttributes, @canvas.ctx)
            @nodes.push(reaction)
            linkAttr =
                id        : "#{source.id}-#{reaction.id}"
                source    : src
                target    : reaction
                fluxValue : 0
                r         : @metaboliteRadius #why does this even need this? idc rn
                linkScale : utilities.scaleRadius(null, 1, 5)

            @links.push(new Link(linkAttr, @canvas.ctx))
            linkAttr =
                id        : "#{reaction.id}-#{target.id}"
                source    : reaction
                target    : tgt
                fluxValue : 0
                r         : @metaboliteRadius #why does this even need this? idc rn
                linkScale : utilities.scaleRadius(null, 1, 5)
            @links.push(new Link(linkAttr, @canvas.ctx))
        else
            alert("Invalid linkage")


    initalizeForce: () ->

        @force = d3.layout.force()
            # The nodes: index,x,y,px,py,fixed bool, weight (# of associated links)
            .nodes(@nodes)
            # The links: mutates source, target
            .links(@links)
            # Affects gravitational center and initial random position
            .size([@W, @H])
            # Sets "rigidity" of links in range [0,1]; func(link, index), this -> force; evaluated at start()
            .linkStrength(2)
            # At each tick of the simulation, the particle velocity is scaled by the specified friction
            .friction(0.9)
            # Target distance b/w nodes; func(link, index), this -> force; evaluated at start()
            .linkDistance(@linkDistanceHandler)
            # Charges to be used in calculation for quadtree BH traversal; func(node,index), this -> force; evaluated at start()
            .charge(@chargeHandler)
            # Sets the maximum distance over which charge forces are applied; \infty if not specified
            #.chargeDistance()
            # Weak geometric constraint similar to a virtual spring connecting each node to the center of the layout's size
            .gravity(0.1)
            # Barnes-Hut theta: (area of quadrant) / (distance b/w node and quadrants COM) < theta => treat quadrant as single large node
            .theta(0.8)
            # Force layout's cooling parameter from [0,1]; layout stops when this reaches 0
            .alpha(0.1)
            # Let's get this party start()ed
            .on("tick", @tick.bind(this))
            .start()

        if @useStatic
            @force.tick() for n in @nodes
            @force.stop()


    startAnimate: () ->
        # Setup [AnimationFrame](https://github.com/kof/animation-frame)
        AnimationFrame = window.AnimationFrame
        AnimationFrame.shim()

        # Render: to cause to be or become
        @render()
    linkDistanceHandler: (link, i) ->
        factor = 0
        if link.target.type is 'r'
            factor = link.target.substrates.length
        else if link.source.type is 'r'
            factor = link.source.products.length

        return factor * 100

    chargeHandler: (node, i) ->
        factor = node.inNeighbours.length + node.outNeighbours.length + 1

        return factor * -100

    tick: () ->
        if @currentActiveNode? and window.fba.isDraggingNode
            tPt = @canvas.transformedPoint(@clientX, @clientY)
            @currentActiveNode.x = tPt.x
            @currentActiveNode.y = tPt.y

    # *checkCollisions*
    checkCollisions: (x, y, e) ->
        if not @currentActiveNode?
            for node in @nodes
                if node.checkCollision(x,y)
                    node.hover = true
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
                    that = this


                    @currentActiveNode = node
                else
                    node.hover = false
        else
            if not @currentActiveNode.checkCollision(x,y)
                @currentActiveNode = null
                $('#nodetext').removeClass('showing');

    deleteNode : (node) ->
        @exclusions.push(node)
        node.deleted = true
        for inNeighbour in node.inNeighbours
            nodeIndex = inNeighbour.outNeighbours.indexOf(node)
            inNeighbour.outNeighbours.splice(nodeIndex, 1)
        for outNeighbour in node.outNeighbours
            nodeIndex = outNeighbour.inNeighbours.indexOf(node)
            outNeighbour.inNeighbours.splice(nodeIndex, 1)

        #mix jquery and d3 lol....quick 'n' dirty
        #removes from the options menu
        d3.select("#source").selectAll("option")[0].forEach((d)->
                if  $(d).val() is node.id and $(d).text() is node.name
                    $(d).remove()
            )
        d3.select("#target").selectAll("option")[0].forEach((d)->
                if  $(d).val() is node.id and $(d).text() is node.name
                    $(d).remove()
            )



    mousedownHandler = (e) ->
        @clientX = e.clientX
        @clientY = e.clientY
        tPt = @canvas.transformedPoint(e.clientX, e.clientY)
        @checkCollisions(tPt.x, tPt.y, e)
        if @currentActiveNode?
            window.fba.isDraggingNode = true

    mouseupHandler = (e) ->
        @clientX = e.clientX
        @clientY = e.clientY
        window.fba.isDraggingNode = false
        @currentActiveNode = null
    mousemoveHandler = (e) ->
        e.preventDefault()
        @clientX = e.clientX
        @clientY = e.clientY
        tPt = @canvas.transformedPoint(e.clientX, e.clientY)

        if window.fba.isDraggingNode
            @currentActiveNode.x = tPt.x
            @currentActiveNode.y = tPt.y
            @nodetext.css({
                'left': e.clientX,
                'top': e.clientY

            })
        else
            @checkCollisions(tPt.x, tPt.y, e)

    buildMetabolites: (model) ->
        for metabolite in model.metabolites
            if metabolite.id.toString() is "Zn2tex"
                console.log("heress")
            for exclusion in @exclusions
                if metabolite.id.toString() is exclusion.id.toString()
                    console.log ("here")
            nodeAttributes =
                x    : utilities.rand(@W)
                y    : utilities.rand(@H)
                r    : @metaboliteRadius
                name : metabolite.name
                id   : metabolite.id
                type : "m"

            @nodes.push(new Metabolite(nodeAttributes, @canvas.ctx))



    buildReactions: (model) ->
        radiusScale = utilities.scaleRadius(model, 5, 15)
        tempLinks = new Array()

        for reaction in model.reactions

            if @everything or reaction.flux_value > 0
                reactionAttributes =
                    x          : utilities.rand(@W)
                    y          : utilities.rand(@H)
                    r          : radiusScale(reaction.flux_value)
                    name       : reaction.name
                    id         : reaction.id
                    type       : "r"
                    flux_value : reaction.flux_value
                    colour     : "rgb(#{utilities.rand(255)}, #{utilities.rand(255)}, #{utilities.rand(255)})"

                # Hardcoded kinda
                # Don't include biomass objective function reaction; skews drawing
                if @hideObjective
                    if reactionAttributes.name.indexOf('objective function') isnt -1
                        continue

                @nodes.push(new Reaction(reactionAttributes, @canvas.ctx))

                # Assign metabolite source and target for each reaction

                for metabolite in Object.keys(reaction.metabolites)


                    source = null
                    target = null

                    if reaction.metabolites[metabolite] > 0
                        source = reaction.id
                        target = metabolite
                    else
                        source = metabolite
                        target = reaction.id
                    link =
                        id         : "#{source}-#{target}"
                        source     : source
                        target     : target
                        flux_value : reaction.flux_value

                    tempLinks.push(link)

        nodesMap = utilities.nodeMap(@nodes)
        for link in tempLinks
            linkAttr =
                id        : link.id
                source    : @nodes[nodesMap[link.source]]
                target    : @nodes[nodesMap[link.target]]
                fluxValue : link.flux_value
                r         : @metaboliteRadius
                linkScale : utilities.scaleRadius(model, 1, 5)

            @links.push(new Link(linkAttr, @canvas.ctx))

    draw: ->
        link.draw() for link in @links
        node.draw() for node in @nodes

    render: ->
        stats.begin()

        @canvas.clear()
        @draw()

        stats.end()

        # Request next frame
        requestAnimationFrame(@render.bind(this))

window.FBA =
    System: System

module.exports = System
