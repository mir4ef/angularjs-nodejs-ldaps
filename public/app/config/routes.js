/**
 * @file routes.js contains routing logic for the application
 * @extends appname
 * @author Miroslav Georgiev
 * @version 0.2.2
 */

(function () {
    'use strict';

    /**
     * @ngdoc config
     * @memberOf appname
     * @param $routeProvider
     * @param $locationProvider
     * @param $httpProvider
     * @param $compileProvider
     * @param {Object} config - object with configuration constants
     * @constructor
     */
    function Routes($routeProvider, $locationProvider, $httpProvider, $compileProvider, config) {
        $routeProvider
            .when('/home', {
                template: '<home-view></home-view>',
                caseInsensitiveMatch: true,
                access: {
                    restricted: true,
                    appName: 'Home'
                }
            })
            .when('/login', {
                template: '<user-login></user-login>',
                caseInsensitiveMatch: true
            })
            .otherwise({ redirectTo: '/home' });

        // remove the '#' sign from the routes/address bar URL
        $locationProvider.html5Mode(true);

        // attach the auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');

        // deprecated legacy `success` and `error` methods usage on/off setting
        $httpProvider.useLegacyPromiseExtensions(config.legacyMode);

        // debug mode on/off setting
        $compileProvider.debugInfoEnabled(config.debugMode);
    }

    angular.module('appname').config(Routes);
})();