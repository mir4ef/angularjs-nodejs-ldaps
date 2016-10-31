#!/bin/bash

# get all the variables
source /webapps/scripts/common_variables.sh

# go to the application folder
cd $DESTINATION_PATH

# and (re)start forever
ps ax | grep -v grep | grep forever > /dev/null
if [ $? == 0 ]; then
    forever stop cluster.js
fi