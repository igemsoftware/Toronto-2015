rand = (range) ->
    return Math.floor(Math.random() * range)

# ###Node

#
class Node
    constructor: (attr, @ctx) ->
        @x = attr.x
        @y = attr.y
        @r = attr.r
        @hover = false
        @id = attr.id
        @name = attr.name
        @type = attr.type
        @colour = attr.colour
        @keepStatic = false

        # Reaction properties
        # In neighbours
        @substrates = @inNeighbours = new Array()
        # Out neighbours
        @products = @outNeighbours = new Array()
        @deleted = false
        # reaction has flux value
        @flux_value = attr.flux_value

    checkCollision: (x,y) ->
        inside = false
        if ((x-@x)**2 + (y-@y)**2 <= @r**2) then inside = true

        return inside

module.exports = Node
