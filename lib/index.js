exports.register = function (server, options, next) {

  server.ext('onPreHandler', function (request, reply) {
    var uriParam = options.uriParam;
    var params = request.params;
    var headerKey = options.customHeaderKey;
    var headers = request.headers;
    var acceptNamespace = options.acceptNamespace;

    request.plugins.consistency = {};

    // URI versioning, if enabled
    if (uriParam && params[uriParam] && (/^v[0-9]+$/).test(params[uriParam]) ) {
      request.plugins.consistency.apiVersion = params[uriParam];
      return reply.continue();
    }

    // Custom Header Versioning, if enabled
    if (headerKey && headers[headerKey] && (/^[0-9]+$/).test(headers[headerKey]) ) {
      request.plugins.consistency.apiVersion = 'v' + headers[headerKey];
      return reply.continue();
    }

    // Accept Header Versioning, if enabled
    var pattern = new RegExp('^application\/vnd\.' + acceptNamespace + '\.v[0-9]+$');
    if (acceptNamespace && headers['accept'] && pattern.test(headers['accept'])) {
      request.plugins.consistency.apiVersion = headers['accept'].replace('application/vnd.' + acceptNamespace + '.', '');
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
