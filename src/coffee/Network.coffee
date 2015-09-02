ViewController  = require "./ViewController"
Node       = require "./Node"
Specie = require "./Specie"
Metabolite = require "./Metabolite"
Reaction   = require "./Reaction"
Link       = require "./Link"
utilities = require "./utilities"
System = require "./System"
Graph = require "./Graph"


class Network extends Graph
    constructor: (@attr, @data) ->
        super(@attr, @data)

        @systems = new Object()
        @species = new Array()
        @viewController = new ViewController('canvas', @W, @H, @BG, this)
        @attr.ctx = @viewController.ctx
        @activeSpecie = null
        @createNetwork2(networkData)
        @initalizeForce()
        @viewController.populateOptions(@nodes)
        @force.on("tick", @viewController.tick.bind(this)).start()

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



    createNetwork2: (netdata) ->
        outside = []
        inside = []
        species = []
        reactions = []
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
    createNetwork: () ->
        ns = []
        compartments = new Object()
        species = new Object()

        for metabolite, i in @data.metabolites
            m = @data.metabolites[i]
            species[m.id] = m.species
            if ns.indexOf(m.species) < 0
                #the ecolie 'data' is hardcoded right now, we expect to retrieve it from the back end
                #given the name of the specie, and the we pass the data to be parsed
                 @addSystem(m.species, data)
                 ns.push(m.species)
            compartments[m.id] = m.compartment

            if m.compartment is "e" and ns.indexOf(m.id) < 0
                @nodes.push(@createMetabolite(m.name, m.id, false, @viewController.ctx))
                ns.push(m.id)
                species[m.id] = m.species
        templinks = []
        rct = []
        for reaction, i in @data.reactions
            m = Object.keys(reaction.metabolites)
            for key in m
                if compartments[key] is "e" and rct.indexOf(reaction.id) < 0
                    @nodes.push(@createReaction(reaction.name, reaction.id, @metaboliteRadius, 0, @viewController.ctx))
                    rct.push(reaction.id)
                    if reaction.metabolites[key] > 0
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is reaction.id
                                source = n
                            else if n.id is key
                                target = n
                        @addLink(source, target, 0, name, @viewController.ctx)

                    else
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is key
                                source = n
                            else if n.id is reaction.id
                                target = n
                        @addLink(source, target, 0, name, @viewController.ctx)
                else
                    if reaction.metabolites[key] > 0
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is reaction.id
                                source = n
                            else if n.id is key
                                target = n
                        if source? and target?
                            @addLink(source, target, 0, name, @viewController.ctx)
                    else
                        source = null
                        target = null
                        for n in @nodes
                            if n.id is key
                                source = n
                            else if n.id is reaction.id
                                target = n
                        if source? and target?
                            @addLink(source, target, 0, name, @viewController.ctx)

            tempLinks = []
            outside = []
            inside = []
            addLinks = []
            for reaction in data.reactions
                m = Object.keys(reaction.metabolites)

                add = false
                for key in m
                    if compartments[key] is "c"

                        if reaction.metabolites[key] < 0
                            s = species[key]
                            t = reaction.id
                            addLinks.push({
                                    id: s + "-->" + t
                                    source: s
                                    target: t
                            })
                        else
                            s = reaction.id
                            t = species[key]
                            addLinks.push({
                                    id: s + "-->" + t
                                    source: s
                                    target: t
                            })
            for link in addLinks
                for node in @nodes
                    if node.id is link.source
                        s = node
                    else if node.id is link.target
                        t = node

                @addLink(s, t, 0, s.id + "-->" + t.id, @viewController.view)


module.exports = Network
    #tempfunction
    # linkToSpecies: (compartments) ->
    #     console.log @data.metabolites
    #     for metabolite, i in @data.reactions.metabolites
    #         if metabolite.compartment is not "e"
    #             for j in [i...@data.reactions.metabolites.length]
    #                 if @data.reactions.metabolites[j].compartment is "c"
    #                     console.log compartments[@data.reactions.metabolites[j].id]
