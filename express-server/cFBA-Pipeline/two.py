import json
import os
import cobra

#Functions======================================================================
def standardDev(l):
    u = sum(l)/len(l)
    sigma = 0
    for num in l:
        sigma += (num-u)**2
        #print(num)
    return (sigma/len(l))**0.5    
    #print(u)
    #return ret.lower()

#===============================================================================


#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Species"):
    speciesName = filename.split(".")[0]
    
    # Load JSON model
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
    solution['y'] = model.solution.x
    
    with open(os.getcwd()+"/Output/Solution1/"+speciesName + '_solution.json', 'w') as outfile:
        json.dump(solution, outfile)
    


reactionFluxes = {}
#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Solution1/"):
    #Opens the JSON
    
    with open(os.getcwd()+"/Output/Solution1/"+filename) as data_file:
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
        avg = sum(reactionFluxes[k])/len(reactionFluxes[k])
        upper = avg + sd
        lower = avg - sd
        
        avgReactionFluxes[k] = [upper, lower]
        

#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Species"):
    #Opens the JSON
    
    with open("Output/Species/"+filename) as data_file:
        data = json.load(data_file)
    
    speciesName = filename.split(".")[0]
    print(speciesName)
    for r in data["reactions"]:
        if(r["id"] in avgReactionFluxes.keys()):
            upper = avgReactionFluxes[r["id"]][0]
            lower = avgReactionFluxes[r["id"]][1]
            r["upper_bound"] = upper
            r["lower_bound"] = lower
            
    
    with open("Output/Species/"+filename, 'w') as outfile:
        json.dump(data, outfile)    
        
        