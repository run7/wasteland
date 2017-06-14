#!/bin/bash

function displayOutput() {
    zenity --width 640 --height 480 --text-info --no-wrap --font 'Mono'
}

sha1sum "$@" 2>&1 | displayOutput
