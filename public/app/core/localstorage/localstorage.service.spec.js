/**
 * @file localstorage.service.spec.js
 * @author Miroslav Georgiev
 * @version 1.0.0
 */


"use strict";

describe('LocStorage factory', function () {
    var config;
    var LocStorage;
    var key = 'myKey';
    var data = 'some data';
    var currentDay = new Date().getUTCDate();
    var currentMonth = new Date().getUTCMonth();
    var currentYear = new Date().getUTCFullYear();
    var todayDate = new Date(Date.UTC(currentYear, currentMonth, currentDay));
    var returnedData = { data: 'some data', saveDate: todayDate.toISOString(), version: '0.0.1' };

    beforeEach(module('appname'));

    beforeEach(inject(function(_config_, _LocStorage_) {
        config = _config_;
        LocStorage = _LocStorage_;

        // set the current version before each test
        returnedData.version = config.version;
        returnedData.saveDate = todayDate.toISOString();
        // clear localStorage before each test
        LocStorage.deleteStorage();
    }));

    it('should exist', function () {
        expect(LocStorage).toBeDefined();
    });

    describe('.saveToStorage()', function () {
        it('should exist', function () {
            expect(LocStorage.saveToStorage).toBeDefined();
        });

        it('should NOT exist if no key is passed', function () {
            LocStorage.saveToStorage();

            expect(LocStorage.isSaved(key)).toEqual(false);
        });

        it('should NOT exist if no data is passed', function () {
            LocStorage.saveToStorage(key);

            expect(LocStorage.isSaved(key)).toEqual(false);
        });

        it('should NOT exist if not saved', function () {
            expect(LocStorage.isSaved(key)).toEqual(false);
        });

        it('should return true if successfully saved', function () {
            LocStorage.saveToStorage(key, data);

            expect(LocStorage.isSaved(key)).toEqual(true);
        });
    });

    describe('.isSaved()', function () {

        it('should exist', function () {
            expect(LocStorage.isSaved).toBeDefined();
        });

        it('should return false if the key cannot be found localStorage', function () {
            expect(LocStorage.isSaved(key)).toEqual(false);
        });

        it('should return false if the passed key exists in localStorage, but application versions do not match', function () {
            // temporarily store the app version to perform this test
            var appVersion = config.version;
            // update the app version before storing the data to localStorage
            config.version = '0.0.0';
            // save the data with the fake app version
            LocStorage.saveToStorage(key, data);
            // restore the app version to the right one (current one) for the rest of the tests
            config.version = appVersion;

            expect(LocStorage.isSaved(key)).toEqual(false);
        });

        it('should return true if the passed key exists in localStorage', function () {
            LocStorage.saveToStorage(key, data);
            expect(LocStorage.isSaved(key)).toEqual(true);
        });
    });

    describe('.getFromStorage()', function () {
        it('should exist', function () {
            expect(LocStorage.getFromStorage).toBeDefined();
        });

        it('should return false if no key is passed', function () {
            LocStorage.saveToStorage(key, data);

            expect(LocStorage.getFromStorage()).toEqual(false);
        });

        it('should return false if the passed key doesn`t exist in localStorage', function () {
            expect(LocStorage.getFromStorage(key)).toEqual(false);
        });

        it('should return the data associated with the passed key from localStorage', function () {
            LocStorage.saveToStorage(key, data);

            expect(LocStorage.getFromStorage(key)).toEqual(returnedData);
        });
    });

    describe('.deleteValue()', function () {
        it('should exist', function () {
            expect(LocStorage.deleteValue).toBeDefined();
        });

        it('should NOT delete anything if no key is passed', function () {
            LocStorage.saveToStorage(key, data);
            LocStorage.deleteValue();

            expect(LocStorage.isSaved(key)).toEqual(true);
        });

        it('should delete the passed key from localStorage', function () {
            LocStorage.saveToStorage(key, data);

            expect(LocStorage.isSaved(key)).toEqual(true);

            LocStorage.deleteValue(key);

            expect(LocStorage.isSaved(key)).toEqual(false);
        });
    });

    describe('.deleteStorage()', function () {
        it('should exist', function () {
            expect(LocStorage.deleteStorage).toBeDefined();
        });

        it('should delete everything from localStorage', function () {
            LocStorage.saveToStorage(key, data);

            expect(LocStorage.isSaved(key)).toEqual(true);

            LocStorage.deleteStorage();

            expect(LocStorage.isSaved(key)).toEqual(false);
        });
    });
});