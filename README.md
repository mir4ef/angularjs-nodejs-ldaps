# AngularJS/NodeJS app authentication with LDAP(S) Template

### Current version: 0.3.0

This application is a template for NodeJS authentication using LDAP(S) and, optionally, AngularJS or anything else. It is also `HTTP/2` enabled.
The backend of the application (NodeJS) communicates with LDAP. If the authentication is successful, the backend will create a token and pass it to the frontend to store it and pass it back with each request.
For more information please see *Settings* below.

## Setup
#### Prerequisites
- NodeJS is required (v >= **6.3.0**). It can be downloaded and installed from [here](https://nodejs.org/).

- Bower is required to install the front-end dependencies. You can install `bower` by running `npm install -g bower`.
Note: The `-g` flag will install it globally and requires admin (`sudo`) rights for the current user.

- Gulp is used (*in this template*) to build the custom style sheets, javascript files, assets, documentation (you can replace it with any build tool you feel comfortable with (e.g. `grunt`, `webpack`, etc.)). You can install it globally by running `npm install -g gulp`. To build them, please run `gulp build` to build all tasks.
Note: The `-g` flag will install it globally and requires admin (`sudo`) rights for the current user.

- Karma is optional. If you want to run the unit tests, you can install it globally by running `npm install -g karma-cli`. To run them, please run `karma start` to have `karma` run the tests every time you make a change or `karma start --singleRun` to run it only once.
Note: The `-g` flag will install it globally and requires admin (`sudo`) rights for the current user.

- Nodemon is optional. It is used to automatically restart/reload the server on changes to the back/front-end. It can be downloaded and installed by running `npm install -g nodemon`. Then, you can just run the server by going to the application folder and typing `nodemon server.js`.
Note: The `-g` flag will install it globally and requires admin (`sudo`) rights for the current user.

#### Prod and Dev
- you need the `build-essential`s installed on Ubuntu and RedHat
- clone the application (you need `git` installed to do it)
- you (might) need to install `libpng` on RedHat (`(sudo) yum install libpng-develm`, if that one doesn't work, you can try `(sudo) yum install libpng-devel`)
- install all backend dependencies, including the development ones, by running `npm install` from the application folder. Note that after successful installation, this will automatically trigger the `postinstall` script from `packages.json`, which will install all frontend dependencies, build the custom stylesheets, javascript, ect., and run the karma tests once
- if, for whatever reason, `npm install` didn't trigger the `postinstall` script, you can install all frontend dependencies by running `bower install` from the application folder. Note that if do not have write rights for the application directory, you might need to execute it with `sudo` and `--allow-root` option (`sudo bower install --allow-root`), because it needs to make and write to a new directory (the one specified in `.bowerrc`. the `.bowerrc` file specifies the destination of the frontend dependencies) 
- if, for whatever reason, `npm install` didn't trigger the `postinstall` script, you can build all the assets by running `npm run build` from the application folder

#### Dev ONLY
- you will need to generate certificates and place them in the certs folder (`appname/server/certs`) for local development. if you don't know how to generate `.pem` and `.key` files, you can search the internet or [read this post](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/) or run this in your terminal `openssl req -x509 -newkey rsa:4096 -keyout appname.key -out appname.pem -days 365` (please use 2048 encryption and above when generating the certs, e.g. `rsa:2048`). If you setup a password for your certs, you will need to provide it when you start the server with the environmental variable `CERTPHRASE`
- you will need to specify a `secret` to encrypt and decrypt the tokens. you can do this by setting the environmental variable `SECRET` when you start the server
- you will need to specify an LDAP user and password to connect and query LDAP to verify users. to do this, you will need to set `LDAPUSER` and `LDAPPASS` environmental variables when you start the server. Note that the app is already configured to use `LDAPS`
- if you want to verify against a specific LDAP group membership, you will need to pass a group name, enclosed in quotes, to the `LDAPGROUP` environmental variable when you start the server (e.g. `LDAPGROUP='cn=my ldap group,ou=groups,dc=com'`). Note that if you do not pass a group, it will just verify the user against LDAP, but no group membership
- if you use the default port configuration, the url will be `https://localhost:8080`. if you are using a different port (by setting the environmental variable `PORT` when you start the server), update the URL accordingly. Note that `http` won't open anything, **ONLY** `https` is allowed!
- when you start the server, your final startup command should look something like this:

    ```bash
    CERTPHRASE='myphrase' SECRET='mysupersecret' LDAPUSER=user.name LDAPPASS='password-for-user.name' node server.js`
    ```

    or if using nodemon (*recommended*)

    ```bash
    CERTPHRASE='myphrase' SECRET='mysupersecret' LDAPUSER=user.name LDAPPASS='password-for-user.name' nodemon server.js
    ```

## Settings:
Configuration settings to match your application needs/specifications:

1. The LDAP(S) properties are defined in the `config.js` file:

    1.1 Regular LDAP (non-secure):

    ```javascript
    //config.js
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

    To see all the available options for the server settings, please [see here](https://github.com/vesse/node-ldapauth-fork/blob/master/lib/ldapauth.js#L25-93).
    
    1.2 Secure LDAP (= LDAPS):
    You will need to prefix the ldap url with `ldaps` and add the certificate(s) under the `tlsOptions`:

    ```javascript
    var fs = require('fs');
    //...
    'ldaps': {
        server: {
            url: 'ldaps://servername.company.com',
            bindDn: 'cn=service.account,ou=System Accounts,dc=company,dc=com',
            bindCredentials: 'password',
            searchBase: 'dc=company,dc=com',
            searchFilter: '(sAMAccountName={{username}})',
            tlsOptions: {
                ca: [
                    fs.readFileSync(__dirname + '/app/certs/certificateName.pem')
                ]
            }
        }
    },
    //...
    ```

    Ideally, you should use only one LDAP(S) URL - the load balancer, and not worrying about one LDAP sever going down, etc. That is the job of the load balancer, not yours. BUT, if, for whatever reason, you need to use more than one LDAP URL, you can:
    
    1.3 Using multiple LDAP URLs:
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

    If you use more than one strategy, hence, more than one URL, your 'failed to authenticate' response message will be an array of objects (rather than just an object):
    
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

    **Note:** Using more than one LDAP URL should work as a failover. However, currently it is not due to an error handling problem in `LdapAuth` (see [this post](https://github.com/vesse/node-ldapauth-fork/pull/20)). The application bombs out if the first server is not accessible, but works fine if the second, third, etc. are not.


2. The content and the duration of the token can be customized in the application in the `api.js` file under the `/authenticate` api endpoint:
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

3. API documentation is auto generated using [Swagger UI](http://swagger.io/swagger-ui/) and is accessible under `url/documentation/api`
4. This template uses AngularJS and its documentation is auto generated using [angular-jsdoc](https://www.npmjs.com/package/angular-jsdoc) and is accessible under `url/documentation/app`
