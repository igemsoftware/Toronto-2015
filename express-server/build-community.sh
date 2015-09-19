#!/bin/bash


speciesFolder="JSON-Lit"
host="localhost:9001"
route="community/create"
header="Content-Type:application/json"
method="POST"

curl $host/$route -X $method --data '{"species": ["iJO1366","Mb_iUPDATE","iRsp1095"], "master": "iJO1366"}'  -H $header

