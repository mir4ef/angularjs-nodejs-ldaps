# AngularJS/NodeJS app authentication with LDAP(S) Template

### Current version: 0.2.0

This application is a template for NodeJS authentication using LDAP(S) and, optionally, AngularJS or any other frontend.
The backend of the application (NodeJS) communicates with LDAP. If the authentication is successful, the backend will create a token and pass it to the frontend to store it and pass it back with each request.
For more information please see *Settings* below.


## Setup:
Clone the application and do the following to have it up and running locally:

1. NodeJS is required (v >0.12). It can be downloaded and installed from [here](https://nodejs.org/).
- Nodemon is optional. It is used to automatically restart/reload the server on changes to the backend. It can be downloaded and installed by running `npm install -g nodemon`. Then you can just run the application/server by going to the application folder and typing `nodemon server.js`.

2. Bower is optional. If you want to use the current frontend as a starting point you can download and install `bower` by running `npm install -g bower`. However, you are free to use whatever frontend you want.
Note: The `-g` flag will install it globally and requires admin (`sudo`) rights for the current user

3. To install all backend dependencies, including the development ones, please run `npm install` from the application folder.

4. To install all frontend dependencies, please run 'bower install' from the application folder. The `.bowerrc' file specifies the destination of the frontend dependencies like angularjs, bootstrap, etc. If you are not using Netbeans, your path might be different, so you might need to update it to match your folder structure.


## Settings:
Configuration settings to match your application needs/specifications:

1. The LDAP(S) properties are defined in the config.js file:

1.1 Regular LDAP (non-secure):

```javascript
//...
'secret': 'superSecret', // a password/phrase used to encode/decode the token
'ldap': {
    server: {
        url: 'ldap://servername.company.com',
        bindDn: 'cn=service.account,ou=System Accounts,dc=company,dc=com',
        bindCredentials: 'password',
        searchBase: 'dc=company,dc=com',
        searchFilter: '(sAMAccountName={{username}})'
    }
},
ldapgroup: 'CN=Group_Name,OU=Company Groups,DC=company,DC=com' // optional, need it if user group membership is required to access the application
//...
```

To see all the available options for the server settings, please (see here)[https://github.com/vesse/node-ldapauth-fork/blob/master/lib/ldapauth.js#L25-93].

1.2 Secure LDAP (= LDAPS):
You will need to prefix the ldap url with `ldaps` and add the certificate(s) under the `tlsOptions`:

```javascript
var fs = require('fs');
//...
'ldap': {
    server: {
        url: 'ldaps://servername.company.com',
        bindDn: 'cn=service.account,ou=System Accounts,dc=company,dc=com',
        bindCredentials: 'password',
        searchBase: 'dc=company,dc=com',
        searchFilter: '(sAMAccountName={{username}})',
        tlsOptions: {
            ca: [
                fs.readFileSync(__dirname + '/app/certs/certificateName.pem') // .pem, .cert, .cer are supported (.cer is used in combination with .cert)
            ]
        }
    }
},
//...
```

Ideally, you should use only one LDAP(S) URL - the load balancer, and not worrying about one LDAP sever going down, etc. That is the job of the load balancer, not yours. BUT, if, for whatever reason, you need to use more than one LDAP URL, you can:
1.1 Using multiple LDAP URLs:
 - Each URL requires separate set of settings. For example, to specify two LDAP URLs, you will need to add a second set of server options/settings to your `config.js`:

```javascript
//config.js
var fs = require('fs');

module.exports = {
    'port': process.env.PORT || 8080,
    'env': process.env.ENV || 'develpment',
    'secret': 'mysupersecret',
    'ldap1': {
        server: {
            url: 'ldaps://server1.company.com',
            bindDn: 'my-binding-username',
            bindCredentials: 'my-binding-username-password',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})',
            tlsOptions: {
                ca: [
                    fs.readFileSync(__dirname + '/certs/certificate-for-server1.pem')
                ]
            }
        }
    },
    'ldap2': {
        server: {
            url: 'ldaps://server2.company.com',
            bindDn: 'my-binding-username',
            bindCredentials: 'my-binding-username-password',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})',
            tlsOptions: {
                ca: [
                    fs.readFileSync(__dirname + '/certs/certificate-for-server2.pem')
                ]
            }
        }
    },
    ldapgroup: 'group-to-compare-user-membership-in-verify-function'
};
```

- You will also need to initialize a new `LdapStrategy` for each LDAP URL and pass the option for each one. In addition, you will have to pass all the strategies to the `passport.authenticate()` method:

```javascript
//api.js
var jwt = require('jsonwebtoken');
var config = require('../../config');
var superSecret = config.secret;
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
//...
passport.use('ldap1', new LdapStrategy(config.ldap1));
passport.use('ldap2', new LdapStrategy(config.ldap2));
apiRouter.use(passport.initialize());

apiRouter.post('/login', authUser);

function authUser(req, res, next) {
    passport.authenticate(['ldap1', 'ldap2'], {session: false}, function(err, user, info) {
        // login logic
    })(req, res, next);
}
//...
```

If you use more than one strategy, hence, more than one URL, your 'failed to authenticate' response message will be an array of objects:
```javascript
//...
passport.authenticate(['ldap1', 'ldap2'], {session: false}, function(err, user, info) {
    //...
    if (!user) {
        console.log((Object.prototype.toString.call(info) === '[object Array]'); // true
        //...
    }
    //...
})(req, res, next);
//...
```

**Note:** Using more than one LDAP URL should work as a failover. However, currently it is not due to an error handling problem in `LdapAuth` (see (this post)[https://github.com/vesse/node-ldapauth-fork/pull/20]). The application bombs out if the first server is not accessible, but works fine if the second, third, etc. are not.


2. The content and the duration of the token can be customized in the application in the api.js file under the `/login` router:
```javascript
var generateToken = function () {
    var token = jwt.sign({
        name: user.name,
        username: user.mailNickname
    }, superSecret, {
        expiresInMinutes: 1440 // 24 hours
    });

    // return the information including a token as JSON
    return res.json({
        success: true,
        message: 'User ' + user.name + ' authenticated successfully!',
        token: token
    });
};
```