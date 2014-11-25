# miff

minimal configuration file parser

```conf
key = value
string = for every thing
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

for quotes

```conf
key = " value "
key = ' value '
```

```javascript
cfg = miff.load('/path/to/file.conf', {quotes: true});
```
