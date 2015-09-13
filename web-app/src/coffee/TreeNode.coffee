
class TreeNode
    #parent is a system
    #children is an object of systems
    #value is a system
    constructor: (@id, @subsystem) ->
        @parent = null #must be a treeNode object
        @children = new Object() #Object of treeNodes

        # Calls to be made to strip the data and make new children happen here!
        # subsystem.organizeData -> [splited up data that is stripped]
        # create children for it


module.exports = TreeNode
