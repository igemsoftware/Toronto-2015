ViewController = require './ViewController'
TreeNode = require './TreeNode'
System = require './System'

# The M for our MVC
class Network
    constructor: (attr) ->
        # The VC for our MVC
        @viewController = new ViewController(attr.wrapperId, 'canvas', attr.width, attr.height, attr.backgroundColour, this, attr.showStats)

        # Create our root TreeNode
        # Will recursively create children
        systemAttr =
            data : attr.data
            width : attr.width
            height : attr.height
            hideObjective : attr.hideObjective
            everything : attr.everything
            sortables : attr.sortables
            ctx : @viewController.ctx
        @root = new TreeNode('root', new System(systemAttr))
        #@root.system.initializeForce()

        # Start the visualization
        @viewController.startCanvas(@root.system)
        @currentLevel = @root

        # console.log(@root)


    enterSpecie: (node) ->
        #find node
        @currentLevel = @currentLevel.children[node.id]

        @viewController.setActiveGraph(@currentLevel.system)
        #@viewController.setActiveGraph(@currentLevel.system)
    exitSpecie: (node) ->
        @currentLevel = @currentLevel.parent
        @viewController.setActiveGraph(@currentLevel.system)


module.exports = Network
