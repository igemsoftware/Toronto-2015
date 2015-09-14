ViewController = require './ViewController'
TreeNode       = require './TreeNode'
Subsystem      = require './Subsystem'

# Main model for our MVC
class Network
    constructor: (attr) ->
        # TODO Remove last parameter
        @viewController = new ViewController('canvas', attr.width, attr.height, attr.backgroundColour, null)

        subsystemAttr =
            data          : attr.data
            width         : attr.width
            height        : attr.height
            hideObjective : attr.hideObjective
            everything    : attr.everything
            ctx           : @viewController.ctx
        # Create our root TreeNode
        # Will recursively create children
        root = new TreeNode('root', new Subsystem(subsystemAttr))

        # Start the visualization
        @viewController.startCanvas(root.subsystem)

module.exports = Network
