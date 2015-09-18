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
        @deleted = {
            reactions: new Array()
            metabolites: new Array()

        }

        @added = {
            reactions: new Object()
            metabolites: new Object()
            species: new Object()
        }

    enterSpecie: (node) ->
        #find node
        @currentLevel = @currentLevel.children[node.id]

        @viewController.setActiveGraph(@currentLevel.system)
        #@viewController.setActiveGraph(@currentLevel.system)
    exitSpecie: (node) ->
        @currentLevel = @currentLevel.parent
        @viewController.setActiveGraph(@currentLevel.system)

    deleteNode: (id, system) ->
        #Making sure to destroy vertex IFF r or m type
        for node in system.nodes
            if node.id is id
                if node.type is "r"
                    system.graph.destroyVertex(id)
                    @deleted.reactions.push(id)
                    node.deleted = true
                else if node.type is "m"
                    system.graph.destroyVertex(id)
                    @deleted.metabolites.push(id)
                    node.deleted = true
        console.log(@deleted)




module.exports = Network
