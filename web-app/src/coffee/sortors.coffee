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

            pushedMetabolites = new Object()
            pushedReactions = new Object()

            # Loop through reaction objects
            for reaction in @data.reactions
                # Loop through keys (metabolite.id's)
                for metabolite of reaction.metabolites
                    # if metabolite is 'adn_p'
                    #     console.log(reaction)

                    compartment = metaboliteDict[metabolite].compartment

                    if compartment isnt 'e'
                        if not @parsedData[compartment]?
                            @parsedData[compartment] = new Object()
                            @parsedData[compartment].metabolites = new Array()
                            @parsedData[compartment].reactions = new Array()

                            pushedMetabolites[compartment] = new Array()
                            pushedReactions[compartment] = new Array()

                        if reaction.id not in pushedReactions[compartment]
                            @parsedData[compartment].reactions.push(reaction)
                            pushedReactions[compartment].push(reaction.id)

                        if metabolite not in pushedMetabolites[compartment]
                            @parsedData[compartment].metabolites.push(metaboliteDict[metabolite])
                            pushedMetabolites[compartment].push(metabolite)

                            # Reactions may contain metabolites from different compartments
                            # Thus, when pushing a metabolite, we need to loop through
                            # the substrates and products of that reaction and push the
                            # metabolite into the parsedData for the current compartment as well.
                            # TODO will something similar need to be done for reactions?

                            for metabolite of reaction.metabolites
                                if metaboliteDict[metabolite].compartment isnt compartment
                                    # console.log(metaboliteDict[metabolite].compartment)
                                    if metabolite not in pushedMetabolites[compartment]
                                        @parsedData[compartment].metabolites.push(metaboliteDict[metabolite])
                                        pushedMetabolites[compartment].push(metabolite)

                            # if metabolite is 'adn_p'
                            #     console.log(@parsedData[c].metabolites)
                            #     console.log('found it!', compartment)

                            # for metabolite of reaction.metabolites
                            #     if metaboliteDict[metabolite].compartment isnt compartment
                            #         # console.log(compartment)
                            #         if reaction.id is 'ADNt2pp'
                            #             console.log('sdsdsdsd')
                            #         # console.log(reaction.id, 'wasssds')
            for metabolite in @parsedData['c'].metabolites
                console.log(metaboliteDict[metabolite.id].compartment)

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
    subsystems:
        parser: ->
            console.log('In the parser')

        compartmentor: ->
            console.log('In the compartmentor')

        sortor: ->
            console.log('In the sortor')
