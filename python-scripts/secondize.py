#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys

def to_seconds(hms):
    nums = hms.split(':')
    seconds = 0
    for i in range(len(nums)):
        seconds += int(nums[-i - 1]) * (60 ** i)
    return seconds

def usage():
    print './secondize HH:MM:SS ...'

def main():
    if len(sys.argv) == 1:
        usage()
        return

    result = 0
    for hms in sys.argv[1:]:
        if hms.startswith('-'):
            symbol = '-'
            seconds = to_seconds(hms[1:])
            result -= seconds
        else:
            symbol = ' '
            seconds = to_seconds(hms)
            result += seconds
        print '%8s   %6s' % (hms, symbol + str(seconds))

    print '-----------------'
    print '%17s' % result

if __name__ == '__main__':
    main()
