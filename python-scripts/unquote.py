#!/usr/bin/env python
# -*- coding: utf8 -*-

# ----------
# Unquote html text from stdin or file.
# ----------

import sys
import urllib

def main():
    arg_num = len(sys.argv)

    if arg_num > 2:
        print "./unquote [quoted_file]"
        return

    if arg_num == 1:
        text = sys.stdin.read()
    else:
        with open(sys.argv[1]) as f:
            text = f.read()

    text = urllib.unquote(text)
    sys.stdout.write(text)

if __name__ == '__main__':
    main()
