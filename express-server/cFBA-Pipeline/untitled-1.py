#.encode('ascii','ignore') 
import os
import json
#Loop through species to add to dictionary
for filename in os.listdir(os.getcwd()+"/Input/Species"):
    #Opens the JSON
    with open("Input/Species/"+filename) as data_file:
        c = data_file.read()
        #data = json.load(data_file)
    speciesName = filename.split(".")[0]
    print(speciesName)
    
    f = open('Input/Species/'+speciesName+".json", 'w')
    
    f.write("".join([ch for ch in c if ord(ch)<= 128]))
    f.close()
    #print()