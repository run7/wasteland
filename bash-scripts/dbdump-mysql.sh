#!/bin/bash

# ----------
# Dump mysql database to archive file.
# ----------
#
# Tips
# ~~~~
#
# 1. Create a read-only "backup" account in mysql
#
# GRANT SELECT, RELOAD, LOCK TABLES ON *.* TO 'backup'@'localhost' IDENTIFIED BY 'backup_password';
#
# 2. Crontab to run this script
#
# 50 23 * * * /path/to/this/script >> /path/to/a/log/file

# mysql connection setting
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=backup
DB_PASSWORD=backup_password
DB_DATABASE=database_name

# filename format
SAVE_DIR=~/mysql_databases/
SQL_FILENAME="${DB_DATABASE}_`date +%Y-%m-%d_%H:%M:%S`.sql"
BZ2_FILENAME="${SQL_FILENAME}.bz2"

# mysqldump arguments
# if all table is innodb engine, use "--single-transaction"
EXTRA_ARGS='--lock-tables'

# start backup
mkdir -p $SAVE_DIR
cd $SAVE_DIR
mysqldump -u $DB_USERNAME -p$DB_PASSWORD -h $DB_HOST -P $DB_PORT --flush-logs $EXTRA_ARGS $DB_DATABASE > $SQL_FILENAME
bzip2 $SQL_FILENAME
md5sum "${PWD}/${BZ2_FILENAME}"
