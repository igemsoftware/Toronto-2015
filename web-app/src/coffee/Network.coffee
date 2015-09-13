ViewController = require "./ViewController"
TreeNode = require "./TreeNode"
Subsystem = require "./Subsystem"

#Main model (For our MVC)
class Network
    constructor: (attr, data) ->
        #TODO Remove last parameter
        @viewController = new ViewController("canvas", attr.width, attr.height, attr.backgroundColour, null)

        subsystemAttr = {
            data: data #object (JSON-like)
            width: attr.width
            height: attr.height
            ctx: @viewController.ctx
            hideObjective: attr.hideObjective
            everything: attr.everything
        }

        root = new TreeNode("root", new Subsystem(subsystemAttr))
        @viewController.startCanvas(root.subsystem)

module.exports = Network
