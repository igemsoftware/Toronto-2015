Node = require("./Node")

class Reaction extends Node
    constructor: (attr) ->
        super(attr)

        @substrateCompartments = new Array()
        @productCompartments = new Array()
        @links = new Array()

    addLink: (link) ->
        @links.push(link)

        # console.log(link.source.type)

        if link.source.type is 'r'
            # R -> m
            # console.log(link.target.compartment)
            if @productCompartments.indexOf(link.target.compartment) is -1
                @productCompartments.push(link.target.compartment)
        else if link.target.type is 'r'
            # m -> R
            if @substrateCompartments.indexOf(link.source.compartment) is -1
                @substrateCompartments.push(link.source.compartment)



module.exports = Reaction
