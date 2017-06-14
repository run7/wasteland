#!/bin/bash

# ----------
# Memory info stat statistics for mrtg.
#
# Use with setting mrtg-mem.cfg:
#
#      Target[ram]: `/path/to/mrtg-mem.sh`
#      Title[ram]: Memory
#      PageTop[ram]: <H1>Memory</H1>
#      YLegend[ram]: Memory Cost
#      LegendO[ram]: Used Memory:
#      LegendI[ram]:
#      ShortLegend[ram]:
#      MaxBytes[ram]: 2048000
#      Options[ram]: gauge
#      kmg[ram]: kB,MB
#      kilo[ram]: 1024
#
# ----------

meminfo=`/usr/bin/free |grep Mem`
memtotal=`echo $meminfo |awk '{print $2}'`
memused=`echo $meminfo |awk '{print $3}'`
upinfo=`uptime | cut -d \, -f 1`
echo $memtotal
echo $memused
echo $upinfo
hostname
