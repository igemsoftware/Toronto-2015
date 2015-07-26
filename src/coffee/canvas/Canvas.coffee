# ###Canvas

#
class Canvas
    # Constructor
    constructor: (@id, @width, @height) ->
        # Create our `<canvas>` DOM element
        @c = document.createElement("canvas")
        # Set some attributes
        @c.id     = @id
        @c.width  = @width
        @c.height = @height

        # Add event listeners
        @c.addEventListener("mouseover", @mouseover, false)
        #c.addEventListener("mousemove", @mousemove, false)

        # Append it to the DOM
        document.body.appendChild(@c)
        
        # Get 2d context
        @ctx = document.getElementById(@id).getContext("2d")

    fill: ->
        @ctx.fill()

    mouseover: (e) ->
        e.preventDefault()
        console.log("mouseover")

    # mousemove: (e) ->
    #     e.preventDefault()
    #     checkCollisions(e.clientX, e.clientY)

module.exports = Canvas
