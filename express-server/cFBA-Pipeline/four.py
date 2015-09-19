import json
import os

#Functions======================================================================
def standardDev(l):
    u = sum(l)/len(l)
    sigma = 0
    for num in l:
        sigma += (num-u)**2
    return (sigma/len(l))**0.5    

def zvalues(l):
    ret = []
    sd = standardDev(l)
    u = sum(l)/len(l)
    for num in l:
        ret += [abs((num-u)/sd)]
    return ret

def biomassC(zvalues):
    ret = []
    for z in zvalues:
        ret += [z/sum(zvalues)]
    return ret
        
#===============================================================================

species = []
biomasses = []

#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Solution2"):
    #Opens the JSON
    with open("Output/Solution2/"+filename) as data_file:
        data = json.load(data_file)
    
    speciesName = filename.split(".")[0]
    species += [speciesName]
    biomasses += [data["f"]]

z = zvalues(biomasses)
bc = biomassC(z)
print(bc)

cMetabolites = []
cReactions = []
community = {}
description = ""
reactions = []
metabolites = []
cBiomassObjectiveFunc = {}
OFmetabolites = {}
#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Output/Species"):
    #Opens the JSON
    
    with open("Output/Species/"+filename) as data_file:
        data = json.load(data_file)
    
    speciesName = filename.split(".")[0]
    print(speciesName)
    
    description += data["description"]+"+"
    
    for m in data["metabolites"]:
        if m["id"] not in cMetabolites:
            cMetabolites += [m["id"]]
            metabolites += [m]
    for r in data["reactions"]:
        if r["id"] not in cReactions:
            if r["objective_coefficient"] == 0:
                cReactions += [r["id"]]
                reactions += [r]
            else:
                cBiomassObjectiveFunc[speciesName] = r
                for k in r["metabolites"]:
                    if k not in OFmetabolites:
                        OFmetabolites[k] = [r["metabolites"][k]]
                    else:
                        OFmetabolites[k] += [r["metabolites"][k]]

description =description.strip("+")
community["id"] = "community"
community["description"] = description
community["reactions"] = reactions
community["metabolites"] = metabolites
community["genes"] = {}

OF = {"subsystem": "Exchange",
      "name": "Community biomass objective function",
      "upper_bound": 1000,
      "lower_bound": 0,
      "notes": {},
      "metabolites": {},
      "objective_coefficient": 1,
      "variable_kind": "continuous",
      "id": "R-biomass",
      "gene_reaction_rule": ""}

counter = 0
for k in cBiomassObjectiveFunc:
    ms = cBiomassObjectiveFunc[k]["metabolites"]
    for m in ms:
        OF["metabolites"][m] = bc[counter]*ms[m]
    counter += 1
    
community["reactions"] += [OF]

with open(os.getcwd()+"/Output/Community/community.json", 'w') as outfile:
    json.dump(community, outfile)

    