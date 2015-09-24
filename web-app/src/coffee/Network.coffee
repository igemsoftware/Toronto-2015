ViewController = require './ViewController'
TreeNode = require './TreeNode'
System = require './System'

# The M for our MVC
class Network
    constructor: (@attr) ->
        # The VC for our MVC
        @viewController = new ViewController(@attr.wrapperId, 'canvas', @attr.width, @attr.height, @attr.backgroundColour, this, @attr.showStats)
        @initalized = false
        @changeSpecie(@attr.data)
        @initalized = true
        @reactionLength = @attr.data.reactions.length
        @metaboliteLength = @attr.data.metabolites.length
        
        # Create our root TreeNode
        # Will recursively create children

    changeSpecie: (model) ->
        @attr.sortables.index = -1
        systemAttr =
            data : model
            width : @attr.width
            height : @attr.height
            hideObjective : @attr.hideObjective
            everything : @attr.everything
            sortables : @attr.sortables
            ctx : @viewController.ctx
        @root = new TreeNode('root', new System(systemAttr))
        @root.system.initializeForce()
        console.log(@root)

        # Start the visualization
        if @initalized
            @viewController.setActiveGraph(@root.system)
        else
            @viewController.startCanvas(@root.system)

        @currentLevel = @root
        @species = new Object()
        for specie of @root.system.parsedData
            if specie isnt "Community"
                @species[specie] = {
                    addedReactions : new Array()
                    addedMetabolites: new Array()
                    deletedReactions: new Array()
                }

    enterSpecie: (node) ->
        #find node
        @currentLevel = @currentLevel.children[node.id]

        @viewController.setActiveGraph(@currentLevel.system)
        #@viewController.setActiveGraph(@currentLevel.system)
    exitSpecie: (node) ->
        @currentLevel = @currentLevel.parent
        @viewController.setActiveGraph(@currentLevel.system)

    addReaction: (reactionObject) ->
        @species[reactionObject.species[0]].addedReactions.push(reactionObject)
        @viewController.activeGraph.addReaction(reactionObject)
        @reactionsLength++


    deleteNode: (id, system) ->
        #Making sure to destroy vertex IFF r or m type
        for node in system.nodes
            if node.id is id
                for specie in node.species
                    @species[specie].deletedReactions.push(node)
                    system.graph.destroyVertex(node.id)
                    node.deleted = true




module.exports = Network
