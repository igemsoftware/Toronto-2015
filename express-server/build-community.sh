#!/bin/bash

host="http://localhost:9001"
route="community/create"
header="Content-Type:application/json"
method="POST"

curl $host/$route -X $method --data "@build/community.json"  -H $header

