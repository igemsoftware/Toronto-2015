import sys
import os
import method as method
input = sys.argv[1]
from variables import datap

f_path = os.path.join(datap['json'], input)
flux = method.calculate_flux(f_path)

for item in flux:
    print(item)
