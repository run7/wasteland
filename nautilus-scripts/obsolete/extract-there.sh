#!/bin/bash

folder=$(basename $@)
path="/media/Data/test/${folder%.*}" 
file-roller --force -e $path "$@" && nautilus $path
