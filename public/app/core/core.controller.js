/**
 * @file core.controller.js
 * @extends core
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @memberOf core
     * @description MainCtrl handles global application logic
     * @param $location
     * @param $rootScope
     * @param {Object} $route
     * @param {Object} Auth - service to perform authentication
     * @param {Object} ClearCache - service to clear angular $http cache
     * @constructor
     */
    function MainCtrl ($location, $rootScope, $route, Auth, ClearCache) {
        var vm = this;

        function handleInit() {
            // get info if a user is logged in
            vm.isLoggedIn = Auth.isLoggedIn();
            // get the current year in YYYY format
            vm.currentYear = new Date().getFullYear();
        }

        // perform logout
        function doLogout() {
            Auth.logout();
            $rootScope.user = null;
            $location.path('/login');
            ClearCache.removeItem('api/v1/me');
        }

        // check if the user is logged in on every request
        function routeChangeStart(event, next) {
            vm.isLoggedIn = Auth.isLoggedIn();

            Auth.getUser()
                .then(function(result) {
                    $rootScope.user = result.data;
                });

            if (next.access && next.access.restricted) {
                if (vm.isLoggedIn) {
                    // make sure the user has rights to access the page
                    if (next.access.authorization) {
                        Auth.isAuthorized(next.access.appName).then(function (response) {
                            // if the user has no rights to access the page, send them to the home page
                            if (!response.data.message) {
                                $location.path('/home');
                            }
                        }, function (err) {
                            $location.path('/home');
                        });
                    }
                } else {
                    // store the next location to redirect after successful login
                    $location.nextAfterLogin = next.$$route.originalPath || null;
                    $location.path('/login');
                    $route.reload();
                }
            }
        }

        // show/hide the disclaimer after a successful route change
        function routeChangeSuccess(event, current) {
            // make sure $$route exists
            if (current.$$route) {
                vm.showDisclaimer = current.$$route.originalPath === '/login';
            }
        }

        $rootScope.$on('$routeChangeStart', routeChangeStart);
        $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

        vm.$onInit = handleInit;
        vm.doLogout = doLogout;
    }

    angular.module('core').controller('MainCtrl', MainCtrl);
})();