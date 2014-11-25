# miff

minimal configuration file parser

```conf
key = value
```

usage

```javascript
miff = require('miff');
cfg = miff.load('/path/to/file.conf');
```

for section support

```conf
[section]
key = value
```

use

```javascript
cfg = miff.load('/path/to/file.conf', {section: true});
```

for number and bool

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

for quotes

```conf
key = " value "
key = ' value '
```

```javascript
cfg = miff.load('/path/to/file.conf', {quote: true});
```

parse from string

```javascript
cfg = miff.parse(path, opts);
```
