#!/bin/bash

filename=$(echo "$1" | sed 's/\(\.ch[st]\)\|\(\.eng\)\?\.srt//g')
merge-subtitles "$@" "${filename}.ass"
