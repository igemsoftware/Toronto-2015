import os
import json
import sys
import codecs

outputDir = os.getcwd() + "/cFBA-Pipeline/Output/"


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
        #print(line)
        if len(line) == 1:
            return ret
        ret += [simplifyName(line[1])]
    return ret

#===============================================================================
#Get exisitng content of metaboliteDictionary
file = open(outputDir + "metaboliteDictionary.txt")
metaContent = file.read();
file.close()

#Get exisitng content of reactionDictionary
file = open(outputDir + "reactionDictionary.txt")
reactContent = file.read();
file.close()

checkM = existingNames(metaContent)
counterM = (len(checkM)+1)

checkR = existingNames(reactContent)
counterR = (len(checkR)+1)

#Loop through species to add to dictionary
# for filename in os.listdir(os.getcwd()+"/Input/Species"):

    #Opens the JSON
filename = sys.argv[1]
with open(filename) as data_file:
    data = json.load(data_file)
speciesName = filename.split(".")[0]
print(speciesName)

#Load metabolites
metabolites = data["metabolites"]
for m in metabolites:
    #print(m)
    if(simplifyName(m["name"]) not in checkM):
        checkM += [simplifyName(m["name"])]
        metaContent += "M"+str(counterM)+"\t"+m["name"]+"\n"
        counterM += 1

#Load reactions
reactions = data["reactions"]
for r in reactions:
    if(simplifyName(r["name"]) not in checkR):
        checkR += [simplifyName(r["name"])]
        reactContent += "R"+str(counterR)+"\t"+r["name"]+"\n"
        counterR += 1

#Save dictionary files
#metaContent = metaContent.strip()


with codecs.open(outputDir + "metaboliteDictionary.txt", 'w', encoding='utf-8') as out:
    out.write(metaContent)

#metaDict = open(outputDir + "metaboliteDictionary.txt", "w")
#print(metaContent)
#metaDict.write(metaContent)
#metaDict.close()

#reactContent = reactContent.strip()
#reactDict = open(outputDir + "reactionDictionary.txt", "w")
#reactDict.write(reactContent)

with codecs.open(outputDir + "reactionDictionary.txt", 'w', encoding='utf-8') as out:
    out.write(reactContent)
#reactDict.close()
