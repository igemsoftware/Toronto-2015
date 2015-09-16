Network  = require "./Network"

# TODO Append subsystems into metabolites on the backend
metaboliteDict = new Object()

# Creates metaboliteDict with empty array for subsystems
for metabolite in data.metabolites
    metabolite.subsystems = new Array()
    metaboliteDict[metabolite.id] = metabolite

for reaction in data.reactions
    if reaction.subsystem is ''
        reaction.subsystem = 'Unassigned'

    for metabolite of reaction.metabolites
        if metaboliteDict[metabolite].subsystems.indexOf(reaction.subsystem) is -1
            metaboliteDict[metabolite].subsystems.push(reaction.subsystem)

data.metabolites = new Array()
for metabolite of metaboliteDict
    data.metabolites.push(metaboliteDict[metabolite])


# Passed in all the way through to system
sortables =
    index       : -1
    identifiers : ['species', 'compartments', 'subsystems']

networkAttributes =
    id               : 'root'
    name             : 'root'
    width            : window.innerWidth
    height           : window.innerHeight
    backgroundColour : 'white'
    metaboliteRadius : 10
    useStatic        : false
    everything       : false
    hideObjective    : true
    data             : data
    sortables        : sortables

window.HyperFluxVisualization = Network
# network = new Network(networkAttributes)




# model = JSON.parse(JSON.stringify(data))
# # subsystems = new Object()
# metaboliteDict = new Object()
#
# # Creates metaboliteDict with empty array for subsystems
# for metabolite in model.metabolites
# 	metabolite.subsystems = new Array()
# 	metaboliteDict[metabolite.id] = metabolite
#
# for reaction in model.reactions
# 	if reaction.subsystem is ''
# 		reaction.subsystem = 'Unassigned'
#
#
# 	# if not subsystems[reaction.subsystem]?
# 	# 	subsystems[reaction.subsystem] = [reaction]
# 	# else
# 	# 	subsystems[reaction.subsystem].push(reaction)
#
# 	for metabolite of reaction.metabolites
# 		if metaboliteDict[metabolite].subsystems.indexOf(reaction.subsystem) is -1
# 			metaboliteDict[metabolite].subsystems.push(reaction.subsystem)
#
# # console.log(subsystems)
# console.log(metaboliteDict)


# for i in [0..Object.keys(subsystems).length]
# 	counter = 0
# 	for metabolite of metaboliteDict
# 		if metaboliteDict[metabolite].subsystems.length > i
# 			counter++
# 	console.log(i, counter)
# counter = 0
# for metabolite of metaboliteDict
# 	if metaboliteDict[metabolite].subsystems.length > 14
# 		counter++
# 		console.log(metaboliteDict[metabolite])
# console.log(counter)

# for reaction in model.reactions
# 	for metabolite of reaction.metabolites
# 		if metabolite is 'acac_p'
# 			console.log(reaction)
