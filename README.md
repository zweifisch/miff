# miff

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
