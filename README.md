# miff

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

minimal configuration file format

```conf
key = value

[section1]
key = another value
number = 1.2
array = [item, "more item", [even, more]]

[section2.bools]
feature = on
boolean = off
on = true
off = false
```

usage

```javascript
miff = require('miff');
cfg = miff.load('/path/to/file.conf');
```

parse from string

```javascript
cfg = miff.parse(input);
```

generate string

```javascript
string = miff.stringify(object);
```

[npm-image]: https://img.shields.io/npm/v/miff.svg?style=flat
[npm-url]: https://npmjs.org/package/miff
[travis-image]: https://img.shields.io/travis/zweifisch/miff.svg?style=flat
[travis-url]: https://travis-ci.org/zweifisch/miff
