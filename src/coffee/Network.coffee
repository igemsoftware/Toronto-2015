ViewController = require "./ViewController"
Node           = require "./Node"
Specie         = require "./Specie"
Metabolite     = require "./Metabolite"
Reaction       = require "./Reaction"
Link           = require "./Link"
utilities      = require "./utilities"
System         = require "./System"
Graph          = require "./Graph"

class Network extends Graph
    constructor: (@attr, @data) ->
        super(@attr, @data)

        @systems = new Object()
        @species = new Array()
        @viewController = new ViewController('canvas', @W, @H, @BG, this)
        @attr.ctx = @viewController.ctx
        @activeSpecie = null
        @createNetwork(networkData)
        @initalizeForce()
        @viewController.populateOptions(@nodes)
        @force.on("tick", @viewController.tick.bind(this)).start()
        #temp
        @viewController.setActiveGraph(@systems['Ecoli'])

    addSystem: (name, data) ->
        @systems[name] = new System(@attr, data)
        nodeAttributes =
             x    : utilities.rand(@W)
             y    : utilities.rand(@H)
             r    : @metaboliteRadius + 15
             name : name
             id   : name
             type : "s"
        specie = new Specie(nodeAttributes, @viewController.ctx)
        @nodes.push(specie)
        #reminder to remove when deleted
        @species.push(specie)
    getSystem: (name) ->
        return @systems[name]
    exitSpecie: () ->
        @activeSpecie = null
        @viewController.setActiveGraph(@viewController.network)
    enterSpecie: (node) ->
        @activeSpecie = @getSystem(node.name)
        @viewController.setActiveGraph(@activeSpecie)

    checkSpecie: (specieName, species) ->
        keys = Object.keys(species)
        for key in keys
            if species[key] is specieName
                return true
        return false

    createNetwork: (netdata) ->
        outside   = new Array()
        inside    = new Array()
        species   = new Array()
        reactions = new Array()

        #metabolites built
        for metabolite, i in netdata.metabolites
            if species.indexOf(metabolite.species) < 0
                @addSystem(metabolite.species, data)
                species.push(metabolite.species)
            if metabolite.compartment is "e" and outside.indexOf(metabolite.id) < 0
                @nodes.push(@createMetabolite(metabolite.name, metabolite.id, false, @viewController.ctx))
                outside.push(metabolite.id)
            else if (metabolite.compartment is "c" or metabolite.compartment is "p") and inside.indexOf(metabolite.id) < 0
                inside.push(metabolite.id)

        for reaction, i in netdata.reactions
            keys = Object.keys(reaction.metabolites)
            source = null
            target = null
            for key in keys
                rValue = reaction.metabolites[key]
                if outside.indexOf(key) >= 0
                    r = null
                    if reactions.indexOf(reaction.id) < 0
                        r = @createReaction(reaction.name, reaction.id, @metaboliteRadius, 0, @viewController.ctx)
                        @nodes.push(r)
                        reactions.push(reaction.id)
                    else
                        #metabolite
                        r = @findNode(reaction.id)

                    if rValue > 0
                        source = r
                        target = @findNode(key)
                    else
                        source = @findNode(key)
                        target = r
                    @addLink(source, target, 0, source.id + "-->" + target.id, @viewController.ctx)

        @addLink(@species[0], @findNode("v1"), 0, @findNode("v1").name, @viewController.ctx)
        @addLink(@species[0], @findNode("v2"), 0, @findNode("v2").name, @viewController.ctx)
        @addLink(@findNode("v3"), @species[0] , 0, @findNode("v3").name, @viewController.ctx)
    getSpecieFromMetabolite: (metaboliteid) ->
        for system in @systems
            for node in system.nodes
                if metaboliteid is node.id
                    return system
        return null


    findNode: (sourceid) ->
        for n in @nodes
            if sourceid is n.id
                return n

module.exports = Network
