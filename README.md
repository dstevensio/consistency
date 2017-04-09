[![npm version](https://badge.fury.io/js/consistency.svg)](http://badge.fury.io/js/consistency)
[![Build Status](https://secure.travis-ci.org/dstevensio/consistency.svg)](http://travis-ci.org/shakefon/consistency)

Consistency
-----------

A hapi.js plugin for versioning your API. Borne out of this talk: http://www.slideshare.net/shakefon/hapidays-2014

## Installation

`npm install consistency`

## Register plugin with your hapi application, provide the option(s) required for version detection.

```js
server.register({
  register: require('consistency'),
  options: {
    uriParam: 'apiVersion',
    acceptNamespace: 'consistencyExample',
    customHeaderKey: 'api-version'
  }
}, function (err) {
  if (err) console.log('Consistency plugin failed to load');

});
```

or, via Glue and manifest:

```js
var manifest = {
  connections: [...],
  plugins: {
    consistency: {
      uriParam: 'apiVersion',
      acceptNamespace: 'consistencyExample',
      customHeaderKey: 'api-version'
    }
  }
};

Glue.compose(manifest, function (err, server) {
  ...
});
```

## Versionize your Routes

### Array of handlers
```js
server.route({
  id: 'array',
  method: 'GET',
  path: '/array',
  handler: {
    versioned: [
      function(request, reply) {
        reply({
          version: '1.0'
        });
      },
      function(request, reply) {
        reply({
          version: '2.0'
        });
      }
    ]
  }
});
```

### Object of handlers

```js
server.route({
    id: 'object',
    method: 'GET',
    path: '/object',
    handler: {
      versioned: {
        'v1.0': function(request, reply) {
          reply({
            version: '1.0'
          });
        },

        'v2.0': function(request, reply) {
          reply({
            version: '2.0'
          });
        },

        'v1.5': function(request, reply) {
          reply({
            version: '1.5'
          });
        }
      }
    }
});
```

## Version Matching

A version can be provided with or without the v prefix and can also be provided
using the `latest` keyword which will use the latest versioned endpoint.

Matching of version handlers is cached to remove redundent checks based on the
route method and route path.  

If an endpoint has not changed in a specific version of the api, we can omit it
and the matcher will use the version that is closest to the one request. for example
if in version 2 we didn't update the users endpoint a request would return version
1

If you provide the version in shorthand (v1, 1) it will return greatest version available
for that api version. for example given the versions 1, 1.2, 1.5 providing 1 will return
1.5.
