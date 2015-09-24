#!/bin/bash

curl -X POST http://localhost:9001/specie/addmodel/escherichia-coli_k12-mg1655 -d "@JSON-Lit/Ecoli-K12-MG1655.json" -H "Content-Type:application/json"

curl -X POST http://localhost:9001/specie/addmodel/methanosarcina-barkeri_fursaro -d "@JSON-Lit/Methanosarcina-barkeri-Fusaro-iMG746.json" -H "Content-Type:application/json"
