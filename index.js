// Generated by CoffeeScript 1.8.0
(function() {
  var __slice = [].slice;

  exports.parse = function(input, opts, result) {
    var char, equalSignSupport, first, idx, key, line, linenumber, parseNumber, quotesSupport, section, sectionSupport, shift, unquoted, value, _i, _len, _ref;
    quotesSupport = opts != null ? opts.quotes : void 0;
    sectionSupport = opts != null ? opts.section : void 0;
    equalSignSupport = opts != null ? opts.equal : void 0;
    parseNumber = opts != null ? opts.numbers : void 0;
    if (result == null) {
      result = {};
    }
    section = result;
    _ref = input.split(/[\r\n]+/);
    for (linenumber = _i = 0, _len = _ref.length; _i < _len; linenumber = ++_i) {
      line = _ref[linenumber];
      line = line.trim();
      if (!line) {
        continue;
      }
      first = line.charAt(0);
      if (first === ';' || first === '#') {
        continue;
      }
      if (sectionSupport && first === '[') {
        if (line.charAt(line.length - 1) === ']') {
          section = result[line.substr(1, line.length - 2)] = {};
          continue;
        } else {
          throw "section header not closed on " + (linenumber + 1);
        }
      }
      shift = 1;
      while (true) {
        idx = line.indexOf('=', shift);
        if (idx === -1) {
          throw new Error("'=' not found on line " + (linenumber + 1));
        }
        if (equalSignSupport) {
          if ('\\' !== line.charAt(idx - 1)) {
            key = (line.substr(0, idx)).split('\\=').join('=');
            value = line.substr(idx + 1);
            break;
          } else {
            shift = idx + 1;
          }
        } else {
          key = line.substr(0, idx);
          value = line.substr(idx + 1);
          break;
        }
      }
      value = value.trimLeft();
      unquoted = false;
      if (quotesSupport) {
        char = value.charAt(0);
        if (char === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substr(1, value.length - 2);
          unquoted = true;
        } else if (char === "'" && value.charAt(value.length - 1) === "'") {
          value = value.substr(1, value.length - 2);
          unquoted = true;
        }
      }
      if (parseNumber && !unquoted) {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          value = parseFloat(value);
        }
      }
      section[key.trimRight()] = value;
    }
    return result;
  };

  exports.load = function() {
    var file, files, fs, opts, ret, _i, _j, _len;
    files = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), opts = arguments[_i++];
    fs = require('fs');
    ret = {};
    if ('object' !== typeof opts) {
      files.push(opts);
      opts = null;
    }
    for (_j = 0, _len = files.length; _j < _len; _j++) {
      file = files[_j];
      exports.parse(fs.readFileSync(file, {
        encoding: 'utf-8'
      }), opts, ret);
    }
    return ret;
  };

}).call(this);
