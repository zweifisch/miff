# miff

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

minimal configuration file parser

```conf
key = value

[section1]
key = another value
```

usage

```javascript
miff = require('miff');
cfg = miff.load('/path/to/file.conf');
```

to parse numbers and bools

```conf
number = 1.2
feature = on
boolean = off
on = true
off = false
```

```javascript
cfg = miff.load('/path/to/file.conf', {number: true, bool: true});
```

parse from string

```javascript
cfg = miff.parse(path, opts);
```

generate string

```javascript
string = miff.stringify(object);
```

[npm-image]: https://img.shields.io/npm/v/miff.svg?style=flat
[npm-url]: https://npmjs.org/package/miff
[travis-image]: https://img.shields.io/travis/zweifisch/miff.svg?style=flat
[travis-url]: https://travis-ci.org/zweifisch/miff
