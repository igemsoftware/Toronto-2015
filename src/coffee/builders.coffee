Graph = require './Graph'


module.exports =
    species:
        sortor: ->
            #itll work
        compartmentor: ->
            sorter = 'species'

            mappings =
                iJO1366: 'E. coli'

            for metabolite of @metabolites
                m = @metabolites[metabolite]

                for specie in m[sorter]
                    if not @graph.outNeighbours[specie]?
                        @graph.outNeighbours[specie] = new Graph(specie, mappings[specie])


    compartments:
        compartmentor: ->
            sorter = 'compartment'

            mappings =
                c: 'cytosol'
                p: 'periplasm'
                e: 'extracellular'

            for metabolite of @metabolites
                m = @metabolites[metabolite]
                # If current Metabolite's compartment is not a child of `graph`, add it
                if not @graph.outNeighbours[m[sorter]]?
                    # Create a new child with no outNeighbours or parents
                    @graph.outNeighbours[m[sorter]] = new Graph(@metabolites[metabolite][sorter], mappings[m[sorter]])

        sortor: ->
            for reaction of @reactions
                r = @reactions[reaction]

                for cpt in r.substrateCompartments
                    leaf = null
                    for _cpt in r.substrateCompartments
                        potentialLeaf = @graph.outNeighbours[_cpt].outNeighbours[r.id]
                        if potentialLeaf?
                            leaf = potentialLeaf

                    if not leaf?
                        leaf = new Graph(r.id)

                        leaf.value = r
                    leaf.inNeighbours[cpt] = @graph.outNeighbours[cpt]
                    @graph.outNeighbours[cpt].outNeighbours[r.id] = leaf

                for cpt in r.productCompartments
                    leaf = null
                    for _cpt in r.substrateCompartments
                        potentialLeaf = @graph.outNeighbours[_cpt].outNeighbours[r.id]
                        if potentialLeaf?
                            leaf = potentialLeaf

                    if not leaf?
                        leaf = new Graph(r.id)
                        leaf.value = r

                    leaf.outNeighbours[cpt] = @graph.outNeighbours[cpt]
                    @graph.outNeighbours[cpt].inNeighbours[leaf.id] = leaf

                if r.outNeighbours.length is 0 #outNeighbour is e to be augmented later
                    leaf.outNeighbours["e"] = @graph.outNeighbours["e"]
                    @graph.outNeighbours["e"].inNeighbours[leaf.id] = leaf
