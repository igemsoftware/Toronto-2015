class TreeNode
    constructor: (@id, @system) ->
        # By the time we get here, @system has run its constructor

        # A TreeNode
        @parent = null
        # Object of TreeNodes
        @children = new Object()


        @system.buildSystem(@system.data)

        # for child of @system.parsedData
        #     @system.buildSystem(@system.parsedData[child])


module.exports = TreeNode
