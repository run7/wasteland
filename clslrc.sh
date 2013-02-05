#!/bin/bash

# ----------
# Clear contact message in lyric files.
# ----------

sed -i -r '/^.*(qq|http|e-?mail).*$/Id' "$@"
