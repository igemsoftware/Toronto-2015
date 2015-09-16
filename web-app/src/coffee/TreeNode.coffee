System = require './System'

class TreeNode
    constructor: (@id, @system) ->
        # By the time we get here, @system has run its constructor

        # A TreeNode
        @parent = null
        # Object of TreeNodes
        @children = new Object()

        # Build a computed layout for the current system
        @system.buildSystem(@system.data)
        # console.log(@system)


        # Create a child for each key in parsedData
        for child of @system.parsedData
            if @system.sortables.index < @system.sortables.identifiers.length - 1
                systemAttr =
                    data          : @system.parsedData[child]
                    width         : @system.width
                    height        : @system.height
                    hideObjective : @system.hideObjective
                    everything    : @system.everything
                    sortables     : @system.sortables
                    ctx           : @system.ctx

                console.log("Making #{child}")
                @children[child] = new TreeNode(child, new System(systemAttr))
                @children[child].parent = this

module.exports = TreeNode
