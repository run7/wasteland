#!/usr/bin/env python
# -*- coding: utf8 -*-

import os
import sys

def main():
    args = sys.argv[1:]
    for name in args:
        name = name.decode('utf8')
        try:
            converted = name.encode('latin-1').decode('gb18030')
        except UnicodeEncodeError:
            continue

        if name == converted:
            continue

        # print will fain if script not run in terminal
        try:
            print converted
        except UnicodeEncodeError:
            pass

        os.rename(name, converted)

if __name__ == '__main__':
    main()
