import os
import json

#Functions======================================================================
def simplifyName(name):
    ret = name.replace(" ", "")
    ret = ret.replace("[", "")
    ret = ret.replace("]", "")
    ret = ret.replace("-", "")
    #ret = ret.replace("+", "")
    ret = ret.replace("'", "")
    ret = ret.replace("(", "")
    ret = ret.replace(")", "")
    ret = ret.replace(",", "")
    ret = ret.replace(":", "")
    return ret.lower()

def existingNames(f):
    ret = []
    c = f.split("\n")
    counter = len(c)+1
    for i in c:
        line = i.split("\t")
        ret += [simplifyName(line[1])]
    return ret


def combine(l1, l2):
    return list(set(l1).intersection(l2))

def createDict(content):
    ret = {}
    c = content.split("\n")
    for i in c:
        line = i.split("\t")
        if len(line) == 1:
                    return ret        
        ret[simplifyName(line[1])] = line[0]
    return ret

def containsE(ms, l):
    for i in ms:
        if(i["compartment"] == "e" and i["id"] in l):
            return True
    return False

def removeDuplicates(ms):
    check = []
    ret = []
    for m in ms:
        if m["id"] not in check:
            check += [m["id"]]
            
            ret += [m]
    return ret
#===============================================================================


#Get exisitng content of metaboliteDictionary
file = open("Output/metaboliteDictionary.txt")
metaContent = file.read();
file.close()

#Get exisitng content of reactionDictionary
file = open("Output/reactionDictionary.txt")
reactContent = file.read();
file.close()

mDict = createDict(metaContent) #dictionary of simplified metabolite names to their respective ids
rDict = createDict(reactContent) #dictionary of simplified reaction names to their respective ids

#print(rDict)
speciesM = {} #keeps track of every single metabolite in their respective species
speciesR = {} #keeps track of every single reaction in their respective species#
ecMeta = {} #keyed by species name and valued by a list of extracellular metabolites across the community
metaInReacts = {} #keyed by metabolites valued by reactions they belong to across the community

metabolites = {} #collection of all metabolites across the community
reactions = {} #collection of all reactions across the community
community = {} #keyed by species and valued by the species' JSON data


#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Input/Species"):
    #Opens the JSON
    with open("Input/Species/"+filename) as data_file:
        data = json.load(data_file)
    speciesName = filename.split(".")[0]
    print(speciesName)
    speciesM[speciesName] = []
    oldMnew = {} #dictionary of old metabolite ids to new metabolite ids
    eMetabolites = [] #a list of all external metabolites
    #Fix metabolites
    for i in range(len(data["metabolites"])):
        m = data["metabolites"][i]
        m["compartment"] = m["compartment"][0].lower()
        if(m["compartment"] == "e"):
            newID = mDict[simplifyName(m["name"])]+"-"+m["compartment"]
            oldMnew[m["id"]] = newID
            m["id"] = newID
            eMetabolites += [newID]
            
        else:
            newID = speciesName+"-"+mDict[simplifyName(m["name"])]+"-"+m["compartment"]
            oldMnew[m["id"]] = newID
            m["id"] = newID
        metabolites[m["id"]] = data["metabolites"][i]
        metaInReacts[m["id"]] = []
        speciesM[speciesName] += [m["id"]]

    speciesR[speciesName] = []
    for i in range(len(data["reactions"])):
        r = data["reactions"][i]
        r["id"] = speciesName+"-"+rDict[simplifyName(r["name"])]
        ms = list(r["metabolites"].keys())
        for k in ms:
            r["metabolites"][oldMnew[k]] = r["metabolites"][k]
            del r["metabolites"][k]
            if(r["id"] not in metaInReacts[oldMnew[k]]):
                metaInReacts[oldMnew[k]] += [r["id"]]
        reactions[r["id"]] = data["reactions"][i]
        speciesR[speciesName] += [r["id"]]
    
    community[speciesName] = data
    ecMeta[speciesName] = eMetabolites

species = list(community.keys())

for s in species:
    i = 0
    for meta in ecMeta[s]:
        for r in metaInReacts[meta]:
            
            if(r not in speciesR[s]):
                speciesR[s] += [r]
                
                check = list(reactions[r]["metabolites"].keys())
                
                for ch in range(len(check)):
                    check[ch] = metabolites[check[ch]]
                if(containsE(check, ecMeta[s]) and (reactions[r]["objective_coefficient"] == 0)):
                    community[s]["reactions"] += [reactions[r]]
                    
                    ks = list(reactions[r]["metabolites"].keys())
                    for j in ks:
                        if(j not in speciesM[s]):
                            speciesM[s] += [j]
                            community[s]["metabolites"] += [metabolites[j]]
                            ecMeta[s] += [j]

        i += 1

    community[s]["metabolites"] = removeDuplicates(community[s]["metabolites"])
    community[s]["reactions"] = removeDuplicates(community[s]["reactions"])
    with open('Output/Species/'+s+".json", 'w') as outfile:
        json.dump(community[s], outfile)
