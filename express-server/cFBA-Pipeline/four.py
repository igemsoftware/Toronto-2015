import json
import os

# Functions======================================================================
def standardDev(l):
    u = sum(l) / len(l)
    sigma = 0
    for num in l:
        sigma += (num - u)**2
    return (sigma / len(l))**0.5

def zvalues(l):
    ret = []
    sd = standardDev(l)
    u = sum(l) / len(l)
    for num in l:
        ret += [abs((num - u) / sd)]
    return ret

def biomassC(zvalues):
    ret = []
    for z in zvalues:
        ret += [z / sum(zvalues)]
    return ret
#=========================================================================

species = []
biomasses = []

# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Solution2"):
    # Opens the JSON
    with open(outputDir + "Solution2/" + filename) as data_file:
        data = json.load(data_file)

    speciesName = filename.split(".")[0]
    species += [speciesName]
    biomasses += [data["f"]]

z = zvalues(biomasses)
bc = biomassC(z)
# print(bc)
dMetabolites = {}
cMetabolites = []
cReactions = []
community = {}
description = ""
reactions = []
metabolites = []
cBiomassObjectiveFunc = {}
OFmetabolites = {}
# Loop through species to add to dictionary
for filename in os.listdir(outputDir + "Species"):
    # Opens the JSON

    with open(outputDir + "Species/" + filename) as data_file:
        data = json.load(data_file)

    speciesName = filename.split(".")[0]
    print(speciesName)

    description += data["description"] + "+"

    for m in data["metabolites"]:
        if m["id"] not in cMetabolites:
            m["species"] = [speciesName]
            cMetabolites += [m["id"]]
            metabolites += [m]
            dMetabolites[m["id"]] = metabolites.index(m)
            # print()
        else:
            if m["compartment"] == "e":
                metabolites[dMetabolites[m["id"]]]["species"] += [speciesName]
                # print(metabolites[dMetabolites[m["id"]]]["species"])
                # print(metabolites[dMetabolites[m["id"]]]["id"])
                #m["species"] += [speciesName]
                # print(speciesName)
                # print(m["id"])
    for r in data["reactions"]:
        if r["id"] not in cReactions:
            if r["objective_coefficient"] == 0:
                cReactions += [r["id"]]
                r["species"] = [speciesName]
                reactions += [r]
            else:
                cBiomassObjectiveFunc[speciesName] = r
                for k in r["metabolites"]:
                    if k not in OFmetabolites:
                        OFmetabolites[k] = [r["metabolites"][k]]
                    else:
                        OFmetabolites[k] += [r["metabolites"][k]]

description = description.strip("+")
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
        if counter < len(bc):
            OF["metabolites"][m] = bc[counter] * ms[m]
            counter += 1
community["reactions"] += [OF]

with open(cmd["output"] + ".json", 'w') as outfile:
    json.dump(community, outfile)
