System = require './System'

class TreeNode
    constructor: (@id, @system) ->
        # By the time we get here, @system has run its constructor

        # A TreeNode
        @parent = null
        # Object of TreeNodes
        @children = new Object()

        # Build a computed layout for the current system
        # @system.buildSystem(@system.data)
        # console.log(@system)

        #Create a child for each key in parsedData

        currentIndex = @system.sortables.index

        for child of @system.parsedData

            if currentIndex < @system.sortables.identifiers.length - 1 and child isnt "e" and child isnt "Community"
                @system.sortables.index = currentIndex
                systemAttr =
                    data          : @system.parsedData[child]
                    width         : @system.width
                    height        : @system.height
                    hideObjective : @system.hideObjective
                    everything    : @system.everything
                    sortables     : @system.sortables
                    ctx           : @system.ctx
                @children[child] = new TreeNode(child, new System(systemAttr))
                @children[child].parent = this

module.exports = TreeNode
