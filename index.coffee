
exports.parse = (input, opts, result)->
    quotesSupport = opts?.quote or on
    sectionSupport = opts?.section or on
    equalSignSupport = opts?.equal
    parseNumber = opts?.number
    parseBool = opts?.bool
    result ?= {}
    section = result
    for line, linenumber in input.split /[\r\n]+/
        line = line.trim()
        continue unless line
        first = line.charAt 0
        continue if first is ';' or first is '#'
        if sectionSupport and first is '['
            if line.charAt(line.length - 1) is ']'
                section = result[line.substr 1, line.length - 2] = {}
                continue
            else
                throw "section header not closed on #{linenumber + 1}"
        shift = 1
        while true
            idx = line.indexOf '=', shift
            if idx is -1
                throw new Error "'=' not found on line #{linenumber + 1} '#{line}'"
            if equalSignSupport
                if '\\' isnt line.charAt idx - 1
                    key = (line.substr 0, idx).split('\\=').join '='
                    value = line.substr idx + 1
                    break
                else
                    shift = idx + 1
            else
                key = line.substr 0, idx
                value = line.substr idx + 1
                break
        value = value.trimLeft()
        key = key.trimRight()
        if quotesSupport
            char = value.charAt 0
            if char is '"' and value.charAt(value.length - 1) is '"'
                section[key] = value.substr 1, value.length - 2
                continue
            else if char is "'" and value.charAt(value.length - 1) is "'"
                section[key] = value.substr 1, value.length - 2
                continue
        if parseBool
            if value is 'on' or value is 'true'
                section[key] = true
                continue
            else if value is 'off' or value is 'false'
                section[key] = false
                continue
        if parseNumber
            if not isNaN(parseFloat value) and isFinite value
                section[key] = parseFloat value
                continue
        section[key] = value
    result

exports.load = (files..., opts)->
    fs = require 'fs'
    ret = {}
    if 'object' isnt typeof opts
        files.push opts
        opts = null
    for file in files
        exports.parse fs.readFileSync(file, encoding: 'utf8'), opts, ret
    ret

exports.stringify = (dict)->

    {EOL} = require 'os'

    escapeEq = (str)-> str.replace /\=/g, '\\='
    escapeQuote = (str)-> str.replace /'/g, "'"

    stringify = (kv)->
        ret = ''
        for k,v of kv
            if 'object' is typeof v
                ret += "#{EOL}[#{k}]#{EOL}"
                ret += stringify v
            else if 'string' is typeof v
                if 'true' is v or 'false' is v
                    ret += "#{escapeEq k} = '#{v}'#{EOL}"
                else if (' ' is v.charAt 0) or (' ' is v.charAt v.length - 1)
                    ret += "#{escapeEq k} = '#{escapeQuote v}'#{EOL}"
                else
                    ret += "#{escapeEq k} = #{v}#{EOL}"
            else
                ret += "#{escapeEq k} = #{v}#{EOL}"
        ret

    stringify dict

exports.dump = (dict, file)->
    fs = require 'fs'
    fs.writeFileSync file, exports.stringify(dict), encoding: 'utf8'
