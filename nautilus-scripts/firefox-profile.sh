#!/bin/bash

# if selected is not a folder, use current folder 
if [ -d "$1" ]; then
    folder="$1"
else
    folder="$PWD"
fi

# check it if a firefox profile folder, check prefs.js exist. 
# if not, ask to create one or just exit.
if [ -e "${folder}/prefs.js" ]; then
    firefox -no-remote -profile "$folder"
else
    question='It is not a firefox profile folder, initialize it ?'
    if zenity --question --text "$question"; then
        firefox -no-remote -profile "$folder"
    fi
fi
