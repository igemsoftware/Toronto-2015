#!/bin/bash

host="http://localhost:9001"
route="community/create"
header="Content-Type:application/json"
method="POST"

curl $host/$route -X $method --data '{"models": ["iJO1366","Mb_iUPDATE","iRsp1095"]}'  -H $header

