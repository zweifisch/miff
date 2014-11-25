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

for numbers

```conf
number = 1.2
cfg = miff.load('/path/to/file.conf', {numbers: true});
```

for quotes

```conf
key = " value "
key = ' value '
```

```javascript
cfg = miff.load('/path/to/file.conf', {quotes: true});
```

parse from string

```javascript
cfg = miff.parse(path, opts);
```
