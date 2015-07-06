import os
import sys

current = os.path.abspath(__file__)
root = os.path.dirname(os.path.dirname(current))
datap = {
    'fba': os.path.join(root, 'fba'),
    'json': os.path.join(root, 'database', 'json'),
    'sbml': os.path.join(root, 'database', 'sbml'),
    'final_json': os.path.join(root, 'database', 'final_json')
}
