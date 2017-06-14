#!/bin/bash

# ----------
# Merge mulit srt subtitles to one file, each subtitle to one line.
# ----------

cat $* | dos2unix | awk '{if ($0 ~ "^[1-9][0-9]*$|-->") {print $0} else {if ($0 ~ "^$") {print "\n"} else {printf("%s ",$0)}}}'
