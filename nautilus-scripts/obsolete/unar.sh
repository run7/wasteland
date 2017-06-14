#!/bin/bash

export TZ='Asia/Shanghai'
output="/media/Data/test/" 
path=`unar -d -f -o $output "$@" | grep 'Successfully extracted to' | awk '{print $4}' | sed  -e 's/^"//' -e 's/"\.$//'`
nautilus $path
