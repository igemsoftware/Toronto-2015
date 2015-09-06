utilities  = require "./utilities"
Specie     = require "./Specie"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"

class Graph
    # constructor: (attr, @data) ->
    #     @W                 = attr.width
    #     @H                 = attr.height
    #     @BG                = attr.backgroundColour
    #     @useStatic         = attr.useStatic
    #     @everything        = attr.everything
    #     @hideObjective     = attr.hideObjective
    #     @metaboliteRadius  = attr.metaboliteRadius
    #     # Initialize the remaining properties as empty for now
    #     @currentActiveNode = null
    #     @force             = null
    #     @nodes             = new Array()
    #     @links             = new Array()
    #     @exclusions        = new Array()
    #     @children = new Object()
    #     @siblings = new Object()
    #     @parents = new Array()

    # children are outNeighbours
    # inNeighours are graphs you are a parent of
    constructor: (@id, @outNeighbours, @inNeighbours) ->


module.exports = Graph
