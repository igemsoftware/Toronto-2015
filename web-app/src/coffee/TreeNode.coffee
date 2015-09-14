class TreeNode
    constructor: (@id, @subsystem) ->
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

        @subsystem.buildSystem(@subsystem.data)

        # Create the children

module.exports = TreeNode
