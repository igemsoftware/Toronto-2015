ViewController = require './ViewController'
TreeNode       = require './TreeNode'
Subsystem      = require './Subsystem'

# The M for our MVC
class Network
    constructor: (attr) ->
        # The VC for our MVC
        @viewController = new ViewController('canvas', attr.width, attr.height, attr.backgroundColour)

        # Create our root TreeNode
        # Will recursively create children
        subsystemAttr =
            data          : attr.data
            width         : attr.width
            height        : attr.height
            hideObjective : attr.hideObjective
            everything    : attr.everything
            sortables     : attr.sortables
            type          : attr.type
            ctx           : @viewController.ctx
        root = new TreeNode('root', new Subsystem(subsystemAttr))

        console.log(root)

        # Start the visualization
        @viewController.startCanvas(root.subsystem)

module.exports = Network
