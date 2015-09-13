#!/bin/bash


speciesFolder="JSON-Lit"
host="localhost:9001"
route="model/create"
header="Content-Type:application/json"
method="POST"

species=`ls $speciesFolder`
for specie in $species
do
    data="@$speciesFolder/$specie"
    curl $host/$route -X $method --data $data -H $header
done

