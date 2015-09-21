#!/bin/bash

host="localhost:9001"
route="communitymodel/create"
header="Content-Type:application/json"
method="POST"

curl -X $method $host/$route -d "@community.json" -H $header

# species=`ls $speciesFolder`
# for specie in $species
# do
#     data="@$speciesFolder/$specie"
#     curl $host/$route -X $method --data $data -H $header
# done

