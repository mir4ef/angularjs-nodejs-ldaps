// Miroslav Georgiev
'use strict';

ngApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'app/views/home.html'
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'MainCtrl',
                controllerAs: 'login'
            })
            .when('/home', {
                templateUrl: 'app/views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            });

    // set our app up to have pretty URLS
    $locationProvider.html5Mode(true);

    // attach the auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');
});