utilities  = require "./utilities"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

class Graph
    constructor: (@id) ->
        @outNeighbours = new Object()
        @inNeighbours = new Object()
        @value = null

module.exports = Graph
