// Miroslav Georgiev
'use strict';

appControllers.controller('MainCtrl', MainCtrl);

function MainCtrl ($rootScope, $location, $cacheFactory, Auth) {
    var vm = this;

    // get info if a user is logged in
    vm.isLoggedIn = Auth.isLoggedIn();
    
    // check if the user is logged in on every request
    $rootScope.$on('$routeChangeStart', function () {
        vm.isLoggedIn = Auth.isLoggedIn();
        Auth.getUser().then(function (data) {
            vm.user = data.data;
        }, function (error) {
            console.log('error rootScope on $routeChangeStart:', error);
        });
    });

    // perform login
    vm.doLogin = function () {
        vm.processing = true;
        vm.error = '';
        
        Auth.login(vm.loginData.username, vm.loginData.password).success(function (data) {
            vm.processing = false;
            if (data.success)
                $location.path('/home');
            else
                vm.error = data.message;
        });
    };

    // perform logout
    vm.doLogout = function () {
        Auth.logout();
        vm.user = '';
        $location.path('/login');
        $cacheFactory.get('$http').remove('/api/me'); // remove the cached user info
    };
    
    // peform form reset
    vm.reset = function (form) {
        vm.error = '';
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        vm.loginData = {};
    };
}