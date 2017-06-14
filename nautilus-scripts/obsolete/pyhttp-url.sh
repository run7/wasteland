#!/bin/bash

local_ip=`ifconfig | grep -E 'inet addr:[0-9.]{1,12}  Bcast:' | awk '{print $2}' | awk -F ':' '{print $2}'` 
prefix="http://${local_ip}:8000/"
for i in $@; do
    echo -n "\"${prefix}${i}\" "
done | xclip -selection "clipboard"
