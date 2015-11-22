'use strict';

var handler = require('./handler');

exports.register = function (server, options, next) {

    server.ext('onPreHandler', function (request, reply) {

        var uriParam = options.uriParam;
        var params = request.params || {};
        var headerKey = options.customHeaderKey;
        var headers = request.headers;
        var acceptNamespace = options.acceptNamespace;
        var acceptPattern = new RegExp('^application\/vnd\.' + acceptNamespace + '\.');
        var version;

        request.plugins.consistency = {};

        // URI versioning, if enabled
        if (uriParam && params[uriParam]) {
            version = params[uriParam];
        } else if (headerKey && headers[headerKey]) {
            version = headers[headerKey];
        } else if (acceptNamespace && headers.accept && acceptPattern.test(headers.accept)) {
            version = headers.accept.replace('application/vnd.' + acceptNamespace + '.', '');
        } else {
            version = 'latest';
        }

        // Default to latest
        request.plugins.consistency.apiVersion = version;

        return reply.continue();

    });

    handler(server, options);

    next();

};

exports.register.attributes = {
    name: 'zension'
};
