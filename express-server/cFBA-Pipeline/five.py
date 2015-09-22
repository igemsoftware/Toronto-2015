import json
import os
import cobra




model = cobra.io.load_json_model(os.getcwd()+"/Output/Community/community.json")

# Optimize for biomass
model.optimize()

# Create a dictionary out of Solution object
solution  = {}
solution['f'] = model.solution.f
solution['status'] = model.solution.status
solution['x_dict'] = model.solution.x_dict
solution['x'] = model.solution.x
solution['y_dict'] = model.solution.y_dict
solution['y'] = model.solution.y


with open("Output/Species/cmd.json") as data_file:
    data = json.load(data_file)
out = data["output"]

with open(out, 'w') as outfile:
#with open(os.getcwd()+"/Output/Community/community_solution.json", 'w') as outfile:
    json.dump(solution, outfile)

print("Done!")