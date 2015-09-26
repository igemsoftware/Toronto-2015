#!/bin/bash

rm -rf static
mkdir static
./build-species.sh
./add-models.sh
