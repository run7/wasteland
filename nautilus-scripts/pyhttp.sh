#!/bin/bash

# if selected is not a folder, use current folder 
if [ -d "$1" ]; then
    folder="$1"
else
    folder="$PWD"
fi

cd $folder
gnome-terminal -x python -m SimpleHTTPServer 8000
