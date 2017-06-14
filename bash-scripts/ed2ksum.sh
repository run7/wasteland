#!/bin/bash

# ----------
# Create ed2k link for files.
# ----------

function unquote_url() {
    python -c 'import sys, urllib; sys.stdout.write(urllib.unquote(sys.stdin.read()))'
}

function filter_url() {
    grep "^ed2k://"
}

function make_hash() {
    mld_hash -hash ed2k "$@" 2>&1
}

make_hash "$@" | filter_url | unquote_url
