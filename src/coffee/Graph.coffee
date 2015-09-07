utilities  = require "./utilities"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

class Graph
    constructor: (@id, @outNeighbours, @inNeighbours) ->
        @value = null

module.exports = Graph
