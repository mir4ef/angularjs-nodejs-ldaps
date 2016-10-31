/**
 * @file auth.service.js
 * @extends core.auth
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

(function () {
    'use strict';
    
    /**
     * @ngdoc factory
     * @name Auth
     * @memberOf core.auth
     * @description Service to login/logout a user
     * @returns {Object}
     */
    function Auth($http, $q, AuthToken) {
        var authFactory = {};

        /**
         * @method login
         * @memberOf Auth
         * @description login the user
         * @param {String} username - The username
         * @param {String} password - The password associated with the {username}
         * @returns {Promise} Session details
         */
        authFactory.login = function (username, password) {
            return $http.post('api/v1/authenticate', { username: username, password: password }).then(function (result) {
                AuthToken.setToken(result.data.token);
                return result;
            }, function (error) {
                return error;
            });
        };

        /**
         * @method logout
         * @memberOf Auth
         * @description logout the user
         */
        authFactory.logout = function () {
            AuthToken.setToken();
        };

        /**
         * @method isLoggedIn
         * @memberOf Auth
         * @description check if the user has a valid token
         * @return {Boolean} whether the token is valid or not
         */
        authFactory.isLoggedIn = function () {
            return AuthToken.getToken() ? true : false;
        };

        /**
         * @method getUser
         * @memberOf Auth
         * @description get the user info from the token and cache it
         * @return {Promise} User details
         */
        authFactory.getUser = function () {
            if (AuthToken.getToken()) {
                return $http.get('api/v1/me', { cache: true });
            }

            return $q.reject({ success: false, message: 'User has no token.' });
        };

        return authFactory;
    }

    /**
     * @ngdoc factory
     * @name AuthToken
     * @memberOf core.auth
     * @description Service to generate/delete a token on login/logout
     * @returns {Object}
     */
    function AuthToken($window) {
        var authTokenFactory = {};

        /**
         * @method getToken
         * @memberOf AuthToken
         * @description retrieve a stored token
         * @returns {String} the saved token for the application
         */
        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('appToken');
        };

        /**
         * @method setToken
         * @memberOf AuthToken
         * @description save the generated token or delete it if nothing is passed
         * @param {String} token - The generated token with the session info
         */
        authTokenFactory.setToken = function (token) {
            if (token) {
                $window.localStorage.setItem('appToken', token);
            }
            else {
                $window.localStorage.removeItem('appToken');
            }
        };

        return authTokenFactory;
    }

    /**
     * @ngdoc factory
     * @name AuthInterceptor
     * @memberOf core.auth
     * @description Service to intercept unauthorized users
     * @returns {Object}
     */
    function AuthInterceptor($q, $location, AuthToken) {
        var interceptorFactory = {};

        /**
         * @method request
         * @memberOf AuthInterceptor
         * @param config
         * @returns {*}
         */
        interceptorFactory.request = function (config) {
            var token = AuthToken.getToken();

            if (token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        /**
         * @method responseError
         * @memberOf AuthInterceptor
         * @param res
         * @returns {*}
         */
        interceptorFactory.responseError = function (res) {
            if (res.status === 403) {
                AuthToken.setToken();
                $location.path('/login');
            }

            return $q.reject(res);
        };

        return interceptorFactory;
    }
    
    angular.module('core.auth').factory('Auth', Auth);
    angular.module('core.auth').factory('AuthToken', AuthToken);
    angular.module('core.auth').factory('AuthInterceptor', AuthInterceptor);
})();