[![npm version](https://badge.fury.io/js/consistency.svg)](http://badge.fury.io/js/consistency)
[![Build Status](https://secure.travis-ci.org/shakefon/consistency.svg)](http://travis-ci.org/shakefon/consistency)

Consistency
-----------

A hapi.js plugin for versioning your API. Borne out of this talk: http://www.slideshare.net/shakefon/hapidays-2014

##Installation

`npm install consistency`

##Register plugin with your hapi application, provide the option(s) required for version detection.

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
      uriVersioning: true,
      customHeaderVersioning: true,
      acceptHeaderVersioning: true,
      acceptNamespace: 'consistencyExample',
      customHeaderKey: 'api-version'
    }
  }
};

Glue.compose(manifest, function (err, server) {
  ...
});
```
