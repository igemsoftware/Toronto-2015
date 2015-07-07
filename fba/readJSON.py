import method as method
import json
from variables import datap
import os

path = os.path.join(datap['final_json'], 'iJO1366.json')
read = method.load_json(path)
print(json.dumps(read))
