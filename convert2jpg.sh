#!/bin/bash

for name in "$@"; do
    if ! echo $name | egrep -q '\.(png|bmp|gif)$'; then
        echo "skip $name"
        continue
    fi
    jpg_name=`echo $name | sed -r 's/\.(png|bmp|gif)$/.jpg/'`
    convert "$name" "$jpg_name"
done
