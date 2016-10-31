#!/bin/bash

# get all the variables
source /webapps/scripts/common_variables.sh

# check if nodejs is installed
yum list installed nodejs &> /dev/null
if [ $? != 0 ]; then
    curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
    yum install -y nodejs
    yum install -y gcc-c++ make
    npm install -g forever
fi

# check if httpd is installed,
# so the CodeDeploy install script can change ownership to apache:apache
yum list installed | grep httpd &> /dev/null
if [ $? != 0 ]; then
    yum install -y httpd
fi

# check if the application folder exists
if [ ! -d "$DESTINATION_PATH" ]; then
  mkdir $DESTINATION_PATH
fi

# delete /node_modules folder if it exists,
# so there are no old/unused files/assets
if [ -d "$DESTINATION_PATH/node_modules" ]; then
  rm -Rf $DESTINATION_PATH/node_modules
fi

# delete /dev folder if it exists,
# so there are no old/unused files/assets
if [ -d "$DESTINATION_PATH/dev" ]; then
  rm -Rf $DESTINATION_PATH/dev
fi

# delete /public folder if it exists,
# so there are no old/unused files/assets
if [ -d "$DESTINATION_PATH/public" ]; then
  rm -Rf $DESTINATION_PATH/public
fi