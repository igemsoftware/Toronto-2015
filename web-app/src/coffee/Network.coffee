ViewController = require './ViewController'
TreeNode       = require './TreeNode'
System      = require './System'

# The M for our MVC
class Network
    constructor: (attr) ->
        # The VC for our MVC
        @viewController = new ViewController('canvas', attr.width, attr.height, attr.backgroundColour)

        # Create our root TreeNode
        # Will recursively create children
        systemAttr =
            data          : attr.data
            width         : attr.width
            height        : attr.height
            hideObjective : attr.hideObjective
            everything    : attr.everything
            sortables     : attr.sortables
            ctx           : @viewController.ctx
        root = new TreeNode('root', new System(systemAttr))

        console.log(root)

        # Start the visualization
        @viewController.startCanvas(root.system)

module.exports = Network
