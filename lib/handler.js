'use strict';

var _ = require('lodash');
var cache = {};

var versionToFloat = function (v, noShorthand) {

    if (_.isString(v)) {
        v = v.replace('v', '');

        if (!noShorthand && v.length === 1) {
            v = v + '.99';
        }
    }

    return parseFloat(v);
};

var cachedVersion = function (id, version) {

    return cache[id] && cache[id][version];
};

var detectVersionHandler = function (id, version, handlers) {

    var handler;
    var versions = Object.keys(handlers).sort()
        .reverse();

    _.some(versions, function testVersion (v) {

        if (v <= version) {
            handler = handlers[v];
        }

        return handler;
    });

    cacheVersionHandler(id, version, handler);

    return handler;
};

var cacheVersionHandler = function (id, version, handler) {

    if (id) {
        cache[id] = cache[id] || {};
        cache[id][version] = handler;
    }
};

module.exports = function register (server) {

    server.handler('versioned', function (route, handlers) {

        var id = route.method + '::' + route.path;
        var handlersIsArray = _.isArray(handlers);
        var versions = {};

        _.each(handlers, function (handler, version) {

            version = versionToFloat(version, true);

            if (handlersIsArray) {
                version += 1;
            }

            versions[version] = handler;
        });

        var latest = Object.keys(versions).sort().pop();

        versions.latest = versions[latest];

        return function (request, reply) {

            var input = request.plugins.consistency.apiVersion;
            var version = input !== 'latest' ? versionToFloat(input) : latest;
            var handler = cachedVersion(id, version);

            if (!handler) {
                handler = detectVersionHandler(id, version, versions);
            }

            return handler(request, reply);
        };
    });
};
