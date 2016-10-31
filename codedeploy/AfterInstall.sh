#!/bin/bash

# get all the variables
source /webapps/scripts/common_variables.sh

# create /server/uploads if it doesn't exist
if [ ! -d "$DESTINATION_PATH/server/uploads" ]; then
  mkdir $DESTINATION_PATH/server/uploads
fi

# create /webapps/logs if it doesn't exist
if [ ! -d "/webapps/logs" ]; then
  mkdir /webapps/logs
fi

# copy certs if they don't exist
if [ ! -f $DESTINATION_PATH/server/certs/$APPLICATION_NAME.* ]; then
    cp /webapps/certs/$APPLICATION_NAME.* $DESTINATION_PATH/server/certs
fi