#!/usr/bin/bash

find ./json/ -maxdepth 1 -name '*.json' -delete
find ../public/svg/ -maxdepth 1 -name '*.svg' -delete
find ../public/sdf/ -maxdepth 1 -name '*.sdf' -delete
python3 ./scripts.py
