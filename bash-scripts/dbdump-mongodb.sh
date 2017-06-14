#!/bin/bash

# ----------
# Dump mongodb database to archive file.
# ----------
#
# Tips
# ~~~~
#
# Crontab to run this script
#
# 50 23 * * * /path/to/this/script >> /path/to/a/log/file

# mongo connection setting
DB_HOST=localhost
DB_PORT=12345
DB_USERNAME=backup
DB_PASSWORD=backup_password
DB_DATABASE=database_name

# filename format
SAVE_DIR=~/mogodb_databases/
OUT_DIRNAME="${DB_DATABASE}_`date +%Y-%m-%d_%H:%M:%S`"
TAR_BZ2_FILENAME="${OUT_DIRNAME}.tar.bz2"

# mongodump arguments
EXTRA_ARGS=""

# start backup
mkdir -p $SAVE_DIR
cd $SAVE_DIR
mongodump -u $DB_USERNAME -p $DB_PASSWORD -h $DB_HOST --port $DB_PORT -d $DB_DATABASE -o $OUT_DIRNAME $EXTRA_ARGS
tar --force-local -cjf $TAR_BZ2_FILENAME $OUT_DIRNAME
rm -rf $OUT_DIRNAME
md5sum "${PWD}/${TAR_BZ2_FILENAME}"
