#!/bin/bash

# get all the variables
source /webapps/scripts/common_variables.sh

# go to the application folder
cd $DESTINATION_PATH

# and (re)start forever
ps ax | grep -v grep | grep forever > /dev/null
if [ $? != 0 ]; then
    PORT=$PORT ENV=$ENV SECRET=$SECRET LDAPUSER=$LDAPUSER LDAPPASS=$LDAPPASS LDAPGROUP=$LDAPGROUP APP_DEBUG=$APP_DEBUG forever start -l /webapps/logs/$APPLICATION_NAME.forever.log -o /webapps/logs/$APPLICATION_NAME.out.log -e /webapps/logs/$APPLICATION_NAME.err.log -a --max-old-space-size=$MAX_V8_HEAP_SIZE cluster.js
else
    forever restart cluster.js
fi