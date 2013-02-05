#!/bin/bash

function displayOutput() {
    zenity --width 640 --height 480 --text-info --no-wrap --font 'Mono'
}

function optipngFiles () {
    for name in "$@"; do
        if [ ! -f "$name" ]; then
            continue
        fi
        if ! echo $name | grep -q '\.png$'; then
            continue
        fi
        optipng $name
    done
}

optipngFiles "$@" 2>&1 | displayOutput
