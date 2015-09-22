import json
import os
import cobra

# Functions======================================================================
def standardDev(l):
    u = sum(l) / len(l)
    sigma = 0
    for num in l:
        sigma += (num - u)**2
        # print(num)
    return (sigma / len(l))**0.5
    # print(u)
    # return ret.lower()
#=========================================================================


# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Species"):
    speciesName = filename.split(".")[0]

    # Load JSON model
    model = cobra.io.load_json_model(outputDir + "Species/" + filename)

    # Optimize for biomass
    model.optimize()

    # Create a dictionary out of Solution object
    solution = {}
    solution['f'] = model.solution.f
    solution['status'] = model.solution.status
    solution['x_dict'] = model.solution.x_dict
    solution['x'] = model.solution.x
    solution['y_dict'] = model.solution.y_dict
    solution['y'] = model.solution.y

    with open(outputDir + "Solution1/" + speciesName + '_solution.json', 'w') as outfile:
        json.dump(solution, outfile)


reactionFluxes = {}
# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Solution1/"):
    # Opens the JSON

    with open(outputDir + "Solution1/" + filename) as data_file:
        data = json.load(data_file)

    speciesName = filename.split("_")[0]

    for k in data["x_dict"]:

        flux = data["x_dict"][k]
        if k not in reactionFluxes.keys():
            reactionFluxes[k] = []
        if flux not in reactionFluxes[k]:
            reactionFluxes[k] += [flux]

avgReactionFluxes = {}
for k in reactionFluxes:
    if len(reactionFluxes[k]) > 1:
        sd = standardDev(reactionFluxes[k])
        avg = sum(reactionFluxes[k]) / len(reactionFluxes[k])
        upper = avg + sd
        lower = avg - sd

        avgReactionFluxes[k] = [upper, lower]


# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Species"):
    # Opens the JSON

    with open(outputDir + "Species/" + filename) as data_file:
        data = json.load(data_file)

    speciesName = filename.split(".")[0]

    for r in data["reactions"]:
        if(r["id"] in avgReactionFluxes.keys()):
            upper = avgReactionFluxes[r["id"]][0]
            lower = avgReactionFluxes[r["id"]][1]
            r["upper_bound"] = upper
            r["lower_bound"] = lower

    with open(outputDir + "Species/" + filename, 'w') as outfile:
        print(speciesName)
        json.dump(data, outfile)
