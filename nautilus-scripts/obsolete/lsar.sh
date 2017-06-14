#!/bin/bash

export TZ='Asia/Shanghai'
cmd="lsar '$@'"
prompt="Press any key to exit..."
gnome-terminal -x bash -c "${cmd}; read -s -n 1 -p \"$prompt\""
