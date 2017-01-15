// Miroslav Georgiev
'use strict';
const fs = require('fs');

module.exports = {
    'port': process.env.PORT || 8080,
    'env': process.env.ENV || 'development',
    'secret': process.env.SECRET || '',
    'certphrase': process.env.CERTPHRASE || '',
    'maxRequests': process.env.MAX_REQUESTS || 150,
    'windowMs': process.env.WINDOW_MINUTES || 25,
    'trustProxy': process.env.TRUST_PROXY === 'true',
    'debug': process.env.APP_DEBUG === 'true',
    'ldap': {
        server: {
            url: 'ldap://server.company.com',
            bindDn: process.env.LDAPUSER || '',
            bindCredentials: process.env.LDAPPASS || '',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})'
        }
    },
    'ldaps': {
        server: {
            url: 'ldaps://server.company.com',
            bindDn: process.env.LDAPUSER || '',
            bindCredentials: process.env.LDAPPASS || '',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})',
            tlsOptions: {
                host: 'company.name.com',
                port: 636,
                ca: [
                    fs.readFileSync(__dirname + '/certs/certificate.cer')
                ],
                checkServerIdentity: (servername, cert) => {
                    if (cert.subject.CN.endsWith(servername)) {
                        return undefined;
                    }

                    return new Error('Could not verify the authentication server');
                }
            }
        }
    },
    ldapgroup: process.env.LDAPGROUP || ''
};
