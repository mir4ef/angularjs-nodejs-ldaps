// Miroslav Georgiev
'use strict';

var ngApp = angular.module('ldap', [
    'ngAnimate',
    'ngRoute',
    'appControllers',
    'appServices'
]);

var appControllers = angular.module('appControllers', []);
var appServices = angular.module('appServices', []);