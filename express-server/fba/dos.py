import sys
import method as method
input = sys.argv[1]
import json
from variables import datap
import os


if input == 'get_json':
    path = os.path.join(datap['final_json'], 'iJO1366.json')
    read = method.load_json(path)
    print(json.dumps(read))
elif input == 'convert_all':
    method.conversion()
elif input == 'insert_all':
    method.insert_all()
else:
    method.insert(input)
