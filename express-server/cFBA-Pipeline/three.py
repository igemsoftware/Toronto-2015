import json
import os
import cobra


#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Species"):
    speciesName = filename.split(".")[0]
    model = cobra.io.load_json_model(os.getcwd()+"/Output/Species/"+filename)
    
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
    
    with open(os.getcwd()+"/Output/Solution2/"+speciesName + '_solution.json', 'w') as outfile:
        json.dump(solution, outfile)