var Hapi = require('hapi');
var consistency = require('../lib');
var server = new Hapi.Server();


var reply = function (obj) {

    return function (req, rep) {

        rep(obj);
    };
};

server.connection({ port: 3000 });

server.register({
    register: consistency,
    options: {
        uriParam: 'apiVersion',
        acceptNamespace: 'example',
        customHeaderKey: 'api-version'
    }
}, function registerRoutes () {

    server.route({
        method: 'GET',
        path: '/array',
        handler: {
            versioned: [
                reply({
                    version: '1.0'
                }),
                reply({
                    version: '2.0'
                }),
                reply({
                    version: '3.0'
                })
            ]
        }
    });

    server.route({
        method: 'GET',
        path: '/test',
        handler: {
            versioned: {
                'v1': reply({
                    version: '1.0'
                }),

                'v2.0': reply({
                    version: '2.0'
                }),

                'v1.5': reply({
                    version: '1.5'
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/url/{apiVersion?}',
        handler: {
            versioned: {
                'v1.0': reply({
                    version: '1.0'
                }),

                'v2.0': reply({
                    version: '2.0'
                }),

                'v1.5': reply({
                    version: '1.5'
                })
            }
        }
    });
});

module.exports = server;
