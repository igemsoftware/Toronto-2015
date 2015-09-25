import os
import json
import sys
cmd = json.loads(sys.argv[1])
outputDir = os.getcwd() + "/cFBA-Pipeline/Output/"

import shutil

def deleteFolderContents(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            #elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception, e:
            print e

deleteFolderContents(outputDir + "Solution1")
deleteFolderContents(outputDir + "Solution2")
deleteFolderContents(outputDir + "Species")




import cobra

model = cobra.io.load_json_model(cmd["output"] + ".json")

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

# with open("Output/Species/cmd.json") as data_file:
#     data = json.load(data_file)
# out = data["output"]

with open(cmd["output"] + "_solution.json", 'w') as outfile:
#with open(os.getcwd()+"/Output/Community/community_solution.json", 'w') as outfile:
    json.dump(solution, outfile)

print("Done!")
