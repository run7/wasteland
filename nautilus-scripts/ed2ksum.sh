#!/bin/bash

function displayOutput() {
    zenity --width 720 --height 480 --text-info --no-wrap --font 'Mono'
}

for name in "$@"; do
    if [ -d "$name" ]; then
        echo ed2ksum: "$name": Is a directory
        continue
    fi
    ed2ksum "$name"
done | displayOutput
