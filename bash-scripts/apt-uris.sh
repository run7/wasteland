#!/bin/bash

# ----------
# Print apt-get deb file uris.
# ----------

if [ $# -eq 0 ]; then
    echo "apt-uris install|upgrade|dist-upgrade package_name." 1>&2
    exit 1
fi

apt-get -y --print-uris $@ | grep -E -o "http://[^\']+"
