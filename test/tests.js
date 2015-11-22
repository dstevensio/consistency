'use strict';

var _          = require('lodash');
var Lab        = require('lab');
var expect     = require('code').expect;
var lab        = Lab.script();
var describe   = lab.describe;
var it         = lab.it;
var beforeEach = lab.beforeEach;
var afterEach  = lab.afterEach;
var server     = require('./server');

var runTests = function (options, version, done) {

    server.inject(options, function (res) {

        var response = res.result.version;
        expect(response).to.exist();
        expect(response).to.be.a.string();
        expect(parseFloat(response)).to.equal(version);
        done();
    });
};

describe('Versioning', function () {

    describe('custom header', function () {

        it('should get version', function (done) {

            runTests({
                url: '/url/v1.0'
            }, 1.0, done);
        });

        it('should get version (shorthand)', function (done) {

            runTests({
                url: '/url/v1'
            }, 1.5, done);
        });

        it('should return closest version matching if version', function (done) {

            runTests({
                url: '/url/v3.0'
            }, 2.0, done);
        });

        it('should be optional to provide the v', function (done) {

            runTests({
                url: '/url/1.5'
            }, 1.5, done);
        });

        it('should allow latest as version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': 'latest'
                }
            }, 2.0, done);
        });

        it('should default to the latest if not provided', function (done) {

            runTests({
                url: '/url/'
            }, 2.0, done);
        });
    });

    describe('custom header', function () {

        it('should get version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': 'v1.0'
                }
            }, 1.0, done);
        });

        it('should get version (shorthand)', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': 'v1'
                }
            }, 1.5, done);
        });

        it('should return closest version matching if version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': 'v3.0'
                }
            }, 2.0, done);
        });

        it('should be optional to provide the v', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': '1.5'
                }
            }, 1.5, done);
        });

        it('should allow latest as version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'api-version': 'latest'
                }
            }, 2.0, done);
        });

        it('should default to the latest if not provided', function (done) {

            runTests({
                url: '/test'
            }, 2.0, done);
        });
    });

    describe('accept header', function () {

        var header = 'application/vnd.example.';

        it('should get version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'accept': header + 'v1.0'
                }
            }, 1.0, done);
        });

        it('should get version (shorthand)', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'accept': header + 'v1'
                }
            }, 1.5, done);
        });

        it('should return closest version matching if version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'accept': header + 'v3.0'
                }
            }, 2.0, done);
        });

        it('should be optional to provide the v', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'accept': header + '1.5'
                }
            }, 1.5, done);
        });

        it('should allow latest as version', function (done) {

            runTests({
                url: '/test',
                headers: {
                    'accept': header + 'latest'
                }
            }, 2.0, done);
        });

        it('should default to the latest if not provided', function (done) {

            runTests({
                url: '/test'
            }, 2.0, done);
        });
    });

    describe('Works with array of handlers', function () {

        it('should get version', function (done) {

            runTests({
                url: '/array',
                headers: {
                    'api-version': 'v1.0'
                }
            }, 1.0, done);
        });

        it('should get version (shorthand)', function (done) {

            runTests({
                url: '/array',
                headers: {
                    'api-version': 'v2'
                }
            }, 2.0, done);
        });

        it('should return closest version matching if version', function (done) {

            runTests({
                url: '/array',
                headers: {
                    'api-version': 'v4.0'
                }
            }, 3.0, done);
        });

        it('should be optional to provide the v', function (done) {

            runTests({
                url: '/array',
                headers: {
                    'api-version': '1'
                }
            }, 1, done);
        });

        it('should allow latest as version', function (done) {

            runTests({
                url: '/array',
                headers: {
                    'api-version': 'latest'
                }
            }, 3.0, done);
        });

        it('should default to the latest if not provided', function (done) {

            runTests({
                url: '/array'
            }, 3.0, done);
        });
    });
});

module.exports.lab = lab;
