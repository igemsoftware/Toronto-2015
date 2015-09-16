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
                # Determine compartments involved with this reaction
                compartments = new Array()
                for metabolite of reaction.metabolites
                    if metaboliteDict[metabolite].compartment not in compartments
                        compartments.push(metaboliteDict[metabolite].compartment)

                # Add reaction and metabolites to parsedData for each involved compartment
                for cpt in compartments
                    if cpt isnt 'e'
                        # Create an empty parsedData[cpt] object if required
                        if not @parsedData[cpt]?
                            @parsedData[cpt] = new Object()
                            @parsedData[cpt].metabolites = new Array()
                            @parsedData[cpt].reactions = new Array()

                            pushedMetabolites[cpt] = new Array()
                            pushedReactions[cpt] = new Array()

                        # Add reaction if not already there
                        if reaction.id not in pushedReactions[cpt]
                            @parsedData[cpt].reactions.push(reaction)
                            pushedReactions[cpt].push(reaction.id)

                        # Add metabolites if not already there
                        for metabolite of reaction.metabolites
                            if metabolite not in pushedMetabolites[cpt]
                                @parsedData[cpt].metabolites.push(metaboliteDict[metabolite])
                                pushedMetabolites[cpt].push(metabolite)

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

                if r.substrateCompartments.length is 1 and r.productCompartments.length is 1 and r.substrateCompartments[0] is r.productCompartments[0]
                    continue

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
            # console.log('In the subsystems parser')

        compartmentor: ->
            sorter = 'subsystem'

            for metabolite of @metabolites
                m = @metabolites[metabolite]
                for subsystem in m.subsystems
                    if not @graph.hasVertex(subsystem)
                        @graph.addVertex(subsystem, creators.createCompartment(subsystem, subsystem))

        sortor: ->
            # Reactions have one subsystem.
            # Metabolites may belong to more than one reaction, and therefore
            # may have more than one subsystem.

            # Loop through each Reaction
            # for reaction of @reactions
            #     r = @reactions[reaction]
            #
            #     # Create vertex
            #     @graph.addVertex(r.id, r)
            #
            #     for substrate in r.substrates
            #         for subsystem in substrate.subsystems
            #             if subsystem is r.subsystem
            #                 if not @graph.hasEdge("#{subsystem} -> #{r.id}")
            #                     @graph.addEdge(subsystem, r.id, "#{subsystem} -> #{r.id}")
            #     for product in r.products
            #         for subsystem in product.subsystems
            #             if subsystem is r.subsystem
            #                 if not @graph.hasEdge(r.id, subsystem, "#{r.id} -> #{subsystem}")
            #                     @graph.addEdge(r.id, subsystem, "#{r.id} -> #{subsystem}")


            # What is exchanged between subsystems? Metabolites.

            subsystemsDict = new Object()

            for reaction of @reactions
                r = @reactions[reaction]

                if not subsystemsDict[r.subsystem]?
                    subsystemsDict[r.subsystem] = new Object()

                subsystemsDict[r.subsystem][r.id] = r

            console.log(subsystemsDict)

            for metabolite of @metabolites
                m = @metabolites[metabolite]

                @graph.addVertex(m.id, m)

                for subsystem in m.subsystems
                    if m.subsystems.length > 1
                        # Find which Reaction is involved with this metabolite
                        for reaction of subsystemsDict[subsystem]
                            for metabolite of subsystemsDict[subsystem][reaction].metabolites
                                if metabolite is m.id
                                    console.log('found', r.id)


                        @graph.addEdge(subsystem, m.id, "#{subsystem} -> #{m.id}")
