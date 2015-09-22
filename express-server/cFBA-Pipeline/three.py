import os
import json
import sys
cmd = json.loads(sys.argv[1])
outputDir = os.getcwd() + "/cFBA-Pipeline/Output/"
import cobra

# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Species"):
    speciesName = filename.split(".")[0]
    model = cobra.io.load_json_model(outputDir + "Species/" + filename)

    # Optimize for biomass
    model.optimize()

    # Create a dictionary out of Solution object
    solution = {}
    solution['f'] = model.solution.f
    solution['status'] = model.solution.status
    solution['x_dict'] = model.solution.x_dict
    # Don't really need these.
    # solution['x'] = model.solution.x
    # solution['y_dict'] = model.solution.y_dict
    # solution['y'] = model.solution.y

    with open(outputDir + "/Solution2/" + speciesName + '_solution.json', 'w') as outfile:
        json.dump(solution, outfile)
