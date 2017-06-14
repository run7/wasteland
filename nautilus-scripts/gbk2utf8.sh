#!/bin/bash

for name in "$@"; do
    if [ -f "$name" ]; then
        iconv -f GBK "$name" -o "${name}.temp" && mv "${name}.temp" "$name"
    fi
done
