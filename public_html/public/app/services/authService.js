// Miroslav Georgiev
'use strict';

appServices.factory('Auth', Auth);
appServices.factory('AuthToken', AuthToken);
appServices.factory('AuthInterceptor', AuthInterceptor);

function Auth($http, $q, AuthToken) {
    var authFactory = {};
    
    authFactory.login = function (username, password) {
        return $http.post('/api/login', {username: username, password: password}).success(function (data) {
            AuthToken.setToken(data.token);
            return data;
        });
    };
    
    authFactory.logout = function () {
        AuthToken.setToken();
    };
    
    authFactory.isLoggedIn = function () {
        if (AuthToken.getToken())
            return true;
        else
            return false;
    };
    
    authFactory.getUser = function () {
        if (AuthToken.getToken())
            return $http.get('/api/me', {cache: true});
        else
            return $q.reject({succcess: false, message: 'User has no token.'});
    };
    
    return authFactory;
}

function AuthToken($window) {
    var authTokenFactory = {};
    
    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('token');
    };
    
    authTokenFactory.setToken = function (token) {
        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
    };
    
    return authTokenFactory;
}

function AuthInterceptor($q, $location, AuthToken) {
    var interceptorFactory = {};
    
    interceptorFactory.request = function (config) {
        var token = AuthToken.getToken();
        
        if (token)
            config.headers['x-access-token'] = token;
        
        return config;
    };
    
    interceptorFactory.responseError = function (res) {
        if (res.status === 403) {
            AuthToken.setToken();
            $location.path('/login');
        }
        
        return $q.reject(res);
    };
    
    return interceptorFactory;
}