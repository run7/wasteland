#!/usr/bin/env python3
# -*- coding: utf8 -*-

# ----------
# Shift ass subtitle position.
# ----------

import sys
import aeidon


def to_seconds(hms):
    nums = hms.split(':')
    seconds = 0
    for i in range(len(nums)):
        seconds += int(nums[-i - 1]) * (60 ** i)
    return seconds


def shift_amount(hms_list):
    amount = 0
    for hms in hms_list:
        if hms.startswith('-'):
            seconds = to_seconds(hms[1:])
            amount -= seconds
        else:
            seconds = to_seconds(hms)
            amount += seconds
    return amount


def shift_positions(filename, amount):
    project = aeidon.Project()
    project.open_main(filename, 'UTF-8')
    project.shift_positions(None, float(amount))
    project.save_main()


def usage():
    print('./shiftsub ass_file HH:MM:SS ...')


def main():
    if len(sys.argv) < 3:
        usage()
        return

    filename = sys.argv[1]
    amount = shift_amount(sys.argv[2:])
    shift_positions(filename, amount)

if __name__ == '__main__':
    main()
