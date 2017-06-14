#!/bin/bash

filename=`echo "$1" | sed -r 's/\.(chs|cht|eng)\.srt$/.ass/'`
mrgsub "$@" "$filename"
