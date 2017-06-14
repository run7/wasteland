#!/bin/bash

folder=$(basename $@)
path="/media/Data/test/${folder%.*}" 
7z x -o"$path" "$@" && nautilus "$path"
