#!/bin/bash

# ----------
# CPU info stat statistics for mrtg.
#
# Use with setting mrtg-cpu.cfg:
#
#      Target[cpu]: `/path/to/mrtg-cpu.sh`
#      Title[cpu]: CPU Loading
#      PageTop[cpu]: <H1>CPU Loading</H1>
#      YLegend[cpu]: CPU Loading (%)
#      LegendO[cpu]: CPU user:
#      LegendI[cpu]: CPU sys:
#      ShortLegend[cpu]: %
#      MaxBytes[cpu]: 100
#      Options[cpu]: gauge, nopercent
#
# ----------

cpuinfo=`/usr/bin/sar -u 1 3 | grep Average`
cpuusr=`echo $cpuinfo | awk '{print $3}'`
cpusys=`echo $cpuinfo | awk '{print $5}'`
upinfo=`uptime | cut -d \, -f 1`
echo $cpuusr
echo $cpusys
echo $upinfo
hostname
