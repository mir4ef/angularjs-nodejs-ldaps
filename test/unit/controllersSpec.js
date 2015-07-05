'use strict';

//describe('application controllers', function () {
//
//    beforeEach(function () {
//        this.addMatchers({
//            toEqualData: function (expected) {
//                return angular.equals(this.actual, expected);
//            }
//        });
//    });
//
//    beforeEach(module('ldap'));
//    beforeEach(module('Auth'));
//
//    describe('MainCtrl', function () {
//        var scope, ctrl, $httpBackend;
//
//        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
//            $httpBackend = _$httpBackend_;
//            $httpBackend.expectGET('api/me').respond({name: 'Miroslav Georgiev', username: 'miroslav.georgiev'});
//
//            scope = $rootScope.$new();
//            ctrl = $controller('MainCtrl', {$scope: scope});
//        }));
//
//        it('should create "user" model with username and name', function () {
//            expect(scope.user).toEqualData([]);
//            $httpBackend.flush();
//
//            expect(scope.user).toEqualData({name: 'Miroslav Georgiev', username: 'miroslav.georgiev'});
//        });
//        
//        it('should set have a default value of isLoggedIn model', function() {
//            expect(scope.isLoggedIn).toBe(false);
////            expect(scope.isLoggedIn).toBeFalsy();
//        });
//    });
//});


//    beforeEach(module('ldap'));
//    
//    var ldap, scope;
//    
////    beforeEach(inject(function ($rootScope, $controller) {
////        scope = $rootScope.$new();
////    }));
//    
//    it('should have a MainCtrl controller', function () {
//        expect(ldap.MainCtrl).toBeDefined();
//    });
//    
////    it('should have a working AuthService service', inject(['Auth', function (Auth) {
////            expect(Auth.login).not.to.equal(null);
////            
////            // test cases - testing for success
////            var validUsername = [
////                'miroslav.georgiev',
////                'a.miroslav.georgiev',
////                's.miroslav.georgiev'
////            ];
////            
////            // test cases - testing for failure
////            var invalidUsername = [
////                'miroslav georgiev',
////                'miroslav.georgiev@regeneron.com',
////                ''
////            ];
////            
////            // loop through the arrays of test cases
////            for (var i in validUsername) {
////                var valid = Auth.login(validUsername[i]);
////                expect(valid).toBeTruthy();
////            }
////            
////            for (var i in invalidUsername) {
////                var invalid = Auth.login(invalidUsername[i]);
////                expect(invalid).toBeFalsy();
////            }
////    }]));