import sys
import method as method
input = sys.argv[1]

if input == 'convert_all':
    method.conversion()
elif input == 'insert_all':
    method.insert_all()
else:
    method.insert(input)
