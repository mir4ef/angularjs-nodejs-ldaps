/**
 * @file clearcache.service.spec.js
 * @author Miroslav Georgiev
 * @version 1.0.0
 */


"use strict";

describe('ClearCache factory', function () {
    var $cacheFactory;
    var ClearCache;
    var key = 'myKey';
    var data = 'some data';

    beforeEach(module('core.clearcache'));

    // inject the necessary modules including $http
    // $http needs to be injected so $cacheFactory can create the `$http` key and its associated data/object/methods
    // so we have access to the `$http` $cacheFactory methods (in the tests and in the ClearCache factory) and for the tests to work
    // otherwise undefined is returned and the tests fail
    beforeEach(inject(function(_$cacheFactory_, _$http_, _ClearCache_) {
        $cacheFactory = _$cacheFactory_;
        ClearCache = _ClearCache_;

        spyOn(ClearCache, 'removeItem').and.callThrough();
    }));

    it('should exist', function () {
        expect(ClearCache).toBeDefined();
    });

    describe('.removeItem()', function () {
        it('should exist', function () {
            expect(ClearCache.removeItem).toBeDefined();
        });

        it('should NOT delete anything from $cacheFactory if no key is passed', function () {
            $cacheFactory.get('$http').put(key, data);
            ClearCache.removeItem();

            expect(ClearCache.removeItem).toHaveBeenCalledWith();
            expect($cacheFactory.get('$http').get(key)).toEqual(data);
        });

        it('should delete the passed key from $cacheFactory', function () {
            $cacheFactory.get('$http').put(key, data);

            expect($cacheFactory.get('$http').get(key)).toEqual(data);

            ClearCache.removeItem(key);

            expect(ClearCache.removeItem).toHaveBeenCalledWith(key);
            expect($cacheFactory.get('$http').get(key)).toBeUndefined();
        });
    });
});