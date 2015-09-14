class TreeNode
    constructor: (@id, @subsystem) ->
        # By the time we get here, @subsystem has run its constructor

        # A TreeNode
        @parent = null
        # Object of TreeNodes
        @children = new Object()
        # A Subsystem
        @value = null

        # Calls to be made to strip the data and make new children happen here!
        # subsystem.organizeData -> [splited up data that is stripped]
        # create children for it
        # parse data first for the system
        # parsedData = @subsystem.parseData(@subsystem.data) #probably give a sorter
        # @subsystem.buildGraph(parsedData)


        for key of @subsystem.parsedData
            # Use data to make kids
            console.log(@subsystem.parsedData[key])

        @subsystem.buildSystem(@subsystem.data)

module.exports = TreeNode
