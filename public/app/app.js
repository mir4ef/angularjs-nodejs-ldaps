/**
 * @file app.js contains the angular definitions to be used by the application
 * @module appname
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

(function () {
    'use strict';

    angular.module('appname', [
        // angular dependencies
        'ngAnimate',
        'ngAria',
        'ngMessages',
        'ngRoute',

        // external libraries

        // internal application components
        'core',
        'login',
        'home'
    ]);
})();