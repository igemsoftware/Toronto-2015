Graph    = require './Graph'
creators = require './creators'

module.exports =
    species:
        parser: ->
            metaboliteDict = new Object()
            for metabolite in @data.metabolites
                metaboliteDict[metabolite.id] = metabolite

            pushedMetabolites = new Array()

            # Loop through BARE data
            for reaction in @data.reactions
                for specie in reaction.species
                    if not @parsedData[specie]?
                        @parsedData[specie] = new Object()
                        @parsedData[specie].metabolites = new Array()
                        @parsedData[specie].reactions = new Array()

                    @parsedData[specie].reactions.push(reaction)

                    for metabolite of reaction.metabolites
                        if metabolite not in pushedMetabolites
                            pushedMetabolites.push(metabolite)
                            @parsedData[specie].metabolites.push(metaboliteDict[metabolite])

        compartmentor: ->
            mappings =
                iJO1366: 'E. coli'

            species = new Array()

            for metabolite in @data.metabolites
                for specie in metabolite.species
                    if specie not in species
                        species.push(specie)

            for specie in species
                @graph.addVertex(specie, creators.createCompartment(specie, mappings[specie]))

        sortor: ->
            # Loop through every Reaction
            for reaction of @reactions
                r = @reactions[reaction]

                for specie in r.species
                    # Case 1: loop through substrates, then products. Can produce
                    # a. `e ->`
                    # b. `e -> e`
                    # c. `e -> specie`
                    for substrate in r.substrates
                        if substrate.compartment is 'e'
                            # Construct `e ->`
                            if not @graph.hasVertex(r.id)
                                @graph.addVertex(r.id, r)
                            if not @graph.hasVertex(substrate.id)
                                @graph.addVertex(substrate.id, substrate)
                            @graph.addEdge(substrate.id, r.id, "#{substrate.id} -> #{r.id}")

                            # Loop through the products for this particular reaction
                            # Are they extracellular, or within the cell?
                            for product in r.products
                                if product.compartment is 'e'
                                    # Construct `-> e` (To complete `e -> e`)
                                    if not @graph.hasVertex(product.id)
                                        @graph.addVertex(product.id, product)
                                    @graph.addEdge(r.id, product.id, "#{r.id} -> #{product.id}")
                                else
                                    # Construct `-> specie` (To complete `e -> specie`)
                                    @graph.addEdge(r.id, specie, "#{r.id} -> #{specie}")

                    # Case 2: loop through products, then substrates. Can produce
                    # a. `-> e`
                    # b. `e -> e`
                    # c. `specie -> e`
                    for product in r.products
                        if product.compartment is 'e'
                            # Construct `-> e`
                            if not @graph.hasVertex(r.id)
                                @graph.addVertex(r.id, r)
                            if not @graph.hasVertex(product.id)
                                @graph.addVertex(product.id, product)
                            @graph.addEdge(r.id, product.id, "#{r.id} -> #{product.id}")

                            for substrate in r.substrates
                                if substrate.compartment is 'e'
                                    # Construct `e ->` (To complete `e -> e`)
                                    if not @graph.hasVertex(substrate.id)
                                        @graph.addVertex(substrate.id, substrate)
                                    @graph.addEdge(substrate.id, r.id, "#{substrate.id} -> #{product.id}")
                                else
                                    # Construct `specie ->` (To complete `specie -> e`)
                                    @graph.addEdge(specie, r.id, "#{specie} -> #{r.id}")
    compartments:
        parser: ->
            # Give back data for `c` and `p`
            metaboliteDict = new Object()
            for metabolite in @data.metabolites
                metaboliteDict[metabolite.id] = metabolite

            pushedMetabolites = new Array()
            pushedReactions = new Array()

            # Loop through reaction objects
            for reaction in @data.reactions
                # Loop through keys (metabolite.id's)
                for metabolite of reaction.metabolites
                    compartment = metaboliteDict[metabolite].compartment

                    if compartment isnt 'e'
                        if not @parsedData[compartment]?
                            @parsedData[compartment] = new Object()
                            @parsedData[compartment].metabolites = new Array()
                            @parsedData[compartment].reactions = new Array()

                        if reaction.id not in pushedReactions
                            @parsedData[compartment].reactions.push(reaction)
                            pushedReactions.push(reaction.id)

                        if metabolite not in pushedMetabolites
                            @parsedData[compartment].metabolites.push(metaboliteDict[metabolite])
                            pushedMetabolites.push(metabolite)

        compartmentor: ->
            sorter = 'compartment'

            mappings =
                c: 'cytosol'
                p: 'periplasm'
                e: 'extracellular'

            for metabolite of @metabolites
                m = @metabolites[metabolite]
                if not @graph.hasVertex(m[sorter])
                    @graph.addVertex(m[sorter], creators.createCompartment(m[sorter], mappings[m[sorter]]))

        sortor: ->
            for reaction of @reactions
                r = @reactions[reaction]

                if not @graph.hasVertex(r.id)
                    @graph.addVertex(r.id, r)

                for cpt in r.substrateCompartments
                    @graph.addEdge(cpt, r.id, "#{cpt} -> #{r.id}")

                for cpt in r.productCompartments
                    @graph.addEdge(r.id, cpt, "{r.id} -> #{cpt}")

                # Sinks fix no longer needed
                # if r.outNeighbours.length is 0 #outNeighbour is e to be augmented later
                #     leaf.outNeighbours["e"] = @graph.outNeighbours["e"]
                #     @graph.outNeighbours["e"].inNeighbours[leaf.id] = leaf
