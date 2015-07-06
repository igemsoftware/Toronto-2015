# methods for xmltojson
from variables import datap
from bs4 import BeautifulSoup
import os
import json
import cobra


# <=== calculate fba and insert all to database/fina_json ===>
def calculate_flux(input_file):
    # after installing cobrapy, optimize json in database directory with following:
    model = cobra.io.load_json_model(input_file)
    model.optimize()
    flux_dict = model.solution.x_dict
    return flux_dict

def insert_all():
    # loop for database/json, initial calculation of all single species fba
    jsons = get_file_name('json')
    for json in jsons:
        insert(json)

def insert(json_n):
    # starts here for subsequent changes in network that require a recalculation
    # json_n stands for file name of model including extensions i.e. 'iJO1366.json'

    f_path = os.path.join(datap['json'], json_n)
    flux = calculate_flux(f_path)
    model = load_json(f_path)

#    flux_solutions = load_json(os.path.join(datap['fba'], 'flux_dict.json'))
    model = add_flux(model, flux) # flux_solutions)
    json_out(model, datap['final_json'])

def add_flux(model, flux):
    for reaction in model['reactions']:
        for key in flux:
            print(key, reaction['id'])
            if reaction['id'] == key:
                reaction['flux_value'] = flux[key]
                break
    return model


def load_json(path):
    with open(path) as data:
        jsonf = json.load(data)
    return jsonf

# <== conversion methods ===>

def conversion():
    # convert sbml to json
    sbmls = get_file_name('sbml')
    for sbml in sbmls:
        convert(sbml)

def convert(sbml_name):
    f_path = os.path.join(datap['sbml'], sbml_name)
    soup = build_soup(f_path)
#  add [, 'xml'] to incorporate lxml parser if present
    model_tag = soup.model
    model = {}
    model['id'] = model_tag['id']
    model['compartments'] = convert_compartment(model_tag)
    model['metabolites'] = convert_metabolites(model_tag)
    model['reactions'] = convert_reactions(model_tag)
    model['genes'] = []
    json_out(model, datap['json'])

def build_soup(p_name):
    file = open(p_name)
    f = file.read()
    soup_m = BeautifulSoup(f)
    return soup_m

def get_file_name(type):
    filen = []
    if type == "sbml":
        for filename in os.listdir(datap['sbml']):
            if filename.endswith('.xml'):
                filen.append(filename)
    if type == 'json':
        for filename in os.listdir(datap['json']):
            if filename.endswith('.json'):
                filen.append(filename)
    return filen

def convert_compartment(modelT):
    compartments = modelT.listofcompartments.find_all('compartment')
    compartment_list = []
    for item in compartments:
        temp = {}
        temp['id'] = item['id']
        temp['name'] = item['name']
        compartment_list.append(temp)
    return compartment_list

def convert_metabolites(modelT):
    species = modelT.listofspecies.find_all('species')
    species_list = []
    for obj in species:
        temp = {}
        temp['id'] = obj['id'][2:]
        temp['name'] = obj['name']
        temp['compartment'] = obj['compartment']
        temp['species'] = []
        temp['species'].append(modelT['id'])
        p = obj.find_all('p')
        counter_in = 0
        for item in p:
            if item.text[:8] == 'FORMULA:':
                temp['formula'] = item.text[9:]
            if item.text[:7] == 'CHARGE:':
                if type(item.text[8:]) is int:
                    temp['charge'] = item.text[8:]
                else:
                    temp['charge'] = 0
                    counter_in += 1
        if (obj['id'][-2:] == '_e') or (obj['id'][-10:] == 'e_boundary'):
            temp['outside'] = True
        elif (obj['id'][-2:] == '_c') or (obj['id'][-2:] == '_p') or (obj['id'][-10:] == 'c_boundary'):
            temp['outside'] = None
        else:
            print('error in assigning metabolite outside attribute')
        species_list.append(temp)
    return species_list

def convert_reactions(modelT):
    reaction = modelT.listofreactions.find_all('reaction')
    reaction_list = []
    for good in reaction:
        temp = {}
        temp['id'] = good['id'][2:]
        temp['name'] = good['name']
        temp['species'] = []
        temp['species'].append(modelT['id'])
        if good.has_attr('reversible'):
            temp['reversible'] = good['reversible']
        else:
            temp['reversible'] = 'didnt specify'

        p = good.find_all('p')
        for item in p:
            if item.text[:17] == 'GENE_ASSOCIATION:':
                temp['gene association'] = item.text[18:]
            if item.text[:10] == 'SUBSYSTEM:':
                temp['subsystem'] = item.text[11:]
            if item.text[:10] == 'EC Number:':
                temp['EC_Number'] = item.text[11:]
        pp = good.find_all('speciesreference')
        metabolite = {}
        for item in pp:
            if item.has_attr('stoichiometry'):
                number = float(item['stoichiometry'])
                if item.parent.name == 'listofproducts':
                    metabolite[item['species'][2:]] = number
                elif item.parent.name == 'listofreactants':
                    metabolite[item['species'][2:]] = -number
                else:
                    print('error')
            else:
                if item.parent.name == 'listofproducts':
                    metabolite[item['species'][2:]] = float(1)
                elif item.parent.name == 'listofreactants':
                    metabolite[item['species'][2:]] = float(-1)
                else:
                    print('error')
        temp['metabolites'] = metabolite
        ppp = good.find_all('parameter')
        for item in ppp:
            if item['id'] == 'LOWER_BOUND':
                temp['lower_bound'] = float(item['value'])
            if item['id'] == 'UPPER_BOUND':
                temp['upper_bound'] = float(item['value'])
            if item['id'] == 'FLUX_VALUE':
                temp['flux_value'] = float(item['value'])
            if item['id'] == 'OBJECTIVE_COEFFICIENT':
                temp['objective_coefficient'] = float(item['value'])
        temp['outside'] = True
        for item in pp:
            if item['species'][-2:] != '_e':
                temp['outside'] = None
                break
        reaction_list.append(temp)
    return reaction_list

def json_out(output, destination):
    fp = open(os.path.join(destination + '\\' + output['id'] + '.json'), 'w')
    json.dump(output, fp)
