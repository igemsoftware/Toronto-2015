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

        compartmentor: (system)->
            # mappings =
            #     iJO1366: 'E. coli'
            #system.data = data

            species = []
            for metabolite in system.data.metabolites
                for specie in metabolite.species
                    if specie not in species
                        species.push(specie)

            for specie in species
                system.graph.addVertex(specie, creators.createCompartment(specie, specie))

        sortor: (system)->
            # Loop through every Reaction
            for reaction of system.reactions
                r = system.reactions[reaction]

                for specie in r.species
                    # Case 1: loop through substrates, then products. Can produce
                    # a. `e ->`
                    # b. `e -> e`
                    # c. `e -> specie`
                    for substrate in r.substrates
                        if substrate.compartment is 'e'
                            # Construct `e ->`
                            if not system.graph.hasVertex(r.id)
                                system.graph.addVertex(r.id, r)
                            if not system.graph.hasVertex(substrate.id)
                                system.graph.addVertex(substrate.id, substrate)
                            if not system.graph.hasEdge(substrate.id, r.id)
                                system.graph.addEdge(substrate.id, r.id, "#{substrate.id} -> #{r.id}")

                            # Loop through the products for this particular reaction
                            # Are they extracellular, or within the cell?
                            for product in r.products
                                if product.compartment is 'e'
                                    # Construct `-> e` (To complete `e -> e`)
                                    if not system.graph.hasVertex(product.id)
                                        system.graph.addVertex(product.id, product)
                                    if not system.graph.hasEdge(r.id, product.id)
                                        system.graph.addEdge(r.id, product.id, "#{r.id} -> #{product.id}")
                                else
                                    # Construct `-> specie` (To complete `e -> specie`)
                                    if not system.graph.hasEdge(r.id, specie)
                                        system.graph.addEdge(r.id, specie, "#{r.id} -> #{specie}")

                    # Case 2: loop through products, then substrates. Can produce
                    # a. `-> e`
                    # b. `e -> e`
                    # c. `specie -> e`
                    for product in r.products
                        if product.compartment is 'e'
                            # Construct `-> e`
                            if not system.graph.hasVertex(r.id)
                                system.graph.addVertex(r.id, r)
                            if not system.graph.hasVertex(product.id)
                                system.graph.addVertex(product.id, product)
                            if not system.graph.hasEdge(r.id, product.id)
                                system.graph.addEdge(r.id, product.id, "#{r.id} -> #{product.id}")

                            for substrate in r.substrates
                                if substrate.compartment is 'e'
                                    # Construct `e ->` (To complete `e -> e`)
                                    if not system.graph.hasVertex(substrate.id)
                                        system.graph.addVertex(substrate.id, substrate)
                                    if not system.graph.hasEdge(substrate.id, r.id)
                                        system.graph.addEdge(substrate.id, r.id, "#{substrate.id} -> #{product.id}")
                                else
                                    # Construct `specie ->` (To complete `specie -> e`)
                                    if not system.graph.hasEdge(specie, r.id)
                                        system.graph.addEdge(specie, r.id, "#{specie} -> #{r.id}")

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

        compartmentor: (system)->
            sorter = 'compartment'

            mappings =
                c: 'cytosol'
                p: 'periplasm'
                e: 'extracellular'

            for metabolite of system.metabolites
                m = system.metabolites[metabolite]
                if not system.graph.hasVertex(m[sorter])
                    system.graph.addVertex(m[sorter], creators.createCompartment(m[sorter], mappings[m[sorter]]))

        sortor: (system)->
            for reaction of system.reactions
                r = system.reactions[reaction]

                if r.substrateCompartments.length is 1 and r.productCompartments.length is 1 and r.substrateCompartments[0] is r.productCompartments[0]
                    continue

                if not system.graph.hasVertex(r.id)
                    system.graph.addVertex(r.id, r)

                for cpt in r.substrateCompartments
                    system.graph.addEdge(cpt, r.id, "#{cpt} -> #{r.id}")

                for cpt in r.productCompartments
                    system.graph.addEdge(r.id, cpt, "{r.id} -> #{cpt}")

    subsystems:
        parser: ->
            # console.log('In the subsystems parser')

        compartmentor:(system) ->
            sorter = 'subsystem'

            for metabolite of system.metabolites
                m = system.metabolites[metabolite]
                for subsystem in m.subsystems
                    if not system.graph.hasVertex(subsystem)
                        system.graph.addVertex(subsystem, creators.createCompartment(subsystem, subsystem))

        sortor: (system) ->
            # Reactions have one subsystem.
            # Metabolites may belong to more than one reaction, and therefore
            # may have more than one subsystem.

            # Loop through each Reaction
            for reaction of system.reactions
                r = system.reactions[reaction]

                # What is exchanged between subsystems? Metabolites.
                # Consider reactions which have substrates or products which
                # belong to more than one subsystem. These are the reactions
                # using/producing metabolites which are shared between subsystems.
                for substrate in r.substrates
                    if substrate.subsystems.length > 1
                        # Safe to append Reaction now
                        if not system.graph.hasVertex(r.id)
                            system.graph.addVertex(r.id, r)

                        # Append Metabolite as well
                        if not system.graph.hasVertex(substrate.id)
                            system.graph.addVertex(substrate.id, substrate)

                        # Create the edges for M -> R -> SS
                        system.graph.addEdge(substrate.id, r.id, "#{substrate.id} -> #{r.id}")
                        system.graph.addEdge(r.id, r.subsystem, "#{r.id} -> #{r.subsystem}")

                for product in r.products
                    if product.subsystems.length > 1
                        # Safe to append Reaction now
                        if not system.graph.hasVertex(r.id)
                            system.graph.addVertex(r.id, r)

                        # Append Metabolite as well
                        if not system.graph.hasVertex(product.id)
                            system.graph.addVertex(product.id, product)

                        # Create the edges for SS -> R -> M
                        system.graph.addEdge(r.subsystem, r.id, "#{r.subsystem} -> #{r.id}")
                        system.graph.addEdge(r.id, product.id, "#{r.id} -> #{product.id}")
