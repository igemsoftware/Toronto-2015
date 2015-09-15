class TreeNode
    constructor: (@id, @subsystem) ->
        # By the time we get here, @subsystem has run its constructor

        # A TreeNode
        @parent = null
        # Object of TreeNodes
        @children = new Object()


        @subsystem.buildSystem(@subsystem.data)

        # for child of @subsystem.parsedData
        #     @subsystem.buildSystem(@subsystem.parsedData[child])


module.exports = TreeNode
