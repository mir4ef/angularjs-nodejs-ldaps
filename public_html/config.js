// Miroslav Georgiev
'use strict';
var fs = require('fs');

module.exports = {
    'port': process.env.PORT || 8080,
    'env': process.env.ENV || 'develpment',
    'secret': 'somesupersecret',
    'ldap': {
        server: {
            url: 'ldaps://server.company.com',
            bindDn: 'cn=user.name,ou=Comapny Accounts,dc=company,dc=com',
            bindCredentials: 'password-for-user.name',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})',
            tlsOptions: {
                ca: [
                    fs.readFileSync(__dirname + '/app/certs/cert1.pem'),
                    fs.readFileSync(__dirname + '/app/certs/cert2.cer'),
                    fs.readFileSync(__dirname + '/app/certs/cert2.cert')
                ]
            }
        }
    },
    ldapgroup: 'CN=Group_Name,OU=Company Groups,DC=company,DC=com'
};
