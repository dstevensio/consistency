exports.register = function (server, options, next) {

  server.ext('onPreHandler', function (request, reply) {
    request.plugins.consistency = {};

    // URI versioning, if enabled
    if (options.uriVersioning && request.params.apiVersion && (/^v[0-9]+$/).test(request.params.apiVersion) ) {
      request.plugins.consistency.apiVersion = request.params.apiVersion;
      return reply.continue();
    }

    // Custom Header Versioning, if enabled
    if (options.customHeaderVersioning && request.headers[options.customHeaderKey] && (/^[0-9]+$/).test(request.headers[options.customHeaderKey]) ) {
      request.plugins.consistency.apiVersion = 'v' + request.headers[options.customHeaderKey];
      return reply.continue();
    }

    // Accept Header Versioning, if enabled
    var pattern = new RegExp('^application\/vnd\.' + options.acceptNamespace + '\.v[0-9]+$');
    if (options.acceptHeaderVersioning && request.headers['accept'] && pattern.test(request.headers['accept'])) {
      request.plugins.consistency.apiVersion = request.headers['accept'].replace('application/vnd.' + options.acceptNamespace + '.', '');
      return reply.continue();
    }

    // Default
    request.plugins.consistency.apiVersion = 'v1';
    return reply.continue();

  });

  next();

};

exports.register.attributes = {
  pkg: require('../package.json')
};
