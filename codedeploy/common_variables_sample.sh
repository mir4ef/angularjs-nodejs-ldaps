#!/bin/true
#
# This is not an executable script, just a set of names and variable declarations.
#
# Use it with:
#   source common_variables.sh
# Or:
#   . common_variables.sh


APPLICATION_NAME="appname"
DESTINATION_PATH="/webapps/$APPLICATION_NAME"
PORT=443
ENV="development"
SECRET="token.secret"
LDAPUSER="account.to.connect.to.AD"
LDAPPASS="AD.password"
LDAPGROUP="CN=AD_Group,OU=Department,OU=Company Groups,DC=company,DC=com"
APP_DEBUG=false
MAX_V8_HEAP_SIZE=8192